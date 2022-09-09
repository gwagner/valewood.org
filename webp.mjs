import imagemin from "imagemin";
import webp from "imagemin-webp";
import glob from "glob";
import fs from 'fs';


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
            quality: 50,
          }),
        ],
      });
    }
    convertImage();
  })
})
