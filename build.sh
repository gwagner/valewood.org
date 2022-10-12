#!/bin/bash

echo "Install Node Deps"
npm install imagemin
npm install imagemin-webp
npm install glob
npm install lunr
npm install cheerio
npm install --save-dev pages-plugin-asset-negotiation

# Generate WebP Images
node webp.mjs

# Generate search index
node build_index.mjs

# Generate the SERP page
node create_serp_page.mjs

# Generate the 404 page
#node create_404_page.mjs

# Generate table of contents
node add_faq_structured_data.mjs

sleep 2

# Generate table of contents
node fix_table_of_contents.mjs

rm -rf webp.mjs build_index.mjs create_serp_page.mjs add_faq_structured_data.mjs fix_table_of_contents.mjs package.json package-lock.json build.sh run.sh update.sh .gitignore