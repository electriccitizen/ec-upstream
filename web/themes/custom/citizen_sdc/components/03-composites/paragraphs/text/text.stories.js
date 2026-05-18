import text from './text.twig';

// Mirror what Drupal's field--text-long.html.twig emits around the rendered
// field_long_text body, so styles scoped to `.field--text-long` apply.
const wrapAsField = (body) =>
  `<div class="field field--long-text field--text-long">${body}</div>`;

export default {
  title: 'Paragraphs/Text',
  tags: ['autodocs'],
  render: ({ content }) => text({ content: wrapAsField(content) }),
  argTypes: {
    content: {
      control: 'text',
      description:
        'Editor HTML for field_long_text. The story wraps this in the standard `.field.field--long-text.field--text-long` div to match Drupal field rendering.',
    },
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
