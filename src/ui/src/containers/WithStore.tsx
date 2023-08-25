import * as React from 'react';
import {
  Router,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import store from '../core/configureStore';

const history = createBrowserHistory();

const WithStore = (Component: any) => (props: any) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Component {...props} />
      </Router>
    </Provider>
  );
};

export default WithStore;
