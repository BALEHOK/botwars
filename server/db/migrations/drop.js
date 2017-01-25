const pg = require('pg');
const connectionString = require('../connectionString');

module.exports = function () {
  const client = new pg.Client(connectionString);
  client.connect();

  let query = client.query(
    'DROP TABLE IF EXISTS dict'
  );

  query = client.query(
    'DROP TABLE IF EXISTS tournamentBots'
  );

  query = client.query(
    'DROP TABLE IF EXISTS matchBots'
  );

  query = client.query(
    'DROP TABLE IF EXISTS matches'
  );

  query = client.query(
    'DROP TABLE IF EXISTS rounds'
  );

  query = client.query(
    'DROP TABLE IF EXISTS tournaments'
  );

  query = client.query(
    'DROP TABLE IF EXISTS botVersions'
  );

  query = client.query(
    'DROP TABLE IF EXISTS bots'
  );

  query = client.query(
    'DROP TABLE IF EXISTS users'
  );

  query = client.query(
    'DROP TABLE IF EXISTS games'
  );

  return new Promise(resolve => query.on('end', () => {
    client.end();
    resolve();
  }));
}
