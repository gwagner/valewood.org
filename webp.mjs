import imagemin from "imagemin";
import webp from "imagemin-webp";
import glob from "glob";
import fs from 'fs';
import crypto from 'crypto';

var backgroundImageRegexp = /style=\"background-image\:\s(url\('(.*?)\.([jpgne]{3,4})'\));\"/ig;

var webpJs = `
<script defer type="text/javascript">

jQuery(window).on('load', function() {
  function WebpIsSupported(callback) {
      // If the browser doesn't has the method createImageBitmap, you can't display webp format
      if (!window.createImageBitmap) {
          callback(false);
          return;
      }

      // Base64 representation of a white point image
      var webpdata = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

      // Retrieve the Image in Blob Format
      fetch(webpdata).then(function(response) {
          return response.blob();
      }).then(function(blob) {
          // If the createImageBitmap method succeeds, return true, otherwise false
          createImageBitmap(blob).then(function() {
              callback(true);
          }, function() {
              callback(false);
          });
      });
  }
  // You can run the code like !
  WebpIsSupported(function(isSupported) {
      if (isSupported) {
          jQuery('[image-loader]').each(function() {
              var bg = jQuery(this).attr('image-loader');
              jQuery(this).css("background-image", "url('" + imageMap[bg].file + ".webp')");
          });
      } else {
          jQuery('[image-loader]').each(function() {
              var bg = jQuery(this).attr('image-loader');
              jQuery(this).css("background-image", "url('" + imageMap[bg].file + "." + imageMap[bg].ext + "')");
          });
      }
  });
});
</script>
`;



// Ensure that all images have a WebP version
glob("**/*.{jpg,png}", {}, function (er, files) {
  files.forEach(function (file) {
    var filePath = process.cwd().concat("/" + file)

    if (fs.lstatSync(filePath).isDirectory()) {
      return;
    }

    var webpFilePath = filePath.substring(0, filePath.lastIndexOf(".") + 1) + "webp";
    if (fs.existsSync(webpFilePath)) {
      return;
    }

    var parentDir = filePath.substring(0, filePath.lastIndexOf("/") + 1);
    const convertImage = async () => {
      await imagemin([filePath], {
        destination: parentDir,
        plugins: [
          webp({
            lossless: true,
          }),
        ],
      });
    }
    convertImage();
  })
})

// Ensure that all images are lazy loaded with webp first
glob("**/*.html", {}, function (er, files) {
  files.forEach(function (file, index) {
    var filePath = process.cwd().concat("/" + file)
    try {
      var data = fs.readFileSync(filePath, 'utf8');
      if (data.includes("WebpIsSupported")) {
        return
      }

      var matches = [...data.matchAll(backgroundImageRegexp)];

      if (matches.length < 1) {
        return
      }

      var imageMap = '<script type="text/javascript">';
      imageMap = imageMap + "\nvar imageMap={"

      matches.forEach(function (match) {
        data = data.replace(match[0], "image-loader=\"" + crypto.createHash('md5').update(match[2]).digest('hex') + "\"")
        imageMap = imageMap + '"' + crypto.createHash('md5').update(match[2]).digest('hex') + '": {file: "' + match[2] + '", ext: "' + match[3] + '"},';
      })
      imageMap = imageMap.substring(0, imageMap.length - 1) + "}\n</script>"

      data = data.replace("</body>", imageMap + webpJs + "</body>")
      fs.writeFileSync(filePath, data);
    } catch (err) {
      console.error(err);
    }
  })

  console.log(er)
})
