import * as R from 'ramda';
import {
  DominoEnvironmentsApiRevisionSummary as EnvRevisionSummaryDto,
  DominoEnvironmentsApiEnvironmentDetails as EnvironmentDetails
} from '@domino/api/dist/types';
import { getBuiltEnvironmentRevisions, getEnvironmentById } from '@domino/api/dist/Environments';

export const fetchEnvironmentRevisions = async (environmentId: string, 
  setRevisions: (revision: EnvRevisionSummaryDto[]) => void) => {
    try {
      const envRevisions = await getBuiltEnvironmentRevisions({environmentId, page: 0, pageSize: 20});
      setRevisions(envRevisions.revisions);
    } catch (e) {
      console.warn(e)
    }
};

export const fetchEnvironmentById = async (environmentId: string, setEnvironment: (environment: EnvironmentDetails) => void) => {
  try {
    const environment = await getEnvironmentById({environmentId});
    setEnvironment(environment);
  } catch (e) {
    console.warn(e)
  }
}

export const ACTIVE_REVISION = 'ActiveRevision';
export const LATEST_REVISION = 'LatestRevision';

export type EnvRevision = 'ActiveRevision' | 'LatestRevision' | {
  revisionId: string
};

export const getFormattedRevision = (revision: string) => {
  return R.equals(ACTIVE_REVISION, revision) ? ACTIVE_REVISION : { revisionId: revision};
};

export const getRevisionFromFormattedRevision = (revision: EnvRevision, setSelectedRevision: (rev: string) => void,
  onChangeRevision?: (rev: EnvRevision) => void) => {
  return R.cond([
    [R.equals(ACTIVE_REVISION), () => {
      setSelectedRevision(ACTIVE_REVISION);
      onChangeRevision && onChangeRevision(ACTIVE_REVISION);
    }],
    [R.T, () => {
      setSelectedRevision(R.pathOr('', ['revisionId'], revision));
      onChangeRevision && onChangeRevision({revisionId: R.pathOr('', ['revisionId'], revision)});
    }]
  ])(revision);
}

export const getSelectedRevision = (revisions: EnvRevisionSummaryDto[], selectedRevision: string) => {
  return R.cond([
    [R.equals(ACTIVE_REVISION), R.always('Active')],
    [R.T, () => `#${R.find(revision => R.equals(revision.id, selectedRevision), revisions)?.number}`]
  ])(selectedRevision)
}

export const getRevisionType = (envRevSpec: EnvRevision) => {
  return R.cond([
    [R.equals(ACTIVE_REVISION), () => 'Active'],
    [R.T, () => 'Pinned']
  ])(envRevSpec)
}

export const updateDefaultRevisionWithSpecificVersion = (envInfo: EnvironmentDetails,
  revision: string,
  setRevision: (revision: string | undefined) => void,
  onChangeRevision?: (rev: EnvRevision) => void) => {
    R.cond([
      [R.equals(ACTIVE_REVISION), () => {
        setRevision(envInfo.selectedRevision?.id);
        onChangeRevision && envInfo.selectedRevision && onChangeRevision({revisionId: envInfo.selectedRevision.id});
      }],
      [R.T, () => {
        setRevision(revision);
        onChangeRevision && onChangeRevision({revisionId: revision});
      }]
    ])(revision);
}
