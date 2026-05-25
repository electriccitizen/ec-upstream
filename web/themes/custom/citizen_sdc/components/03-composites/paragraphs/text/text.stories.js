import text from './text.twig';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

// Render the Text SDC with the Drupal field wrapper the text_default formatter
// emits around field_long_text editor HTML.
const renderText = (html) =>
  text({
    content: `<div class="field field--long-text field--text-long">${html}</div>`,
  });

// Fill every region of the chosen layout with a Text paragraph, so flipping the
// `layout` control actually shows 1 / 2 / 3 populated columns in the playground.
const fillRegions = (html, layout) =>
  Array.from({ length: regionCountFor(layout) }, () => renderText(html));

export default {
  title: 'Paragraphs/Text',
  tags: ['autodocs'],
  render: ({ content, style_class, layout, ratio }) =>
    renderSection({
      regions: fillRegions(content, layout),
      style_class,
      layout,
      ratio,
    }),
  argTypes: {
    content: {
      control: 'text',
      description:
        'Editor HTML for field_long_text. Wrapped in `.field.field--long-text.field--text-long`, rendered through the Text SDC, then nested in the selected column layout inside a Layout Section — matching production ancestry.',
    },
    ...sectionArgTypes,
  },
  args: {
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Default = {
  args: {
    content:
      '<p>The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!</p>',
  },
};

export const MultipleParagraphs = {
  args: {
    content:
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>' +
      '<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
  },
};

export const RichFormatting = {
  args: {
    content:
      '<p>This paragraph contains <strong>bold text</strong>, <em>italic text</em>, and a <a href="#">link to nowhere</a> to demonstrate inline formatting.</p>' +
      '<h2>A subheading inside the text field</h2>' +
      '<p>Editors can drop subheadings, lists, and other block-level markup right into <code>field_long_text</code>.</p>' +
      '<ul><li>First bullet</li><li>Second bullet</li><li>Third bullet</li></ul>' +
      '<blockquote><p>A pull-quote-style blockquote inside the body copy.</p></blockquote>',
  },
};

export const ShortLine = {
  args: {
    content: '<p>A single short line of text.</p>',
  },
};

// Distinct content per column rather than a repeated fill — closer to a real
// two-column section. Overrides the default render to control each region.
export const TwoColumn = {
  args: { layout: 'twocol', ratio: null },
  render: ({ style_class, ratio }) =>
    renderSection({
      layout: 'twocol',
      ratio,
      style_class,
      regions: [
        renderText(
          '<p>Left column. Two-column sections place one Text paragraph in each region; the gutter and column widths come from the layout’s ratio.</p>',
        ),
        renderText(
          '<p>Right column. Switch the <em>Column widths</em> control to try 33-67, 67-33, 25-75, or 75-25.</p>',
        ),
      ],
    }),
};

export const ThreeColumn = {
  args: { layout: 'threecol', ratio: null },
  render: ({ style_class, ratio }) =>
    renderSection({
      layout: 'threecol',
      ratio,
      style_class,
      regions: [
        renderText('<p>First column of a three-column section.</p>'),
        renderText('<p>Second (middle) column.</p>'),
        renderText('<p>Third column.</p>'),
      ],
    }),
};
