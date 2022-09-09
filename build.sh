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

rm -rf webp.mjs build_index.mjs package.json package-lock.json build.sh run.sh update.sh .gitignore