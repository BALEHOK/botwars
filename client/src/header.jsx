import React from 'react';
import { Link } from 'react-router';
import { LoginLink, LogoutLink, Authenticated, NotAuthenticated } from 'react-stormpath';
import classnames from 'classnames';

export default class Header extends React.Component {
  static contextTypes = {
    authenticated: React.PropTypes.bool,
    user: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      navShown: false
    };
  }

  toggleNav = () => {
    this.setState({
      navShown: !this.state.navShown
    });
  }

  render() {
    const username = this.context.authenticated ? this.context.user.fullName : '';

    const navClass = classnames('collapse navbar-collapse', { in: this.state.navShown });

    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">

          <div className="navbar-header">
            <button className="navbar-toggle collapsed" onClick={this.toggleNav}>
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">Bot Wars</Link>
          </div>

          <div className={navClass}>
            <ul className="nav navbar-nav">
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <NotAuthenticated>
                <li>
                  <LoginLink />
                </li>
              </NotAuthenticated>
              <NotAuthenticated>
                <li>
                  <Link to="/register">Create Account</Link>
                </li>
              </NotAuthenticated>
              <Authenticated>
                <li>
                  <Link to="/profile">{username}</Link>
                </li>
              </Authenticated>
              <Authenticated>
                <li>
                  <LogoutLink />
                </li>
              </Authenticated>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
