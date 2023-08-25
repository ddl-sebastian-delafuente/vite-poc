import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { UserState } from '../../src/core/User';
import { GlobalState, initialState, configureStore } from '../../src/core/configureStore';
import rootSaga from '../../src/core/redux/index';

require('./browserMocks');

export interface TestableReduxContainerProps {
  children: JSX.Element;
  state?: UserState;
  onStoreCreate?: (store: any) => void;
}

export function configureTestStore(state?: UserState) {
  const sagaMiddleWare = createSagaMiddleware();
  const testStore: Store<{} | undefined> = configureStore({
    core: {},
    user: state || {},
  } as GlobalState, [sagaMiddleWare]);
  sagaMiddleWare.run(rootSaga);
  return testStore;
}

export const TestableReduxContainer: React.FC<TestableReduxContainerProps> = ({
  state = initialState,
  onStoreCreate,
  children,
}) => {
 const store = configureTestStore(state);
 if (onStoreCreate) {
   onStoreCreate(store);
 }
 return (
   <Provider store={store}>
     {children}
   </Provider>
 );
};

export type WithRouterAndReduxContainerProps = {
  children: React.ReactNode & JSX.Element;
};

export const WithRouterAndReduxContainer: React.FC<WithRouterAndReduxContainerProps> = props => (
  <BrowserRouter>
    <TestableReduxContainer>
      {props.children}
    </TestableReduxContainer>
  </BrowserRouter>
);
