# Install Profile Drift — Findings

Comparison of `web/profiles/citizen/config/install/` (install profile) against `config/sync/` (current source of truth).
Generated 2026-05-04 after the citizen_dart cleanup commit `ae8a6f3f` and the `_embed` install-profile cleanup.

## Scope

| | active sync | install profile |
|---|---:|---:|
| Total files | 709 | 677 |

| | count |
|---|---:|
| Only in active sync (add to install) | 165 |
| Only in install profile (consider removing) | 133 |
| In both, content differs (after stripping `uuid:` / `_core:` / `default_config_hash:`) | 185 |
| In both, content identical | 359 |

**Total drift to review: ~483 files.**

To regenerate the lists locally:
```
ls config/sync/*.yml | xargs -n1 basename | sort > /tmp/active.txt
ls web/profiles/citizen/config/install/*.yml | xargs -n1 basename | sort > /tmp/install.txt
comm -23 /tmp/active.txt /tmp/install.txt   # only in active
comm -13 /tmp/active.txt /tmp/install.txt   # only in install
comm -12 /tmp/active.txt /tmp/install.txt   # in both
```
Diff helper for any file in both:
```
diff <(grep -vE '^uuid:|^  default_config_hash:|^_core:' config/sync/X.yml) \
     <(grep -vE '^uuid:|^  default_config_hash:|^_core:' web/profiles/citizen/config/install/X.yml)
```

---

## 1. Only in active sync — `add to install profile` (165 files)

These exist in the live site but a fresh install will not get them.

### Block placements for citizen_sdc theme (16)
Install profile only has the now-deleted citizen_dart placements (see §2). All citizen_sdc block placements need to be added.
```
block.block.citizen_sdc_aboutsomethings.yml
block.block.citizen_sdc_alert.yml
block.block.citizen_sdc_ancillary.yml
block.block.citizen_sdc_branding.yml
block.block.citizen_sdc_connectwithus.yml
block.block.citizen_sdc_content.yml
block.block.citizen_sdc_copyright.yml
block.block.citizen_sdc_footer.yml
block.block.citizen_sdc_help.yml
block.block.citizen_sdc_local_actions.yml
block.block.citizen_sdc_local_tasks.yml
block.block.citizen_sdc_mainnavigation.yml
block.block.citizen_sdc_messages.yml
block.block.citizen_sdc_secondary.yml
block.block.citizen_sdc_sitesearch.yml
block.block.citizen_sdc_stayintouch.yml
```

### Hero block_content type (8)
The Hero block was added 2026 (commit `04588abc`) and never propagated to the install profile.
```
block_content.type.hero.yml
core.entity_form_display.block_content.hero.default.yml
core.entity_view_display.block_content.hero.default.yml
field.field.block_content.hero.field_eyebrow.yml
field.field.block_content.hero.field_headline.yml
field.field.block_content.hero.field_image.yml
field.field.block_content.hero.field_link.yml
field.field.block_content.hero.field_video.yml
field.storage.block_content.field_eyebrow.yml
field.storage.block_content.field_headline.yml
field.storage.block_content.field_image.yml
field.storage.block_content.field_link.yml
field.storage.block_content.field_video.yml
```

### Alert content type (6)
```
node.type.alert.yml
core.base_field_override.node.alert.promote.yml
core.entity_form_display.node.alert.default.yml
core.entity_view_display.node.alert.default.yml
core.entity_view_display.node.alert.teaser.yml
field.field.node.alert.field_alert_text.yml
field.field.node.alert.field_display_range.yml
field.field.node.alert.field_urgency.yml
field.storage.node.field_alert_text.yml
field.storage.node.field_display_range.yml
field.storage.node.field_urgency.yml
pathauto.pattern.alert.yml
```

