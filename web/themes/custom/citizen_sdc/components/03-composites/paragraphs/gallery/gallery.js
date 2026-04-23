/**
 * @file
 * Gallery paragraph behaviors.
 *
 * LIGHTBOX — vanilla <dialog>-based modal, replaces the old featherlight
 * (jQuery) integration. One dialog per gallery, pre-rendered inert in the
 * twig and hoisted to the top layer by `.showModal()` when opened. ESC-to-
 * close, focus trap, role="dialog", and aria-modal are provided by the
 * browser. We wire up:
 *   - click on trigger button → open dialog, populate stage from <template>
 *   - prev/next buttons + arrow keys → cycle through items (with wrap)
 *   - close button + backdrop click → close
 *   - aria-live announcement of position ("Image N of M")
 *   - focus return to the trigger button that opened the dialog
 *
 * SLIDER — kept on slick/jQuery pending the slick → Embla rewrite. Same
 * behavior shape as before: `adaptiveHeight`, `autoplay`.
 */
((Drupal, once, $) => {
  'use strict';

  // -------------------------------------------------------------------
  // LIGHTBOX
  // -------------------------------------------------------------------

  // Set up one gallery's click handlers + dialog wiring.
  function initLightbox(root) {
    const triggers = root.querySelectorAll('.paragraph--gallery__trigger');
    const modal = root.querySelector('[data-gallery-modal]');
    if (!modal || !triggers.length) return;

    const stage = modal.querySelector('[data-gallery-stage]');
    const liveRegion = modal.querySelector('[data-gallery-live]');
    const closeBtn = modal.querySelector('[data-gallery-close]');
    const prevBtn = modal.querySelector('[data-gallery-prev]');
    const nextBtn = modal.querySelector('[data-gallery-next]');
    const items = Array.from(triggers).map((btn) => {
      const source = btn.parentElement.querySelector('.paragraph--gallery__source');
      return { trigger: btn, source };
    });

    let currentIndex = 0;
    let openedBy = null;

    // Crossfade transition between images: fade the stage out, swap in
    // the new content, wait for the new image to finish decoding (so we
    // don't fade back in on a blank placeholder), then fade back in.
    // Masks the momentary white flash that happens when the old node is
    // removed and the new one hasn't painted yet.
    const FADE_MS = 180;

    function render(index) {
      currentIndex = ((index % items.length) + items.length) % items.length;
      const clone = items[currentIndex].source.content.cloneNode(true);

      stage.classList.add('is-transitioning');

      const swap = () => {
        stage.replaceChildren(clone);
        const newImg = stage.querySelector('img');
        const fadeIn = () => stage.classList.remove('is-transitioning');
        if (newImg && !newImg.complete) {
          newImg.addEventListener('load', fadeIn, { once: true });
          newImg.addEventListener('error', fadeIn, { once: true });
        } else {
          requestAnimationFrame(fadeIn);
        }
      };
      // Let the fade-out finish before swapping content, then fade back in
      // once the new image is ready.
      setTimeout(swap, FADE_MS);

      // Announce the position for screen readers.
      if (liveRegion) {
        liveRegion.textContent = `Image ${currentIndex + 1} of ${items.length}`;
      }
      // Hide prev/next entirely when there's only one image.
      const hasMulti = items.length > 1;
      prevBtn.hidden = !hasMulti;
      nextBtn.hidden = !hasMulti;
    }

    function open(index, trigger) {
      openedBy = trigger;
      render(index);
      modal.showModal();
    }

    function close() {
      if (modal.open) modal.close();
    }

    // Trigger click → open.
    triggers.forEach((btn, index) => {
      btn.addEventListener('click', () => open(index, btn));
    });

    // Nav buttons.
    prevBtn.addEventListener('click', () => render(currentIndex - 1));
    nextBtn.addEventListener('click', () => render(currentIndex + 1));
    closeBtn.addEventListener('click', close);

    // Keyboard nav within the open dialog.
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        render(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        render(currentIndex + 1);
      }
      // ESC is handled natively by <dialog>.
    });

    // Click on backdrop (dialog itself, not inner content) → close.
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // On close (any path — ESC, button, backdrop), return focus to the
    // trigger that opened the dialog.
    modal.addEventListener('close', () => {
      if (openedBy && typeof openedBy.focus === 'function') {
        openedBy.focus();
      }
      openedBy = null;
    });
  }

  // -------------------------------------------------------------------
  // SLIDER (slick — temporary)
  // -------------------------------------------------------------------

  function initSlider(root) {
    if (!$) return;
    const wrap = root.querySelector('.paragraph--gallery__wrap');
    if (!wrap) return;
    $(wrap).slick({
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 5000,
    });
    $('button.slick-prev, button.slick-next', root).addClass('material-icons');
  }

  // -------------------------------------------------------------------
  // Drupal behavior
  // -------------------------------------------------------------------

  Drupal.behaviors.citizenSdcGallery = {
    attach(context) {
      once('gallery-lightbox', '.paragraph--gallery--lightbox', context).forEach(initLightbox);
      once('gallery-slider', '.paragraph--gallery--slider', context).forEach(initSlider);
    },
  };
})(Drupal, once, window.jQuery);
