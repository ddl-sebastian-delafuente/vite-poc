import * as React from 'react';
import fetchMock from 'fetch-mock';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { BrowserRouter as Router } from 'react-router-dom'
import {
  DominoProjectsApiUseableProjectEnvironmentsDto as Environment,
} from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import ComputeEnvironmentDropdownState from '@domino/ui/dist/components/ComputeEnvironmentDropdown';
import { testResults } from '@domino/ui/dist/components/__tests__/computeEnvironmentData';
import { getDevStoryPath } from '../src/utils/storybookUtil';

// Constants
const projectId = 'testProjectId';
const selectedEnvironment = testResults[2];
export const environment: Environment = {
  environments: testResults,
  currentlySelectedEnvironment: {
    id: selectedEnvironment.id,
    supportedClusters: [ComputeClusterLabels.Spark],
  },
};

// Wrapper Components & Handlers
export const customStyles: React.CSSProperties = { width: '600px', padding: '30px' };
export const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={customStyles}><Router>{children}</Router></div>;
export const selectHandler = (e: any) => action('Selected')(e);


// Stories
const stories = storiesOf(getDevStoryPath('Develop/Workspaces/ComputeEnvironmentDropdown'), module);
stories.add('mocking the http request', () => {
  fetchMock
    .restore()
    .get(
      `/v4/projects/${projectId}/useableEnvironments`,
      environment,
    ).put('*', {});
  return (
    <Wrapper>
      <ComputeEnvironmentDropdownState
        projectId={projectId}
        canSelectEnvironment={true}
        updateProjectEnvironmentOnSelect={true}
        onChangeEnvironment={selectHandler}
      />
    </Wrapper>
  );
});