### Paragraph types added since install profile was last updated (24)
```
paragraphs.paragraphs_type.content_list.yml
paragraphs.paragraphs_type.cta.yml
paragraphs.paragraphs_type.fifty_fifty.yml
paragraphs.paragraphs_type.gallery_item.yml
paragraphs.paragraphs_type.layout_section_simple.yml
paragraphs.paragraphs_type.view_placer.yml
```
Plus their form/view displays + fields + storages (~22 supporting files):
- `core.entity_form_display.paragraph.{content_list,cta,fifty_fifty,gallery_item,view_placer}.default`
- `core.entity_view_display.paragraph.{content_list,cta,fifty_fifty,gallery_item,view_placer}.{default,preview}`
- `core.entity_view_display.paragraph.horizontal_rule.preview` (preview display only — install has default)
- `field.field.paragraph.{content_list,cta,fifty_fifty,gallery_item,view_placer}.field_*`
- `field.field.paragraph.gallery.field_gallery_items` (replaces `field_image_multi` from install)
- `field.field.paragraph.horizontal_rule.field_color` (replaces `field_width` from install)
- `field.field.paragraph.image.{field_additional_text,field_headline,field_text_position}`
- `field.storage.paragraph.field_{additional_text,alignment,caption,color,gallery_items,media,text_position,view}`

### Search-result view modes for nodes (5)
Used by the new `site_search` view results display.
```
core.entity_view_display.node.bios.search_result.yml
core.entity_view_display.node.landing_page.search_result.yml
core.entity_view_display.node.news.search_result.yml
core.entity_view_display.node.page.search_result.yml
core.entity_view_display.node.news.token.yml
```

### Listing view modes for nodes (4)
Used by views (events listing, bios listing, news listing).
```
core.entity_view_display.node.bios.listing.yml
core.entity_view_display.node.event.listing.yml
core.entity_view_display.node.news.listing.yml
core.entity_view_mode.node.listing.yml
```

### Image styles (5)
```
image.style.400x300.yml
image.style.400x300_1_5x.yml
image.style.400x300_2x.yml
image.style.400x300_non_webp.yml
image.style.default_scaled.yml
```

### Media view modes + responsive image styles (4)
```
core.entity_view_mode.media.360x360.yml
core.entity_view_mode.media.400x300.yml
responsive_image.styles.360x360.yml
responsive_image.styles.400x300.yml
```

### Media remote_video size displays (3)
Active sync has these but install profile has only the `*_embed` flavors. Cleaned up in this branch's `_embed` removal — install needs the size variants instead.
```
core.entity_view_display.media.image.360x360.yml
core.entity_view_display.media.image.400x300.yml
core.entity_view_display.media.remote_video.large.yml
core.entity_view_display.media.remote_video.medium.yml
core.entity_view_display.media.remote_video.small.yml
```

### support_html text format (2)
```
editor.editor.support_html.yml
filter.format.support_html.yml
```

### Bios + node meta_description / search_keywords / exclude_search fields (10)
Field instances that were added per-bundle (probably for Search API + sitemap excerpts).
```
field.field.node.bios.field_headshot.yml
field.field.node.bios.field_meta_description.yml
field.field.node.event.field_meta_description.yml
field.field.node.landing_page.field_exclude_search.yml
field.field.node.landing_page.field_meta_description.yml
field.field.node.landing_page.field_search_keywords.yml
field.field.node.news.field_meta_description.yml
field.field.node.page.field_meta_description.yml
field.field.node.page.field_search_keywords.yml
field.field.node.support_book.field_exclude_search.yml
field.field.node.support_book.field_last_reviewed.yml
field.field.node.support_book.field_support_type.yml
field.field.node.support_book.layout_builder__layout.yml
field.storage.node.field_exclude_search.yml
field.storage.node.field_headshot.yml
field.storage.node.field_last_reviewed.yml
field.storage.node.field_meta_description.yml
field.storage.node.field_search_keywords.yml
field.storage.node.field_support_type.yml
```

