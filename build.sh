#!/bin/bash

echo "Install Node Deps"
npm install imagemin
npm install imagemin-webp
npm install glob
npm install lunr
npm install cheerio
npm install --save-dev pages-plugin-asset-negotiation
npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-react
#npm install @ampproject/toolbox-optimizer


# Generate WebP Images
node webp.mjs

# Generate search index
node build_index.mjs

# Generate the SERP page
node create_serp_page.mjs

# Generate table of contents
node add_faq_structured_data.mjs

# Generate table of contents
node fix_table_of_contents.mjs

# Convert babel over to js
node convert_babel.mjs

rm -rf webp.mjs build_index.mjs convert_babel.mjs create_serp_page.mjs add_faq_structured_data.mjs fix_table_of_contents.mjs package.json package-lock.json build.sh run.sh update.sh .gitignore