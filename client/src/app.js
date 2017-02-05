import React from 'react';
import ReactDOM from 'react-dom';
import ReactStormpath from 'react-stormpath';
import { Provider } from 'react-redux';
import store from './store';
import { ajaxConfig } from './common/ajax';
import NavigationRouter from './navigationRouter';

const serverUrl = API_URL || 'http://127.0.0.1:3001';

ajaxConfig({apiUrl: serverUrl});

ReactStormpath.init({
  endpoints: {
    me: `${serverUrl}/me`,
    login: `${serverUrl}/login`,
    register: `${serverUrl}/register`,
    verifyEmail: `${serverUrl}/verify`,
    forgotPassword: `${serverUrl}/forgot`,
    changePassword: `${serverUrl}/change`,
    logout: `${serverUrl}/logout`
  }
});

const appComponent = (
  <Provider store={store}>
    <NavigationRouter />
  </Provider>
);

ReactDOM.render(
  appComponent,
  document.getElementById('app')
);