### Password / user-management fields (4)
For password expiration policy.
```
field.field.user.user.field_image.yml
field.field.user.user.field_last_password_reset.yml
field.field.user.user.field_password_expiration.yml
field.field.user.user.field_pending_expire_sent.yml
field.storage.user.field_image.yml
field.storage.user.field_last_password_reset.yml
field.storage.user.field_password_expiration.yml
field.storage.user.field_pending_expire_sent.yml
password_policy.password_policy.standard_password_policy.yml
password_policy.settings.yml
```

### Settings / module configs (12)
```
ckeditor5_plugin_pack.settings.yml
ckeditor5_premium_features.settings.yml
key.key.openai.yml
key.key.zillix_milvus.yml
metatag.metatag_defaults.node__bios.yml
metatag.metatag_defaults.webform_submission.yml
search_api.index.support.yml
system.action.node_purge_action.yml
system.action.node_restore_action.yml
system.feature_flags.yml
system.menu.ancillary.yml
tagify.settings.yml
trash.settings.yml
core.extension.yml
```
Note: `core.extension.yml` differs because install ships its own; the sync version reflects the actual installed set (citizen_sdc, ckeditor5_premium_features, lazy, etc.).

### Views (2)
```
views.view.content_list.yml
views.view.support_search.yml
```

---

## 2. Only in install profile — `consider removing` (133 files)

These ship with the install profile but don't exist on the live site. Most are stale.

### citizen_dart block placements (13) — DEFINITELY REMOVE
Already removed from active config when the dart theme was uninstalled. Install profile shouldn't seed dart blocks for new sites.
```
block.block.citizen_dart_aboutsomethings.yml
block.block.citizen_dart_branding.yml
block.block.citizen_dart_connectwithus.yml
block.block.citizen_dart_content.yml
block.block.citizen_dart_copyright.yml
block.block.citizen_dart_footer.yml
block.block.citizen_dart_help.yml
block.block.citizen_dart_local_actions.yml
block.block.citizen_dart_local_tasks.yml
block.block.citizen_dart_mainnavigation.yml
block.block.citizen_dart_messages.yml
block.block.citizen_dart_sitesearch.yml
block.block.citizen_dart_stayintouch.yml
```

### stable9 theme block placements (2) — REVIEW
```
block.block.stable9_connectwithus.yml
block.block.stable9_mainnavigation.yml
```

### Old paragraph types replaced by newer equivalents (6) — REVIEW
The active site no longer has these. Replacements likely live in the §1 list (e.g. `content_list` ← `content_placer`, `view_placer` ← `block_placer`).
```
paragraphs.paragraphs_type.block_placer.yml         # → view_placer
paragraphs.paragraphs_type.content_placer.yml       # → content_list
paragraphs.paragraphs_type.layout_section_single.yml # → layout_section_simple
paragraphs.paragraphs_type.links_files.yml          # likely deprecated
paragraphs.paragraphs_type.map.yml                  # likely deprecated
paragraphs.paragraphs_type.quote.yml                # likely deprecated
```
Plus their supporting form/view displays and field/storage configs (~50 files): `core.entity_*_display.paragraph.{block_placer,content_placer,links_files,map,quote}.{default,preview}` and `field.field.paragraph.{block_placer,content_placer,links_files,map,quote}.field_*` and `field.storage.paragraph.field_{address,bios_list_type,block,events_list_type,file_multi,image_multi,image_size,link_multi,location,news_list_type,quote,source,width}`.

### Old image-bundle fields and image_size/widget_title fields (5)
```
field.field.media.image.field_caption.yml
field.field.node.bios.field_image.yml             # replaced by field_headshot?
field.field.node.bios.field_list_widget.yml
field.field.node.event.field_event_location.yml
field.field.paragraph.gallery.field_image_multi.yml  # replaced by field_gallery_items
field.field.paragraph.image.field_image_size.yml     # not used in active
field.field.paragraph.image.field_link.yml           # check if active still has it
field.field.paragraph.image.field_widget_title.yml
field.field.paragraph.text.field_widget_title.yml
field.storage.media.field_caption.yml
field.storage.node.field_event_location.yml
```

