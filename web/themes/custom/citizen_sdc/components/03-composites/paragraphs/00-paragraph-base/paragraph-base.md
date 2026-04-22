# Paragraph Base SDC

Thin wrapper used by every per-bundle paragraph SDC. Owns two contracts
shared across all paragraphs:

- The `.paragraph` / `.paragraph--{bundle}` BEM classes on the outermost
  `<div>` — use `paragraph--{bundle}--{modifier}` in your per-bundle SDC when
  you need further variants.
- The `data-animate` attribute that drives the field-level scroll-in
  observer (see **Scroll-in animation** below).

Usage from a per-bundle SDC twig:

```twig
{{ include('citizen_sdc:paragraph-base', {
  attr: attr,                 // optional — falls back to create_attribute()
  modifier_class: 'cta',      // required — bundle machine name, dashed
  animate: 'yes',             // optional — default 'no' (opt-in)
  content: composed_markup,   // the bundle's rendered body
}, with_context = false) }}
```

## Scroll-in animation

The animation system has **three moving pieces**:

| Piece | Where it lives | What it does |
|---|---|---|
| `data-animate="yes|no"` attribute | Emitted by this SDC onto the paragraph wrapper | Marks which paragraphs participate in the observer |
| `citizen_sdc/paragraph-animate` library | `citizen_sdc.libraries.yml` → `js/paragraph-animate.js` | One `IntersectionObserver` per field, toggles `is-in-view` |
| `is-in-view` class | Added by JS on scroll-in, held permanently | Switches the per-bundle CSS from initial to final animation state |

**How it wires together:**

1. Each paragraph bundle's SDC passes `animate: 'yes'` (or omits it, defaulting
   to `'no'`) when it includes paragraph-base. This SDC writes
   `data-animate="yes"` or `data-animate="no"` onto the wrapper.
2. The paragraph field template (`templates/field/paragraphs/field--node--field-paragraphs.html.twig`)
   attaches the `citizen_sdc/paragraph-animate` library and puts
   `data-paragraph-animate-field` on the `.field-paragraphs` wrapper.
3. On `Drupal.behaviors.citizenParagraphAnimate.attach`, one
   `IntersectionObserver` is created per `[data-paragraph-animate-field]`
   wrapper. It watches every descendant `[data-animate="yes"]` element
   (including nested paragraphs inside layout-sections) and adds the
   `is-in-view` class when the element's intersection ratio reaches 0.15.
   After firing, it unobserves the element so the class change is one-way.
4. Per-bundle SCSS defines the initial (pre-animation) state under
   `.paragraph--{bundle}[data-animate="yes"]` and the final state under
   `.paragraph--{bundle}[data-animate="yes"].is-in-view`. CSS transitions
   handle the actual motion.

### Defaults (and why)

- **`animate` defaults to `'no'`.** The opt-in default is intentional: a
  forgotten `animate` setting produces a static paragraph (visible, easy to
  fix), whereas an always-on default would silently leave an observer
  running on paragraphs that don't need animation if a dev forgets to turn
  it off.
- **Layout-wrapping bundles explicitly pass `animate: 'no'`.** `layout-section`
  and `layout-section-simple` pass the default explicitly for readability —
  section wrappers themselves shouldn't animate; their children do.

### Writing an animation for a new bundle

Two things in the bundle's SCSS file:

```scss
.paragraph--cta {
  // Structural styling (padding, typography, etc.) goes here as usual.

  // Scroll-in animation states.
  &[data-animate="yes"] {
    // Initial — pre-animation, visible ONLY to pages where JS can run.
    // (Page-source non-JS clients see the final state because they don't
    //  get the is-in-view class either, but the transition targets are
    //  present; see reduced-motion below.)
    .paragraph--cta__headline {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.5s ease-out 0.25s, transform 0.5s ease-out 0.25s;
    }

    .paragraph--cta__actions {
      opacity: 0;
      transition: opacity 0.5s ease-out 0.5s;
    }

    &.is-in-view {
      .paragraph--cta__headline {
        opacity: 1;
        transform: translateY(0);
      }

      .paragraph--cta__actions {
        opacity: 1;
      }
    }
  }
}
```

### `prefers-reduced-motion`

The JS reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
at `attach` time. When true, it short-circuits — no observer is created,
and `is-in-view` is added to every animated element immediately so anything
with a hidden initial state (`opacity: 0`, etc.) paints as visible.

**Your per-bundle SCSS still needs a reduced-motion override** because the
JS only handles the class toggle; it can't kill the CSS transition or
force the final state on elements whose initial state is set by property
(not class). Pattern:

```scss
@media (prefers-reduced-motion: reduce) {
  .paragraph--cta[data-animate="yes"] {
    .paragraph--cta__headline,
    .paragraph--cta__actions {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
}
```

This cancels the initial hidden state and the transition, so users with the
preference see the paragraph fully visible from first paint — no flash of
the pre-animation state.

### Observer tuning

Currently `threshold: 0.15` + `rootMargin: '0px 0px -10% 0px'` in
`js/paragraph-animate.js`. That fires when ~15% of the element is visible
inside the top 90% of the viewport — slightly before the paragraph reaches
the actual viewport edge. Adjust both there if animation feels too early or
too late.

### Where the observer does NOT fire

- Nested paragraphs inside other *per-paragraph* wrappers (accordion items
  inside an accordion, gallery items inside a gallery) are still
  `[data-animate="yes"]` descendants of the paragraph field, so the
  observer WILL watch them. If that's too much motion, set the container
  bundle's SDC to `animate: 'no'` AND pass `animate: 'no'` through to its
  children, OR target only the container's animation and let the children
  stay static.
- Paragraphs rendered outside a `[data-paragraph-animate-field]` wrapper
  (for example, a paragraph rendered in isolation via a custom route) are
  never watched — no observer attaches. Add the attribute + library
  attachment at whatever wrapper actually groups them if you need it.
