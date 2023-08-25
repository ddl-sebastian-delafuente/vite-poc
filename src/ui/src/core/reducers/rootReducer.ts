import { combineReducers, Reducer } from 'redux';
import coreReducer, { CoreState } from '../redux/reducer';

export interface RootState {
  core: CoreState;
}

// Noop User reducer to fix undexpected key errorsj
const userReducer = (state = {}) => state;

const rootReducer: Reducer<{}> = combineReducers({
  core: coreReducer,
  user: userReducer,
});

export default rootReducer;