### Newsletter modal fields (4) — REVIEW
Likely deprecated in favor of `field_form_embed`.
```
field.field.block_content.newsletter.field_form_modal.yml
field.field.block_content.newsletter.field_modal_header.yml
field.field.block_content.newsletter.field_modal_intro.yml
field.field.block_content.newsletter.field_modal_trigger.yml
field.storage.block_content.field_form_modal.yml
field.storage.block_content.field_modal_header.yml
field.storage.block_content.field_modal_intro.yml
field.storage.block_content.field_modal_trigger.yml
```

### metatag fields per content type (5) — REVIEW
Active config uses metatag_defaults (`metatag.metatag_defaults.*`) instead of per-bundle `field_metatags` field instances.
```
field.field.node.bios.field_metatags.yml
field.field.node.event.field_metatags.yml
field.field.node.landing_page.field_metatags.yml
field.field.node.news.field_metatags.yml
field.field.node.page.field_metatags.yml
field.storage.node.field_metatags.yml
```

### user.field_user_image (replaced by field_image) (2)
Active uses `field_image` on user (in §1).
```
field.field.user.user.field_user_image.yml
field.storage.user.field_user_image.yml
```

### responsive_preview module configs (10) — REVIEW
The `responsive_preview` module is likely no longer installed.
```
responsive_preview.device.galaxy_s9.yml
responsive_preview.device.galaxy_tab_s4.yml
responsive_preview.device.ipad_pro.yml
responsive_preview.device.iphone_xs.yml
responsive_preview.device.iphone_xs_max.yml
responsive_preview.device.laptop.yml
responsive_preview.device.large.yml
responsive_preview.device.medium.yml
responsive_preview.device.preview.yml
responsive_preview.device.small.yml
```

### Unused image styles + view modes (8)
```
image.style.views_card.yml
image.style.views_card_1_5x.yml
image.style.views_card_2x.yml
image.style.views_card_non_webp.yml
core.entity_view_display.media.image.square.yml
core.entity_view_display.media.image.views_card.yml
core.entity_view_mode.media.square.yml
core.entity_view_mode.media.views_card.yml
responsive_image.styles.square.yml
responsive_image.styles.views_card.yml
```

### Tour module configs (8) — REVIEW
Likely auto-installed by search_api. Active site doesn't have them.
```
tour.tour.block-layout.yml
tour.tour.search-api-index-fields.yml
tour.tour.search-api-index-form.yml
tour.tour.search-api-index-processors.yml
tour.tour.search-api-index.yml
tour.tour.search-api-server-form.yml
tour.tour.search-api-server.yml
tour.tour.views-ui.yml
core.entity_view_mode.tour.token.yml
```

### Geolocation module configs (2) — REVIEW
The `geolocation` and `geolocation_google_maps` modules are likely uninstalled.
```
geolocation.settings.yml
geolocation_google_maps.settings.yml
```

### Misc (4)
```
system.rss.yml             # active doesn't have a custom one
update.settings.yml        # active manages elsewhere
views.view.user_dashboard.yml
webform.webform.checkboxes_test.yml
```

---

## 3. In both, content differs (185 files)

These files exist in both locations but have non-trivial differences (UUIDs, `_core: default_config_hash`, and `_core:` blocks were excluded from the comparison). Each one needs case-by-case review.

### High-impact files likely to need updating
- `core.extension.yml` — module/theme list drift (already known: dart removed, others added).
- `system.site.yml` — site name / slogan / front page may differ.
- `system.theme.yml` — default and admin themes.
- `views.view.{events,news,bios,site_search,frontpage,media_library,...}.yml` — display tweaks accumulate over time.
- `node.type.{bios,event,landing_page,news,page,support_book}.yml` — content type defaults.
- `block_content.type.{basic,newsletter}.yml` — block bundle defaults.
- `taxonomy.vocabulary.{event_categories,list_widget,news_categories,section_styles}.yml`
- `metatag.metatag_defaults.{front,global,node}.yml` — meta tag defaults.
- `user.role.{authenticated,editor,site_manager}.yml` — role permissions drift.
- `responsive_image.styles.{banner,full,large,large_thumb,medium,small,thumbnail_cropped}.yml` — these now reference `citizen_sdc` breakpoints in active; install still references `citizen_dart`.

