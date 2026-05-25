import type { Preview } from '@storybook/html-vite';
import Twig from 'twig';
import { addDrupalExtensions } from 'drupal-twig-extensions/twig';
// @ts-expect-error virtual module emitted by main.ts viteFinal
import sdcTemplates from 'virtual:sdc-twig-sources';

// Base/global styles (fonts, resets, typography, grid, color vars) live only in
// the aggregated style.css. Per-component styles are compiled into each SDC's
// own .css, and that aggregate lags behind them — it predates the layout-section
// column system entirely (no .layout--onecol / .layout--{twocol,threecol}-section
// rules). Import style.css first for the base layer, then every compiled
// component stylesheet after it so stories always reflect current per-component
// CSS (column widths, the onecol text max-width constraint, etc.).
import '../components/style.css';
const componentStyles = import.meta.glob(
  ['../components/**/*.css', '!../components/style.css'],
  { eager: true },
);
void componentStyles;

// --- Minimal Drupal JS runtime shim -----------------------------------------
// Interactive components (accordions, gallery, …) ship their behavior as a
// `Drupal.behaviors.*` object that calls the global `once()` and expects a
// global `Drupal`. Provide just enough of both that a story can `import` a
// component's .js (its IIFE registers the behavior) and then run it from a
// `play` function via `Drupal.attachBehaviors(canvasElement)`. Installed here
// in preview.ts so the globals exist before any story module (and the
// component .js it imports) evaluates.
const onceElements = (selector: unknown, context: ParentNode = document) =>
  typeof selector === 'string'
    ? Array.from((context as ParentNode).querySelectorAll(selector))
    : Array.isArray(selector)
      ? (selector as Element[])
      : [selector as Element];

const once = ((id: string, selector: unknown, context?: ParentNode) =>
  onceElements(selector, context).filter((el) => {
    const applied = (el.getAttribute('data-once') ?? '').split(' ').filter(Boolean);
    if (applied.includes(id)) return false;
    el.setAttribute('data-once', [...applied, id].join(' '));
    return true;
  })) as ((id: string, selector: unknown, context?: ParentNode) => Element[]) & {
  remove: (id: string, selector: unknown, context?: ParentNode) => Element[];
};

once.remove = (id, selector, context) =>
  onceElements(selector, context).filter((el) => {
    const applied = (el.getAttribute('data-once') ?? '').split(' ').filter(Boolean);
    const i = applied.indexOf(id);
    if (i === -1) return false;
    applied.splice(i, 1);
    if (applied.length) el.setAttribute('data-once', applied.join(' '));
    else el.removeAttribute('data-once');
    return true;
  });

type Behavior = {
  attach?: (context: Element | Document, settings?: unknown) => void;
  detach?: (context: Element | Document, settings?: unknown, trigger?: string) => void;
};

const Drupal = {
  behaviors: {} as Record<string, Behavior>,
  attachBehaviors(context: Element | Document = document, settings: unknown = {}) {
    Object.values(Drupal.behaviors).forEach((b) => b.attach?.(context, settings));
  },
  detachBehaviors(
    context: Element | Document = document,
    settings: unknown = {},
    trigger = 'unload',
  ) {
    Object.values(Drupal.behaviors).forEach((b) => b.detach?.(context, settings, trigger));
  },
};

Object.assign(window, { Drupal, once, drupalSettings: {} });

// Pre-register every SDC twig template under its `citizen_sdc:{id}` namespace
// so function-form includes (`{{ include('citizen_sdc:foo', ...) }}`) resolve
// at render time. See .storybook/main.ts for why this is needed.
addDrupalExtensions(Twig);
Twig.cache(false);

for (const { id, source } of sdcTemplates as Array<{
  id: string;
  source: string;
}>) {
  Twig.twig({ id, data: source, allowInlineIncludes: true });
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
