import type { Preview } from '@storybook/html-vite';
import Twig from 'twig';
import { addDrupalExtensions } from 'drupal-twig-extensions/twig';
// @ts-expect-error virtual module emitted by main.ts viteFinal
import sdcTemplates from 'virtual:sdc-twig-sources';

import '../components/style.css';

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
