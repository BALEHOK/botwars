import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import Tournament from './tournament';
import { getTournamentInfo } from 'actions/creators';

function mapStateToProps(state, ownProps) {
  const shortName = ownProps.params.shortName;
  return {
    tournament: state.tournaments.active[shortName],
    competitors: state.tournaments.competitors[shortName]
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getTournamentInfo}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tournament);
