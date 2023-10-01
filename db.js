// db.js
const mysql = require('mysql');

const dbConfig = {
  host: 'bae9whvtilwmhtv3ty3a-mysql.services.clever-cloud.com',
  user: 'utxkg2wdr9ylxioi',
  password: 'Np6KmOYA4LRAUnPjP3ih',
  database: 'bae9whvtilwmhtv3ty3a'
};

const pool = mysql.createPool(dbConfig);

module.exports = {
  query: (query, params, callback) => {
    pool.query(query, params, callback);
  },
  close: () => {
    pool.end();
  }
};
