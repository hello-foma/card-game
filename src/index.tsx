import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';

import rootSaga from './saga';
import rootReducer from './store';
import RootRoutes from './routes';
import { HistoryRouter } from 'redux-first-history/rr6';

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    ...rootReducer
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false })
      .concat(sagaMiddleware)
      .concat(routerMiddleware),
  devTools: import.meta.env.DEV,
});

const history = createReduxHistory(store);

sagaMiddleware.run(rootSaga);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={history}>
        <RootRoutes />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>
)
