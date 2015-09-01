var express = require('express');
var serveStatic = require('serve-static');
var FlashCard = require('./model/flash-card');
var Handlebars = require('handlebars');
var fs = require('fs');

// Create an Express.js application
var app = express();

// The beginnings of a REST API.
// We're not really using this in the current application,
// but this gives you an idea of how to could create a more
// dynamic application with AJAX on the client side.
app.get('/api/flash-cards', function(req, res) {
  // Grab our model data
  FlashCard.findAll().
    then(function(flashCards) {
      // ...and render it at JSON
      res.json(flashCards);
    }).
    catch(function(err) {
      // ...or render an error message, if the request fails.
      res.json({
        error: {
          message: err.message
        }
      })
    });
});


// HTML FlashCards app view
app.get('/flash-cards', function(req, res) {
  // Fetch our model data
  FlashCard.findAll().
    then(function(flashCards) {
      // ...and render the flash-cards view (see view/flahs-cards.html.hbs)
      var html = render('flash-cards', {
        // pass the flashCards data to the view
        flashCards: flashCards
      });
      res.send(html);
    }).
    catch(function(err) {
      // ... or render an error view, if something goes wrong
      var html = render('error', err);
      res.send(html);
    })
});

// Serve static files from the /public dir
app.use(serveStatic(__dirname + '/../public', {
  index: false
}));

// Catch-all error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// We're using the Handlebars library to render our HTML views
function render(viewName, data) {
  var path = __dirname + '/view/' + viewName + '.html.hbs';
  var view = fs.readFileSync(path, {encoding: 'utf8'});
  var template = Handlebars.compile(view);
  return template(data);
}

// A helper for our Handlebars templates, to render data as JSON.
// Allows us to "bootstrap" our FlashCards app with data
Handlebars.registerHelper('json', function(obj) {
  return new Handlebars.SafeString(JSON.stringify(obj, null, 2));
});

// Start up the Express.js server, on port 8000
var server = app.listen(8000, 'localhost', function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});