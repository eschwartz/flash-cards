var express = require('express');
var serveStatic = require('serve-static');
var FlashCard = require('./model/flash-card');
var fileTemplate = require('./view-helper/file-template');
var Handlebars = require('handlebars');

var app = express();

// REST API
app.get('/api/flash-cards', function(req, res) {
  FlashCard.findAll().
    then(function(flashCards) {
      res.json(flashCards);
    }).
    catch(function(err) {
      res.json({
        error: {
          message: err.message
        }
      })
    });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// HTML views
app.get('/flash-cards', function(req, res) {
  FlashCard.findAll().
    then(function(flashCards) {
      var html = render('flash-cards', {
        flashCards: flashCards
      });
      res.send(html);
    }).
    catch(function(err) {
      var html = render('error', err);
      res.send(html);
    })
});

// Static files
app.use(serveStatic(__dirname + '/../public', {
  index: false
}));

function render(viewName, data) {
  var template = fileTemplate(__dirname + '/view/' + viewName + '.html.hbs');
  return template(data);
}

Handlebars.registerHelper('json', function(obj) {
  return new Handlebars.SafeString(JSON.stringify(obj, null, 2));
});

app.listen(3002, function() {
  console.log('server started!');
});