import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  DominoEnvironmentsApiEnvironmentDetails,
} from '@domino/api/dist/types';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';
import { fireEvent, screen, waitFor, render } from '@domino/test-utils/dist/testing-library';
import ComputeEnvironmentDropdown from '../ComputeEnvironmentDropdown';
import { testResults } from './computeEnvironmentData';
import ComputeEnvironmentRevisionFormItem from '../ComputeEnvironmentRevisionFormItem';
import { DDFormItem } from '../../components/ValidatedForm';

const mockEnvironments = {
  currentlySelectedEnvironment: {
    id: '5e981b92c3427a28af9c9dd2',
    supportedClusters: [],
    v2EnvironmentDetails: {
      latestRevision: 16,
      latestRevisionStatus: 'Failed',
      latestRevisionUrl: '/environments/revisions/5e9829ef23236574390f84ba',
      selectedRevision: 15,
      selectedRevisionUrl: '/environments/revisions/5e981e23c3427a28af9c9e32'
    }
  },
  environments: testResults
};

const mockRevisionsInfo = {
  revisions: [
    { id: '61a73748d04758372110231e', number: 3, created: 1638348616973 },
    { id: 'test-revision-id', number: 2, created: 1638175949915 },
    { id: '61a46956f04e9e5137a593b5', number: 1, created: 1638164821975 }],
  pageInfo: {
    totalPages: 0,
    currentPage: 0,
    pageSize: 20
  }
};

const mockEnvironment: DominoEnvironmentsApiEnvironmentDetails = {
  id: '61a46955f04e9e5137a593b1',
  archived: false,
  name: 'Domino Standard Environment Py3.8 R4.1',
  visibility: 'Global',
  supportedClusters: [],
  latestRevision: {
    id: '61a73748d04758372110231e',
    number: 3,
    status: 'Succeeded',
    url: '/environments/revisions/61a73748d04758372110231e',
    isRestricted: false,
    availableTools: [{
      id: 'jupyter',
      name: 'jupyter',
      title: 'Jupyter (Python, R, Julia)',
      iconUrl: '/assets/images/workspace-logos/Jupyter.svg',
      start: ['/opt/domino/workspaces/jupyter/start'],
    }]
  },
  selectedRevision: {
    id: '61a73748d04758372110231e',
    number: 3,
    status: 'Succeeded',
    url: '/environments/revisions/61a73748d04758372110231e',
    isRestricted: false,
    availableTools: [{
      id: 'jupyter',
      name: 'jupyter',
      title: 'Jupyter (Python, R, Julia)',
      iconUrl: '/assets/images/workspace-logos/Jupyter.svg',
      start: ['/opt/domino/workspaces/jupyter/start'],
    }]
  },
  restrictedRevision: {
    id: "61a46956f04e9e5137a593b5",
    number: 2,
    status: "Succeeded",
    url: "/environments/revisions/61a46956f04e9e5137a593b5",
    availableTools: [],
    isRestricted: true
  }
};

const mockProfile: MockProfile = {
  admin: {
    getWhiteLabelConfigurations: {},
  },
  auth: {
    getPrincipal: {
      isAnonymous: true,
      isAdmin: false,
      allowedSystemOperations: ['EditCentralConfig'],
      featureFlags: [],
      booleanSettings: [],
      mixpanelSettings: {
        frontendClientEnabled: true,
        backendClientEnabled: true,
        token: 'token',
      }
    }
  },
  environments: {
    getBuiltEnvironmentRevisions: mockRevisionsInfo,
    getEnvironmentById: mockEnvironment,
  },
  projects: {
    getUseableEnvironments: mockEnvironments,
    getUseableEnvironmentDetails: mockEnvironment,
  },
  users: {
    getCurrentUser: {}
  }
};

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(mockProfile);
});

afterAll(() => {
  mocks.unmock();
});

