import * as actionTypes from './types';

export const getActiveTournaments = () => ({
  type: actionTypes.getActiveTournaments
});
export const getActiveTournamentsSuccess = tournaments => ({
  type: actionTypes.getActiveTournamentsSuccess,
  payload: { tournaments }
});

export const getTournamentInfo = (shortName) => ({
  type: actionTypes.getTournamentInfo,
  payload: { shortName }
});
export const getTournamentInfoSuccess = (tournament, competitors) => ({
  type: actionTypes.getTournamentInfoSuccess,
  payload: { tournament, competitors }
});


