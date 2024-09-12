# ec-upstream

[![CircleCI](https://circleci.com/gh/electriccitizen/ec-upstream.svg?style=shield)](https://circleci.com/gh/electriccitizen/ec-upstream)
[![Dashboard ec-upstream](https://img.shields.io/badge/dashboard-ec_upstream-yellow.svg)](https://dashboard.pantheon.io/sites/b043b678-2567-403a-aafc-947c7d9a76de#dev/code)
[![Dev Site ec-upstream](https://img.shields.io/badge/site-ec_upstream-blue.svg)](http://dev-ec-upstream.pantheonsite.io/)

Ec-upstream is a Composer-based Drupal application hosted on [Pantheon](http://dashboard.getpantheon.com).

## Onboarding

* Refer to [EC-INSTALL.md](/EC-INSTALL.md) for local development instructions.

* Refer to [THEME-INSTALL.md](/web/themes/citizen_patterns/THEME-INSTALL.md) for Theme Building instructions.

* Refer to [EC-BACKSTOP.md](/tests/backstop/EC-BACKSTOP.md) for complete instructions for Visual Regression Testing using Backstop JS.

## Important notes

## AI Search

This is a branch set up to easily demonstrate AI search and chatbots in Drupal.
To accomplish that:

1. Go to cloud.zilliz.com and register.
2. Create a new Project, with empty Collections.
3. Go to openai.com, create an account, and subscribe at the lowest amount you're
   allowed to subscribe with.
4. Go to http://ec-upstream.docksal.site/admin/config/system/keys and update or
   enter the key you have for both OpenAI and for Zilliz Milvus.
5. Go to http://ec-upstream.docksal.site/admin/config/ai/vdb_providers/milvus
   and update the server to point to the server you created in 2 (it should be
   on the Cluster Details tab of your Zilliz project, under "Public Endpoint").
6. Go to http://ec-upstream.docksal.site/admin/config/openai/settings and put
   your OpenAI API key in here, too, as well as your organization ID.
7. Go to http://ec-upstream.docksal.site/admin/config/search/search-api/server/ai_test_server/edit
   and Save the page. If all goes well, this should create a new Collection on
   your Zilliz Cluster named "TestDrupalCollection". You may need to refresh.
8. On the Zilliz interface, click "Load" on TestDrupalCollection, and wait until
   "LOADED" appears next to the name.
9. Go to http://ec-upstream.docksal.site/admin/config/search/search-api/index/ai_test_index,
   clear all indexed data, then re-index all. This should take a moment, but
   complete without errors, saying all 25 nodes are indexed.
10. Refresh the Zilliz interface again, and you should see that TestDrupalCollection
   now has 25 loaded entries.
11. Refresh the homepage and ask the AI chatbot anything about the content. It
   should(tm) come back with a title of a page that meets your request.
