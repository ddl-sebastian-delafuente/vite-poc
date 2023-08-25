import { F, ifElse, isNil, compose, prop, contains, find, propEq } from 'ramda';

import { DominoServerProjectsApiProjectGatewayOverview as Project } from '@domino/api/dist/types';
import { DominoProjectsApiProjectStage as ProjectStage } from '@domino/api/dist/types';

export const canUserEditProject: (project?: Project) => boolean =
  ifElse(isNil, F, compose(contains('Edit'), prop('allowedOperations')));

export const getStageById = (stageId: string, projectStages?: ProjectStage[]): undefined | ProjectStage =>
  projectStages ? find(propEq('id', stageId), projectStages) : undefined;

export const canUserSeeProject: (project?: Project) => boolean =
  ifElse(isNil, F, compose(contains('BrowseReadFiles'), prop('allowedOperations')));
