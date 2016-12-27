import { ajax } from '../common/ajax';

class BotsRepository {
  get(gameId) {
    return ajax.get('/bots', { gameId });
  }
  save(gameId, botSource) {
    return ajax.post('/bots', { gameId, botSource });
  }
}

export default new BotsRepository();
