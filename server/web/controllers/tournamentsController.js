const router = require('express').Router();
const stormpath = require('express-stormpath');
const tournamentsRepo = require('../../db/tournamentsRepo');

router.get('/', async (req, res) => {
  const tournaments = await tournamentsRepo.getActiveTournaments();
  res.json(tournaments);
  res.end();
});

router.get('/:shortName', async (req, res) => {
  const shortName = req.params.shortName;

  res.json(await tournamentsRepo.getTournament(shortName));
  res.end();
});

router.get('/:shortName/competitors', async (req, res) => {
  const shortName = req.params.shortName;

  res.json(await tournamentsRepo.getTournamentCompetitors(shortName));
  res.end();
});

module.exports = router;
