#!/bin/zsh -

mkdir new-site/
unzip $1 -d ./new-site/

echo "Removing old JS files"
rm -rf ./wp-content/cache/autoptimize/js/*.js

echo "Rsyncing content"
rsync -cvr ./new-site/ ./

rm -rf ./new-site/

echo "Replacing www.lab.valewood.org with www.valewood.org"
grep -rl www.lab.valewood.org . --exclude='build.sh' | xargs sed -i 's/www.lab.valewood.org/www.valewood.org/g'

echo "Fixing canonical links with https://www.valewood.org"
grep -rl '<link rel="canonical" href="/' . --exclude='build.sh' | xargs sed -i 's/\(<link rel="canonical" href="\)\//\1https:\/\/www.valewood.org\//g'

echo "You can now remove the source files: rm -rf $1"