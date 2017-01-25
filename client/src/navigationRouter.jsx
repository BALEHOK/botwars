import React from 'react';
import { Route, browserHistory, IndexRoute } from 'react-router';
import { Router, HomeRoute, LoginRoute, AuthenticatedRoute } from 'react-stormpath';

import MasterPage from 'components/masterPage';
import Home from 'components/home';

import LoginPage from 'components/auth/login';
import RegistrationPage from 'components/auth/registrationPage';
import ProfilePage from 'components/auth/profilePage';

import Ttt3 from 'components/games/ticTacToe';
import Gomoku from 'components/games/gomoku';

import { TournamentsList, Tournament } from 'components/tournaments';

export default class NavigationRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={browserHistory}>
        <HomeRoute path="/" component={MasterPage}>

          <IndexRoute component={Home} />

          <LoginRoute path='login' component={LoginPage} />
          <Route path='register' component={RegistrationPage} />
          <AuthenticatedRoute path='profile' component={ProfilePage} />

          <Route path="games">
            <IndexRoute component={Home} />
            <Route path="ttt3" component={Ttt3} />
            <Route path="gomoku" component={Gomoku} />
          </Route>

          <Route path="tournaments">
            <IndexRoute component={TournamentsList} />

            <Route path=":shortName" component={Tournament} />
          </Route>
        </HomeRoute>
      </Router>
    );
  }
}
