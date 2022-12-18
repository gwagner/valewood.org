var fs = require('fs')
var filePath = './topics/devops/resources/readiness-assessment/index.html';
var matchExpressions = [
    /(^render\(.*?<)\\\/(.*$)/gim,
    /(^function\sApp.*?)\\\/(.*$)/gim
]

fs.readFile(filePath, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  matchExpressions.forEach(e => {
    while(data.match(e)){
        data = data.replaceAll(e, '$1\/$2');
        //console.log("Replacement on " + e.toString())
    }
  })

  fs.writeFile(filePath, data, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});