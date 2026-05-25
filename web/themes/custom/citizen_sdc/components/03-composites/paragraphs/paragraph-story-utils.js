// Shared Storybook helpers for paragraph stories.
//
// In production every child paragraph (Text, Image, CTA, …) renders inside a
// Layout Section paragraph, which in turn renders a layout_paragraphs column
// layout (one / two / three column) holding the children. Lots of CSS keys off
// that ancestry — section padding/background, `.field-paragraphs > :first-child`
// rules, `.layout__region` column widths, the scroll-in animation observer.
//
// Rather than re-create that wrapping in every paragraph's *.stories.js, this
// module owns it. A paragraph story just renders its own SDC and hands the
// markup to `renderSection()`.
//
// Not named `*.stories.js`, so Storybook's glob doesn't pick it up as a story.

import DrupalAttribute from 'drupal-attribute';
import layoutSection from './layout-section/layout-section.twig';
import twoColumn from '../layouts/paragraph-section-layouts/layout-section-two-column/layout-section-two-column.twig';
import threeColumn from '../layouts/paragraph-section-layouts/layout-section-three-column/layout-section-three-column.twig';

// The three column layouts a Layout Section offers, with their region count and
// the default width ratio the layout plugin applies when none is chosen.
export const LAYOUTS = {
  onecol: { label: 'One column', regions: 1, defaultRatio: null },
  twocol: { label: 'Two column', regions: 2, defaultRatio: '50-50' },
  threecol: { label: 'Three column', regions: 3, defaultRatio: '33-34-33' },
};

// Valid `column_widths` per layout — these become the
// `layout--{twocol|threecol}-section--{ratio}` modifier class.
export const RATIOS = {
  twocol: ['50-50', '33-67', '67-33', '25-75', '75-25'],
  threecol: ['33-34-33', '25-50-25', '25-25-50', '50-25-25'],
};

export const regionCountFor = (layout) =>
  (LAYOUTS[layout] ?? LAYOUTS.onecol).regions;

// Build the layout wrapper's Attribute object with the classes the
// layout_{twocol,threecol}_section plugin adds in its build() method (the SDC
// twig expects them to already be present on `attr`).
const layoutAttr = (...classes) => new DrupalAttribute().addClass(classes);

// One-column has no SDC — it renders through the core layout--onecol template
// override. Reproduce that markup directly.
const oneColumnHtml = (content) =>
  '<div class="layout layout--onecol">' +
  `<div class="layout__region layout__region--content">${content}</div>` +
  '</div>';

/**
 * Nest already-rendered child-paragraph markup inside a column layout inside a
 * Layout Section inside the node's field-paragraphs wrapper.
 *
 * @param {object}          opts
 * @param {string|string[]} opts.regions      Rendered HTML per column region.
 *   A string is treated as a single region; an array maps onto first/second/
 *   third in order. Extra regions for the layout are left empty.
 * @param {string|null}     opts.style_class  layout-section field_style
 *   (`light-grey`, `light-blue`, or null/`backless`).
 * @param {string}          opts.layout       `onecol` | `twocol` | `threecol`.
 * @param {string|null}     opts.ratio        Column-width ratio; null uses the
 *   layout's default. Ignored for one column.
 * @returns {string} HTML
 */
export function renderSection({
  regions = [],
  style_class = null,
  layout = 'onecol',
  ratio = null,
} = {}) {
  const cells = Array.isArray(regions) ? regions : [regions];
  const def = LAYOUTS[layout] ?? LAYOUTS.onecol;
  const widths = ratio ?? def.defaultRatio;

  let columns;
  if (layout === 'twocol') {
    columns = twoColumn({
      attr: layoutAttr(
        'layout',
        'layout--twocol-section',
        `layout--twocol-section--${widths}`,
      ),
      first_attr: new DrupalAttribute(),
      second_attr: new DrupalAttribute(),
      first: cells[0] ?? '',
      second: cells[1] ?? '',
    });
  } else if (layout === 'threecol') {
    columns = threeColumn({
      attr: layoutAttr(
        'layout',
        'layout--threecol-section',
        `layout--threecol-section--${widths}`,
      ),
      first_attr: new DrupalAttribute(),
      second_attr: new DrupalAttribute(),
      third_attr: new DrupalAttribute(),
      first: cells[0] ?? '',
      second: cells[1] ?? '',
      third: cells[2] ?? '',
    });
  } else {
    columns = oneColumnHtml(cells.join(''));
  }

  return (
    '<div class="field-paragraphs" data-paragraph-animate-field>' +
    layoutSection({ style_class, content: columns }) +
    '</div>'
  );
}

// Drop-in argTypes for the section/column controls every paragraph story shares.
// Spread into a story's `argTypes` alongside the paragraph's own props.
export const sectionArgTypes = {
  style_class: {
    name: 'Section style',
    control: { type: 'select' },
    options: ['backless', 'light-grey', 'light-blue'],
    mapping: { backless: null },
    description:
      'layout-section `field_style`. `backless` (null) = no background; `light-grey` / `light-blue` apply background colors.',
  },
  layout: {
    name: 'Column layout',
    control: { type: 'inline-radio' },
    options: Object.keys(LAYOUTS),
    description:
      'layout_paragraphs column layout the section wraps the paragraph in: One, Two, or Three column.',
  },
  ratio: {
    name: 'Column widths',
    control: { type: 'select' },
    options: ['default', ...RATIOS.twocol, ...RATIOS.threecol],
    mapping: { default: null },
    description:
      '`column_widths` ratio for two/three-column layouts. `default` = 50-50 (two col) / 33-34-33 (three col). Ignored for one column.',
  },
};
