var mysql = require('mysql');
var dbConf = require('../config/db.local.json');
var Promise = require('es6-promise').Promise;

var connection = mysql.createConnection(dbConf);

connection.connect();

// have query method return a promise
var queryOrig = connection.query;
connection.query = function(sql, cb) {
  return new Promise(function(resolve, reject) {
    queryOrig.call(this, sql, function(err, rows, fields) {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    })
  }.bind(this));
};

module.exports = connection;