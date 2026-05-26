import cta from './cta.twig';
// The CTA opts into the scroll-in observer (paragraph-base `animate: yes`), so
// its headline and button start at opacity:0 and only appear once `.is-in-view`
// is added. Side-effect import registers the observer behavior; the meta `play`
// (Drupal.attachBehaviors) runs it against the story DOM. The observer attaches
// to the `[data-paragraph-animate-field]` wrapper renderSection already emits.
import '../00-paragraph-base/paragraph-animate.js';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// field_link's default formatter emits a plain <a>; the SDC wraps it in
// .paragraph--cta__actions and the SCSS styles that <a> as a button. Empty
// label → no link (the SDC's `{% if link %}` drops the actions wrapper).
const renderLink = (text, url) =>
  text ? `<a href="${url || '#'}">${text}</a>` : null;

const renderCta = ({ headline, additional_text, link_text, link_url }) =>
  cta({
    headline,
    additional_text: additional_text || null,
    link: renderLink(link_text, link_url),
  });

// Run the scroll-in observer on this story's DOM after render.
const attachBehaviors = ({ canvasElement }) =>
  window.Drupal.attachBehaviors(canvasElement);

export default {
  title: 'Paragraphs/CTA',
  tags: ['autodocs'],
  // Fill each region of the chosen layout with a CTA so flipping `layout` shows
  // the column theming too.
  render: (args) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(args.layout) }, () =>
        renderCta(args),
      ),
      style_class: args.style_class,
      layout: args.layout,
      ratio: args.ratio,
    }),
  play: attachBehaviors,
  argTypes: {
    headline: {
      control: 'text',
      description:
        'field_headline — required plain-text heading, rendered as `<h2 class="paragraph--cta__headline">`.',
    },
    additional_text: {
      control: 'text',
      description:
        'field_additional_text — optional supporting copy. Rendered as `<p class="paragraph--cta__text">` when present.',
    },
    link_text: {
      control: 'text',
      description:
        'field_link label. Rendered as a button-styled `<a>` in `.paragraph--cta__actions`. Leave empty to omit the link.',
    },
    link_url: {
      control: 'text',
      description: 'field_link URL. Defaults to `#` when a label is set.',
    },
    ...sectionArgTypes,
  },
  args: {
    headline: 'Ready to get started?',
    additional_text:
      'Join thousands of teams already building with our platform. No credit card required.',
    link_text: 'Sign up free',
    link_url: '#',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Default = {};

export const HeadlineOnly = {
  args: {
    additional_text: '',
    link_text: '',
  },
};

export const WithoutLink = {
  args: {
    link_text: '',
  },
};

export const LongCopy = {
  args: {
    headline: 'Bring your whole team together in one place',
    additional_text:
      'Centralize projects, conversations, and files so everyone stays aligned. Set up takes minutes, and you can invite your whole organization with a single link — no per-seat configuration, no spreadsheets, no waiting on IT.',
    link_text: 'Start your free trial',
  },
};

export const TwoColumn = {
  args: { layout: 'twocol' },
  render: ({ style_class, ratio }) =>
    renderSection({
      layout: 'twocol',
      ratio,
      style_class,
      regions: [
        renderCta({
          headline: 'For individuals',
          additional_text: 'Everything you need to get going on your own.',
          link_text: 'Get the free plan',
        }),
        renderCta({
          headline: 'For teams',
          additional_text: 'Collaboration features and admin controls.',
          link_text: 'See team pricing',
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
        renderCta({ headline: 'Learn', link_text: 'Read the docs' }),
        renderCta({ headline: 'Build', link_text: 'View examples' }),
        renderCta({ headline: 'Ship', link_text: 'Deploy now' }),
      ],
    }),
};
