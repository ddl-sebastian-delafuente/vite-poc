import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects';
import { getCurrentUser } from '@domino/api/dist/Users';
import { DominoCommonUserPerson } from '@domino/api/dist/types';
import {
  setCurrentUser,
  setCurrentUserFailed,
  FETCH_CURRENT_USER_REQUESTED,
} from './actions';

function* fetchCurrentUser() {
  try {
    const user: DominoCommonUserPerson = yield call(getCurrentUser, {});
    yield put(setCurrentUser(user));
  } catch (e) {
    console.warn(e);
    yield put(setCurrentUserFailed(e));
  }
}

function* fetchCurrentUserSaga(): Iterable<ForkEffect> {
  yield takeLatest(FETCH_CURRENT_USER_REQUESTED, fetchCurrentUser);
}

export default fetchCurrentUserSaga;
