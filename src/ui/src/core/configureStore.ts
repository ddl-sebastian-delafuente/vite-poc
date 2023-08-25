import { createStore, applyMiddleware, compose, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';

import { UserState } from './User';
import { CoreState } from './redux/reducer';
import rootSaga from './redux';

export type GlobalState = { core: CoreState; } & UserState;

const sagaMiddleWare = createSagaMiddleware();

export const initialState = {core: {}, user: {} } as GlobalState;
// This is added to allow better debugging with redux devtools
// https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  }) : compose;

export const configureStore = (state?: GlobalState, middleware: any[] = [sagaMiddleWare]): Store<{} | undefined> =>
  createStore(rootReducer, state, composeEnhancers(applyMiddleware(...middleware)));

export const store = configureStore(initialState);

sagaMiddleWare.run(rootSaga);

export default store;
