const db = require('./provider');
const uuidV4 = require('uuid/v4');


function tournamentFromRow(row) {
  return row && {
      id: row.id,
      gameId: row.gameid,
      gameShortName: row.gameshortname,
      name: row.name,
      shortName: row.shortname,
      description: row.description,
      isActive: row.isactive
    }
    || null;
}

const getActiveTournamentsQuery = `
  SELECT *
  FROM tournaments
  WHERE isActive = TRUE;`;
exports.getActiveTournaments = async function () {
  return (await db.query(getActiveTournamentsQuery))
    .rows.map(tournamentFromRow);
}

const getTournamentQuery = `
  SELECT *
  FROM tournaments
  WHERE isActive = TRUE AND shortName = $1;`;
exports.getTournament = async function (shortName) {
  return tournamentFromRow(await db.querySingleOrDefault(getTournamentQuery, [shortName]));
}

const getTournamentByIdQuery = `
  SELECT *
  FROM tournaments
  WHERE id = $1;`;
exports.getTournamentById = async function (id) {
  return tournamentFromRow(await db.querySingleOrDefault(getTournamentByIdQuery, [id]));
}

const getTournamentCompetitorsQuery = `
  SELECT u.username, bv.version, tb.score
  FROM tournaments t
    JOIN tournamentBots tb ON t.id = tb.tId
    JOIN botVersions bv ON bv.id = tb.botVersionId
    JOIN bots b ON b.id = bv.botId
    JOIN users u ON u.id = b.userId
  WHERE t.shortName = $1`;
exports.getTournamentCompetitors = async function(shortName) {
  return (await db.query(getTournamentCompetitorsQuery, [shortName])).rows;
}
