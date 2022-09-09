import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import cheerio from 'cheerio';


// Change these constants to suit your needs
const HTML_FOLDER = ".";  // folder with your HTML files
// Valid search fields: "title", "description", "keywords", "body"
const SEARCH_FIELDS = ["title", "description", "keywords", "body"];
const EXCLUDE_FILES = ["category-sitemap.xml", "main-sitemap.xsl", "page-sitemap.xml", "post-sitemap.xml"];
const MAX_PREVIEW_CHARS = 250;  // Number of characters to show for a given search result

var previews = {};
var docs = [];

function isHtml(filename) {
    var lower = filename.toLowerCase();
    return (lower.endsWith(".htm") || lower.endsWith(".html"));
}


function findHtml(folder) {
    if (!fs.existsSync(folder)) {
        console.log("Could not find folder: ", folder);
        return;
    }

    var files = fs.readdirSync(folder);
    var htmls = [];
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(folder, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            var recursed = findHtml(filename);
            for (var j = 0; j < recursed.length; j++) {
                recursed[j] = path.join(files[i], recursed[j]).replace(/\\/g, "/");
            }
            htmls.push.apply(htmls, recursed);
        }
        else if (isHtml(filename) && !EXCLUDE_FILES.includes(files[i])) {
            htmls.push(files[i]);
        };
    };
    return htmls;
};


function readHtmlAndIndex(root, file, fileId) {
    var filename = path.join(root, file);
    var txt = fs.readFileSync(filename).toString();
    var $ = cheerio.load(txt);

    if (!isIndexable($, file))
        return

    console.log("\t" + filename)

    var body = $("body")
    if (typeof body == 'undefined') {
        body = "";
    } else {
        // get rid of the table of contents
        body.find('#penci-toc-container').remove();

        // get rid of the ending post tags
        body.find('.post-tags').remove();

        body = body.find('.post-entry').text().trim();
    }

    var title = $("title").text();
    if (typeof title == 'undefined') title = file;

    var description = $("meta[name=description]").attr("content");
    if (typeof description == 'undefined') description = "";

    var keywords = $("meta[name=keywords]").attr("content");
    if (typeof keywords == 'undefined') keywords = "";

    // add the information to the indexable array
    docs.push({
        "id": fileId,
        "title": title,
        "description": description,
        "keywords": keywords,
        "body": body,
    })

    var preview = body
    if (preview.length > MAX_PREVIEW_CHARS)
        preview = preview.slice(0, MAX_PREVIEW_CHARS).trim() + "...";

    var date = $(".entry-date").filter(":first").text();
    if (typeof date == 'undefined') date = "";

    var datetime = $(".entry-date").filter(":first").attr('datetime');
    if (typeof datetime == 'undefined') datetime = "";

    var author = $(".author").filter(":first").text();
    if (typeof author == 'undefined') author = "";

    var author_link = $(".author").filter(":first").find('a').attr('href');
    if (typeof author_link == 'undefined') author_link = "/";

    var category = $(".current-post-parent").find('a').filter(":first").text();
    if (typeof category == 'undefined') category = "Uncategorized";

    var category_link = $(".current-post-parent").find('a').filter(":first").attr('href');
    if (typeof category_link == 'undefined') category_link = "Uncategorized";

    var image = $(".jarallax-img").attr('src')
    if (typeof image == 'undefined') image = "/wp-content/uploads/2022/08/A-DevOoops-1-e1660773390219.png";

    /**
     * category array of objects (category and link)
     */

    previews[fileId] = {
        "link": "/" + file.replace("/index.html", "/", file),
        "title": title,
        "image": image,
        "description": cleanString(description),
        "preview": cleanString(preview),
        "date": cleanString(date),
        "datetime": datetime,
        "author": cleanString(author),
        "author_link": author_link,
        "category": cleanString(category),
        "category_link": category_link,
    };

    return;
}

function cleanString(s) {
    return s.replace(/[\t\n\r]+/g, " ").replace(/\s{2,}/g, " ")
}

function isIndexable($, file) {
    if (file.includes("/amp") || file.includes("amp/"))
        return false;

    if (file.includes("node_modules/"))
        return false;

    if ($("#penci-post-entry-inner").length < 1)
        return false;

    return true;
}


function main() {
    var files = findHtml(HTML_FOLDER);
    console.log("Building index for these files:");
    for (var i = 0; i < files.length; i++) {
        readHtmlAndIndex(HTML_FOLDER, files[i], i)
    }

    var idx = lunr(function () {
        this.ref('id');
        for (var i = 0; i < SEARCH_FIELDS.length; i++) {
            this.field(SEARCH_FIELDS[i]);
        }

        docs.forEach(function(doc){
            this.add(doc)
        }, this)
    });

    fs.writeFile('search_index.json', JSON.stringify(idx), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Index saved as search_index.json");
    });

    fs.writeFile('search_previews.json', JSON.stringify(previews), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Previews saved as search_previews.json");
    });
}

main();