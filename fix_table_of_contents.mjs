import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import cheerio from 'cheerio';
import BuildTools from './build_tools.mjs';

const bt = new BuildTools()

const HTML_FOLDER = ".";  // folder with your HTML files
const DEPTH = 2;
const levelMatrix = [
  'H2',
  'H3',
  'H4',
  'H5',
  'H6'
]

var files = bt.findFilesByExtension(HTML_FOLDER, ['htm', 'html'], ['node_modules/', 'notes/']);

function addReplacement(id, title, step, tag, replacements) {
  // Skip empty titles
  if (title.trim() == "" || title.trim() == "&nbsp;") {
    return
  }
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
  return text.replace(/[^a-zA-Z0-9\s]+/, "").replace(/[\r\n]+/, " ").replace(/[\s]{2,}/, " ").toLowerCase().trim().replace(/\s/g, '-')
}

for (var i = 0; i < files.length; i++) {
  var filename = files[i];

  var html = bt.readFile(HTML_FOLDER, filename)
  var $ = cheerio.load(html);

  if ($('.elementor-toc__header').length == 0) {
    continue
  }

  var replacements = [];

  $('[data-widget_type="text-editor.default"]').each(function (idx, section) {
    $(section).find('h2,h3,h4,h5,h6').each(function (idx, tag) {
      var d = levelMatrix.indexOf($(tag).prop('nodeName'))
      if (d >= DEPTH || d === 'undefined') { return; }

      addReplacement(sanitizeHTag($(tag).html()), $(tag).html(), d, $(tag), replacements)
    });
  })

  $('.elementor-toc__spinner-container').remove()
  var currentOrderedList = $("<ol>").attr("class", 'elementor-toc__list-wrapper');
  let parentOrderedList;

  // Get a pointer to the root OL
  var ol = currentOrderedList

  // current depth of the loop
  var depth = 0;

  replacements.forEach(function (item) {
    if (item.step > depth) {
      depth = item.step

      var newOrderedList = $("<ol>").attr("class", 'elementor-toc__list-wrapper')
      currentOrderedList.children().filter('li').last().append(newOrderedList)
      parentOrderedList = currentOrderedList
      currentOrderedList = newOrderedList
    }

    if (item.step < depth) {
      depth = item.step

      currentOrderedList = parentOrderedList
      parentOrderedList = $(currentOrderedList).parent('ol')
    }

    currentOrderedList.append($(`
      <li class=\"elementor-toc__list-item\">
        <div class="elementor-toc__list-item-text-wrapper">
          <a href="#${item.id}" class="elementor-toc__list-item-text elementor-toc__top-level">${item.title}</a>
        </div>
      </li>`))
    item.tag.attr("id", item.id)
  })

  $('.elementor-toc__body').append(ol)

  // Removes the data element to stop the JS from firing off
  $('[data-widget_type="table-of-contents.default"]').removeAttr("data-widget_type")

  if(bt.writeFileSync(filename, $.html())){
    console.log("Table of contents saved: " + filename);
  } else {
    console.log("Error saving toc file: "+filename)
    break;
  }
}
