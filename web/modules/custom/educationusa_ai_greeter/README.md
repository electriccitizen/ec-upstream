# EducationUSA AI Greeter — Module Notes (POC)

Last updated: 2025-11-18

## Purpose

Proof‑of‑concept AI greeter for EducationUSA, built on the Drupal AI ecosystem and DeepChat UI. It captures the user’s audience (Student, HEI, Counselor), injects a role message, and offers audience‑specific CTAs directly inside the chat before regular conversation.

No Zilliz/VDB is required for this POC.

## High‑level Behavior

- Block renders DeepChat plus a greeter overlay that locks the chat until a role is chosen.
- On DeepChat initialization, the module injects an assistant message with 3 audience buttons inside the chat.
- When a role is clicked:
  - A role message is injected as a user message (e.g., “My role is: …”).
  - A second assistant message shows audience‑specific CTA buttons inside the chat.
  - Clicking a CTA injects a predefined user prompt and fetches the AI response via the same DeepChat endpoint.
- Default state: no role selected. Audience persistence via sessionStorage is currently disabled for this POC (can be re‑enabled later).

## Key Files

- `educationusa_ai_greeter.info.yml` — Module definition and dependencies (Drupal 11, ai, ai_chatbot, ai_assistant_api).
- `educationusa_ai_greeter.module` — `hook_theme()` for Twig template.
- `educationusa_ai_greeter.routing.yml` — Settings route `/admin/config/educationusa/ai-greeter`.
- `src/Form/AIGreeterSettingsForm.php` — Admin settings form (Drupal 11 `ConfigFormBase`, no custom create()).
- `src/Plugin/Block/AIGreeterBlock.php` — Block plugin; renders: DeepChat block (programmatically) + attaches greeter settings for JS.
- `templates/educationusa_ai_greeter.html.twig` — Contains only the DeepChat wrapper and a “locked” overlay. Audience/CTAs render inside the chat stream.
- `js/educationusa_ai_greeter.js` — Greeter behaviors (renders in‑chat buttons, handles clicks, sends CTA prompts, unlocks UI).
- `css/educationusa_ai_greeter.css` — Minimal styles (overlay and in‑chat button appearance).
- `config/schema/educationusa_ai_greeter.schema.yml` — Config schema.
- `config/install/educationusa_ai_greeter.settings.yml` — Default config.

## Configuration

- Settings page: `/admin/config/educationusa/ai-greeter`
  - Enable greeter (default: on)
  - Show on front page only (default: off)
  - AI Assistant selection (uses existing `ai_assistant` entities)
  - Audience labels for Student, HEI, Counselor

- Drush examples:
  - `drush en ai ai_chatbot ai_assistant_api educationusa_ai_greeter -y`
  - `drush cset educationusa_ai_greeter.settings assistant grants_scholarships_assistant -y`
  - `drush cr`

- Block placement: Place “EducationUSA AI Greeter” in a site region. The greeter internally embeds the AI DeepChat block using the assistant selected in the module settings.

## How It Integrates With DeepChat

- We programmatically instantiate the contrib block `ai_deepchat_block` with the selected assistant. That contrib block sets:
  - `drupalSettings.ai_deepchat.assistant_id`
  - `drupalSettings.ai_deepchat.thread_id`
  - `deep-chat` element `connect.url` and body props

- The greeter JS waits for DeepChat to initialize via the custom event dispatched by `ai_chatbot` (`DrupalDeepchatInitialized` from `deepchat-init.js`).

- Once DeepChat is ready, greeter JS:
  1. Adds an assistant message with audience buttons inside the chat.
  2. On audience click, adds a user “role” message and injects a second assistant message with CTA buttons.
  3. On CTA click, POSTs to the same DeepChat endpoint (from `deepchatEl.connect.url`) with:
     - `assistant_id`: `drupalSettings.ai_deepchat.assistant_id`
     - `thread_id`: `drupalSettings.ai_deepchat.thread_id`
     - `messages`: `[{ role: 'user', text: <cta prompt> }]`
     - Additional DeepChat props (`structured_results`, `show_copy_icon`) passed through
  4. The response HTML replaces a temporary “Thinking…” AI message via `deepchatEl.updateMessage()`.

- We rely on DeepChat’s `htmlClassUtilities` API to bind click handlers inside the DeepChat component (important due to shadow DOM scoping). Classes used:
  - `greeter-audience-btn` — audience selection buttons
  - `greeter-cta-btn` — CTA buttons

## Why Audience UI Lives Inside Chat

- Requirement: “move the 3 audience buttons into the chatbot.”
- Earlier versions rendered buttons outside the chat; this version renders them as assistant messages within the DeepChat stream for a seamless UX.

