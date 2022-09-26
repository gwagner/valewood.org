import fs from 'fs';
import cheerio from 'cheerio';

var txt = fs.readFileSync("index.html").toString();
var $ = cheerio.load(txt);

const PageContent404 = `
<section class="penci-section penci-disSticky penci-structure-10 elementor-section elementor-top-section elementor-element elementor-element-264ecbd3 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="264ecbd3" data-element_type="section"><div class="elementor-container elementor-column-gap-default"><div class="penci-ercol-100 penci-ercol-order-1 penci-sticky-ct  penci-dmcheck penci-elbg-activate  elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-1427082a" data-id="1427082a" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"><div class="elementor-widget-wrap elementor-element-populated"><div class="elementor-element elementor-element-5a35d4d7 elementor-widget elementor-widget-heading" data-id="5a35d4d7" data-element_type="widget" data-widget_type="heading.default"><div class="elementor-widget-container"><h1 class="elementor-heading-title elementor-size-default">404</h1></div></div><div class="elementor-element elementor-element-3e414407 elementor-widget__width-initial elementor-widget elementor-widget-text-editor" data-id="3e414407" data-element_type="widget" data-widget_type="text-editor.default"><div class="elementor-widget-container"><p>Sorry, we can’t find the page you’re looking for.<br>Click the button below to go back to the homepage.</p></div></div><div class="elementor-element elementor-element-58d4b8be elementor-align-center elementor-widget elementor-widget-button" data-id="58d4b8be" data-element_type="widget" data-widget_type="button.default"><div class="elementor-widget-container"><div class="elementor-button-wrapper"> <a href="https://www.valewood.org" class="elementor-button-link elementor-button elementor-size-sm" role="button"> <span class="elementor-button-content-wrapper"> <span class="elementor-button-text">Back Home</span> </span> </a></div></div></div></div></div></div></section>
`

// Remove the guts of the page
var next = $("header").next("div")
next.children().remove()
next.append(PageContent404)

// // Add necessary info here

fs.writeFile('404.html', $.html(), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("404 Page saved as /404.html");
});

