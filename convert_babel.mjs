import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import Babel from '@babel/core';
import BuildTools from './build_tools.mjs';

const bt = new BuildTools()
const HTML_FOLDER = ".";  // folder with your HTML files

var files = bt.findFilesByExtension(HTML_FOLDER, ['htm', 'html'], ['node_modules/', 'notes/']);

for (var i = 0; i < files.length; i++) {
  var filename = files[i];

  var html = bt.readFile(HTML_FOLDER, filename)
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

  if(bt.writeFileSync(filename, $.html())){
    console.log("Babel saved: " + filename);
  } else {
    console.log("Error saving babel file: "+filename)
    break;
  }
}
