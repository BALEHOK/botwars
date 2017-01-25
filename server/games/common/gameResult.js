module.exports = class GameResult {
  constructor(message, scores, winnerIndex) {
    this.message = message;
    this.scores = scores;
    this.winnerIndex = winnerIndex;
  }
}