describe('ComputeEnvironmentDropdown', () => {
  describe('with ComputeEnvironmentRevisionFormItem', () => {
    it('should render environment revisions dropdown when enableEnvironmentRevisions is true', async () => {
      const { container } = render(
        <Router>
          <ComputeEnvironmentRevisionFormItem
            enableEnvironmentRevisions={true}
            formItem={DDFormItem}
            environmentId={mockEnvironment.id}
          >
            <ComputeEnvironmentDropdown
              getContainer={jest.fn()}
              projectId={'projectId'}
              updateProjectEnvironmentOnSelect={false}
              onChangeEnvironment={jest.fn()}
              canEditEnvironments={false}
              canSelectEnvironment={true}
              shouldEnvironmentBeInSyncWithProject={false}
              environmentId={mockEnvironment.id}
              isControlled={true}
              projectEnvironments={mockEnvironments}
              clusterEnvironments={mockEnvironments.environments}
              areProjectEnvironmentsFetching={false}
            />
          </ComputeEnvironmentRevisionFormItem>
        </Router>
      );
      const changeEnvRevisionLink = await screen.findByText("Change");
      fireEvent.click(changeEnvRevisionLink);
      await waitFor(() => expect(container.getElementsByClassName('env-revision-dropdown').length).toBe(1));
    });

    it('should not render environment revisions dropdown when enableEnvironmentRevisions is false', () => {
      render(
        <Router>
          <ComputeEnvironmentRevisionFormItem
            formItem={DDFormItem}
            environmentId={mockEnvironment.id}
          >
            <ComputeEnvironmentDropdown
              getContainer={jest.fn()}
              projectId={'projectId'}
              updateProjectEnvironmentOnSelect={false}
              onChangeEnvironment={jest.fn()}
              canEditEnvironments={false}
              canSelectEnvironment={true}
              shouldEnvironmentBeInSyncWithProject={false}
              environmentId={'5e981b92c3427a28af9c9dd2'}
              isControlled={true}
              projectEnvironments={mockEnvironments}
              clusterEnvironments={mockEnvironments.environments}
              areProjectEnvironmentsFetching={false}
            />
          </ComputeEnvironmentRevisionFormItem>
        </Router>
      );
      expect(screen.queryByText('Change')).toBeNull();
    });

    it('should select Active revision by default', async () => {
      render(
        <Router>
          <ComputeEnvironmentRevisionFormItem
            enableEnvironmentRevisions={true}
            formItem={DDFormItem}
            environmentId={mockEnvironment.id}
          >
            <ComputeEnvironmentDropdown
              getContainer={jest.fn()}
              projectId={'projectId'}
              updateProjectEnvironmentOnSelect={false}
              onChangeEnvironment={jest.fn()}
              canEditEnvironments={false}
              canSelectEnvironment={true}
              shouldEnvironmentBeInSyncWithProject={false}
              environmentId={'5e981b92c3427a28af9c9dd2'}
              isControlled={true}
              projectEnvironments={mockEnvironments}
              clusterEnvironments={mockEnvironments.environments}
              areProjectEnvironmentsFetching={false}
            />
          </ComputeEnvironmentRevisionFormItem>
        </Router>
      );
      const changeEnvRevisionLink = await screen.findByText("Change");
      fireEvent.click(changeEnvRevisionLink);
      await waitFor(() => expect(screen.getAllByText('Active')[0]).not.toBeNull());
    });

    it('should show active label for active revision in revisions dropdown', async () => {
      const view = render(
        <Router>
          <ComputeEnvironmentRevisionFormItem
            enableEnvironmentRevisions={true}
            formItem={DDFormItem}
            environmentId={mockEnvironment.id}
          >
            <ComputeEnvironmentDropdown
              getContainer={jest.fn()}
              projectId={'projectId'}
              updateProjectEnvironmentOnSelect={false}
              onChangeEnvironment={jest.fn()}
              canEditEnvironments={false}
              canSelectEnvironment={true}
              shouldEnvironmentBeInSyncWithProject={false}
              environmentId={'5e981b92c3427a28af9c9dd2'}
              isControlled={true}
              projectEnvironments={mockEnvironments}
              clusterEnvironments={mockEnvironments.environments}
              areProjectEnvironmentsFetching={false}
            />
          </ComputeEnvironmentRevisionFormItem>
        </Router>);

      const changeEnvRevisionLink = await screen.findByText("Change");
      fireEvent.click(changeEnvRevisionLink);
      const revDropdown = await screen.findByText("Active");
      await userEvent.click(revDropdown);
      await waitFor(() => {
        const activeRevision = view.getByDominoTestId('active-revision');
        expect(activeRevision.getElementsByClassName('ant-tag')).toBeTruthy();
      })
    });

    it('should show restricted tag for restricted revision in revisions dropdown', async () => {
      const view = render(
        <Router>
          <ComputeEnvironmentRevisionFormItem
            enableEnvironmentRevisions={true}
            formItem={DDFormItem}
            environmentId={mockEnvironment.id}
          >
            <ComputeEnvironmentDropdown
              getContainer={jest.fn()}
              projectId={'projectId'}
              updateProjectEnvironmentOnSelect={false}
              onChangeEnvironment={jest.fn()}
              canEditEnvironments={false}
              canSelectEnvironment={true}
              shouldEnvironmentBeInSyncWithProject={false}
              environmentId={'5e981b92c3427a28af9c9dd2'}
              isControlled={true}
              projectEnvironments={mockEnvironments}
              clusterEnvironments={mockEnvironments.environments}
              areProjectEnvironmentsFetching={false}
            />
          </ComputeEnvironmentRevisionFormItem>
        </Router>);

      const changeEnvRevisionLink = await screen.findByText("Change");
      fireEvent.click(changeEnvRevisionLink);
      const revDropdown = await screen.findByText("Active");
      await userEvent.click(revDropdown);
      await waitFor(() => {
        expect(view.getByDominoTestId('restricted-tag')).toBeTruthy();
      });
    });
  });
});
