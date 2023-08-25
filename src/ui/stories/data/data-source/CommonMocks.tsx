import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock, { MockMatcher, MockResponse } from 'fetch-mock';
import {
  getAuthConfigsResponse,
  getAllDataSourcesResponse,
  getDataSourceConfigsNewResponse
} from '@domino/test-utils/dist/mockResponses';
import { AuthenticationType } from '../../../src/data/data-sources/CommonData';
import {
  checkValidDataSourceNameResponse,
  createResponse,
  getAdminPrincipalResponse,
  getAllOrganizationsResponse,
  getCurrentUserResponse,
  getCurrentOrgResponse,
  getProjectSummaryResponse,
  listUsersResponse,
} from '../../../src/data/data-sources/testUtil';

type FetchArgs = [MockMatcher, MockResponse];

export const getAuthConfigs: FetchArgs = ['/v4/datasource/auths/all', getAuthConfigsResponse];
export const getDataSourceConfigsNew: FetchArgs = ['/v4/datasource/config/all/fields', getDataSourceConfigsNewResponse]

export const t = (content: JSX.Element) => <Router>{content}</Router>;

export const addDataSourceButton = ({ visibleCredentialUsername }: { visibleCredentialUsername: string }) => fetchMock.restore()
  .get('glob:/v4/datasource/user/*', getAllDataSourcesResponse)
  .get('glob:/v4/datasource/*/authentication-status', (url: string) => {
    const regex = new RegExp('^/v4/datasource/([0-9a-f]+)/authentication-status$');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const matches = url.match(regex);

    // find the data source matching id
    const datasource = getAllDataSourcesResponse.find(({ id: datasourceId }) => matches && datasourceId === matches[1]);

    if (datasource?.authType === AuthenticationType.AWSIAMRoleWithUsername) {
      return false;
    }

    return true;
  })
  .get('glob:/v4/datasource/*/credential', visibleCredentialUsername)
  .get('glob:/v4/datasource/*/datasource-project-only-data', true)
  .get('glob:/v4/datasource/*/datasource-project-data', true)
  .get(...getAuthConfigs)
  .get(...getDataSourceConfigsNew)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .put('glob:/v4/datasource/*/credentials', (url: string, opts: any) => {
    console.warn('Adding credentials to datasource', opts);
    return true;
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .post('glob:/v4/datasource/*/projects/test-project-id', (url: string, opts: any) => {
    console.warn('Adding datasource to project', opts)
    return true;
  });

export const authenticateStepContent = () => fetchMock.restore()
  .get(...getAuthConfigs)
  .post('/v4/datasource/connection', true);

export const newDataSourceButton = (isAdminUser: boolean) => fetchMock.restore()
  .get('/v4/users/self', getCurrentUserResponse)
  .get('v4/organizations/self', getCurrentOrgResponse)
  .get(...getAuthConfigs)
  .get(...getDataSourceConfigsNew)
  .get('glob:/v4/datasource/name/check/*', checkValidDataSourceNameResponse)
  .get('/v4/users', listUsersResponse)
  .get('/v4/organizations', getAllOrganizationsResponse)
  .get('/v4/auth/principal', getAdminPrincipalResponse(isAdminUser))
  .get('glob:/v4/projects/*', getProjectSummaryResponse)
  .post('/v4/datasource/connection', true)
  .post('/v4/datasource', createResponse);


export const allDatasourceWithRows = (isAdminUser: boolean) => fetchMock.restore()
  .get('/v4/datasource/dataSources/all', getAllDataSourcesResponse)
  .get('glob:/v4/datasource/user/*', getAllDataSourcesResponse)
  .get('/v4/users/self', getCurrentUserResponse)
  .get('v4/organizations/self', getCurrentOrgResponse)
  .get(...getAuthConfigs)
  .get(...getDataSourceConfigsNew)
  .get('glob:/v4/datasource/name/check/*', checkValidDataSourceNameResponse)
  .get('/v4/users', listUsersResponse)
  .get('/v4/organizations', getAllOrganizationsResponse)
  .get('/v4/auth/principal', getAdminPrincipalResponse(isAdminUser))
  .get('glob:/v4/projects/*', getProjectSummaryResponse)
  .post('v4/datasource/connection', true)
  .post('/v4/datasource', createResponse);

export const allDatasourceWithEmptyState = (isAdminUser: boolean) => fetchMock.restore()
  .get('/v4/datasource/dataSources/all', [])
  .get('glob:/v4/datasource/user/*', [])
  .get('/v4/users/self', getCurrentUserResponse)
  .get('v4/organizations/self', getCurrentOrgResponse)
  .get(...getAuthConfigs)
  .get(...getDataSourceConfigsNew)
  .get('glob:/v4/datasource/name/check/*', checkValidDataSourceNameResponse)
  .get('/v4/users', listUsersResponse)
  .get('/v4/organizations', getAllOrganizationsResponse)
  .get('/v4/auth/principal', getAdminPrincipalResponse(isAdminUser))
  .get('glob:/v4/projects/*', getProjectSummaryResponse)
  .post('v4/datasource/connection', true)
  .post('/v4/datasource', createResponse);

export const getHybridCalls = () => fetchMock.restore()
  .get('glob:/v4/datasetrw/mounts/*/local',
    [{
      'datasetId': '624cfee51e4abf7838b26863',
      'snapshotId': '624cfee51e4abf7838b26862',
      'versionNumber': 0,
      'name': 'Foo',
      'description': 'This is the default dataset provided for your project and will be available in all your executions. You can add/remove data, rename or delete this dataset.',
      'ownerProjectId': '624cfee41e4abf7838b2685e',
      'ownerProjectOwnerUsername': 'integration-test',
      'ownerProjectName': 'Foo',
      'storageSize': 0,
      'isPartialSize': false,
      'availableVersions': 1,
      'mountPathsForProject': ['/domino/datasets/local/Foo'],
      'dataPlanes': [{'id': '000000000000000000000000', 'name': '', 'namespace': 'domino-compute', 'isLocal': true}]
    }, {
      'datasetId': '624cfef51e4abf7838b26865',
      'snapshotId': '624cfef51e4abf7838b26864',
      'versionNumber': 0,
      'name': 'Foo-Shared',
      'ownerProjectId': '624cfee41e4abf7838b2685e',
      'ownerProjectOwnerUsername': 'integration-test',
      'ownerProjectName': 'Foo',
      'storageSize': 36993,
      'isPartialSize': false,
      'availableVersions': 1,
      'mountPathsForProject': ['/domino/datasets/local/Foo-Shared'],
      'dataPlanes': [{'id': '000000000000000000000000', 'name': '', 'namespace': 'domino-compute', 'isLocal': true}]
    }])
  .mock('glob:/v4/*', []);
