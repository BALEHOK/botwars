const db = require('./provider');
const uuidV4 = require('uuid/v4');

const getUserIdQuery =
  `SELECT id FROM users
    WHERE username = $1`;

const setUserIdQuery =
  `INSERT INTO users (id, username)
    VALUES ($1, $2)`;

exports.getUserId = (username) => {
  return db.query(getUserIdQuery, [username])
    .then((result, err) => {
      if (!err && result && result.rows.length) {
        return result.rows[0].id;
      }

      return null;
    });
}

exports.setUserId = (username) => {
  const userId = uuidV4();
  return db.query(setUserIdQuery, [userId, username])
    .then(() => userId);
}
