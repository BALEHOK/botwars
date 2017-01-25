import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class TournamentListItem extends React.PureComponent {
  static propTypes = {
    tournament: PropTypes.object.isRequired
  };

  render() {
    const t = this.props.tournament;
    return (
      <Link to={'/tournaments/' + t.shortName} className="list-group-item">
        <h4 className="list-group-item-heading">{t.name}</h4>
        <p className="list-group-item-text">{t.description}</p>
      </Link>
    );
  }
}
