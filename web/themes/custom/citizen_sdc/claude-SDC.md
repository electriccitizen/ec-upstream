# Building SDCs in citizen_sdc with Claude Code

This theme ships a Claude Code skill that knows how this theme builds Single Directory Components — base SDCs, naming conventions, BEM rules, library attachment, and the gotchas we've hit. Use it whenever you create a new SDC so the new component composes cleanly with everything already here.

## What's in the theme

```
.claude/skills/citizen-sdc-builder/SKILL.md   ← the skill — Claude reads this
claude-SDC.md                                  ← this file (human-readable)
```

When you open this theme in Claude Code (or open the wider repo and `cd` into the theme), the skill auto-loads. Claude will pick it up when your prompt matches phrases like "create an SDC", "build a paragraph SDC for X", "add a new block component", "scaffold a node teaser", etc.

## How to use it

Just describe what you want in plain English. The skill kicks in automatically; you don't have to invoke it by name.

Good prompts:

- *"Create a paragraph SDC for a new bundle called `pull_quote` — fields are `field_quote_text` (long text) and `field_attribution` (text)."*
- *"Build a block SDC for the existing `front_page_hero` block_content bundle. It has `field_headline`, `field_subhead`, `field_image`, and `field_link`. Should opt into the scroll-in animation observer."*
- *"Scaffold a teaser SDC for the new `case_study` content type."*
- *"Add a layout SDC for a new three-column layout-section variant — equal columns at desktop, stack at mobile."*
- *"Create a per-view SDC for our staff search results view, using the views-search-result base."*

If you want to see the underlying playbook, read `.claude/skills/citizen-sdc-builder/SKILL.md` directly. It documents the conventions in detail and is the source of truth for any "wait, why are we doing it that way" question.

## What Claude will do

For each new SDC, expect these files to land in the right place:

| File | Where |
|---|---|
| `{name}.component.yml` | `components/0{N}-{tier}/{kind}/{name}/` |
| `{name}.twig` | same folder |
| `{name}.scss` (and compiled `.css` after the next build) | same folder |
| `{name}.js` | same folder, **only** if the component needs co-located JS |
| `{name}.md` | same folder, **rare** — only when there's a hidden dependency a dev wouldn't see by reading the folder |
| `{type}--{name}.html.twig` | `templates/{blocks|paragraphs|content/nodes}/{name}/` — the Drupal template that hands data to the SDC |

Tiers (`02-chunks`, `03-composites`) and kinds (`blocks`, `paragraphs`, `nodes`, `layouts`, `views`) follow the existing structure — Claude picks the right slot from the type of SDC you ask for.

If you spot Claude putting something in the wrong place, push back — the skill is the convention but the codebase is the source of truth and your judgment beats both.

## Verifying after Claude finishes

The skill instructs Claude to do these as part of the build, but if you want to confirm by hand:

```bash
# Compile SCSS (the user's running watcher will do this automatically too)
sass components --style compressed

# Register the new SDC and pick up templates
ddev drush cr

# Confirm the SDC definition resolves
ddev drush ev '$d = \Drupal::service("plugin.manager.sdc")->getDefinition("citizen_sdc:YOUR-ID", FALSE); print_r($d ? "OK" : "MISSING");'
```

UI / visual / browser-test verification is on you — Claude won't claim a feature works without seeing it render unless you've explicitly told it to skip that step.

## Adding to the playbook

If you discover a new pattern, gotcha, or convention while building SDCs, edit `.claude/skills/citizen-sdc-builder/SKILL.md` and commit the change. The skill travels with the theme — every project built on this theme gets the same playbook automatically.

When something you tell Claude turns out to apply broadly (not just to one SDC), favor putting it in the skill over leaving it in chat. Future-you (and other devs) will thank you.

## Reference SDCs

When in doubt, copy the closest existing SDC of the same kind. Good ones to learn from:

- **Block:** `components/03-composites/blocks/branding/` — minimal, no extra library; `components/03-composites/blocks/alert/` — has `block-alert.md` documenting the AJAX architecture.
- **Paragraph:** `components/03-composites/paragraphs/cta/` — composed slot + props, opts into animation; `components/03-composites/paragraphs/accordions/` — multi-item parent SDC pulling child paragraph data without a separate child SDC.
- **Node default:** `components/03-composites/nodes/news-default/` — thin passthrough to `node-base`.
- **Node teaser:** `components/03-composites/nodes/news-teaser/` — composes a date + summary into the content slot of `node-teaser-base`.
- **Layout:** `components/03-composites/layouts/paragraph-section-layouts/twocol-split-left/` — self-contained, no base.

## A note on memory

If you've worked on this theme before and built up Claude Code memory under `~/.claude/projects/.../memory/`, that's separate from this skill. The skill is the version that travels with the repo. If something you've memorized contradicts the skill, treat the skill as the team-shared convention and update either side as appropriate.
