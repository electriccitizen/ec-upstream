import imageParagraph from './image.twig';
// Only the `overlay` position animates (paragraph-base `animate: yes`): the
// overlay panel slides in from the left once `.is-in-view` is added. Import the
// observer behavior; the meta `play` runs it. Harmless for above/below/no-text
// (no `[data-animate="yes"]` targets → the observer no-ops).
import '../00-paragraph-base/paragraph-animate.js';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// The `image` slot is a rendered media render array (field_image). Stand in with
// a self-contained inline-SVG data URI so stories need no network or asset
// pipeline. 16:9 so the overlay gradient/text framing reads correctly.
const placeholder = (label, w = 1280, h = 720, bg = '#2b3a55') =>
  `<img width="${w}" height="${h}" alt="${label}" src="data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="100%" height="100%" fill="${bg}"/>` +
      `<text x="50%" y="50%" fill="rgba(255,255,255,0.85)" font-family="sans-serif" ` +
      `font-size="${Math.round(h / 12)}" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
      `</svg>`,
  )}">`;

const renderImage = ({ headline, additional_text, text_position, image }) =>
  imageParagraph({
    headline: headline || null,
    additional_text: additional_text || null,
    text_position,
    image: image ?? placeholder('1280 × 720'),
  });

// Run the scroll-in observer on this story's DOM after render (drives the
// overlay slide-in).
const attachBehaviors = ({ canvasElement }) =>
  window.Drupal.attachBehaviors(canvasElement);

export default {
  title: 'Paragraphs/Image',
  tags: ['autodocs'],
  // Fill each region of the chosen layout with an Image so flipping `layout`
  // shows the column theming too.
  render: ({ headline, additional_text, text_position, style_class, layout, ratio }) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(layout) }, () =>
        renderImage({ headline, additional_text, text_position }),
      ),
      style_class,
      layout,
      ratio,
    }),
  play: attachBehaviors,
  argTypes: {
    headline: {
      control: 'text',
      description: 'Optional headline, rendered as an `<h2>`. Empty → omitted.',
    },
    additional_text: {
      control: 'text',
      description:
        'Optional plain, multiline body text (line breaks preserved via `white-space: pre-line`). Empty → omitted.',
    },
    text_position: {
      control: { type: 'inline-radio' },
      options: ['above', 'below', 'overlay'],
      description:
        'Where the text sits relative to the image. `overlay` floats the text over the image (tablet+) with a dark gradient and a scroll-in slide; on mobile it falls back to the `below` layout. Ignored when there’s no text.',
    },
    ...sectionArgTypes,
  },
  args: {
    headline: 'A picture is worth a thousand words',
    additional_text:
      'Supporting copy sits with the image. Editors choose whether it appears above, below, or as an overlay.',
    text_position: 'below',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Below = {};

export const Above = {
  args: { text_position: 'above' },
};

export const Overlay = {
  args: {
    text_position: 'overlay',
    headline: 'Text overlaid on the image',
    additional_text:
      'On tablet and up this panel slides in from the left over a dark gradient. Resize narrow to see the mobile fallback.',
  },
};

export const NoText = {
  args: { headline: '', additional_text: '' },
};

export const TwoColumn = {
  args: { layout: 'twocol' },
  render: ({ style_class, ratio }) =>
    renderSection({
      layout: 'twocol',
      ratio,
      style_class,
      regions: [
        renderImage({
          headline: 'Before',
          text_position: 'below',
          image: placeholder('Before', 800, 600, '#5a3a3a'),
        }),
        renderImage({
          headline: 'After',
          text_position: 'below',
          image: placeholder('After', 800, 600, '#2f5a3a'),
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
        renderImage({ text_position: 'below', image: placeholder('One', 640, 480, '#3a4a6a') }),
        renderImage({ text_position: 'below', image: placeholder('Two', 640, 480, '#6a4a3a') }),
        renderImage({ text_position: 'below', image: placeholder('Three', 640, 480, '#3a6a5a') }),
      ],
    }),
};
