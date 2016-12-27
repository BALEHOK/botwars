import React from 'react';
import { Route, browserHistory, IndexRoute } from 'react-router';
import { Router, HomeRoute, LoginRoute, AuthenticatedRoute } from 'react-stormpath';

import MasterPage from './masterPage';
import Home from './home';
import LoginPage from './login';
import RegistrationPage from './registrationPage';
import ProfilePage from './profilePage';
import Ttt3 from './games/ticTacToe';
import Gomoku from './games/gomoku';

export default class NavigationRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={browserHistory}>
        <HomeRoute path="/" component={MasterPage}>

          <IndexRoute component={Home} />

          <LoginRoute path='/login' component={LoginPage} />
          <Route path='/register' component={RegistrationPage} />
          <AuthenticatedRoute path='/profile' component={ProfilePage} />

          <Route path="/ttt3" component={Ttt3} />
          <Route path="/gomoku" component={Gomoku} />
        </HomeRoute>
      </Router>
    );
  }
}
