import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects';
import { getWhiteLabelConfigurations } from '@domino/api/dist/Admin';
import { DominoAdminInterfaceWhiteLabelConfigurations } from '@domino/api/dist/types';
import {
  setWhiteLabelSettings,
  setWhiteLabelSettingsFailed,
  FETCH_WHITELABEL_SETTINGS_REQUESTED,
} from './actions';

function* fetchWhiteLabelSettings() {
   try {
    const settings: DominoAdminInterfaceWhiteLabelConfigurations = yield call(getWhiteLabelConfigurations, {});
    yield put(setWhiteLabelSettings(settings));
   } catch (e) {
      console.warn(e);
      yield put(setWhiteLabelSettingsFailed(e));
   }
}

function* fetchWhiteLabelSettingsSaga(): Iterable<ForkEffect> {
  yield takeLatest(FETCH_WHITELABEL_SETTINGS_REQUESTED, fetchWhiteLabelSettings);
}

export default fetchWhiteLabelSettingsSaga;
