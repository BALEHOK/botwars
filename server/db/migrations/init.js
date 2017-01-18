const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:pwd@localhost:5432/postgres';

module.exports = function () {
  const client = new pg.Client(connectionString);
  client.connect();

  let query = client.query(
    `CREATE TABLE IF NOT EXISTS dict (
      key VARCHAR(50) PRIMARY KEY,
      valueString TEXT,
      valueInt int)`
  );

  query = client.query(
    `CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      username TEXT not null UNIQUE)`
  );

  query = client.query(
    `CREATE TABLE IF NOT EXISTS bots (
      id uuid PRIMARY KEY,
      userId uuid not null,
      gameId int not null,
      activeVersion int not null)`
  );

  query = client.query(
    `CREATE TABLE IF NOT EXISTS botVersions (
      id uuid PRIMARY KEY,
      botId uuid not null,
      version int not null,
      source TEXT not null)`
  );

  return new Promise(resolve => query.on('end', () => {
    client.end();
    resolve();
  }));
}
