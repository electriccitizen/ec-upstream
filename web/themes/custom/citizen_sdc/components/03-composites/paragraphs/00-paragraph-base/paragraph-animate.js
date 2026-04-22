/**
 * @file
 * Field-level scroll-in observer for paragraphs.
 *
 * Attached once per `field-paragraphs` wrapper (via the
 * `citizen_sdc/paragraph-animate` library on the
 * `field--node--field-paragraphs.html.twig` template). One IntersectionObserver
 * per field watches every descendant `[data-animate="yes"]` element; when an
 * element scrolls into view, it gets the `is-in-view` class and the observer
 * stops watching it. Per-paragraph CSS drives the actual animation — initial
 * state defined under `.paragraph--{bundle}[data-animate="yes"]` and final
 * state under `.paragraph--{bundle}[data-animate="yes"].is-in-view` (or
 * similar). Elements that render inside the initial viewport animate on load.
 *
 * Reduced motion: when the user's OS sets `prefers-reduced-motion: reduce`,
 * the observer is skipped and `is-in-view` is added to every animated
 * element immediately so paragraphs that rely on an initial hidden state
 * aren't stuck invisible.
 */
((Drupal, once) => {
  'use strict';

  const FIELD_SELECTOR = '[data-paragraph-animate-field]';
  const ANIMATE_SELECTOR = '[data-animate="yes"]';
  const IN_VIEW_CLASS = 'is-in-view';

  Drupal.behaviors.citizenParagraphAnimate = {
    attach(context) {
      once('paragraphAnimateField', FIELD_SELECTOR, context).forEach((field) => {
        const targets = field.querySelectorAll(ANIMATE_SELECTOR);
        if (!targets.length) return;

        // Respect prefers-reduced-motion: no animation, just make everything
        // final-state immediately.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          targets.forEach((el) => el.classList.add(IN_VIEW_CLASS));
          return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(IN_VIEW_CLASS);
              obs.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: '0px 0px -10% 0px',
        });

        targets.forEach((el) => observer.observe(el));
      });
    },
  };
})(Drupal, once);
