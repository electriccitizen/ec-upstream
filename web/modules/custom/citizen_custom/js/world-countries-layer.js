(function (Drupal, drupalSettings) {
  'use strict';

  var namespace = 'CitizenCustomWorldCountriesLayer';
  var defaultPath = 'modules/custom/citizen_custom/data/natural_earth_countries.geojson';
  var autoAttachedMaps = new Set();
  var pendingMapLookups = {};

  function resolveBasePath() {
    var base = (drupalSettings && drupalSettings.path && drupalSettings.path.baseUrl) || '/';
    var prefix = (drupalSettings && drupalSettings.path && drupalSettings.path.pathPrefix) || '';
    var combined = base + prefix;
    return combined.endsWith('/') ? combined : combined + '/';
  }

  function resolveDatasetUrl(overrideUrl) {
    if (overrideUrl) {
      return overrideUrl;
    }
    if (drupalSettings && drupalSettings.citizenCustom && drupalSettings.citizenCustom.countriesGeojsonUrl) {
      return drupalSettings.citizenCustom.countriesGeojsonUrl;
    }
    var relative = defaultPath.replace(/^\//, '');
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return new URL(relative, window.location.origin + resolveBasePath()).toString();
    }
    return resolveBasePath() + relative;
  }

  function resolveLeafletMap(mapCandidate) {
    if (!mapCandidate) {
      return null;
    }
    if (typeof mapCandidate.addLayer === 'function' && typeof mapCandidate.eachLayer === 'function') {
      return mapCandidate;
    }
    if (typeof mapCandidate.leafletMap !== 'undefined') {
      return mapCandidate.leafletMap;
    }
    return null;
  }

  function styleResolver(optionStyle) {
    if (typeof optionStyle === 'function') {
      return optionStyle;
    }
    var merged = Object.assign({
      weight: 1,
      color: '#225173',
      fillColor: '#3578b5',
      fillOpacity: 0.25
    }, optionStyle || {});

    return function () {
      return Object.assign({}, merged);
    };
  }

  function hoverStyleResolver(optionHoverStyle) {
    if (typeof optionHoverStyle === 'function') {
      return optionHoverStyle;
    }
    var merged = Object.assign({
      weightOffset: 1,
      opacityOffset: 0.2
    }, optionHoverStyle || {});

    return function (feature, baseStyle) {
      var hover = Object.assign({}, baseStyle);
      hover.weight = (hover.weight || 1) + merged.weightOffset;
      hover.fillOpacity = Math.min(1, (hover.fillOpacity || 0.25) + merged.opacityOffset);
      hover.color = merged.color || '#103655';
      hover.fillColor = merged.fillColor || '#1d5f8a';
      return hover;
    };
  }

  function fieldResolver(optionField) {
    if (optionField === false) {
      return null;
    }
    return optionField || 'NAME_LONG';
  }

  function demographicsConfigResolver(options) {
    var demographics = options.demographics || {};
    var keyField = options.demographicsKey || 'ISO_A3';
    return {
      data: demographics,
      keyField: keyField,
      formatter: typeof options.demographicsFormatter === 'function' ? options.demographicsFormatter : null,
      includeInTooltip: options.tooltipIncludeDemographics !== false,
      fields: options.demographicFields || {
        population: 'population',
        ethnicities: 'ethnicities',
        languages: 'languages'
      }
    };
  }

  function escapeHtml(value) {
    if (typeof value !== 'string') {
      value = String(value || '');
    }
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(value));
    return span.innerHTML;
  }

  function lookupDemographics(feature, config) {
    if (!feature || !feature.properties || !config || !config.data) {
      return null;
    }
    var key = feature.properties[config.keyField];
    if (!key) {
      return null;
    }
    var normalized = String(key).toUpperCase();
    var dataset = config.data;
    return dataset[normalized] || dataset[key] || null;
  }

  function formatDemographicsTooltip(baseLabel, demographics, config) {
    if (!config || !config.includeInTooltip || !demographics) {
      return baseLabel;
    }
    if (config.formatter) {
      return config.formatter(baseLabel, demographics);
    }
    var rows = [];
    if (demographics[config.fields.population]) {
      rows.push('<div class="demographic population"><strong>Population:</strong> ' + escapeHtml(demographics[config.fields.population]) + '</div>');
    }
    if (demographics[config.fields.ethnicities]) {
      rows.push('<div class="demographic ethnicities"><strong>Ethnicities:</strong> ' + escapeHtml(demographics[config.fields.ethnicities]) + '</div>');
    }
    if (demographics[config.fields.languages]) {
      rows.push('<div class="demographic languages"><strong>Languages:</strong> ' + escapeHtml(demographics[config.fields.languages]) + '</div>');
    }
    if (!rows.length) {
      return baseLabel;
    }
    return baseLabel + '<div class="citizen-custom-demographics">' + rows.join('') + '</div>';
  }

  function getDefaultTooltip(feature, tooltipField) {
    if (!tooltipField || !feature || !feature.properties) {
      return null;
    }
    return feature.properties[tooltipField] || feature.properties.NAME || null;
  }

  function defaultTooltipOptions() {
    return {
      sticky: true,
      direction: 'auto',
      className: 'citizen-custom-country-tooltip'
    };
  }

  function fetchGeojson(url) {
    return fetch(url, {cache: 'force-cache'}).then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to fetch country layer from ' + url + ' (' + response.status + ')');
      }
      return response.json();
    });
  }

  function ensureLayerPane(leafletMap, requestedPane) {
    if (!leafletMap) {
      return requestedPane || null;
    }
    var paneName = requestedPane || 'citizen-custom-world-layer';
    var pane = leafletMap.getPane(paneName);
    if (!pane) {
      pane = leafletMap.createPane(paneName);
      pane.style.zIndex = 450; // Above tile pane, below marker pane.
    }
    return paneName;
  }

  function loadCountriesLayer(options) {
    options = options || {};
    if (typeof L === 'undefined') {
      return Promise.reject(new Error('Leaflet is not available on this page.'));
    }
    var url = resolveDatasetUrl(options.url);
    var baseStyleResolver = styleResolver(options.style);
    var hoverResolver = hoverStyleResolver(options.hoverStyle);
    var tooltipField = fieldResolver(options.tooltipField);
    var tooltipOptions = Object.assign(defaultTooltipOptions(), options.tooltipOptions || {});
    var baseStyleCache = new WeakMap();
    var demographicsConfig = demographicsConfigResolver(options);

    var leafletMap = resolveLeafletMap(options.map);
    var paneName = ensureLayerPane(leafletMap, options.pane);

    function buildGeoJsonLayer(geojson) {
      return L.geoJSON(geojson, {
        pane: paneName,
        style: function (feature) {
          var style = baseStyleResolver(feature);
          baseStyleCache.set(feature, style);
          return style;
        },
        onEachFeature: function (feature, layer) {
          var style = baseStyleCache.get(feature) || baseStyleResolver(feature);
          var hoverStyle = hoverResolver(feature, style);
          var demographics = lookupDemographics(feature, demographicsConfig);

          layer.on({
            mouseover: function () {
              layer.setStyle(hoverStyle);
            },
            mouseout: function () {
              layer.setStyle(style);
            }
          });

          var label = getDefaultTooltip(feature, tooltipField);
          var countryLabel = label ? '<div class="country-name">' + escapeHtml(label) + '</div>' : '';
          var tooltipContent = formatDemographicsTooltip(countryLabel, demographics, demographicsConfig);
          if (tooltipContent) {
            layer.bindTooltip(tooltipContent, tooltipOptions);
          }

          layer.featureDemographics = demographics;
          if (demographics && typeof options.onDemographicsResolved === 'function') {
            options.onDemographicsResolved(feature, layer, demographics);
          }

          if (typeof options.onEachFeature === 'function') {
            options.onEachFeature(feature, layer);
          }
        }
      });
    }

    var geojsonPromise = options.geojson ? Promise.resolve(options.geojson) : fetchGeojson(url);

    return geojsonPromise.then(function (geojson) {
      var layer = buildGeoJsonLayer(geojson);
      if (leafletMap) {
        layer.addTo(leafletMap).bringToBack();
      }
      return layer;
    });
  }

  function querySelectorAllWithin(selector, context) {
    var collections = [];
    var roots = [];
    if (context && typeof context.querySelectorAll === 'function') {
      roots.push(context);
    }
    if (context && context.ownerDocument && context.ownerDocument !== context) {
      roots.push(context.ownerDocument);
    }
    if (roots.length === 0) {
      roots.push(document);
    }

    try {
      roots.forEach(function (root) {
        collections.push(root.querySelectorAll(selector));
      });
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error('Invalid selector supplied to worldCountriesLayer:', selector, error);
      return [];
    }

    var combined = Array.prototype.concat.apply([], collections.map(function (nodeList) {
      return Array.prototype.slice.call(nodeList);
    }));

    return combined.filter(function (element, index, array) {
      return array.indexOf(element) === index;
    });
  }

  function resolveMapIdsFromSelectors(selectors, context) {
    if (!Array.isArray(selectors) || selectors.length === 0) {
      return [];
    }

    var ids = [];
    selectors.forEach(function (selector) {
      if (typeof selector !== 'string' || selector.trim() === '') {
        return;
      }
      var matches = querySelectorAllWithin(selector, context);
      Array.prototype.forEach.call(matches, function (element) {
        var wrapper = element.closest('.geolocation-map-wrapper');
        var candidate = wrapper && wrapper.id ? wrapper.id : element.id;
        if (!candidate || ids.indexOf(candidate) !== -1) {
          return;
        }
        ids.push(candidate);
      });
    });

    return ids;
  }

  function waitForGeolocationMap(mapId) {
    if (!mapId) {
      return Promise.reject(new Error('Unable to wait for geolocation map without an identifier.'));
    }

    if (pendingMapLookups[mapId]) {
      return pendingMapLookups[mapId];
    }

    pendingMapLookups[mapId] = new Promise(function (resolve, reject) {
      var attempts = 0;
      var maxAttempts = 80; // ~4 seconds at 50ms intervals.

      function attemptLookup() {
        if (typeof Drupal === 'undefined' || !Drupal.geolocation || typeof Drupal.geolocation.getMapById !== 'function') {
          if (attempts++ > maxAttempts) {
            reject(new Error('Drupal.geolocation is not available for map ' + mapId));
            return;
          }
          return window.setTimeout(attemptLookup, 50);
        }

        var map = Drupal.geolocation.getMapById(mapId);
        if (map) {
          resolve(map);
          return;
        }

        if (attempts++ > maxAttempts) {
          reject(new Error('Timed out waiting for geolocation map ' + mapId));
          return;
        }
        window.setTimeout(attemptLookup, 50);
      }

      attemptLookup();
    })
    .finally(function () {
      delete pendingMapLookups[mapId];
    });

    return pendingMapLookups[mapId];
  }

  function autoAttachCountriesLayer(settings, context) {
    if (
      !settings
      || (
        (!Array.isArray(settings.mapIds) || settings.mapIds.length === 0)
        && (!Array.isArray(settings.mapSelectors) || settings.mapSelectors.length === 0)
      )
    ) {
      return;
    }
    if (typeof Drupal === 'undefined' || !Drupal.geolocation || typeof Drupal.geolocation.getMapById !== 'function') {
      return;
    }

    var targetIds = new Set(
      (Array.isArray(settings.mapIds) ? settings.mapIds : []).filter(Boolean)
    );
    resolveMapIdsFromSelectors(settings.mapSelectors, context).forEach(function (id) {
      targetIds.add(id);
    });

    targetIds.forEach(function (mapId) {
      if (!mapId || autoAttachedMaps.has(mapId)) {
        return;
      }
      waitForGeolocationMap(mapId)
        .then(function (map) {
          var identifier = map.id || mapId;
          if (autoAttachedMaps.has(identifier)) {
            return;
          }
          autoAttachedMaps.add(identifier);
          map.addPopulatedCallback(function () {
            loadCountriesLayer(Object.assign({}, settings, {map: map})).catch(function (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            });
          });
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  var api = {
    load: loadCountriesLayer,
    fetchGeojson: function (url) {
      return fetchGeojson(resolveDatasetUrl(url));
    },
    resolveDatasetUrl: resolveDatasetUrl
  };

  Drupal.citizenCustom = Drupal.citizenCustom || {};
  Drupal.citizenCustom.worldCountriesLayer = api;
  if (typeof window !== 'undefined') {
    window[namespace] = api;
  }

  Drupal.behaviors = Drupal.behaviors || {};
  Drupal.behaviors.citizenCustomWorldCountriesLayer = Drupal.behaviors.citizenCustomWorldCountriesLayer || {
    attach: function (context, drupalSettings) {
      autoAttachCountriesLayer(drupalSettings && drupalSettings.citizenCustom && drupalSettings.citizenCustom.worldCountriesLayer, context);
    }
  };
})(Drupal, drupalSettings);
