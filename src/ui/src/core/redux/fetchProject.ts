import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects';
import { match, matchPath } from 'react-router';
import { findProjectByOwnerAndName } from '@domino/api/dist/Gateway';
import { getCurrentProjectStageAndStatus } from '@domino/api/dist/Projects';
import {
  DominoProjectsApiProjectStageAndStatus,
  DominoServerProjectsApiProjectGatewayOverview
} from '@domino/api/dist/types';
import {
  FETCH_PROJECT_REQUESTED,
  setProject,
  setFetchProjectFailed,
  setProjectStageAndStatus
} from './actions';
import { findMatchedRoute, getInRoutes } from '../../navbar/routes';

export interface Params {
  ownerName: string;
  projectName: string;
}

function* fetchProject() {
  const matchResult = getMatchResult();
  let userInfo: DominoServerProjectsApiProjectGatewayOverview;
  if (matchResult) {
    const { ownerName, projectName } = matchResult.params;
    if (ownerName && projectName) {
      try {
        userInfo = yield call(findProjectByOwnerAndName, {
          ownerName,
          projectName,
        });
        if (userInfo) {
          yield put(setProject(userInfo));
          const projectStageAndStatus: DominoProjectsApiProjectStageAndStatus =
            yield call(getCurrentProjectStageAndStatus, { projectId: userInfo.id });
          yield put(setProjectStageAndStatus(projectStageAndStatus));
        }
      } catch (err) {
        console.warn(err);
        yield put(setFetchProjectFailed(err));
      }
    }
  } else {
    console.warn('ownerName and projectName don\'t exist as location match props');
  }
}

export function getMatchResult(context?: { location: { pathname: string } }): match<Params> | null {
  const pathname = (context || window).location.pathname;
  const matchedPath = findMatchedRoute(pathname);
  if (matchedPath) {
    const matchedRoute = getInRoutes(matchedPath);

    if (matchedRoute) {
      return matchPath(pathname, {
        path: matchedRoute.matchingPattern,
        exact: matchedRoute.exactMatch,
        strict: false
      });
    }
  }
  return null;
}

function* fetchProjectSaga(): Iterable<ForkEffect> {
  yield takeLatest(FETCH_PROJECT_REQUESTED, fetchProject);
}

export default fetchProjectSaga;
