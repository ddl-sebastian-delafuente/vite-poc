import { all, ForkEffect, GenericAllEffect } from 'redux-saga/effects';
import fetchFlagsSaga from './fetchFlagsSaga';
import fetchProjectSaga from './fetchProject';
import fetchwhiteLabelSettingsSaga from './fetchWhiteLabelSettings';
import fetchCurrentUserSaga from './fetchCurrentUser';

export default function* rootSaga(): IterableIterator<GenericAllEffect<Iterable<ForkEffect>>> {
  yield all([
    fetchFlagsSaga(),
    fetchProjectSaga(),
    fetchwhiteLabelSettingsSaga(),
    fetchCurrentUserSaga()
  ]);
}
