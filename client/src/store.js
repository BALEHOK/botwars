import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from './reducers/rootReducer';

import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics/tournamentsEpics';

const loggerMiddleware = createLogger();

const epicMiddleware = createEpicMiddleware(rootEpic);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(epicMiddleware, loggerMiddleware)
  )
);
