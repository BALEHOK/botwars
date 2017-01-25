const router = require('express').Router();
const stormpath = require('express-stormpath');
const botsRepo = require('../../db/botsRepo');

router.get('/', stormpath.loginRequired, async (req, res) => {
  const userId = req.user.userId;
  const gameId = req.query.gameId;
  const bot = await botsRepo.getActiveBot(userId, gameId);
  res.json(bot && { botSource: bot.source } || null);
  res.end();
});

router.post('/', stormpath.loginRequired, (req, res) => {
  const userId = req.user.userId;
  const gameId = req.body.gameId;
  const botSource = req.body.botSource;
  botsRepo.saveBot(userId, gameId, botSource)
    .then(() => res.end());
});

module.exports = router;
