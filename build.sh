#!/bin/bash

echo "Install Node Deps"
npm install imagemin
npm install imagemin-webp
npm install glob
npm install lunr
npm install cheerio
npm install --save-dev pages-plugin-asset-negotiation

node webp.mjs

node build_index.mjs
node create_serp_page.mjs

rm -rf webp.mjs build_index.mjs package.json package-lock.json docker.sh build.sh run.sh update.sh .gitignore