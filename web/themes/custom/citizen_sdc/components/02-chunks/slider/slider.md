# Slider (chunk)

Reusable carousel component. Takes a list of rendered slide markup and produces the carousel chrome (ul/li track, prev/next buttons, ARIA live region). Backed by [Embla Carousel](https://www.embla-carousel.com/) + the autoplay plugin. Used by:

- `citizen_sdc:gallery` (slider mode)
- (future) news-featured, program-teasers, any other SDC that needs a carousel

## Files

- `slider.component.yml` — props (`attr`, required `slider_id` + `items`, optional `label`, `autoplay`, `autoplay_interval`, `loop`, `per_view`). Declares `citizen_sdc/embla` as a library dependency via `libraryOverrides.dependencies` so consumers don't have to `attach_library()` manually.
- `slider.twig` — renders `<section role="region" aria-roledescription="carousel">` with an inner viewport + `<ul>`-track + `<li>`-slide for each item. Per-view config emits as CSS custom properties inline on the wrapper (`--slider-per-view-mobile`, `--slider-per-view-tablet`, `--slider-per-view-desktop`); slides resolve their flex-basis via `calc(100% / var(...))` with cascading fallback so setting only `mobile: 1` works at all widths. Prev/next buttons + live region only render when there are 2+ slides.
- `slider.scss` / `.css` — chrome styling only (viewport overflow clip, track flex, circular prev/next buttons, focus ring). Consumer SDCs style slide content themselves.
- `slider.js` — initializes Embla on every `[data-slider]` wrapper. Reads `data-slider-autoplay`, `data-slider-autoplay-interval`, `data-slider-loop` from the wrapper; wires prev/next buttons; announces "Slide N of M" in the aria-live region on each change. Auto-registered by the SDC module; core/autoplay Embla bundles come from the `citizen_sdc/embla` lib dep.

## Props

- `slider_id` **(required)** — unique per instance; used in `data-slider` for JS scoping.
- `items` **(required)** — array of rendered slide markup. Consumer's job to prep each slide.
- `attr` — Drupal Attributes.
- `label` — string; applied as `aria-label` on the region. Leave empty/null when inside a named container (e.g. a gallery with its own H2) to avoid redundant region announcement.
- `autoplay` (bool, default false)
- `autoplay_interval` (int, default 5000 ms)
- `loop` (bool, default true)
- `adaptive_height` (bool, default false) — viewport height follows the current slide's natural height. See "Adaptive height" below.
- `per_view` — `{ mobile?, tablet?, desktop? }` object. Each key optional. Falls back to the smaller breakpoint.

## Adaptive height

When `adaptive_height: true`, the SDC pulls in Embla's `AutoHeight` plugin, which writes an inline `height` on `.slider__viewport` to match the currently-visible slide. Prevents whitespace under shorter images when slides vary in aspect ratio.

**Two coupled requirements** for it to work:

1. `.slider__track` uses `align-items: flex-start` (not `stretch`). Stretching forces every slide to the tallest height, leaving the plugin with nothing to adapt to — adaptive-height looks like it's doing nothing. `flex-start` is the current default in `slider.scss`.
2. `.slider__track` has a CSS `transition: height …` so the resize animates smoothly. **The transition goes on the track, NOT the viewport** — the plugin writes inline `height` to `containerNode()` which is the first child of the Embla root (our `<ul class="slider__track">`). If you put the transition on the viewport instead, nothing animates: the viewport has `height: auto` and just follows the track's instant jump. Also in `slider.scss`.

Consumers don't need to do anything beyond passing the prop.

**Image-load reInit (important):** if slides contain `<img>` elements that haven't finished loading at Embla init time, they report 0×0 natural dimensions and the AutoHeight plugin caches a placeholder height for them — visible as "the height updates once between slides 0 and 1, then sticks forever." `slider.js` attaches a one-shot `load`/`error` listener on every `<img>` inside the slider and calls `embla.reInit()` on each fire, which re-reads real slide heights now that the image has actual dimensions. reInit is idempotent and this matches Embla's own async-content docs. Applies to *any* slider with images, not just gallery.

## Responsive per-view pattern

Instead of a combinatorial SCSS matrix (mobile×tablet×desk × all possible values), slide width is driven by CSS custom properties set inline on each slider instance by the twig. Example output:

```html
<section class="slider" style="--slider-per-view-tablet: 2; --slider-per-view-desktop: 4;" …>
```

```scss
.slider__slide {
  flex: 0 0 calc(100% / var(--slider-per-view-mobile, 1));
  @include tab { flex: 0 0 calc(100% / var(--slider-per-view-tablet, var(--slider-per-view-mobile, 1))); }
  @include desk { flex: 0 0 calc(100% / var(--slider-per-view-desktop, var(--slider-per-view-tablet, var(--slider-per-view-mobile, 1)))); }
}
```

This lets every consumer pick its own per-breakpoint count without touching the slider SDC.

## Library — citizen_sdc/embla

Defined in `citizen_sdc.libraries.yml`. Provides the Embla core UMD + autoplay plugin UMD bundles from `components-addons/embla/`. Both bundles are vanilla (no jQuery); core is ~18KB unminified, autoplay is ~2.5KB.

Globals exposed:
- `window.EmblaCarousel` — core factory
- `window.EmblaCarouselAutoplay` — plugin factory (only loaded because we always include autoplay; if we ever want autoplay-free, the plugin bundle can be conditionally attached).

## Accessibility

- Wrapper is `role="region"` + `aria-roledescription="carousel"` + optional `aria-label` (consumer decides).
- Each slide: `role="group"` + `aria-roledescription="slide"` + `aria-label="N of M"`.
- Prev/Next are real `<button>` elements with `aria-label`.
- On slide change, an SR-only `aria-live="polite"` region announces "Slide N of M".
- Embla handles touch/drag natively; no custom gesture code needed.
