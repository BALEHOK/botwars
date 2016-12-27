const db = require('./provider');

const setQuery =
  `INSERT INTO dict (key, value)
    VALUES ($1, $2)
    ON CONFLICT (key) DO UPDATE
      SET value = $2`;

exports.set = (key, value) => {
  if (typeof key !== 'string') {
    key = key.toString();
  }

  const valueJson = JSON.stringify(value);

  return db.query(setQuery, [key, valueJson])
}

const getQuery =
  `SELECT value FROM dict
    WHERE key = $1`;

exports.get = (key) => {
  return db.query(getQuery, [key])
    .then((result, err) => {
      if (!err && result && result.rows.length && result.rows[0].value) {
        return JSON.parse(result.rows[0].value);
      }

      return null;
    });
}
