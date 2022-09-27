#!/bin/zsh -

mkdir new-site/
unzip $1 -d ./new-site/

echo "Removing old JS files"
rm -rf ./wp-content/cache/autoptimize/js/*.js
rm -rf ./wp-content/plugins/elementor/assets/js/*.js
rm -rf ./wp-content/plugins/elementor-pro/assets/js/*.js
rm -f ./new-site/robots.txt # Local code repo has changes to block indexing of Cloudflare things, Manually merge this file if needed

echo "Rsyncing content"
rsync -cvr ./new-site/ ./

rm -rf ./new-site/

# Add missing JS
echo "Download missing JS files"
grep -ohP "\"([a-z0-9A-Z\.\-\_]+\.bundle\.min\.js)\"" wp-content/cache/autoptimize/js/*.js | sort -u | xargs -I{} curl https://www.lab.valewood.org/wp-content/plugins/elementor/assets/js/{} -s -S -f -w %{url_effective} -o wp-content/plugins/elementor/assets/js/{}
grep -ohP "\"([a-z0-9A-Z\.\-\_]+\.bundle\.min\.js)\"" wp-content/cache/autoptimize/js/*.js | sort -u | xargs -I{} curl https://www.lab.valewood.org/wp-content/plugins/elementor-pro/assets/js/{} -s -S -f -w %{url_effective} -o wp-content/plugins/elementor-pro/assets/js/{}

# Fix URLs
echo "Correct funky //www.valewood.org formatting"
grep -rl "\"//www.lab.valewood.org" . --exclude='update.sh' | xargs sed -i 's/"\/\/www.lab.valewood.org/"https:\/\/www.lab.valewood.org/g'

echo "Replacing www.lab.valewood.org with www.valewood.org"
grep -rl www.lab.valewood.org . --exclude='update.sh' | xargs sed -i 's/www.lab.valewood.org/www.valewood.org/g'

echo "Replacing loc>/ with www.valewood.org"
grep -rl "loc>/" . --exclude='update.sh' | xargs sed -i 's/\(loc>\)\//\1https:\/\/www.valewood.org\//g'

echo "Fix og:url property"
grep -rl "<meta property=\"og:url\" content=\"/" . --exclude='update.sh' | xargs sed -i 's/\(<meta property="og:url" content="\)\//\1https:\/\/www.valewood.org\//g'

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

# Fix ads
# echo "Replacing adsbygoogle.js\" with adsbygoogle.js?client=ca-pub-7120242057450442\""
# grep -rl "adsbygoogle.js\"" . --exclude='update.sh' | xargs sed -i 's/\(adsbygoogle.js\)"/\1?client=ca-pub-7120242057450442"/g'

echo "Add push javascript to ins"
grep -rl "</ins>" . --exclude='update.sh' | xargs sed -i 's/\(<\/ins>\)<\//\1<script>\(adsbygoogle = window.adsbygoogle || []\).push\({}\);<\/script><\//g'

SOURCE_FILE=$1
echo "Do you wish to remove the source files from $SOURCE_FILE"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) echo "Removing source files from $SOURCE_FILE\n";rm -rf $SOURCE_FILE; break;;
        No ) exit;;
    esac
done



