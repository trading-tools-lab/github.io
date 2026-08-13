ZERIK — TRADING TOOLS LAB
============================================================

Static GitHub Pages site for:
https://github.com/trading-tools-lab/github.io/

The package is ready to upload to the ROOT of the repository. After extraction,
index.html must be at the repository root; do not upload an extra zerik folder.

DEPLOYMENT
----------
1. Extract the ZIP.
2. Upload every extracted file and folder to the main branch root.
3. In GitHub, open Settings > Pages > Build and deployment.
4. Select “Deploy from a branch”, then main and / (root), and save.
5. Open https://trading-tools-lab.github.io/github.io/ after Pages finishes.

ARTICLE PUBLISHING PLUGIN
-------------------------
This site is compatible with:
D:\publish_plugin\item_github.py

The plugin discovers the repository through agent/publish-config.json, adds or
updates an entry in data/articles.json, uploads article images to assets/, and
returns a public URL in this format:
article.html?id=article-slug

Keep these paths and fields unchanged unless the plugin is updated with them:

agent/publish-config.json
  provider: github-pages
  branch: main
  basePath: empty because the site is at repository root
  contentSource: data/articles.json

data/articles.json
  Top-level JSON array of article objects. Each article needs a unique id,
  title, category, summary, readTime, date, tags and body object. Published
  entries may include "status": "published".

article.html
  Must retain #article-detail. The plugin uses it to verify the published title,
  body and any uploaded images.

AUTOMATIC ARTICLE LISTS
-----------------------
The homepage and full article archive both read data/articles.json in the
browser. New plugin-published articles are inserted at the beginning of that
file and are also sorted by date by js/content-loader.js:

- index.html shows the latest three published articles.
- articles.html shows every published article.
- Archive category filters are built from the current article data.
- Draft or review entries are hidden when they include a non-published status.

No article cards need to be copied into HTML when a new article is published.

CONTENT FILES
-------------
data/profile.json             Public identity and biography data.
data/articles.json            Article metadata and long-form body data.
data/research.json            Field-test and research records.
agent/profile.json            Editorial identity, expertise and audience.
agent/content-schema.json     JSON Schema for generated articles.
agent/content-plan.json       Content lanes and review cadence.
agent/publish-config.json     Plugin repository and Pages target.
agent/writing-style.json      Editorial and citation rules.

LOCAL REVIEW
------------
Use a local web server because browsers block JSON requests when HTML is opened
directly through file://. No framework, package installation, build command or
database is required.

Editorial content is educational and must not be presented as investment
advice. Review claims, citations and images before publishing.
