#!/bin/bash

echo "Install Node Deps"
npm install imagemin
npm install imagemin-webp
npm install glob
npm install --save-dev pages-plugin-asset-negotiation

node webp.mjs

rm -rf webp.mjs package.json package-lock.json docker.sh build.sh update.sh .gitignore