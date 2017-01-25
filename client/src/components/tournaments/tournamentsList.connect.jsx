import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import TournamentsList from './tournamentsList';
import { getActiveTournaments } from 'actions/creators';

function mapStateToProps(state) {
  return { tournaments: Object.values(state.tournaments.active) };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getActiveTournaments}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(TournamentsList);
