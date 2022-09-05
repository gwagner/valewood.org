import imagemin from "imagemin";
import webp from "imagemin-webp";
import glob from "glob";
import fs from 'fs';

var webpJs = `
<script defer type="text/javascript">
jQuery(window).on('load', function() {
  var WebP = new Image();
  WebP.onload = WebP.onerror = function() {
      if (WebP.height != 2) {
          jQuery('img[src$=".webp"]').each(function(index, element) {
              element.src = element.src.replace('.webp', '.jpg');
              element.src = element.src.replace('.webp', '.png');
          });
          jQuery('*').filter(function() {
              if (this.currentStyle)
                  return this.currentStyle['backgroundImage'] !== 'none';
              else if (window.getComputedStyle)
                  return document.defaultView.getComputedStyle(this, null)
                      .getPropertyValue('background-image') !== 'none';
          }).each(function(){
            var bg = jQuery(this).css('background-image');
            console.log("Before: "+ bg)
            bg = bg.substring(0,bg.lastIndexOf(".")+1) + "webp\")";
            console.log("After: "+ bg)
            jQuery(this).css("background-image", bg);
          });
      }
  };
  WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
});
</script>
`;

jQuery('*').filter(function() {
  if (this.currentStyle)
      return this.currentStyle['backgroundImage'] !== 'none';
  else if (window.getComputedStyle)
      return document.defaultView.getComputedStyle(this, null)
          .getPropertyValue('background-image') !== 'none';
}).each(function(){
  var bg = jQuery(this).css('background-image');
  console.log(bg)
});

// options is optional
glob("**/*.{jpg,png}", {}, function (er, files) {
   files.forEach(function(file){
        var filePath = process.cwd().concat("/" + file)

        if(fs.lstatSync(filePath).isDirectory()) {
            console.log("Image " + filePath + " is a directory, skipping");
            return;
        }

        var webpFilePath = filePath.substring(0,filePath.lastIndexOf(".")+1) + "webp";
        if (fs.existsSync(webpFilePath)) {
            console.log("Image " + webpFilePath + " Exists");
            return;
        }

        var parentDir = filePath.substring(0,filePath.lastIndexOf("/")+1);
        const convertImage = async () => {
            await imagemin([filePath], {
                destination: parentDir,
                plugins: [
                    webp({
                        lossless: true,
                    }),
                ],
            });
            console.log("Image " + filePath + " Converted Successfully into " + parentDir);
        }
        convertImage();
   })
})

// // options is optional
glob("**/*.html", {}, function (er, files) {
    files.forEach(function(file, index){
         var filePath = process.cwd().concat("/" + file)
         try {
            var data = fs.readFileSync(filePath, 'utf8');
            if(data.includes(webpJs)) {
                console.log("File " + filePath + " Already contains WebPJS");
                return;
            }

            data = data.replace("</body>", webpJs + "</body>")
            fs.writeFileSync(filePath, data);
          } catch (err) {
            console.error(err);
          }
    })
    console.log(er)
 })


