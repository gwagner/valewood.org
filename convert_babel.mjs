import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import Babel from '@babel/core';

const HTML_FOLDER = ".";  // folder with your HTML files


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

var files = findHtml(HTML_FOLDER);
for (var i = 0; i < files.length; i++) {
  var filename = files[i];

  // Do not convert the notes folder
  if(filename.startsWith("notes/")) {
    continue;
  }

  var html = readHtml(HTML_FOLDER, filename)
  var $ = cheerio.load(html);

  // No babel found
  if ($('script[type="text/babel"]').length == 0) {
    continue
  }

  $('script[type="text/babel"]').each(function(){  
    let output = Babel.transform($(this).text(), { presets: ["@babel/env", "@babel/preset-react"] }).code;
    $(this).html(output)
    $(this).attr("type", "text/javascript")
  })

  $('head script').each(function(){
    if($(this).attr('src') != undefined && $(this).attr('src').endsWith('babel.min.js')){
      $(this).remove()
    }
  })

  try {
    fs.writeFileSync(filename, $.html())
    console.log("Babel saved: " + filename);
  } catch (err) {
    console.log(err)
    break;
  }
}
