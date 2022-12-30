import purify from "purify-css";
import BuildTools from './build_tools.mjs';
const bt = new BuildTools()

const HTML_FOLDER = ".";  // folder with your HTML files
var html = bt.findFilesByExtension(HTML_FOLDER, ['htm', 'html'], ['node_modules/']);
var css = bt.findFilesByExtension(HTML_FOLDER, ['css'], ['node_modules/', 'purified.css']);

var options = {
    // Will write purified CSS to this file.
    output: './purified.css',

    // Will minify CSS code in addition to purify.
    minify: true,

    info: true,
};

purify(html, css, options);

// var options = {
//     banner       : false,
//     csspath      : HTML_FOLDER + '/wp-content/cache/css/',
//     htmlroot     : HTML_FOLDER,
//     ignoreSheets : [/fonts.googleapis/],
//     inject       : function(window) { window.document.querySelector('html').classList.add('no-csscalc', 'csscalc'); },
//     jsdom        : {
//         userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
//     },
//     media        : ['(min-width: 700px) handheld and (orientation: landscape)'],
//     raw          : 'h1 { color: green }',
//     report       : false,
//     strictSSL    : true,
//     timeout      : 1000,
//     userAgent    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
// };

// uncss(files, options, function (error, output) {
//     console.log(output);
//     console.log(error)
// });
