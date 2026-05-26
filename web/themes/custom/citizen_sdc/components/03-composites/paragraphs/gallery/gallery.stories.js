import galleryParagraph from './gallery.twig';
// Lightbox mode: vanilla <dialog> modal behavior (citizenSdcGallery).
import './gallery.js';
// Slider mode: the gallery delegates to the slider SDC, whose behavior
// (citizenSdcSlider) drives the Embla carousel. Embla globals are loaded via
// .storybook/preview-head.html.
import '../../../02-chunks/slider/slider.js';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// gallery_item children have no SDC — the paragraph--gallery template flattens
// field_gallery_items into { id, thumb, full, caption }. thumb is the media at
// `large_thumb`, full at `large`. Stand in with inline-SVG data URIs (offline,
// deterministic) at two sizes so the lightbox clearly swaps thumb → full.
const swatch = (label, w, h, bg) =>
  `<img width="${w}" height="${h}" alt="${label}" src="data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
      `<rect width='100%' height='100%' fill='${bg}'/>` +
      `<text x='50%' y='50%' fill='rgba(255,255,255,0.9)' font-family='sans-serif' ` +
      `font-size='${Math.round(Math.min(w, h) / 7)}' text-anchor='middle' dominant-baseline='middle'>${label}</text>` +
      `</svg>`,
  )}">`;

// gallery_id must be unique per instance (drives the modal/slider grouping and
// element ids); each rendered gallery pulls a fresh sequence value.
let gallerySeq = 0;
const buildGallery = (photos) => {
  const gid = `g${(gallerySeq += 1)}`;
  return {
    gallery_id: gid,
    items: photos.map(([label, bg], i) => ({
      id: `${gid}-${i}`,
      thumb: swatch(label, 480, 360, bg),
      full: swatch(label, 1280, 800, bg),
      caption: `${label} — image ${i + 1} of ${photos.length}`,
    })),
  };
};

const renderGallery = ({ title, type, photos }) => {
  const { gallery_id, items } = buildGallery(photos ?? PHOTOS);
  return galleryParagraph({ title: title || null, type, gallery_id, items });
};

// Run the gallery + slider behaviors on this story's DOM after render.
const attachBehaviors = ({ canvasElement }) =>
  window.Drupal.attachBehaviors(canvasElement);

const PHOTOS = [
  ['Mountains', '#3a5a78'],
  ['Forest', '#2f5a3a'],
  ['Desert', '#9a6a3a'],
  ['Harbor', '#2a4a6a'],
  ['Canyon', '#7a4a3a'],
  ['Meadow', '#4a6a4a'],
];

export default {
  title: 'Paragraphs/Gallery',
  tags: ['autodocs'],
  render: ({ title, type, style_class, layout, ratio }) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(layout) }, () =>
        renderGallery({ title, type }),
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
        'Optional field_widget_title — rendered as `<h2 class="paragraph--gallery__title">` above the gallery. Leave empty to omit.',
    },
    type: {
      control: { type: 'inline-radio' },
      options: ['lightbox', 'slider'],
      description:
        'Render mode (from field_gallery_type). `lightbox` = thumbnail grid, each thumb opens a `<dialog>` modal with prev/next. `slider` = single-image Embla carousel.',
    },
    ...sectionArgTypes,
  },
  args: {
    title: 'Project gallery',
    type: 'lightbox',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Lightbox = {};

export const Slider = {
  args: { type: 'slider' },
};

export const WithoutTitle = {
  args: { title: '' },
};

// One image: the lightbox prev/next controls hide (JS sets them `hidden`).
export const SingleImage = {
  render: ({ title, style_class, ratio }) =>
    renderSection({
      layout: 'onecol',
      ratio,
      style_class,
      regions: [renderGallery({ title, type: 'lightbox', photos: [['Solo shot', '#3a5a78']] })],
    }),
};

export const TwoColumn = {
  args: { layout: 'twocol', type: 'lightbox' },
  render: ({ title, type, style_class, ratio }) =>
    renderSection({
      layout: 'twocol',
      ratio,
      style_class,
      regions: [
        renderGallery({ title, type, photos: PHOTOS.slice(0, 4) }),
        renderGallery({ title, type, photos: PHOTOS.slice(0, 4) }),
      ],
    }),
};
