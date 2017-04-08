const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:pwd@localhost:5432/postgres';
const uuidV4 = require('uuid/v4');

module.exports = function () {
  const client = new pg.Client(connectionString);
  client.connect();

  const now = (new Date()).toISOString();
  const query = client.query(
    `ALTER TABLE users
      ADD COLUMN createdAt TYPE varchar(50),
      ADD COLUMN modifiedAt TYPE varchar(50),
      ADD COLUMN passwordModifiedAt TYPE varchar(50),
      ADD COLUMN email TYPE varchar(100),
      ADD COLUMN givenName TYPE TEXT,
      ADD COLUMN surname TYPE TEXT,
      ADD COLUMN fullName TYPE TEXT,
      ADD COLUMN status TYPE varchar(10),
      ADD COLUMN href TYPE varchar(100);

    UPDATE users
      SET createdAt = "${now}",
      modifiedAt = "${now}",
      passwordModifiedAt = "${now}",
      email = username,
      fullName = username,
      status = "ENABLED";

    ALTER TABLE users
      ADD CONSTRAINT createdAt not null,
      ADD CONSTRAINT modifiedAt not null,
      ADD CONSTRAINT passwordModifiedAt not null,
      ADD CONSTRAINT email not null UNIQUE,
      ADD CONSTRAINT fullName not null,
      ADD CONSTRAINT status not null;`
  );

  return new Promise(resolve => query.on('end', () => {
    client.end();
    resolve();
  }));
}
