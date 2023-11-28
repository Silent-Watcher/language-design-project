'use strict';
const mysql = require('mysql2');
// Create the connection pool. The pool-specific settings are the defaults
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'tasks',
  password: '',
});

module.exports = db.promise();

