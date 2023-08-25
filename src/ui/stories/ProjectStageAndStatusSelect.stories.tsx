import * as React from 'react';
import * as R from 'ramda';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import fetchMock from 'fetch-mock';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectStage,
  DominoProjectsApiProjectStage as ProjectStage,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
} from '@domino/api/dist/types';
import ProjectStageAndStatusSelect from '../src/navbar/projects/stage/ProjectStageAndStatusSelect';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const mockProjectId = '5c335ee32fd89d166036b9d8';
export const mockProject: Project = {
  'id': '5c335ee32fd89d166036b9d8',
  'name': 'quick-start',
  'owner': {
    'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
    'userName': 'integration-test'
  },
  'description': 'some description',
  'hardwareTierName': 'test-clone-clone',
  'hardwareTierId': 'test-clone-clone',
  'environmentName': 'Default',
  'allowedOperations': [
    'EditTags',
    'RunLauncher',
    'ViewRuns',
    'ProjectSearchPreview',
    'ChangeProjectSettings',
    'Run',
    'BrowseReadFiles',
    'Edit',
    'UpdateProjectDescription'
  ],
  'visibility': 'Public',
  'tags': [],
  'updatedAt': '2019-05-08T19:12:13Z',
  'numComments': 6,
  'runsCountByType': [
    {
      'runType': 'App',
      'count': 140
    },
    {
      'runType': 'Workspace',
      'count': 500
    },
    {
      'runType': 'Batch',
      'count': 1119
    },
  ],
  'totalRunTime': 'PT20490644.922S',
  'stageId': '5cb087f424c57c39eef25acb',
  'status': {
    'status': 'active',
    'isBlocked': false
  },
  requestingUserRole: 'Owner'
};
export const mockProjectStageAndStatus: ProjectStageAndStatus = {
  stage: {
    createdAt: 1558046257864,
    stage: 'stageName',
    isArchived: false,
    id: 'stageId',
    stageCreationSource: 'Domino'
  },
  status: {
    isBlocked: false,
    status: 'active'
  },
  name: 'name',
  id: 'id'
};
const mockBlockedStatus = {
  'status': 'active',
  'isBlocked': true,
  blockedReason: 'Blocked for testing'
}
const mockCompleteStatus = {
  'status': 'complete',
  'isBlocked': false
}
export const mockBlockedProject = R.mergeDeepRight(mockProject, { status: mockBlockedStatus });
export const mockCompletedProject = R.mergeDeepRight(mockProject, { status: mockCompleteStatus });

export const stagesData: ProjectStage[] = [{
  id: '5cb087f424c57c39eef25acb',
  stage: 'Ideation',
  createdAt: 1555073012588,
  createdBy: '5c335ee32fd89d166036b9d4',
  isArchived: false,
  stageCreationSource: 'Domino'
}, {
  id: '5cb0892a24c57c39eef25ad7',
  stage: 'Development',
  createdAt: 1555073322809,
  createdBy: '5c335ee32fd89d166036b9d4',
  isArchived: false,
  stageCreationSource: 'Domino'
}, {
  id: '5cb08cb324c57c39eef25af7',
  stage: 'R&D',
  createdAt: 1555074227142,
  createdBy: '5c335ee32fd89d166036b9d4',
  isArchived: false,
  stageCreationSource: 'Domino'
}];

const mockProjectStage: DominoProjectsApiProjectStage = {
  id: '5cb087f424c57c39eef25acb',
  stage: 'Ideation',
  createdAt: 1555073012588,
  createdBy: '5c335ee32fd89d166036b9d4',
  isArchived: false,
  stageCreationSource: 'Domino'
};
export const mockActiveStageAndStatus: ProjectStageAndStatus = {
  id: mockProjectId,
  name: 'quick-start',
  stage: mockProjectStage,
  status: {
    status: 'active',
    isBlocked: false,
  }
};
export const mockBlockedStageAndStatus: ProjectStageAndStatus = {
  id: mockProjectId,
  name: 'quick-start',
  stage: mockProjectStage,
  status: {
    status: 'active',
    isBlocked: true,
  }
};
export const mockCompletedStageAndStatus: ProjectStageAndStatus = {
  id: mockProjectId,
  name: 'quick-start',
  stage: mockProjectStage,
  status: {
    status: 'complete',
    isBlocked: false,
  }
}

const Wrapper = styled.div`
  width: 200px;
  color: white;
`;

const defaultProps = {
  project: mockProject,
  projectStageAndStatus: mockActiveStageAndStatus,
  updateProject: () => R.always(null),
  updateProjectStageAndStatus: R.always(null)
};

export const stories = [{
  name: 'active project',
  component: (
    <Wrapper>
      <ProjectStageAndStatusSelect {...defaultProps} />
    </Wrapper>)
}, {
  name: 'blocked project',
  component: (
    <Wrapper>
      <ProjectStageAndStatusSelect {...defaultProps} projectStageAndStatus={mockBlockedStageAndStatus} />
    </Wrapper>)
}, {
  name: 'completed project',
  component: (
    <Wrapper>
      <ProjectStageAndStatusSelect {...defaultProps} projectStageAndStatus={mockCompletedStageAndStatus} />
    </Wrapper>)
}];

const storiesOfModule = storiesOf(getDevStoryPath('Components/ProjectStageAndStatusSelect'), module);

// add each story to the stories module
stories.forEach(story => storiesOfModule.add(story.name, () => {
  fetchMock
    .restore()
    .get(
      `/v4/projectManagement/project/${mockProjectId}/stage/list`,
      stagesData
    )
    .put('*', {});
  return story.component
}))
