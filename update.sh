#!/bin/zsh -

mkdir new-site/
unzip $1 -d ./new-site/

echo "Removing old JS files"
rm -rf ./wp-content/cache/autoptimize/js/*.js

echo "Rsyncing content"
rsync -cvr ./new-site/ ./

rm -rf ./new-site/

echo "Replacing www.lab.valewood.org with www.valewood.org"
grep -rl www.lab.valewood.org . --exclude='update.sh' | xargs sed -i 's/www.lab.valewood.org/www.valewood.org/g'

echo "Replacing loc>/ with www.valewood.org"
grep -rl "loc>/" . --exclude='update.sh' | xargs sed -i 's/\(loc>\)\//\1https:\/\/www.valewood.org\//g'

# RSS Atom Feed Fixing
echo "Replacing link>/ with www.valewood.org"
grep -rl "link>/" . --exclude='update.sh' | xargs sed -i 's/\(link>\)\//\1https:\/\/www.valewood.org\//g'

echo "Replacing comments>/ with www.valewood.org"
grep -rl "comments>/" . --exclude='update.sh' | xargs sed -i 's/\(comments>\)\//\1https:\/\/www.valewood.org\//g'

echo "Replacing comments>/ with www.valewood.org"
grep -rl "commentRss>/" . --exclude='update.sh' | xargs sed -i 's/\(commentRss>\)\//\1https:\/\/www.valewood.org\//g'

echo "Replacing href=\"/ with www.valewood.org"
grep -rl "href=\"/" . --include="*.xml" | xargs sed -i 's/\(href="\)\//\1https:\/\/www.valewood.org\//g'

echo "Fixing canonical links with https://www.valewood.org"
grep -rl '<link rel="canonical" href="/' . --exclude='update.sh' | xargs sed -i 's/\(<link rel="canonical" href="\)\//\1https:\/\/www.valewood.org\//g'

echo "You can now remove the source files: rm -rf $1"