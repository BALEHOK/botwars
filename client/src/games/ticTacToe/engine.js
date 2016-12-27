import { Subject } from 'rxjs/Subject';

import { GameStateEnum } from '../../common/ENUM';
import GameState from '../../common/gameState';

let signs = ['X', 'O'];
export default class Engine {
  constructor(){
    let stateSubject = new Subject();
    this.gameStream = stateSubject.asObservable();
    this._stateSubject = stateSubject;

    stateSubject.next(new GameState(GameStateEnum.notStarted));
  }

  start(bot1, bot2) {
    let field = [];
    for (let i = 0; i !== 3; i++) {
      let row = [];
      for (let j = 0; j !== 3; j++) {
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
  field[move[1]][move[0]] = sign;

  if (stepNum === 8)  {
    stateSubject.next(new GameState(GameStateEnum.finished, field, 'draw'));
    // stateSubject.complete();
    return;
  } else if (move[0] < 0 || move[0] > 2
    || move[1] < 0 || move[1] > 2
  )  {
    stateSubject.next(new GameState(GameStateEnum.finished, field, signs[Number(!botIndex)] + ' win', sign + ' returned error move'));
    // stateSubject.complete();
    return;
  }
  if (hasWon(sign, field)
  )  {
    stateSubject.next(new GameState(GameStateEnum.finished, field, sign + ' win'));
    // stateSubject.complete();
    return;
  }

  stateSubject.next(new GameState(GameStateEnum.playing, field));

  stepAsync(stepNum + 1, bots, field, stateSubject);
}

function hasWon(sign, field) {
  return checkHorizontal(0, 0, 3)
    || checkHorizontal(1, 0, 3)
    || checkHorizontal(2, 0, 3)
    || checkVertical(0, 0, 3)
    || checkVertical(1, 0, 3)
    || checkVertical(2, 0, 3)
    || checkDiagonalDR(0, 0, 3)
    || checkDiagonalDL(2, 0, 3);

  function checkHorizontal(y, startX, length) {
    let row = field[y];
    for (let x = startX; x !== startX+length; x++) {
      if (row[x] !== sign) {
        return false;
      }
    }

    return true;
  }

  function checkVertical(x, startY, length) {
    for (let y = startY; y !== startY+length; y++) {
      if (field[y][x] !== sign) {
        return false;
      }
    }

    return true;
  }

  function checkDiagonalDR(startX, startY, length) {
    for (let i = 0, x = startX, y = startY; i !== length; i++, x++, y++) {
      if (field[y][x] !== sign) {
        return false;
      }
    }

    return true;
  }

  function checkDiagonalDL(startX, startY, length) {
    for (let i = 0, x = startX, y = startY; i !== length; i++, x--, y++) {
      if (field[y][x] !== sign) {
        return false;
      }
    }

    return true;
  }
}