### config_split + entity_form_display + entity_view_display drift
- `config_split.config_split.{dev,live,local,test}.yml` — env split definitions.
- `core.entity_form_display.*` (12 files) — many node/paragraph/user form display tweaks.
- `core.entity_view_display.*` (35 files) — view display tweaks (fields shown/hidden, formatter changes).

### Module settings drift (29 files)
```
addanother.settings.yml          gin.settings.yml             pathologic.settings.yml
admin_toolbar.settings.yml       layout_paragraphs.settings.yml  search_api.index.nodes.yml
editoria11y.settings.yml         linkit.linkit_profile.default.yml  system.cron.yml
entity_usage.settings.yml        linkit.linkit_profile.wysiwyg.yml  system.file.yml
extlink.settings.yml             media.settings.yml           system.mail.yml
file.settings.yml                menu_breadcrumb.settings.yml  system.performance.yml
filter.format.{basic_html,limited_html,plain_text,restricted_html,webform_default}.yml
editor.editor.{basic_html,limited_html,webform_default}.yml
metatag.settings.yml             system.theme.global.yml
views.settings.yml               webform.settings.yml
```

### Views (17 files)
```
views.view.archive.yml          views.view.events.yml       views.view.media_library.yml
views.view.bios.yml             views.view.files.yml        views.view.news.yml
views.view.block_content.yml    views.view.frontpage.yml    views.view.redirect.yml
views.view.content.yml          views.view.glossary.yml     views.view.site_search.yml
                                 views.view.media.yml         views.view.taxonomy_term.yml
                                 views.view.user_admin_people.yml
                                 views.view.webform_submissions.yml
                                 views.view.who_s_online.yml
```

### Full list
See `/tmp/content-diffs.txt` (185 entries) for the complete list, or regenerate with the diff helper at the top.

---

## 4. Suggested order of operations (when ready to fix)

1. **Quick wins first** — delete the 13 citizen_dart block placements + the 10 responsive_preview devices + the 8 tour configs from install profile.
2. **Add citizen_sdc block placements** to install profile (16 files).
3. **Add Hero block_content type** to install profile (13 files).
4. **Add Alert content type** to install profile (12 files).
5. **Add new paragraph types** (content_list, cta, fifty_fifty, gallery_item, layout_section_simple, view_placer) — ~28 files.
6. **Remove deprecated paragraph types** (block_placer, content_placer, links_files, map, quote, layout_section_single) — ~50 files.
7. **Reconcile responsive image styles** — install ones reference dart breakpoints; replace with active versions.
8. **Sweep content diffs** — bring node types, view modes, content type defaults, view display tweaks in line with active.
9. **Settings sync** — module settings, role permissions, metatag defaults, taxonomy.
10. **Final pass** — `core.extension.yml`, system.site, system.theme, etc.

Roughly: deletes are ~120 files, adds are ~150 files, modifies are ~185 files.

## 5. Caveats

- `_core: default_config_hash` and per-config UUIDs are expected to differ — they are auto-generated. The diff scan ignored them.
- Cache-tag lists embedded in `views.view.*.yml` regenerate on save — many "diffs" in those files are just stale cache tags, not meaningful logical changes.
- Install-profile files don't carry `_core:` blocks, but most active sync files do. The comparison stripped that block to focus on real drift.
- `core.extension.yml` will always differ — install profile lists modules to install at site-creation time; sync lists what's currently enabled.
- Some "only in install" entries may be from contrib modules that auto-create config on install (Tour, responsive_preview, geolocation). Whether to remove them depends on whether those modules will still be installed on new sites.
