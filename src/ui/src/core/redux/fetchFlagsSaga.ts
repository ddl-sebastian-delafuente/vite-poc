import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects';
import { getPrincipal } from '@domino/api/dist/Auth';
import { DominoNucleusLibAuthPrincipalWithFeatureFlags as PrincipalAuthType } from '@domino/api/dist/types';
import {
  setFlags,
  setFetchFlagsFailed,
  FETCH_FLAGS_REQUESTED,
} from './actions';

function* fetchFlags() {
   try {
      const principal: PrincipalAuthType = yield call(getPrincipal, {});
      yield put(setFlags(principal));
   } catch (e) {
      console.warn(e);
      yield put(setFetchFlagsFailed(e));
   }
}

function* fetchFlagsSaga(): Iterable<ForkEffect> {
  // doesn't allow concurrent fetches. Can send many actions at once to fetch flags
  // but only one fetch should happen
  yield takeLatest(FETCH_FLAGS_REQUESTED, fetchFlags);
}

export default fetchFlagsSaga;
