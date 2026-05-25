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