## Data Structures (JS)

`drupalSettings.educationusa_ai_greeter` (attached by the block):
- `wrapperId`: unique DOM id for this greeter instance
- `audiences`: keyed by role (`student`, `hei`, `counselor`) with `label` and `buttons` arrays
- `prompts`: CTA id → user prompt text
- `roles`: audience key → role message text to inject as initial context

Example CTA prompts (POC hard‑coded in block):
- `student_steps`: “I’m a student. Please explain the 5 steps to studying in the U.S.”
- `student_aid`: “I’m a student seeking financial aid information.”
- `hei_events`: “I represent a higher education institution and want to learn about EducationUSA events.”
- `counselor_resources`: “I’m a high school counselor looking for resources for my students.”

Note: Labels are configurable; prompts are intentionally hard‑coded for POC.

## Drupal 11 Considerations Already Addressed

- `drupal_get_path()` was removed. `hook_theme()` now uses `\Drupal::service('extension.list.module')->getPath('educationusa_ai_greeter')`.
- `ConfigFormBase` in D11 requires DI via constructor; we removed a custom `create()` that returned `new static()` and now rely on the parent’s factory method.
- Render arrays: made sure template variables are passed as `#wrapper_id`, `#audiences`, `#deepchat` rather than plain keys to avoid invalid render array errors.

## Known Behaviors and Pitfalls

- Audience defaults: No role selected on load; sessionStorage restore is disabled. We can re‑enable persistence later (behind a config toggle) if desired.
- Message buttons from ai_chatbot: Contrib’s “message buttons” (copy/link icons) may still render after assistant responses. If we want a pristine greeter UI, implement `hook_deepchat_buttons_alter()` to suppress them for this assistant/thread.
- Shadow DOM: Click handlers must be bound via `deepchatEl.htmlClassUtilities[...]` for elements rendered inside DeepChat. Binding on outer wrappers won’t catch events.
- Assistant selection: The greeter always uses the `ai_assistant` selected on the settings form, not any separate per‑block config.

## CSS/UI Notes

- `.ai-greeter__chat-wrapper--locked`: Overlays the chat with “Select a role to start” until a role is chosen. `unlockChat()` removes the class.
- In‑chat buttons use DeepChat’s `deep-chat-button` class for consistent styling; additional classes provide POC styling.

## How to Test

1. Enable modules: `drush en ai ai_chatbot ai_assistant_api educationusa_ai_greeter -y`
2. Select an assistant: `/admin/config/educationusa/ai-greeter` (e.g., `grants_scholarships_assistant`)
3. Place block: “EducationUSA AI Greeter” in a region.
4. Clear cache: `drush cr`
5. Load the page: You should see audience buttons inside the chat. Choose a role; CTA buttons appear. Click a CTA; response arrives inside the chat.

## Future Enhancements

- Configurable CTAs: allow admins to add/edit CTA sets per audience (labels, prompts, optional link redirects).
- Dedicated assistant: create an AI assistant with a greeter‑specific system prompt and use that by default.
- Analytics: track audience selection and CTA clicks.
- i18n: translate labels/prompts, map to multilingual assistants.
- Persistence: optional restore of last selected audience via sessionStorage.
- Styling: branded styles and DeepChat theme YAML.
- Buttons alter: suppress contrib message buttons for a cleaner greeter experience.
- Validation: guard when DeepChat is not present or assistant misconfigured; provide admin warnings.

## Troubleshooting

- “Invalid render array key” errors: ensure variables are `#`‑prefixed in render arrays and never pass objects as top‑level children.
- “Call to undefined function drupal_get_path()”: fixed; ensure this module version is deployed and caches are cleared.
- Settings form constructor errors (D11): fixed by inheriting `ConfigFormBase::create()` instead of a custom one.
- Can’t click buttons inside chat: make sure `htmlClassUtilities` handlers are set and `ai_chatbot` deepchat library is loaded (it is a dependency in `educationusa_ai_greeter.libraries.yml`).

## Contact Points in Contrib

- DeepChat block: `ai/modules/ai_chatbot/src/Plugin/Block/DeepChatFormBlock.php`
- Init behavior/event: `ai/modules/ai_chatbot/js/deepchat-init.js` (dispatches `DrupalDeepchatInitialized`)
- API endpoint: route `ai_chatbot.api` handled by `ai/modules/ai_chatbot/src/Controller/DeepChatApi.php`
- Message buttons service: `ai/modules/ai_chatbot/src/Service/MessagesButtons.php`

---

This README captures the current POC state and the architectural decisions made so we can continue iterating (e.g., moving to configurable CTAs, analytics, or a dedicated greeter assistant).

