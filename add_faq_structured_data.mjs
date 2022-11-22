

import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import cheerio from 'cheerio';

const HTML_FOLDER = ".";  // folder with your HTML files
const DEPTH = 2;

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
    else if (isHtml(filename)) {
      htmls.push(files[i]);
    };
  };
  return htmls;
};

function isHtml(filename) {
  var lower = filename.toLowerCase();
  return (lower.endsWith(".htm") || lower.endsWith(".html"));
}

function readHtml(root, file) {
  var filename = path.join(root, file);
  return fs.readFileSync(filename).toString();
}

function addReplacement(id, title, step, tag, replacements) {
  var duplicate = 0
  replacements.forEach(function (r) {
    if (r.id == id) {
      duplicate++
    }
  })
  if (duplicate > 0) {
    id = id + "-" + duplicate
  }
  replacements.push({
    'id': id,
    'title': title,
    'step': step,
    'tag': tag
  });

  return;
}

function sanitizeHTag(text) {
  return text.replace("&nbsp;", " ").replace(/[^a-zA-Z0-9\s]+/, "").replace(/[\r\n]+/, " ").replace(/[\s]{2,}/, " ").toLowerCase().trim().replace(/\s/g, '-')
}

var files = findHtml(HTML_FOLDER);
for (var i = 0; i < files.length; i++) {
  var filename = files[i];
  if(!filename.includes("faq/index.html")) {
    continue;
  }

  var html = readHtml(HTML_FOLDER, filename)
  var $ = cheerio.load(html);

  if ($('.elementor-toc__header').length == 0) {
    continue
  }

  var replacements = [];

  console.log("Modifying file: " + filename)
  $('.elementor-widget-text-editor').find('h2').each(function (idx, tag) {
    addReplacement(sanitizeHTag($(tag).html()), $(tag).html(), 0, $(tag), replacements)
  })
  //console.log(replacements)
  //continue;

  /**
 * 
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"","acceptedAnswer":{"@type":"Answer","text":""}}]}</script>
 */
  var schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  }

  replacements.forEach(function (item) {
    if(item.title.trim() == "" || item.title.trim() == "&nbsp;"){
      return
    }

    var answer = item.tag.nextUntil("h2", "p,blockquote").text().replace(/[\t\s]{2,}/g, " ").replace(/\.([a-z0-9])/ig, ". $1").trim()
    var faq = {
      "@type": "Question",
      "name": item.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer,
      }
    }
    schema.mainEntity.push(faq)
  })

  $("head").append($("<script type=\"application/ld+json\">").text(JSON.stringify(schema)));

  try{
    fs.writeFileSync(filename, $.html())
    console.log("FAQ contents saved: "+filename);
  }catch(err) {
    console.log(err)
    break;
  }
}
