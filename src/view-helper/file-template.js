var Handlebars = require('handlebars');
var fs = require('fs');

function FileTemplate(path) {
  var view = fs.readFileSync(path, {encoding: 'utf8'});
  return Handlebars.compile(view);
}

module.exports = FileTemplate;