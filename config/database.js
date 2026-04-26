const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'testdb',
  port: 3306
};

function createConnection() {
  return mysql.createConnection(dbConfig);
}

module.exports = { createConnection, dbConfig };
