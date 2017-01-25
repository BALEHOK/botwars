const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:pwd@localhost:5432/postgres';

module.exports = function () {
  const client = new pg.Client(connectionString);
  client.connect();

  const query = client.query(
    `CREATE TABLE IF NOT EXISTS dict (
      key VARCHAR(50) PRIMARY KEY,
      valueString TEXT,
      valueInt INT);


    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username TEXT not null UNIQUE);


    CREATE TABLE IF NOT EXISTS games (
      id INT PRIMARY KEY,
      name VARCHAR(255) not null,
      shortName VARCHAR(20) not null UNIQUE,
      description TEXT);

    INSERT INTO games (id, name, shortName)
      VALUES (-1, 'Tic Tac Toe', 'ttt3');

    INSERT INTO games (id, name, shortName)
      VALUES (10, 'Gomoku', 'gomoku');

    CREATE TABLE IF NOT EXISTS bots (
      id UUID PRIMARY KEY,
      userId UUID not null REFERENCES users,
      gameId INT not null REFERENCES games,
      activeVersion INT not null);


    CREATE TABLE IF NOT EXISTS botVersions (
      id UUID PRIMARY KEY,
      botId UUID not null REFERENCES bots,
      version INT not null,
      source TEXT not null);`
  );

  return new Promise(resolve => query.on('end', () => {
    client.end();
    resolve();
  }));
}
