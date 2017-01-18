import React from 'react';
import ReactDOM from 'react-dom';
import ReactStormpath from 'react-stormpath';
import { ajaxConfig } from './common/ajax';
import NavigationRouter from './navigationRouter';

const serverUrl = process.env.SERVER_URL || 'http://127.0.0.1:3001';

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

ReactDOM.render(
  <NavigationRouter />,
  document.getElementById('app')
);
