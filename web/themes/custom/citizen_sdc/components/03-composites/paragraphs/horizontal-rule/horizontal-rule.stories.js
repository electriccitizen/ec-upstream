import horizontalRule from './horizontal-rule.twig';
// Borrow the Text SDC only for the "as a divider" story, to show the rule doing
// its real job between two text paragraphs.
import text from '../text/text.twig';
import {
  renderSection,
  regionCountFor,
  sectionArgTypes,
} from '../paragraph-story-utils.js';

const renderHr = (color) => horizontalRule({ color });

const renderText = (html) =>
  text({
    content: `<div class="field field--long-text field--text-long">${html}</div>`,
  });

// No `play`/behavior import here: horizontal-rule is animate:'no' and ships no
// JS — it's a static <hr>.

export default {
  title: 'Paragraphs/Horizontal Rule',
  tags: ['autodocs'],
  render: ({ color, style_class, layout, ratio }) =>
    renderSection({
      regions: Array.from({ length: regionCountFor(layout) }, () =>
        renderHr(color),
      ),
      style_class,
      layout,
      ratio,
    }),
  argTypes: {
    color: {
      control: { type: 'inline-radio' },
      options: ['light_gray', 'black', 'primary'],
      description:
        'field_color key. Drives the `paragraph--horizontal-rule--{clean_class}` modifier → the rule’s `border-top-color` (`light-gray` → $lightGray, `black` → $black, `primary` → $hrPrimary).',
    },
    ...sectionArgTypes,
  },
  args: {
    color: 'primary',
    style_class: null,
    layout: 'onecol',
    ratio: null,
  },
};

export const Primary = {};

export const LightGray = {
  args: { color: 'light_gray' },
};

export const Black = {
  args: { color: 'black' },
};

// The rule's real use: a divider between blocks of content. Shows the
// textConstrain max-width and the section's inter-paragraph spacing too.
export const AsDivider = {
  render: ({ color, style_class, ratio }) =>
    renderSection({
      layout: 'onecol',
      ratio,
      style_class,
      regions: [
        renderText(
          '<p>The section above sits before the rule. Editors drop a Horizontal Rule between paragraphs to visually separate topics within a single column.</p>',
        ) +
          renderHr(color) +
          renderText(
            '<p>The content below picks up after the divider. The gap on either side comes from the rule’s own <code>margin</code> plus the section’s inter-paragraph spacing.</p>',
          ),
      ],
    }),
};
