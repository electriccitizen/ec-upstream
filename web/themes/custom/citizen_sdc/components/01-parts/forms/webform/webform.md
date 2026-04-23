# Webform Component

## Title rendering split

- **Standalone `/forms/{id}` page** — this SDC renders `<h1 class="webform-wrapper__title">{{ title }}</h1>`.
- **Form-placer paragraph context** — this SDC renders no heading. The placer SDC (`citizen_sdc:form-placer`) renders its own `<h2>` above the form, gated per-instance on `field_form_title`.

## Custom Twig variables

- `webform_placer` (bool) — set by `citizen_sdc_preprocess_paragraph__form_placer()` (in `includes/citizen_sdc.paragraph.inc`) via `$webform->set('webform_placer', TRUE)`. Exposed as a Twig variable by `citizen_sdc_preprocess_webform()` (in `includes/citizen_sdc.form.inc`). Drives the H1-suppression branch in `webform.twig`.
- `title` (string) — the webform's label, exposed by `citizen_sdc_preprocess_webform()`.

## Why the placer title lives in the placer SDC, not here

Earlier versions stored per-instance title visibility (`show_placer_title`) on the shared Webform entity via `$webform->set(...)`. With two form-placer paragraphs referencing the same webform on one page, both preprocess hooks wrote to the same static-cached entity and clobbered each other — whichever ran last won, or the webform render cache returned one cached output for both. Per-instance state can't live on a shared entity. It now lives on the paragraph (where it belongs) and is rendered directly by the placer SDC.

`webform_placer` stays here because it's a stable boolean (always TRUE in placer context, always FALSE standalone) — no bleed risk.
