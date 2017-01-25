import { Subject } from 'rxjs/Subject';

import { GameStateEnum } from 'common/ENUM';
import GameState from 'common/gameState';

const signs = ['X', 'O'];
const stonesToWin = 5;
const fieldSize = 19;
const maxStepsNum = fieldSize * fieldSize;

export default class Engine {
  constructor() {
    let stateSubject = new Subject();
    this.gameStream = stateSubject.asObservable();
    this._stateSubject = stateSubject;

    stateSubject.next(new GameState(GameStateEnum.notStarted));
  }

  start(bot1, bot2) {
    let field = [];
    for (let i = 0; i !== fieldSize; i++) {
      let row = [];
      for (let j = 0; j !== fieldSize; j++) {
        row[j] = '.';
      }

      field[i] = row;
    }

    this._stateSubject.next(new GameState(GameStateEnum.playing, field));

    let bots = [bot1, bot2];

    stepAsync(0, bots, field, this._stateSubject);
  }

  stop() {
    this._stateSubject.complete();
  }
}

// stepNum - zero based number of the step
function stepAsync(stepNum, bots, field, stateSubject) {
  return setTimeout(() => step(stepNum, bots, field, stateSubject), 0);
}

function step(stepNum, bots, field, stateSubject) {
  let botIndex = stepNum % 2;
  let sign = signs[botIndex];
  let move = bots[botIndex].main(field, sign);

  // check for wrong move
  if (move[0] < 0 || move[0] >= fieldSize
    || move[1] < 0 || move[1] >= fieldSize
    || field[move[1]][move[0]] !== '.'
  ) {
    stateSubject.next(new GameState(GameStateEnum.finished, field, signs[Number(!botIndex)] + ' win', sign + ' returned error move'));
    return;
  }

  field[move[1]][move[0]] = sign;

  if (hasWon(sign, move, field)) {
    stateSubject.next(new GameState(GameStateEnum.finished, field, sign + ' win'));
    return;
  }

  stateSubject.next(new GameState(GameStateEnum.playing, field));

  if (++stepNum === maxStepsNum) {
    stateSubject.next(new GameState(GameStateEnum.finished, field, 'draw'));
  } else {
    stepAsync(stepNum, bots, field, stateSubject);
  }
}

function hasWon(sign, move, field) {
  return checkHorizontal()
    || checkVertical()
    || checkDiagonalDR()
    || checkDiagonalDL();

  function checkHorizontal() {
    const startX = Math.max(0, move[0] - stonesToWin + 1);
    const endX = Math.min(field.length, move[0] + stonesToWin - 1);
    const row = field[move[1]];
    let consecutiveSignesCount = 0;
    for (let x = startX; x <= endX && consecutiveSignesCount < stonesToWin; ++x) {
      if (row[x] === sign) {
        ++consecutiveSignesCount;
      } else {
        consecutiveSignesCount = 0;
      }
    }

    return consecutiveSignesCount === stonesToWin;
  }

  function checkVertical() {
    const startY = Math.max(0, move[1] - stonesToWin + 1);
    const endY = Math.min(field.length, move[1] + stonesToWin - 1);
    let consecutiveSignesCount = 0;
    for (let x = move[0], y = startY; y <= endY && consecutiveSignesCount < stonesToWin; ++y) {
      if (field[y][x] === sign) {
        ++consecutiveSignesCount;
      } else {
        consecutiveSignesCount = 0;
      }
    }

    return consecutiveSignesCount === stonesToWin;
  }

  function checkDiagonalDR() {
    const moveX = move[0];
    const moveY = move[1];

    let startX = Math.max(0, moveX - stonesToWin + 1);
    let startY = Math.max(0, moveY - stonesToWin + 1);

    let xDiff = moveX - startX;
    let yDiff = moveY - startY;
    if (xDiff < yDiff) {
      startY = moveY - xDiff;
    } else if (xDiff > yDiff) {
      startX = moveX - yDiff;
    }

    let endX = Math.min(field.length, moveX + stonesToWin - 1);
    let endY = Math.min(field.length, moveY + stonesToWin - 1);

    xDiff = endX - moveX;
    yDiff = endY - moveY;
    if (xDiff < yDiff) {
      endY = moveY + xDiff;
    } else if (xDiff > yDiff) {
      endX = moveX + yDiff;
    }

    let consecutiveSignesCount = 0;
    for (let x = startX, y = startY; x <= endX && y <= endY && consecutiveSignesCount < stonesToWin; ++x, ++y) {
      if (field[y][x] === sign) {
        ++consecutiveSignesCount;
      } else {
        consecutiveSignesCount = 0;
      }
    }

    return consecutiveSignesCount === stonesToWin;
  }

  function checkDiagonalDL() {
    const moveX = move[0];
    const moveY = move[1];

    let startX = Math.min(field.length, moveX + stonesToWin - 1);
    let startY = Math.max(0, moveY - stonesToWin + 1);

    let xDiff = startX - moveX;
    let yDiff = moveY - startY;
    if (xDiff < yDiff) {
      startY = moveY - xDiff;
    } else if (xDiff > yDiff) {
      startX = moveX + yDiff;
    }

    let endX = Math.max(0, moveX - stonesToWin + 1);
    let endY = Math.min(field.length, moveY + stonesToWin - 1);

    xDiff = moveX - endX;
    yDiff = endY - moveY;
    if (xDiff < yDiff) {
      endY = moveY + xDiff;
    } else if (xDiff > yDiff) {
      endX = moveX - yDiff;
    }

    let consecutiveSignesCount = 0;
    for (let x = startX, y = startY; x >= endX && y <= endY && consecutiveSignesCount < stonesToWin; --x, ++y) {
      if (field[y][x] === sign) {
        ++consecutiveSignesCount;
      } else {
        consecutiveSignesCount = 0;
      }
    }

    return consecutiveSignesCount === stonesToWin;
  }
}
