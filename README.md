# Flash Cards Demo

## Getting Started

You'll need to download and familiarize yourself with a few common web development tools, in order to get this application up and running:

* [Git](https://git-scm.com/): version control - [download](https://git-scm.com/downloads)
* [Node](https://nodejs.org/): server-side javascript runtime  - [download](https://nodejs.org/download)
* [npm](https://www.npmjs.com/): package manager for node - included with node download

### Downloading the code base

You can use git to download the code base from github. In your terminal, enter:

```
git clone https://github.com/eschwartz/flash-cards.git
```

This will clone (copy) the flash-cards repository (code base) in the the `flash-cards` directory in your computer.

### Installing dependencies

You can install dependencies using npm. From the `flash-cards` project directory, enter into the terminal:

```
npm install
```

This will install project dependencies into `flash-cards/node_modules`

### Setting up the MySql database

If you look in `flash-cards/data` you'll see a couple of SQL scripts. 

* `flashcards.sql` contains the the SQL code for defining the schema of the `flashcards` database
* `fixtures.sql` contains some sample data for populating the `flashcards` database.

Run both of these scripts, starting with `flashcards.sql`. 

You now need to tell the application how to connect to the database. To do this

* Make a copy of `src/config/db.local.json.dist` and re-name to `db.local.json`
* Change the username/password in `db.local.json` to match your MySQL credentials.

### Starting the application

The code for the application server is in `flash-cards/src/app.js`. To start up the application server, simply run that file with node:

```
node ./src/app.js
```

If everything is working correctly, you should see something like:

```
Example app listening at http://127.0.0.1:8000
```


## Using the application

If you followed the "Getting Started" docs, you should now have a node server up and running on your local machine at `http://127.0.0.1:8000`. The application exposes a few endpoints (urls) under that address:

* `/api/flash-cards`: Serves a JSON representation of the flash-cards in the `flashcards` database
	* This could be used by the client-side javascript for dynamic access to server data
* `/flash-cards`: Serves an HTML file, which runs the FlashCards app
* `/audio`, `/css`, `/js`: Serves static content from the `/public` directory.

To access any of these endpoints, visit `http://127.0.0.1:8000/ENDPOINT_NAME` in your browser. The main application is at `http://127.0.0.1:8000/flash-cards`.

## Understanding the application

The FlashCards app includes both server-side javascript (in the `src/` directory), and client-side javascript (in the `/public` directory).

Take a look at the code for more documentation and notes.

### Server-side javascript

The main components on the server-side are:

* The `FlashCard` model, in `src/model/flash-card.js`
	* This model provides methods for populating `FlashCard` objects from SQL queries. 
* HTML View templates, in `src/view`
* The main application script, which is an [Express.js](http://expressjs.com/) application.
	* Routes requests to controllers (functions), using `app.get`
	* Controllers fetch data from the `FlashCard` model
	* Controllers render HTML or JSON views, using `FlashCard` model data

### Client-side javascript

The client-side javascript is located in `public/js/cards.js`. This is a pretty simple/naive application, which runs through the flash card data (provided in the `src/view/flash-cards.html.hbs` template), and creates some interactive views.

Note that we're using an audio library called [`Howler.js`](http://howlerjs.com/) for playing audio files. Take a look at their docs, and especially at the sprites feature, which I'm using to play sound clips from an audio file. There may be other more advanced or easy-to-use audio libraries out there (including the native [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)), but this one worked for what I was doing.