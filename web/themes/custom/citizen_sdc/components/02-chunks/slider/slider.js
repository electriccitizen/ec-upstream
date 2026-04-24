/**
 * @file
 * Slider SDC behaviors — initializes an Embla carousel on every
 * `[data-slider]` wrapper. Reads config from the data- attributes emitted
 * by `slider.twig`, resolves the autoplay plugin only if autoplay is
 * enabled, and wires the prev/next buttons + live-region announcements.
 *
 * Globals used (provided by `citizen_sdc/embla` library):
 *   - EmblaCarousel           (core factory)
 *   - EmblaCarouselAutoplay   (autoplay plugin factory)
 */
((Drupal, once) => {
  'use strict';

  function initSlider(root) {
    const EmblaCarousel = window.EmblaCarousel;
    if (!EmblaCarousel) return;

    const viewport = root.querySelector('[data-slider-viewport]');
    if (!viewport) return;

    const prevBtn = root.querySelector('[data-slider-prev]');
    const nextBtn = root.querySelector('[data-slider-next]');
    const live = root.querySelector('[data-slider-live]');

    const autoplay = root.dataset.sliderAutoplay === 'yes';
    const loop = root.dataset.sliderLoop !== 'no';
    const adaptiveHeight = root.dataset.sliderAdaptiveHeight === 'yes';
    const autoplayInterval = parseInt(root.dataset.sliderAutoplayInterval, 10) || 5000;

    const plugins = [];
    if (autoplay && typeof window.EmblaCarouselAutoplay === 'function') {
      plugins.push(window.EmblaCarouselAutoplay({
        delay: autoplayInterval,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }));
    }
    if (adaptiveHeight && typeof window.EmblaCarouselAutoHeight === 'function') {
      plugins.push(window.EmblaCarouselAutoHeight());
    }

    const embla = EmblaCarousel(viewport, { loop }, plugins);

    // Images without natural dimensions report a placeholder height at
    // init time, which the AutoHeight plugin caches and then reuses for
    // the affected slide forever (the symptom: viewport height doesn't
    // update when a lazy-loaded slide becomes active). Re-init Embla as
    // each image finishes so the plugin re-reads real heights. Idempotent
    // and inexpensive; matches the pattern in Embla's own async-content
    // docs.
    root.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth > 0) return;
      const onResolved = () => embla.reInit();
      img.addEventListener('load', onResolved, { once: true });
      img.addEventListener('error', onResolved, { once: true });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => embla.scrollPrev());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => embla.scrollNext());
    }

    // Update the SR-only live region on slide change.
    if (live) {
      const announce = () => {
        const i = embla.selectedScrollSnap() + 1;
        const n = embla.scrollSnapList().length;
        live.textContent = Drupal.t('Slide @i of @n', {'@i': i, '@n': n});
      };
      embla.on('select', announce);
    }
  }

  Drupal.behaviors.citizenSdcSlider = {
    attach(context) {
      once('citizen-sdc-slider', '[data-slider]', context).forEach(initSlider);
    },
  };
})(Drupal, once);
