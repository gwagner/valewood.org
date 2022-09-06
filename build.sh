#!/bin/bash

echo "Install Node Deps"
npm install imagemin
npm install imagemin-webp
npm install glob

node webp.mjs

rm -rf /work/node_modules/ webp.mjs package.json package-lock.json docker.sh build.sh update.sh .gitignore
