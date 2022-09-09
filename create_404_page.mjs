import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import cheerio from 'cheerio';

var txt = fs.readFileSync("index.html").toString();
var $ = cheerio.load(txt);

const PageContent404 = `
<div class="container page-404">
    <div class="error-404">
        <div class="error-image">
            <img src="/wp-content/themes/soledad/images/404.png" alt="404" width="212" height="87" />
        </div>
        <p class="sub-heading-text-404">OOPS! Page you&#039;re looking for doesn&#039;t exist.</p>
    </div>
    <p class="go-back-home"><a href="/">Back to Home Page</a></p>
</div>
`

// Remove the guts of the page
$(".penci-wrapper-posts-content > ul").remove()
$(".penci-wrapper-posts-content > div.penci-ajax-more").remove()
$("#sidebar").remove()
$('.penci-wrapper-posts-content').append(PageContent404);

// Add necessary info here

fs.writeFile('404.html', $.html(), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("404 Page saved as /404.html");
});

