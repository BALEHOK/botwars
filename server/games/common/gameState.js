module.exports = class GameState {
  constructor(gameStateEnum, data, result = null, error = null) {
    this.state = gameStateEnum;
    this.data = data;
    this.result = result;
    this.error = error;
  }
}
