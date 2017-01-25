import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Loader from '../common/loader';

export default class TournamentsList extends React.PureComponent {
  static propTypes = {
    tournament: PropTypes.object,
    competitors: PropTypes.array,
    getTournamentInfo: PropTypes.func.isRequired
  }
  componentDidMount() {
    const tournamentShortName = this.props.params.shortName;
    tournamentShortName && this.props.getTournamentInfo(tournamentShortName);
  }

  render() {
    const t = this.props.tournament;
    if (!t) {
      return <Loader />;
    }

    const competitors = this.props.competitors && this.props.competitors.map((c, i) => (
        <div key={i} className="list-group-item">
          <h4 className="list-group-item-heading">{c.name}</h4>
          <p className="list-group-item-text">User: {c.username}</p>
          <p className="list-group-item-text">Score: {c.score}</p>
        </div>
      ))
      || null;

    return (
      <div className="container">
        <div className="row">
          <div className="page-header">
            <h1 className="text-muted">{t.name}</h1>
          </div>
        </div>
        <div className="row">
        { competitors
          ? (
            <div className="list-group">
              {competitors}
            </div>
          ) : (
            <div className="col-sm-12">
              No matches played yet
            </div>
          )
        }
        </div>
      </div >
    );
  }
}
