import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import * as actionTypes from 'actions/types';
import * as actionCreators from 'actions/creators';

import tournamentsRepository from 'repositories/tournamentsRepo';

const fetchActiveTournamentsEpic = (action$) =>
  action$.ofType(actionTypes.getActiveTournaments)
    ::mergeMap(tournamentsRepository.getActiveTournaments)
    ::map(actionCreators.getActiveTournamentsSuccess);

const fetchTournamentInfoEpic = (action$, store) =>
  action$.ofType(actionTypes.getTournamentInfo)
    ::mergeMap(action => {
      const shortName = action.payload.shortName;
      const competitors$ = tournamentsRepository.getTournamentCompetitors(shortName);

      const state = store.getState();
      const tournament = state.tournaments && state.tournaments.active[shortName];
      if (!tournament) {
        const tournament$ = tournamentsRepository.getTournament(shortName);
        return Observable::zip(tournament$, competitors$,
          (t, c) => ({ tournament: t, competitors: c }));
      }

      return competitors$.map(competitors => ({ tournament, competitors }));
    })
    ::map(data => actionCreators.getTournamentInfoSuccess(
      data.tournament,
      data.competitors
    ));

export default combineEpics(
  fetchActiveTournamentsEpic,
  fetchTournamentInfoEpic
);
