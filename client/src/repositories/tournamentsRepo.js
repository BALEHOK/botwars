import { ajax } from 'common/ajaxRx';

class TournamentsRepository {
  getActiveTournaments() {
    return ajax.get('/tournaments');
  }

  getTournament(shortName) {
    return ajax.get(`/tournaments/${shortName}`);
  }

  getTournamentCompetitors(shortName) {
    return ajax.get(`/tournaments/${shortName}/competitors`);
  }
}

export default new TournamentsRepository();
