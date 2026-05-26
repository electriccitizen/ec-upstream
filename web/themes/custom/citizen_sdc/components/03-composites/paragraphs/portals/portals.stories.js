import portalsParagraph from './portals.twig';
// Cards fade in (staggered) on scroll-in (paragraph-base `animate: yes`): each
// .paragraph--portals__item starts at opacity:0 until `.is-in-view` is added to
// the parent. Import the observer behavior; the meta `play` runs it. Portals has
// no JS of its own.
import '../00-paragraph-base/paragraph-animate.js';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// portal children have no SDC — the paragraph--portals template flattens
// field_portals into { id, link, image, headline, long_text }. image is the
// media rendered at the 400x300 view mode; stand in with an inline-SVG data URI
// (offline, deterministic, 4:3).
const swatch = (label, w, h, bg) =>
  `<img width="${w}" height="${h}" alt="${label}" src="data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
      `<rect width='100%' height='100%' fill='${bg}'/>` +
      `<text x='50%' y='50%' fill='rgba(255,255,255,0.9)' font-family='sans-serif' ` +
      `font-size='${Math.round(Math.min(w, h) / 7)}' text-anchor='middle' dominant-baseline='middle'>${label}</text>` +
      `</svg>`,
  )}">`;

// cards: [headline, swatchLabel, bg, long_text?]
const makeItems = (cards) =>
  cards.map(([headline, label, bg, long_text], i) => ({
    id: i + 1,
    link: { url: '#' },
    image: swatch(label, 400, 300, bg),
    headline,
    long_text: long_text || null,
  }));

const renderPortals = ({ title, cards }) =>
  portalsParagraph({ title: title || null, items: makeItems(cards ?? CARDS) });

// Run the scroll-in observer on this story's DOM after render.
const attachBehaviors = ({ canvasElement }) =>
  window.Drupal.attachBehaviors(canvasElement);

const CARDS = [
  ['Admissions', 'Admissions', '#3a5a78', '<p>Application steps, deadlines, and requirements.</p>'],
  ['Academics', 'Academics', '#2f5a3a', '<p>Programs, departments, and course catalogs.</p>'],
  ['Campus Life', 'Campus Life', '#9a6a3a', '<p>Housing, dining, clubs, and student services.</p>'],
];

const SIX_CARDS = [
  ['Admissions', 'Admissions', '#3a5a78'],
  ['Academics', 'Academics', '#2f5a3a'],
  ['Campus Life', 'Campus Life', '#9a6a3a'],
  ['Athletics', 'Athletics', '#2a4a6a'],
  ['Research', 'Research', '#7a4a3a'],
  ['Alumni', 'Alumni', '#4a6a4a'],
];

export default {
  title: 'Paragraphs/Portals',
  tags: ['autodocs'],
  render: ({ title, style_class, layout, ratio }) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(layout) }, () =>
        renderPortals({ title }),
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
        'Optional field_widget_title — rendered as `<h2 class="paragraph--portals__title">` above the grid. Leave empty to omit.',
    },
    ...sectionArgTypes,
  },
  args: {
    title: 'Explore the site',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Default = {};

// Six cards exercise the 3-up grid and the shuffled 3-delay stagger cycle.
export const SixCards = {
  render: ({ title, style_class, ratio }) =>
    renderSection({
      layout: 'onecol',
      ratio,
      style_class,
      regions: [renderPortals({ title, cards: SIX_CARDS })],
    }),
};

// Same three topics as Default but with no long_text — image + headline only.
export const WithoutDescriptions = {
  render: ({ title, style_class, ratio }) =>
    renderSection({
      layout: 'onecol',
      ratio,
      style_class,
      regions: [renderPortals({ title, cards: SIX_CARDS.slice(0, 3) })],
    }),
};

export const WithoutTitle = {
  args: { title: '' },
};

export const TwoColumn = {
  args: { layout: 'twocol' },
  render: ({ title, style_class, ratio }) =>
    renderSection({
      layout: 'twocol',
      ratio,
      style_class,
      regions: [
        renderPortals({ title, cards: CARDS.slice(0, 2) }),
        renderPortals({ title, cards: CARDS.slice(0, 2) }),
      ],
    }),
};
