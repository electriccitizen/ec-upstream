(function (Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.educationusaAIGreeter = {
    attach: function (context) {
      const settings = drupalSettings.educationusa_ai_greeter;
      if (!settings || !settings.wrapperId) return;

      const wrapper = context.querySelector('#' + settings.wrapperId);
      if (!wrapper || wrapper.dataset.greeterInitialized) return;
      wrapper.dataset.greeterInitialized = 'true';

      const chatWrapper = wrapper.querySelector('.ai-greeter__chat-wrapper');

      // Find the inner DeepChat element when initialized.
      let deepchatEl = null;
      const resolveDeepchat = () => {
        // Scoped search for deepchat element in this wrapper.
        const el = wrapper.querySelector('.deepchat-element');
        if (el) {
          deepchatEl = el;
          return true;
        }
        return false;
      };

      // Ensure deepchat is ready; deepchat-init fires a global event.
      const onDeepchatReady = () => {
        if (!resolveDeepchat()) return;
        // Clear any previous stored audience so default is no selection.
        try { window.sessionStorage.removeItem('educationusa_ai_greeter_audience'); } catch (e) {}

        // Attach DeepChat class utilities for events inside the web component.
        if (deepchatEl && deepchatEl.htmlClassUtilities) {
          deepchatEl.htmlClassUtilities['greeter-audience-btn'] = {
            events: {
              click: (event) => {
                event.preventDefault();
                const key = event.target?.dataset?.audience;
                if (key) setAudience(key);
              }
            }
          };
          deepchatEl.htmlClassUtilities['greeter-cta-btn'] = {
            events: {
              click: (event) => {
                event.preventDefault();
                const id = event.target?.dataset?.cta;
                if (id) {
                  sendCtaPrompt(id);
                  openChatContainer();
                }
              }
            }
          };
        }

        // Render the in-chat audience selection buttons as an assistant message.
        renderAudienceButtonsMessage();
      };
      document.addEventListener('DrupalDeepchatInitialized', onDeepchatReady, { once: true });
      // In case the event already fired, attempt immediate resolution.
      resolveDeepchat();

      function openChatContainer() {
        // Simulate opening the chat.
        const container = wrapper.querySelector('.chat-container');
        const header = container && container.querySelector('.ai-deepchat--header');
        if (container && header && container.classList.contains('chat-collapsed')) {
          header.click();
        }
      }

      function unlockChat() {
        chatWrapper.classList.remove('ai-greeter__chat-wrapper--locked');
      }

      function setAudience(audienceKey) {
        if (!deepchatEl) resolveDeepchat();
        if (!deepchatEl) return;

        window.sessionStorage.setItem('educationusa_ai_greeter_audience', audienceKey);

        // Inject a role message as a user message into the chat history.
        const roleMsg = settings.roles[audienceKey] || '';
        if (roleMsg) {
          try {
            deepchatEl.addMessage({ role: 'user', text: roleMsg });
          } catch (e) {
            // no-op
          }
        }
        // Add CTA buttons inside the chat for this audience.
        renderCtaButtonsMessage(audienceKey);
        unlockChat();
        openChatContainer();
      }

      function sendCtaPrompt(promptId) {
        if (!deepchatEl) resolveDeepchat();
        if (!deepchatEl) return;

        const promptText = settings.prompts[promptId];
        if (!promptText) return;

        // Add user message.
        try {
          deepchatEl.addMessage({ role: 'user', text: promptText });
        } catch (e) {}

        // Add placeholder assistant message and then fetch response using DeepChat API.
        let aiIndex = null;
        try {
          deepchatEl.addMessage({ role: 'ai', html: '<em>Thinking…</em>' });
          aiIndex = deepchatEl.getMessages().length - 1;
        } catch (e) {}

        const connect = deepchatEl.connect || {};
        const url = connect.url || null;
        const threadId = drupalSettings.ai_deepchat && drupalSettings.ai_deepchat.thread_id;
        const assistantId = drupalSettings.ai_deepchat && drupalSettings.ai_deepchat.assistant_id;
        if (!url || !assistantId || !threadId) return;

        if (deepchatEl.disableSubmitButton) deepchatEl.disableSubmitButton(true);

        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            thread_id: threadId,
            assistant_id: assistantId,
            show_copy_icon: drupalSettings.ai_deepchat && drupalSettings.ai_deepchat.show_copy_icon,
            structured_results: drupalSettings.ai_deepchat && drupalSettings.ai_deepchat.structured_results,
            messages: [ { role: 'user', text: promptText } ],
          }),
        })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          const html = (data && data.html) ? data.html : '<em>No response</em>';
          if (deepchatEl.updateMessage && aiIndex !== null) {
            deepchatEl.updateMessage({ role: 'ai', html: html }, aiIndex);
          }
        })
        .catch(() => {
          if (deepchatEl.updateMessage && aiIndex !== null) {
            deepchatEl.updateMessage({ role: 'assistant', html: '<em>Error fetching response.</em>' }, aiIndex);
          }
        })
        .finally(() => {
          if (deepchatEl.disableSubmitButton) deepchatEl.disableSubmitButton(false);
        });
      }

      function renderAudienceButtonsMessage() {
        if (!deepchatEl) return;
        let html = '<div class="greeter-audience"><p>' + Drupal.t('Hello! Who are you?') + '</p><div class="greeter-audience-buttons">';
        for (const key in settings.audiences) {
          const label = settings.audiences[key].label || key;
          html += '<button class="deep-chat-button greeter-audience-btn" data-audience="' + key + '">' + label + '</button> ';
        }
        html += '</div></div>';
        try { deepchatEl.addMessage({ role: 'ai', html }); } catch(e) {}
      }

      function renderCtaButtonsMessage(audienceKey) {
        const audience = settings.audiences[audienceKey];
        if (!audience) return;
        let html = '<div class="greeter-ctas"><p>' + Drupal.t('Choose an action:') + '</p><div class="greeter-cta-buttons">';
        (audience.buttons || []).forEach(btn => {
          html += '<button class="deep-chat-button greeter-cta-btn" data-cta="' + btn.id + '">' + btn.label + '</button> ';
        });
        html += '</div></div>';
        try { deepchatEl.addMessage({ role: 'ai', html }); } catch(e) {}
      }
    }
  }
})(Drupal, drupalSettings);
