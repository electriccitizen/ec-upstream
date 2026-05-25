import layoutSection from './layout-section.twig';
import text from '../text/text.twig';

// Mirror the minimal field--node--field-paragraphs.html.twig wrapper. Some
// layout-section styles key off `.field-paragraphs > :first-child` rules.
const wrapInFieldParagraphs = (body) =>
  `<div class="field-paragraphs" data-paragraph-animate-field>${body}</div>`;

// Build a fully-rendered Text paragraph (with its Drupal field wrapper) to
// drop into a section's `content` slot — matches what layout_paragraphs
// emits for a child Text paragraph in production.
const renderTextParagraph = (html) =>
  text({
    content: `<div class="field field--long-text field--text-long">${html}</div>`,
  });

export default {
  title: 'Paragraphs/Layout Section',
  tags: ['autodocs'],
  render: ({ style_class, content }) =>
    wrapInFieldParagraphs(layoutSection({ style_class, content })),
  argTypes: {
    style_class: {
      control: { type: 'select' },
      options: ['backless', 'light-grey', 'light-blue'],
      mapping: { backless: null },
      description:
        '`field_style` taxonomy term, cleaned. `backless` (the null mapping) is the no-background variant; `light-grey` and `light-blue` apply background colors.',
    },
    content: {
      control: 'text',
      description:
        'Section body. In production, layout_paragraphs injects a layout template (e.g. twocol-split-left) plus the nested child paragraphs. For stories, pass any rendered HTML — typically one or more child paragraph wrappers.',
    },
  },
};

export const Backless = {
  args: {
    style_class: null,
    content: renderTextParagraph(
      '<p>Child Text paragraph inside a <strong>backless</strong> Layout Section.</p>',
    ),
  },
};

export const LightGrey = {
  args: {
    style_class: 'light-grey',
    content: renderTextParagraph(
      '<p>Child Text paragraph inside a <strong>light-grey</strong> Layout Section.</p>',
    ),
  },
};

export const LightBlue = {
  args: {
    style_class: 'light-blue',
    content: renderTextParagraph(
      '<p>Child Text paragraph inside a <strong>light-blue</strong> Layout Section.</p>',
    ),
  },
};

export const MultipleChildren = {
  args: {
    style_class: null,
    content:
      renderTextParagraph(
        '<p>First child paragraph. Sections normally hold several paragraphs stacked vertically inside a layout region.</p>',
      ) +
      renderTextParagraph(
        '<p>Second child paragraph. The gap between siblings comes from the section’s own spacing rules.</p>',
      ),
  },
};
