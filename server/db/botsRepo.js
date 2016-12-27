const db = require('./provider');
const uuidV4 = require('uuid/v4');

const getActiveBotQuery = `
  SELECT b.id, b.userId, b.gameId, bV.version, bV.source
  FROM bots b INNER JOIN botVersions bV
    ON b.id = bV.botId AND b.activeVersion = bV.version
  WHERE b.userId = $1 AND b.gameId = $2;`;

exports.getActiveBot = function (userId, gameId) {
  return db.query(getActiveBotQuery, [userId, gameId])
    .then((result) => {
      if (result && result.rows.length) {
        const row = result.rows[0];
        return row;
      }

      return null;
    });
}

// todo transaction
const getExistingBotInfo = `
  SELECT b.id, MAX(bV.version) as maxVersion
  FROM bots b INNER JOIN botVersions bV
    ON b.id = bV.botId AND b.activeVersion = bV.version
  WHERE userId = $1 AND gameId = $2
  GROUP BY b.id;`;

const updateBotVersion = `
  UPDATE bots
  SET activeVersion = $1;`;

const addNewBot = `
  INSERT INTO bots VALUES
    ($1, $2, $3, $4);`;

const addBotVersion = `
  INSERT INTO botVersions VALUES
    ($1, $2, $3, $4);`;

exports.saveBot = async function (userId, gameId, source) {
  let existingBotInfoRes = await db.querySingleOrDefault(getExistingBotInfo, [userId, gameId]);
  let botInfo;
  if (existingBotInfoRes.rows.length) {
    botInfo = existingBotInfoRes.rows[0];

    botInfo.version = botInfo.maxversion + 1;

    await db.query(updateBotVersion, [botInfo.version]);
  } else {
    botInfo = {
      id: uuidV4(),
      version: 1
    };

    await db.query(addNewBot, [botInfo.id, userId, gameId, botInfo.version]);
  }

  await db.query(addBotVersion, [uuidV4(), botInfo.id, botInfo.version, source]);
}
