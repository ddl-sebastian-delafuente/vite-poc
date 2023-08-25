import fetchMock from 'fetch-mock';
import * as React from 'react';
import { MemoryRouter as Router } from 'react-router';
import styled from 'styled-components';
import Navbar, { ContainerProps } from '../Navbar';
import { DominoServerProjectsApiProjectGatewayOverview as Project } from '@domino/api/dist/types';
import { AccessControlProvider } from '@domino/ui/dist/core/AccessControlProvider';
import { DataAnalystConditionalCSS } from '@domino/ui/dist/core/DataAnalystConditionalCSS';
import { Flags } from '../types';

const Wrapper = styled.div`
  position: relative;
  li[data-test="bottom-menu"] {
    position: absolute !important;
  }
`;

export const flags: Flags = {
  showEndpointSpend: true,
  showComputeInControlCenter: true,
  showTagsNavItem: true,
  showAdminMenu: true,
  showDSLFeatures: true,
  showUserNotifications: true,
  enableSparkClusters: true,
  enableRayClusters: true,
  enableDaskClusters: false,
  enableModelAPIs: true,
  enableApps: true
};

export const defaultProps = {
  isNucleusApp: true,
  username: 'integration-test',
  userId: 'userId',
  loading: false,
  primaryCollapsed: false,
  // eslint-disable-next-line no-console
  setGlobalSocket: (socket: SocketIOClient.Socket) => console.log(socket),
  whiteLabelSettings: {
    appName: 'Domino'
  }
};

export const project: Project = {
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
    'UpdateProjectDescription',
    'ViewWorkspaces'
  ],
  'visibility': 'Public',
  'tags': [],
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
  'updatedAt': '2019-05-08T19:12:13Z',
  'stageId': '5cb087f424c57c39eef25acb',
  'status': {
    'status': 'active',
    'isBlocked': false
  },
  'requestingUserRole': 'Owner',
   mainRepository: {
     uri: 'https://github.com/domino/repo1.git',
     id: 'repo1-id',
     serviceProvider: 'github'
   }

};

const NavbarWrapper = (props: ContainerProps) => {
  fetchMock.restore()
    .get('/v4/users/notifications/unreadStatus', {})
    .get('/v4/users/isDataAnalystUser', false)

  return (
    <Wrapper>
      <AccessControlProvider>
        <DataAnalystConditionalCSS>
          <Router initialEntries={[props.location?.pathname]}>
            <Navbar
              project={project}
              dmmLink="http://google.com"
              onError={() => undefined}
              isMixpanelOff={true}
              {...props}
            />
          </Router>
        </DataAnalystConditionalCSS>
      </AccessControlProvider>
    </Wrapper>
  );
};

export default NavbarWrapper;
