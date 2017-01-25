const tournamentsRepo = require('../db/tournamentsRepo');
const botsRepo = require('../db/botsRepo');
const matchRepo = require('../db/matchRepo');
const BotFactory = require('./common/botFactory');
const GameStateEnum = require('./common/ENUM').GameStateEnum;

class Runner {
  constructor() {
    this.roundLoop = this.roundLoop.bind(this);
    this.roundQueue = [];
    this.state = 0;
    this.roundLoopTimeout = -1;
  }

  start() {
    this.state = 1;
    this.scheduleLoop();
  }

  stop() {
    this.state = 0;
    clearTimeout(this.roundLoopTimeout);
  }

  async push(tournamentShortName) {
    const tournament = await tournamentsRepo.getTournament(tournamentShortName);
    if (tournament) {
      this.roundQueue.push(tournament.id);
      console.log('queued tournament', tournament.id, tournament.shortName);
    }
  }

  getInfo() {
    return {
      queueLength: this.roundQueue.length
    };
  }

  async roundLoop() {
    console.log('inner loop start');
    const startTime = process.hrtime();
    try {
      await this.innerLoop();
    } catch (e) {
      console.log('round loop failed');
      console.log(e);
    }
    const duration = process.hrtime(startTime);
    console.log(`inner loop finished in ${duration[0]}s ${duration[1]/1e3 | 0} mks`);
    this.scheduleLoop();
  }

  async innerLoop() {
    if (!this.roundQueue.length) {
      return;
    }

    const tId = this.roundQueue.pop();

    const tournament = await tournamentsRepo.getTournamentById(tId);
    console.log('tournament:', tournament);

    if (!tournament) {
      return;
    }

    const botsInTournament = await botsRepo.getBotsForGame(tournament.gameId);
    console.log('bots.length', botsInTournament.length);

    if (botsInTournament.length < 2) {
      return;
    }

    const Engine = require(`./common/games/${tournament.gameShortName}/engine`);
    const eng = new Engine();
    const matchLog = [];
    let i = 0, j = 1;
    let bots = [botsInTournament[i], botsInTournament[j]];

    const roundTimeStart = new Date();
    const roundId = await matchRepo.startRound(tournament.id, roundTimeStart);

    let subscription;
    await new Promise((res, rej) => {
      subscription = eng.gameStream.subscribe(processStep, e => rej(e));
      let matchTimeStart;
      startMatch();

      function processStep(gameState) {
        if (gameState.state === GameStateEnum.playing) {
          matchLog.push(gameState.data)
        } else if (gameState.state === GameStateEnum.finished) {
          const {scores, winnerIndex} = gameState.result;

          const match = {
            tId: tournament.id,
            roundId,
            timeStart: matchTimeStart,
            duration: (new Date()).getTime() - matchTimeStart.getTime(),
            log: JSON.stringify(matchLog),
            bots: bots.map((b, i) => ({
              versionId: b.versionId,
              matchScore: scores[i],
              matchResultScore: winnerIndex === i && 2
              || winnerIndex === -1 && 1
              || 0
            }))
          };

          matchRepo.addMatch(match);

          // охуительнейший цикл!
          // суть - хотим чтобы боты сыграли каждый с каждым по 2 раза: ходили первыми по очереди
          if (j < botsInTournament.length - 1 && j + 1 !== i) {
            ++j;
            bots[1] = botsInTournament[j];
            startMatch();
          } else if (j < botsInTournament.length - 2 && j + 1 === i) {
            j += 2;
            bots[1] = botsInTournament[j];
            startMatch();
          } else if (i < botsInTournament.length - 1) {
            ++i;
            j = 0;
            bots = [botsInTournament[i], botsInTournament[j]];
            startMatch();
          } else {
            subscription.unsubscribe();
            eng.stop();
            console.log('match played');
            res();
          }
        }
      }

      function startMatch() {
        matchTimeStart = new Date();
        eng.start(BotFactory.Create(bots[0].source), BotFactory.Create(bots[1].source));
      }
    });

    await matchRepo.finishRound(roundId, (new Date()).getTime() - roundTimeStart.getTime());
  }

  scheduleLoop() {
    if (!this.state) {
      return;
    }

    this.roundLoopTimeout = setTimeout(this.roundLoop, 10000);
  }
}
module.exports = Runner;
