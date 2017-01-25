const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:pwd@localhost:5432/postgres';
const uuidV4 = require('uuid/v4');

module.exports = function () {
  const client = new pg.Client(connectionString);
  client.connect();

  const gomokuTournamentId = uuidV4();

  const query = client.query(
    `CREATE TABLE IF NOT EXISTS tournaments (
      id UUID PRIMARY KEY,
      gameId INT not null REFERENCES games,
      gameShortName VARCHAR(20) not null UNIQUE,
      name VARCHAR(255) not null,
      shortName VARCHAR(20) not null,
      description TEXT,
      isActive BOOLEAN not null DEFAULT TRUE);

    INSERT INTO tournaments (id, gameId, gameShortName, name, shortName, description)
      VALUES ('${gomokuTournamentId}', 10, 'gomoku', 'Gomoku tournament', 'gomoku', 'The very first tournament. Will last forever ]:D');

    CREATE TABLE IF NOT EXISTS rounds (
      id UUID PRIMARY KEY,
      tId UUID not null REFERENCES tournaments,
      roundNum INT not null,
      datetimeStart TIMESTAMP not null DEFAULT (now() at time zone 'utc'),
      duration INT,

      UNIQUE (tId, roundNum));

    CREATE TABLE IF NOT EXISTS matches (
      id UUID PRIMARY KEY,
      roundId UUID not null REFERENCES rounds,
      datetimeStart TIMESTAMP not null DEFAULT (now() at time zone 'utc'),
      duration INT,
      matchLog JSON);

    CREATE TABLE IF NOT EXISTS matchBots (
      id UUID PRIMARY KEY,
      matchId UUID not null REFERENCES matches,
      botVersionId UUID not null REFERENCES botVersions,
      matchScore NUMERIC not null DEFAULT 0,

      UNIQUE (matchId, botVersionId));

    CREATE TABLE IF NOT EXISTS tournamentBots (
      id UUID PRIMARY KEY,
      tId UUID not null REFERENCES tournaments,
      botVersionId UUID not null REFERENCES botVersions,
      score NUMERIC not null DEFAULT 0,
      win INT not null DEFAULT 0,
      draw INT not null DEFAULT 0,
      loss INT not null DEFAULT 0,

      UNIQUE (tId, botVersionId));`
  );

  return new Promise(resolve => query.on('end', () => {
    client.end();
    resolve();
  }));
}
