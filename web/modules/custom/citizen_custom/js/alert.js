/**
 * @file
 * Fetches active alert teasers and injects them into the alert placeholder.
 * Each teaser can be dismissed for 30 days (tracked in localStorage by UUID).
 */
((Drupal, once) => {
  'use strict';

  const PLACEHOLDER_SELECTOR = '[data-alert-placeholder]';
  const TEASER_SELECTOR = '[data-alert-uuid]';
  const CLOSE_SELECTOR = '[data-alert-close]';
  const STORAGE_KEY = 'citizen_alert_dismissed';
  const DISMISS_DAYS = 30;
  const DAY_MS = 24 * 60 * 60 * 1000;

  const readDismissed = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      const now = Date.now();
      // Drop entries that have passed their expiry.
      const cleaned = {};
      Object.keys(data).forEach((uuid) => {
        if (data[uuid] > now) cleaned[uuid] = data[uuid];
      });
      return cleaned;
    }
    catch (e) {
      return {};
    }
  };

  const writeDismissed = (data) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    catch (e) {
      // localStorage unavailable (private mode, quota) — dismissal won't
      // persist, but the alert will still close for this page view.
    }
  };

  const dismiss = (uuid) => {
    const data = readDismissed();
    data[uuid] = Date.now() + (DISMISS_DAYS * DAY_MS);
    writeDismissed(data);
  };

  Drupal.behaviors.citizenAlert = {
    attach(context) {
      once('citizenAlert', PLACEHOLDER_SELECTOR, context).forEach((placeholder) => {
        const endpoint = placeholder.getAttribute('data-alert-placeholder');
        if (!endpoint) return;

        fetch(endpoint, {
          credentials: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
          .then((response) => response.ok ? response.text() : '')
          .then((html) => {
            if (!html) return;
            placeholder.innerHTML = html;

            const dismissed = readDismissed();
            placeholder.querySelectorAll(TEASER_SELECTOR).forEach((teaser) => {
              const uuid = teaser.getAttribute('data-alert-uuid');
              if (uuid && dismissed[uuid]) {
                teaser.remove();
              }
            });

            Drupal.attachBehaviors(placeholder);
          });
      });

      once('citizenAlertClose', CLOSE_SELECTOR, context).forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const teaser = button.closest(TEASER_SELECTOR);
          if (!teaser) return;
          const uuid = teaser.getAttribute('data-alert-uuid');
          if (uuid) dismiss(uuid);
          teaser.remove();
        });
      });
    },
  };
})(Drupal, once);
