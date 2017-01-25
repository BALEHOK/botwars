import { combineReducers } from 'redux';
import tournamentsReducer from './tournamentsReducer';

export default combineReducers({
  tournaments: tournamentsReducer
});
