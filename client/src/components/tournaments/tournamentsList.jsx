import React from 'react';
import TournamentsListItem from './tournamentListItem';

export default class TournamentsList extends React.PureComponent {
  componentDidMount() {
    this.props.getActiveTournaments();
  }

  render() {
    const tournaments = this.props.tournaments
      .map(t => <TournamentsListItem key={t.id} tournament={t} />);

    return (
      <div className="container">
        <div className="row">
          <div className="page-header">
            <h1 className="text-muted">Tournaments</h1>
          </div>
        </div>
        <div className="row">
          <div className="list-group">
            {tournaments}
          </div>
        </div>
      </div >
    );
  }
}
