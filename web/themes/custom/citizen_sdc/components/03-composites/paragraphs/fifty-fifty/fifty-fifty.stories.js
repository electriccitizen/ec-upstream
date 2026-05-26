import fiftyFifty from './fifty-fifty.twig';
// The media slides in from the aligned side on scroll-in (paragraph-base
// `animate: yes`): the media starts translated off-screen + opacity:0 until
// `.is-in-view` is added. Import the observer behavior; the meta `play` runs it.
import '../00-paragraph-base/paragraph-animate.js';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// Image media (field_media, image bundle at the 400x300 view mode). Inline-SVG
// data URI keeps stories offline/deterministic; object-fit:cover handles the
// stretch at tablet+ so a 4:3 swatch is fine.
const swatch = (label, w, h, bg) =>
  `<img width="${w}" height="${h}" alt="${label}" src="data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
      `<rect width='100%' height='100%' fill='${bg}'/>` +
      `<text x='50%' y='50%' fill='rgba(255,255,255,0.9)' font-family='sans-serif' ` +
      `font-size='${Math.round(Math.min(w, h) / 7)}' text-anchor='middle' dominant-baseline='middle'>${label}</text>` +
      `</svg>`,
  )}">`;

// Remote-video media oEmbeds to an <iframe> inside `.field--media-oembed-video`
// (responsive 16:9 box — see media.scss). srcdoc placeholder = no network call.
const placeholderDoc = (label) =>
  `<!doctype html><meta charset='utf-8'>` +
  `<div style='position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;` +
  `justify-content:center;gap:12px;background:#1a1a1a;color:#fff;font-family:system-ui,sans-serif'>` +
  `<svg width='64' height='64' viewBox='0 0 24 24'>` +
  `<circle cx='12' cy='12' r='11' fill='none' stroke='#fff' stroke-width='1.5'/>` +
  `<path d='M10 8l6 4-6 4z' fill='#fff'/></svg><div style='font-size:13px'>${label}</div></div>`;

const videoEmbed = (label = 'Video') =>
  `<div class="field--media-oembed-video">` +
  `<iframe srcdoc="${placeholderDoc(label)}" title="${label}" loading="lazy" allowfullscreen></iframe>` +
  `</div>`;

const renderFifty = ({ title, alignment, media, text, link_text, link_url }) => {
  const isVideo = media === 'video';
  return fiftyFifty({
    title,
    alignment,
    // Undocumented-but-used prop: drives `__media--{type}` (image rules in SCSS).
    media_type: isVideo ? 'remote_video' : 'image',
    media: isVideo ? videoEmbed('Watch the story') : swatch('Image', 800, 600, '#3a5a78'),
    text: text || null,
    link: link_text ? `<a href="${link_url || '#'}">${link_text}</a>` : null,
  });
};

// Run the scroll-in observer on this story's DOM after render.
const attachBehaviors = ({ canvasElement }) =>
  window.Drupal.attachBehaviors(canvasElement);

export default {
  title: 'Paragraphs/Fifty-Fifty',
  tags: ['autodocs'],
  render: ({ title, alignment, media, text, link_text, link_url, style_class, layout, ratio }) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(layout) }, () =>
        renderFifty({ title, alignment, media, text, link_text, link_url }),
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
        'field_widget_title (required) — rendered as `<h2 class="paragraph--fifty-fifty__title">`.',
    },
    alignment: {
      control: { type: 'inline-radio' },
      options: ['left', 'right'],
      description:
        'Which side the media sits on → BEM modifier `paragraph--fifty-fifty--{alignment}`. Also sets the scroll-in slide direction (media slides in from that side).',
    },
    media: {
      control: { type: 'inline-radio' },
      options: ['image', 'video'],
      description:
        'field_media bundle. `image` → object-fit:cover, equal-height with the content column at tablet+ (via `__media--image`). `video` → responsive 16:9 oEmbed.',
    },
    text: {
      control: 'text',
      description: 'Optional field_long_text (editor HTML). Empty → omitted.',
    },
    link_text: {
      control: 'text',
      description:
        'field_link label → button-styled `<a>` in `.paragraph--fifty-fifty__actions`. Empty → omitted.',
    },
    link_url: { control: 'text', description: 'field_link URL. Defaults to `#`.' },
    ...sectionArgTypes,
  },
  args: {
    title: 'Built for the way your team works',
    alignment: 'left',
    media: 'image',
    text:
      '<p>Pair a supporting image or video with a headline, a paragraph of copy, and a call to action. Alignment flips which side the media lands on.</p>',
    link_text: 'Learn more',
    link_url: '#',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const MediaLeft = {};

export const MediaRight = {
  args: { alignment: 'right' },
};

export const WithVideo = {
  args: { media: 'video' },
};

export const TitleAndMediaOnly = {
  args: { text: '', link_text: '' },
};
