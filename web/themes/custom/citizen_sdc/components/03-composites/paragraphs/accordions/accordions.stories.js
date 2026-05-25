import accordions from './accordions.twig';
// Side-effect import: the IIFE registers Drupal.behaviors.citizenAccordions
// against the Drupal/once globals the preview installs. The `play` function
// below runs it so toggles, keyboard nav, and single-open-at-a-time work.
import './accordions.js';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// The accordion_item child bundle has no SDC — in production the
// paragraph--accordions template flattens field_accordion_items into
// { id, header, body } objects and hands them to this SDC. Mirror that here.
// `id` drives aria-controls / element ids and must be unique across the page
// (the autodocs page renders every story at once), so each rendered group
// pulls a fresh sequence prefix.
let groupSeq = 0;
const makeItems = (entries) => {
  const prefix = `acc${(groupSeq += 1)}`;
  return entries.map(([header, body], i) => ({ id: `${prefix}-${i + 1}`, header, body }));
};

const renderAccordions = ({ title, entries }) =>
  accordions({ title, items: makeItems(entries) });

// Attach the real behavior to this story's DOM after render.
const attachBehaviors = ({ canvasElement }) =>
  window.Drupal.attachBehaviors(canvasElement);

const FAQ = [
  [
    'What is an accordion?',
    '<p>An accordion is a vertically stacked set of headers that each reveal a section of content when activated.</p>',
  ],
  [
    'When should I use one?',
    '<p>Use accordions to shorten a page and cut scrolling when content splits into logical sections a reader may not need all at once.</p>' +
      '<ul><li>FAQs</li><li>Product specs</li><li>Step-by-step guides</li></ul>',
  ],
  [
    'Is it accessible?',
    '<p>Yes. Each header is a <code>&lt;button&gt;</code> inside an <code>&lt;h3&gt;</code>, panels use <code>role="region"</code>, and Arrow / Home / End keys move between headers per the WAI-ARIA accordion pattern.</p>',
  ],
];

export default {
  title: 'Paragraphs/Accordions',
  tags: ['autodocs'],
  // Fill each region of the chosen layout with its own accordions group (unique
  // ids per column), so switching `layout` shows the column theming too.
  render: ({ title, style_class, layout, ratio }) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(layout) }, () =>
        renderAccordions({ title, entries: FAQ }),
      ),
      style_class,
      layout,
      ratio,
    }),
  play: attachBehaviors,
  argTypes: {
    title: {
      control: 'text',
      description:
        'Optional field_widget_title — rendered as an `<h2 class="paragraph--accordions__title">` above the items. Leave empty to omit.',
    },
    ...sectionArgTypes,
  },
  args: {
    title: 'Frequently asked questions',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Default = {};

export const WithoutTitle = {
  args: { title: '' },
};

export const ManyItems = {
  render: ({ title, style_class, layout, ratio }) =>
    renderSection({
      regions: [
        renderAccordions({
          title,
          entries: [
            ['First section', '<p>Body copy for the first section.</p>'],
            ['Second section', '<p>Body copy for the second section.</p>'],
            ['Third section', '<p>Body copy for the third section.</p>'],
            ['Fourth section', '<p>Body copy for the fourth section.</p>'],
            ['Fifth section', '<p>Body copy for the fifth section.</p>'],
            ['Sixth section', '<p>Body copy for the sixth section.</p>'],
          ],
        }),
      ],
      style_class,
      layout,
      ratio,
    }),
};

export const RichContent = {
  render: ({ title, style_class, layout, ratio }) =>
    renderSection({
      regions: [
        renderAccordions({
          title,
          entries: [
            [
              'Formatted body content',
              '<p>Accordion bodies hold processed <code>field_long_text</code>, so editors can use <strong>bold</strong>, <em>italics</em>, <a href="#">links</a>, and block markup.</p>' +
                '<h4>A sub-heading inside the panel</h4>' +
                '<ol><li>Ordered step one</li><li>Ordered step two</li></ol>' +
                '<blockquote><p>A blockquote inside an accordion panel.</p></blockquote>',
            ],
            [
              'A second item',
              '<p>Opening this one collapses the first — only one panel stays open at a time.</p>',
            ],
          ],
        }),
      ],
      style_class,
      layout,
      ratio,
    }),
};

export const TwoColumn = {
  args: { layout: 'twocol' },
  render: ({ title, style_class, ratio }) =>
    renderSection({
      layout: 'twocol',
      ratio,
      style_class,
      regions: [
        renderAccordions({
          title: 'Getting started',
          entries: [
            ['Create an account', '<p>How to register and verify your email.</p>'],
            ['Set up your profile', '<p>Add a photo, bio, and contact details.</p>'],
          ],
        }),
        renderAccordions({
          title: 'Billing',
          entries: [
            ['Payment methods', '<p>Which cards and wallets we accept.</p>'],
            ['Refunds', '<p>Our refund window and how to request one.</p>'],
          ],
        }),
      ],
    }),
};

export const ThreeColumn = {
  args: { layout: 'threecol' },
  render: ({ style_class, ratio }) =>
    renderSection({
      layout: 'threecol',
      ratio,
      style_class,
      regions: [
        renderAccordions({
          title: 'Product',
          entries: [['Features', '<p>What it does.</p>']],
        }),
        renderAccordions({
          title: 'Support',
          entries: [['Contact us', '<p>How to reach the team.</p>']],
        }),
        renderAccordions({
          title: 'Legal',
          entries: [['Privacy', '<p>How we handle your data.</p>']],
        }),
      ],
    }),
};
