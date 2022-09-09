import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import cheerio from 'cheerio';

var txt = fs.readFileSync("index.html").toString();
var $ = cheerio.load(txt);

var searchFunction = `
<script src="https://unpkg.com/lunr/lunr.js"></script>
<script type="text/javascript">
  // self calling function
  jQuery(document).ready(function ($) {
    var urlParams = new URLSearchParams(window.location.search);

    // bail if we did not get a search param
    if (!urlParams.has('s')) {
      window.location.href = "/";
      return;
    }

    // AJAX request with GET action from the mock API source
    jQuery.get("/search_index.json", function (data) {

      // Setup the lunr index
      var idx = lunr.Index.load(data)
      var res = idx.search(urlParams.get('s'))

      jQuery.get("/search_previews.json", function (previews) {
        // creating the "table" with the received data
        createTable(res, previews)
      });
    });
  })

  function createTable(results, previews) {
    var html = ''
    results.forEach(result => {
      // calling createTableRow() for each data item in the
      // received array
      html += createPostRecord(result, previews)
    })

    jQuery('.penci-wrapper-posts-content > ul').html(html);
  }

  // adding content to the DOM
  function createPostRecord(result, previews) {
    /**
     * post article
     * category array of objects (category and link)
     * author link 
     * datetime
     */
    return \`<li class="list-post pclist-layout">
          <article id="post-\${result.ref}" class="item hentry">
            <div class="thumbnail">

              <a class="penci-image-holder"
                style="background-image: url('\${previews[result.ref].image}');"
                href="\${previews[result.ref].link}" title="\${previews[result.ref].title}">
              </a>

            </div>

            <div class="content-list-right content-list-center">
              <div class="header-list-style">
                <span class="cat"><a class="penci-cat-name penci-cat-8" href="\${previews[result.ref].category_link}" rel="category tag">\${previews[result.ref].category}</a></span>

                <h2 class="penci-entry-title entry-title grid-title"><a href="\${previews[result.ref].link}">\${previews[result.ref].title}</a></h2>
                <div class="penci-hide-tagupdated">
                  <span class="author-italic author vcard">by <a class="url fn n" href="\${previews[result.ref].author_link}">\${previews[result.ref].author}</a></span>
                  <time class="entry-date published" datetime="\${previews[result.ref].datetime}">\${previews[result.ref].date}</time>
                </div>
                <div class="grid-post-box-meta">
                  <span class="otherl-date-author author-italic author vcard">
                    by <a class="url fn n" href="\${previews[result.ref].author_link}">\${previews[result.ref].author}</a></span>
                  <span class="otherl-date">
                    <time class="entry-date published" datetime="\${previews[result.ref].datetime}">\${previews[result.ref].date}</time>
                  </span>
                </div>
              </div>

              <div class="item-content entry-content">
                <p>\${previews[result.ref].preview}</p>
              </div>

              <div class="penci-readmore-btn">
                <a class="penci-btn-readmore" href="\${previews[result.ref].link}">Read more<i class="penci-faicon fa fa-angle-double-right"></i></a>
              </div>

              <div class="penci-post-box-meta penci-post-box-grid penci-post-box-listpost">
                <div class="penci-post-share-box">
                  <a class="new-ver-share post-share-item post-share-facebook" aria-label="Share on Facebook"
                    target="_blank" rel="noreferrer"
                    href="https://www.facebook.com/sharer/sharer.php?u=\${previews[result.ref].l}"><i
                      class="penci-faicon fa fa-facebook"></i><span class="dt-share">Facebook</span></a><a
                    class="new-ver-share post-share-item post-share-twitter" aria-label="Share on Twitter"
                    target="_blank" rel="noreferrer"
                    href="https://twitter.com/intent/tweet?text=Check%20out%20this%20article:%20\${encodeURIComponent(previews[result.ref].title)}%20-%20\${encodeURIComponent(previews[result.ref].link)}"><i
                      class="penci-faicon fa fa-twitter"></i><span class="dt-share">Twitter</span></a><a
                    class="new-ver-share post-share-item post-share-linkedin" aria-label="Share on LinkedIn"
                    target="_blank" rel="noreferrer"
                    href="https://www.linkedin.com/shareArticle?mini=true&#038;url=\${encodeURIComponent(previews[result.ref].link)}&#038;title=\${encodeURIComponent(previews[result.ref].title)}"><i
                      class="penci-faicon fa fa-linkedin"></i><span class="dt-share">Linkedin</span></a><a
                    class="new-ver-share post-share-item post-share-reddit" aria-label="Share on Reddit"
                    target="_blank" rel="noreferrer"
                    href="https://reddit.com/submit?url=\${encodeURIComponent(previews[result.ref].link)}#038;title=\${encodeURIComponent(previews[result.ref].title)}"><i
                      class="penci-faicon fa fa-reddit-alien"></i><span class="dt-share">Reddit</span></a><a
                    class="new-ver-share post-share-item post-share-email" target="_blank"
                    aria-label="Share via Email" rel="noreferrer"
                    href="mailto:/?subject=\${encodeURIComponent(previews[result.ref].title)};BODY=\${previews[result.ref].link}"><i
                      class="penci-faicon fa fa-envelope"></i><span class="dt-share">Email</span></a>
                </div>
              </div>
            </div>
          </article>
        </li>\`
  }
</script>
`

// Remove the guts of the page
$(".penci-wrapper-posts-content").find('ul.penci-wrapper-data').children().remove()
$(".penci-wrapper-posts-content").find('div.penci-ajax-more').remove()
$('body').append(searchFunction);

// Add neccisary info here

fs.writeFile('search/index.html', $.html(), function(err) {
  if(err) {
          return console.log(err);
  }
  console.log("SERP Page saved as search.html");
});

