import Immutable from 'seamless-immutable';

import Reducer from './baseReducer';
import * as actionTypes from 'actions/types';

class TournamentsReducer extends Reducer {
  constructor() {
    super();

    this.defaultState = Immutable({
      active: {},
      competitors: {}
    });

    this.actionMap = {
      [actionTypes.getActiveTournamentsSuccess]: 'gotActiveTournaments',
      [actionTypes.getTournamentInfoSuccess]: 'gotTournamentInfo',
    };
  }

  gotActiveTournaments(state, action) {
    const active = {};

    action.payload.tournaments.forEach(t => active[t.shortName] = t);

    return Immutable.merge(state, {active});
  }

  gotTournamentInfo(state, action) {
    const tournament = action.payload.tournament;
    const competitors = action.payload.competitors;

    let newState = Immutable.setIn(state, ['active', tournament.shortName], tournament);
    newState = Immutable.setIn(newState, ['competitors', tournament.shortName], competitors);
    return newState;
  }
}

export default new TournamentsReducer().getReducerFn();
