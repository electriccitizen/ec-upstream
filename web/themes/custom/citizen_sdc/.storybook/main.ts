import type { StorybookConfig } from '@storybook/html-vite';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';
import yml from '@modyfi/vite-plugin-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '../components');

// The theme uses Twig's function-form include — `{{ include('citizen_sdc:x') }}` —
// universally. twig.js (the browser runtime) can't parse named args like
// `with_context = false` and has no built-in `include()` function. We solve
// this with two coordinated pieces:
//
//   1. Rewrite function-form includes to tag-form
//      (`{% include 'x' with {...} only %}`). `, with_context = false` matches
//      `... only` semantics — the theme never inherits parent context.
//   2. Pre-register every SDC twig source at preview boot (see preview.ts),
//      and route `.twig` imports through Twig.twig({ref}) rather than letting
//      vite-plugin-twig-drupal try to compile them itself (which fails on the
//      function-form syntax).
const FUNCTION_INCLUDE_PATTERN =
  /\{\{\s*include\(\s*(['"][^'"]+['"])\s*,\s*(\{(?:[^{}]|\{[^{}]*\})*\})\s*(?:,\s*with_context\s*=\s*(?:true|false)\s*)?\)\s*\}\}/g;

function rewriteFunctionIncludes(source: string): string {
  return source.replace(
    FUNCTION_INCLUDE_PATTERN,
    '{% include $1 with $2 only %}',
  );
}

function sdcIdFromPath(filePath: string): string | null {
  const m = filePath.match(/([^/]+)\.twig$/);
  return m ? `citizen_sdc:${m[1]}` : null;
}

function collectSdcTwigs(root: string): Array<{ id: string; source: string }> {
  const out: Array<{ id: string; source: string }> = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectSdcTwigs(full));
    } else if (entry.name.endsWith('.twig')) {
      out.push({
        id: `citizen_sdc:${entry.name.replace(/\.twig$/, '')}`,
        source: rewriteFunctionIncludes(readFileSync(full, 'utf-8')),
      });
    }
  }
  return out;
}

const VIRTUAL_ID = 'virtual:sdc-twig-sources';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  async viteFinal(config) {
    config.plugins = config.plugins ?? [];
    config.plugins.push(
      {
        name: 'sdc-twig-sources',
        resolveId(id) {
          if (id === VIRTUAL_ID) return RESOLVED_ID;
        },
        load(id) {
          if (id === RESOLVED_ID) {
            return `export default ${JSON.stringify(collectSdcTwigs(COMPONENTS_DIR))};`;
          }
        },
      },
      {
        name: 'sdc-twig-import',
        enforce: 'pre',
        transform(_src, id) {
          if (!id.endsWith('.twig')) return;
          const sdcId = sdcIdFromPath(id);
          if (!sdcId) return;
          return {
            code: [
              "import Twig from 'twig';",
              "import DrupalAttribute from 'drupal-attribute';",
              'export default function render(context = {}) {',
              `  return Twig.twig({ ref: ${JSON.stringify(sdcId)} }).render({`,
              '    attributes: new DrupalAttribute(),',
              '    ...context,',
              '  });',
              '}',
            ].join('\n'),
            map: null,
          };
        },
      },
      yml(),
    );
    return config;
  },
};

export default config;
