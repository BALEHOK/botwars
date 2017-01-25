const db = require('./provider');
const uuidV4 = require('uuid/v4');


// ToDo: refactore insertion of match bots, transaction
const addRoundQuery = `
  INSERT INTO rounds
    (id, tId, roundNum, datetimestart)
  (
    SELECT $1, $2, coalesce(max(roundNum),0) + 1, $3
    FROM rounds
    WHERE tId = $2
  );`;
exports.startRound = async function (tournamentId, timeStart) {
  const roundId = uuidV4();
  await db.query(addRoundQuery, [roundId, tournamentId, timeStart])
  return roundId;
};

const updateRoundDurationQuery = `
  UPDATE rounds
  SET duration = $2
  WHERE id = $1;`;
exports.finishRound = async function(roundId, duration) {
  await db.query(updateRoundDurationQuery, [roundId, duration]);
};

const addMatchQuery = `
  INSERT INTO matches
    (id, roundId, dateTimeStart, duration, matchlog)
  VALUES
    ($1, $2, $3, $4, $5);`;
const addMatchBotQuery = `
  INSERT INTO matchBots
    (id, matchId, botVersionId, matchScore)
  VALUES
    ($1, $2, $3, $4);`;
const addTournamentBotQuery = `
  INSERT INTO tournamentBots
    (id, tId, botVersionId, score, win, draw, loss)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT (tId, botVersionId) DO UPDATE
    SET
      score = tournamentBots.score + excluded.score,
      win = tournamentBots.win + excluded.win,
      loss = tournamentBots.loss + excluded.loss;`;
exports.addMatch = async function (match) {
  const matchId = uuidV4();
  await db.query(addMatchQuery, [matchId, match.roundId, match.timeStart, match.duration, match.log]);
  await Promise.all(
    match.bots.map(
      b => Promise.all([
        db.query(addMatchBotQuery, [uuidV4(), matchId, b.versionId, b.matchScore]),
        db.query(addTournamentBotQuery, [
          uuidV4(), match.tId, b.versionId, b.matchResultScore,
          b.matchResultScore === 2 && 1 || 0,
          b.matchResultScore === 1 && 1 || 0,
          b.matchResultScore === 0 && 1 || 0
        ])
      ])
    )
  );
};
