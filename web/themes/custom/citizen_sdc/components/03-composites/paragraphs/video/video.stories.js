import videoParagraph from './video.twig';
// The whole paragraph fades in on scroll-in (paragraph-base `animate: yes`), so
// it starts at opacity:0 until `.is-in-view` is added. Import the observer
// behavior; the meta `play` runs it.
import '../00-paragraph-base/paragraph-animate.js';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// In production the `video` slot is a remote_video media entity that oEmbeds to
// an <iframe> inside a `.field--media-oembed-video` wrapper. That wrapper class
// carries the responsiveVideo treatment (56.25% padding box, iframe absolutely
// filling it — see media.scss). Reproduce that markup with a real <iframe>, but
// point it at an inline `srcdoc` placeholder so stories need no network call or
// real provider embed while still exercising the responsive sizing CSS.
const placeholderDoc = (label) =>
  `<!doctype html><meta charset='utf-8'>` +
  `<div style='position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;` +
  `justify-content:center;gap:12px;background:#1a1a1a;color:#fff;font-family:system-ui,sans-serif'>` +
  `<svg width='72' height='72' viewBox='0 0 24 24'>` +
  `<circle cx='12' cy='12' r='11' fill='none' stroke='#fff' stroke-width='1.5'/>` +
  `<path d='M10 8l6 4-6 4z' fill='#fff'/></svg>` +
  `<div style='font-size:14px;letter-spacing:.04em'>${label}</div></div>`;

const videoEmbed = (label = 'Video embed') =>
  `<div class="field--media-oembed-video">` +
  `<iframe srcdoc="${placeholderDoc(label)}" title="${label}" loading="lazy" allowfullscreen></iframe>` +
  `</div>`;

const renderVideo = ({ title, video }) =>
  videoParagraph({ title: title || null, video: video ?? videoEmbed() });

// Run the scroll-in observer on this story's DOM after render (drives the fade).
const attachBehaviors = ({ canvasElement }) =>
  window.Drupal.attachBehaviors(canvasElement);

export default {
  title: 'Paragraphs/Video',
  tags: ['autodocs'],
  // Fill each region of the chosen layout with a Video so flipping `layout`
  // shows the column theming too.
  render: ({ title, style_class, layout, ratio }) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(layout) }, () =>
        renderVideo({ title }),
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
        'Optional field_widget_title — rendered as `<h2 class="paragraph--video__title">` above the video. Leave empty to omit.',
    },
    ...sectionArgTypes,
  },
  args: {
    title: 'Watch the overview',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Default = {};

export const WithoutTitle = {
  args: { title: '' },
};

export const TwoColumn = {
  args: { layout: 'twocol' },
  render: ({ style_class, ratio }) =>
    renderSection({
      layout: 'twocol',
      ratio,
      style_class,
      regions: [
        renderVideo({ title: 'Product tour', video: videoEmbed('Product tour') }),
        renderVideo({ title: 'Customer story', video: videoEmbed('Customer story') }),
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
        renderVideo({ video: videoEmbed('Clip one') }),
        renderVideo({ video: videoEmbed('Clip two') }),
        renderVideo({ video: videoEmbed('Clip three') }),
      ],
    }),
};
