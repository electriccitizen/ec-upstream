# Form Placer paragraph — file map

Reference for where the pieces of this widget live. The form-placer paragraph embeds a referenced webform, optionally preceded by an H2 title.

## SDC (this folder)

- `form-placer.component.yml` — props (`attr`, optional `title`) + slot (`form`).
- `form-placer.twig` — renders `<h2 class="paragraph--form-placer__title">` when `title` is truthy, then the `{{ form }}` slot; delegates to `paragraph-base` with `animate: 'no'`.
- `form-placer.scss` / `.css` — widgetTitle mixin on the H2; ports the one dart rule (`.webform-submission-form { padding-top: 0 }`).

## Drupal template

`web/themes/custom/citizen_sdc/templates/paragraphs/form-placer/paragraph--form-placer.html.twig`

- Derives `form_title` from `paragraph.field_form.entity.label` (Twig sandbox allows `.label` method access on entities).
- Gates on `paragraph.field_form_title.value == '1'`. When off, passes `null` for the title so the SDC renders no H2.
- Passes `content.field_form` (rendered webform render array) through as the `form` slot.

## Title rendering split — WHY THIS IS WEIRD

Two separate SDCs decide whether/how to render a webform's title, depending on context:

- **Standalone `/forms/{id}` page** — `citizen_sdc:webform` renders `<h1 class="webform-wrapper__title">{{ title }}</h1>`.
- **Inside a form-placer paragraph** — `citizen_sdc:webform` renders nothing; `citizen_sdc:form-placer` renders its own `<h2 class="paragraph--form-placer__title">`, gated per-instance on `field_form_title`.

**Why not keep both titles in `citizen_sdc:webform`?** Earlier design did — it stored `show_placer_title` on the shared webform entity via `$webform->set(...)` in the paragraph preprocess, and the webform twig branched on it. With two placers on one page referencing the same webform, both preprocess hooks wrote to the same static-cached entity and clobbered each other (plus render cache reuse made it worse). Per-instance state can't live on a shared entity. The fix was to move H2 rendering up to the placer SDC where per-instance state naturally belongs.

The webform SDC still needs to know "am I in a placer context?" so it can suppress its H1. That lives on as a single boolean flag (`webform_placer`) — always TRUE in placer context, always FALSE standalone — which is stable and doesn't bleed.

## Variables coming from outside the SDC

The form-placer + webform SDCs both consume variables set by `.inc` preprocess hooks. When debugging "where is this variable coming from?", look here:

### `web/themes/custom/citizen_sdc/includes/citizen_sdc.paragraph.inc`

`citizen_sdc_preprocess_paragraph__form_placer()` —

- Pulls the webform entity off the paragraph's rendered field (`$variables['elements']['field_form'][0]['#webform']`).
- Sets `webform_placer = TRUE` on the webform entity so the webform SDC's H1 is suppressed in this context.
- **Does not** handle the title visibility toggle — that's pure paragraph-side work in the Drupal template above.

### `web/themes/custom/citizen_sdc/includes/citizen_sdc.form.inc`

`citizen_sdc_preprocess_webform()` —

- Loads the webform via `Webform::load()` (returns the same static-cached instance the paragraph preprocess mutated).
- Exposes `webform_placer` + `title` (the webform's label) as Twig variables for the webform SDC.

## Webform SDC

`components/01-parts/forms/webform/` — the partner SDC. Its `webform.md` explains the title split from the other side. Keep both files in sync when changing the rendering contract.
