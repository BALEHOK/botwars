const pg = require('pg');
const connectionString = require('../connectionString');

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

query.on('end', () => { client.end(); });
