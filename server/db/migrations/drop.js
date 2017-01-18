const pg = require('pg');
const connectionString = require('../connectionString');

module.exports = function () {
  const client = new pg.Client(connectionString);
  client.connect();

  let query = client.query(
    'DROP TABLE IF EXISTS dict'
  );

  query = client.query(
    'DROP TABLE IF EXISTS users'
  );

  query = client.query(
    'DROP TABLE IF EXISTS bots'
  );

  query = client.query(
    'DROP TABLE IF EXISTS botVersions'
  );

  return new Promise(resolve => query.on('end', () => {
    client.end();
    resolve();
  }));
}
