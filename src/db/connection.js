var mysql = require('mysql');
var dbConf = require('../config/db.local.json');
var Promise = require('es6-promise').Promise;

/**
 * We're using the node-mysql library here:
 * https://github.com/felixge/node-mysql/
 */

var connection = mysql.createConnection(dbConf);

connection.connect();

/**
 * Wrapping `connection.query` in a Promise.
 * A Promise represents an asynchronous value,
 * and is a very common construct in modern javascript.
 * There's a ton of docs online about javascript Promises.
 * Start with this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
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