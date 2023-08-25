import * as React from 'react';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import { Route, Router, MemoryRouter } from 'react-router';
import {
  DominoServerProjectsApiProjectGatewayOverview as ProjectGatewayOverview,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
} from '@domino/api/dist/types';
import * as httpRequest from '@domino/api/dist/httpRequest';
import { CoreState } from '../redux/reducer';
import rootSaga from '../redux';
import { projectEndpoints, projectOverviewPage, dataIndexPath } from '../routes';
import { configureStore } from '../configureStore';
import FlagManagerProvider from '../FlagManagerProvider';
import {
  pageLoadBasicMocks,
  projectGet,
  projectStageAndStatusGet,
  principalGet,
  whitelabelConfigGet,
  principal as mockPrincipal
} from '../../utils/testUtil';
import {
  principal as mockPrincipal2,
  projectGatewayOverview,
  projectStageAndStatus as mockProjectStageAndStatus,
} from '@domino/test-utils/dist/mocks';
import { createMemoryHistory } from 'history';

/**
 * goals
 * 6. what happens when flag fetching fails
 * 7. what happens when white label settings fetching fails
 * 8. what happens when project fetch succeeds
 * 9. what happens when flag fetch succeeds
 * 10. what happens when white label settings fetch succeeds
 */
const projectName = 'D';
const ownerName = 'newuser';
const history = createMemoryHistory();

const project: ProjectGatewayOverview = {
  ...projectGatewayOverview,
  "id":"5d32334afee21d0006f92724",
  "name":"D",
  "owner":{"id":"5d154bb5fdfe52c4e282731b","userName":"newuser"},
  "description":"",
  "hardwareTierName":"No info",
  "hardwareTierId":"No info",
  "environmentName":"Domino Analytics Distribution Py3.6 R3.4",
  // "forkInfo":{"relatedForks":[]},
  // "dependentProjects":[],
  "allowedOperations":["BrowseReadFiles","ProjectSearchPreview","Run","ChangeProjectSettings","ViewRuns","RunLauncher","Edit","ViewWorkspaces","EditTags","UpdateProjectDescription"],
  "visibility":"Searchable",
  "tags":[],
  "updatedAt":"2019-07-19T21:17:03.864Z",
  "numComments":0,
  "runsCountByType":[],
  "totalRunTime":"PT0S",
  "stageId":"5cc93b1058c93f0006276adf",
  "status":{"status":"active","isBlocked":false}
};
const projectStageAndStatus: ProjectStageAndStatus = {
  ...mockProjectStageAndStatus,
  'id': '5d32334afee21d0006f92724',
  'name': 'D',
  'stage': {
    ...mockProjectStageAndStatus.stage,
    'id': '5cc93b1058c93f0006276adf',
    'stage': 'Ideation',
    'createdAt': 1556691728917,
    'isArchived': false
  },
  'status': {
    ...mockProjectStageAndStatus.status,
    'status': 'active',
    'isBlocked': true
  }
};
const principal = { ...mockPrincipal2, "isAnonymous":false,"isAdmin":false,"canonicalId":"5d154bb5fdfe52c4e282731b","canonicalName":"newuser","allowedSystemOperations":[],"featureFlags":["EnableModelAPIs","EnableApps","EnableLaunchers","ShortLived.DSLEnabled","AppPublishingEnabled","ShortLived.GitReferencesCustomizableEnabled","ShortLived.CommentsPreviewEnabled","ShortLived.PluggableInteractiveSessionSubdomains","ShortLived.PluggableInteractiveSessions","ShortLived.ExecuteHtmlInMarkdown","ShortLived.WriteLogsToNewIndices","ShortLived.FastStartDataSets"],"booleanSettings":["enableProjectTagging","publicModelProductsEnabled"]}
const whiteLabelConfiguration = {"errorPageContactEmail":"support+develop@dominodatalab.com","defaultProjectName":"quick-start","favicon":"/favicon.ico","gitCredentialsDescription":"Authenticate Domino for access to your Git repositories via <strong>GitHub Personal Access Token (PAT)</strong> or <strong>Private SSH Key</strong>.","helpContentUrl":"https://tickets.dominodatalab.com","hidePopularProjects":false,"hideDownloadDominoCli":false,"hideMarketingDisclaimer":false,"hidePublicProjects":false,"hideSearchableProjects":false,"hideSuggestedProjects":false,"hideLearnMoreOnFile":false,"hideGitSshKey":false,"appName":"Domino","pageFooter":"","showSupportButton":false,"supportEmail":"support+develop@dominodatalab.com"}
const testableFlagManagerProvider = (
  propsToPass: any,
  route: string,
  matcher?: string,
  overridingCoreState?: Partial<CoreState>,
) => {

  /**
   * TODO
   * the FlagMangerProvider depends on the equality of
   * window.location.pathname and the.props.history.location.pathname
   * must set before sagas are run
   */
  window.history.pushState({}, '', route);
  history.push(route);

  const coreStateOverrides = overridingCoreState || {};
  const sagaMiddleWare = createSagaMiddleware();
  const store = configureStore({
      core: {
        isMixpanelEnabled: true,
        mixpanelToken: '12345',
        shouldExecuteHtmlInMarkdown: false,
        fetched: undefined,
        fetchedOps: undefined,
        fetchedWhitelabelConfig: undefined,
        showComputeInControlCenter: false,
        showTagsNavItem: false,
        showPublicProjectsOption: true,
        showPublicModelProductsOption: true,
        showAdminMenu: false,
        showEndpointSpend: false,
        showAppPublishingEnabled: false,
        canReadKubernetes: false,
        showApiEndPoints: false,
        overviewPage: false,
        project: undefined,
        projectStageAndStatus: undefined,
        whiteLabelSettings: undefined,
        showDSLFeatures: false,
        showV1DataProjects: false,
        enableJiraIntegration: false,
        enableSparkClusters: false,
        enableRayClusters: false,
        enableDaskClusters: false,
        enableMpiClusters: false,
        areStagesStale: false,
        fetchedCurrentUser: undefined,
        enableModelAPIs: true,
        enableApps: true,
        enableLaunchers: true,
        enablePinProjects: false,
        enableHybrid: false,
        enableGitCredentialFlowForCollaborators: false,
        enableDarkMode: false,
        ...coreStateOverrides,
      },
      user: {
        name: 'string',
        avatar: 'string',
      },
    },
    [sagaMiddleWare]
  );

  sagaMiddleWare.run(rootSaga);
  return (
    <Provider store={store}>
      <MemoryRouter>
      <Router history={history} >
        <Route
          exact={false}
          path={matcher || ''}
          render={(props: any) => (
            <FlagManagerProvider
              {...props}
              {...propsToPass}
            />
          )}
        />
      </Router>
      </MemoryRouter>
    </Provider>
  );
};

const getHttpRequest = jest.spyOn(httpRequest, 'httpRequest');
getHttpRequest.mockImplementation(jest.fn());

describe('<FlagManagerProvider />', () => {
  const defaultProps = {
    children: (state: CoreState) => <div className="rendered-child" data-test="rendered-child">{JSON.stringify(state)}</div>,
  };

  it('should render', () => {
    pageLoadBasicMocks();
    const view = render(
      testableFlagManagerProvider(defaultProps, projectOverviewPage(ownerName, projectName))
    );
    expect(view.getByDominoTestId('rendered-child')).toBeTruthy();
  });

  it('should attempt to fetch the project if ownerName and projectName exist', async () => {
    const spy = jest.fn(async () => project);
    pageLoadBasicMocks();
    projectGet()(spy)

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should not attempt to fetch the project if ownerName or projectName doesn\'t exist', async () => {
    const spy = jest.fn(async () => project);
    pageLoadBasicMocks();
    projectGet()(spy)

    render(
      testableFlagManagerProvider(
        defaultProps,
        dataIndexPath(),
        dataIndexPath(),
      )
    );

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(0));
  });

  it('should deliver failures errors to children if project fetch fails', async () => {
    pageLoadBasicMocks();
    const failureText = 'PROJECT FETCH FAILURE';
    projectGet()(async () => Promise.reject(failureText))

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );
    await waitFor(() => expect(baseElement.textContent).toMatch(failureText));
  });

  it('should set project fetching flag to failed if project fetch fails', async () => {
    projectGet()(async () => Promise.reject('fail'))
    projectStageAndStatusGet()(async () => projectStageAndStatus);
    principalGet()(async () => principal);
    whitelabelConfigGet()(async () => whiteLabelConfiguration);

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    await waitFor(() => expect(baseElement.textContent).toMatch('"fetchedOps":"failed"'));
  });

  it('should set project fetching flag to "inflight" during the fetch', async () => {
    projectGet()(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(project);
        }, 100);
      })
    })
    projectStageAndStatusGet()(async () => projectStageAndStatus);
    principalGet()(async () => principal);
    whitelabelConfigGet()(async () => whiteLabelConfiguration);

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );
    await waitFor(() => expect(baseElement.textContent).toMatch('"fetchedOps":"inflight"'));
  });

  it('should set project fetching flag to "success" if can successfully get project', async () => {
    pageLoadBasicMocks();

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );
    await waitFor(() => expect(baseElement.textContent).toMatch('"fetchedOps":"success"'));
  });

  it('should set project in central state and deliver to children if successfully gotten', async () => {
    pageLoadBasicMocks();
    projectGet()(async () => project);

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    await waitFor(() => expect(baseElement.textContent).toEqual(expect.stringContaining(`"project":${JSON.stringify(project)}`)));
  });

  it('should refetch project if the projectName or ownerName have changed in the url', async () => {
    pageLoadBasicMocks();
    const spy = jest.fn(async () => project);
    projectGet()(spy);

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );
      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
      const newOwnerName = 'newownername';
      const newRoute = projectOverviewPage(newOwnerName, projectName);
      window.history.pushState({}, '', newRoute);
      history.push(newRoute);
      await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });

  it('should not refetch project if go to another route and the projectName and ownerName are the same', async () => {
    pageLoadBasicMocks();
    const spy = jest.fn(async () => project);
    projectGet()(spy);

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    const newRoute = projectEndpoints('section')(ownerName, projectName);
    window.history.pushState({}, '', newRoute);
    history.push(newRoute);
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should set whitelabelsettings if white label settings fetch succeeds', async () => {
    const spy = jest.fn(async () => whiteLabelConfiguration);
    const whiteLabelConfigString = JSON.stringify(whiteLabelConfiguration);

    pageLoadBasicMocks();
    whitelabelConfigGet()(spy)

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    await waitFor(() => expect(baseElement.textContent).toMatch(`"whiteLabelSettings":${whiteLabelConfigString}`));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set whiteLabelSettingsFetchFailure flag to failed if white label settings fetch fails', async () => {
    projectGet()(async () => project);
    projectStageAndStatusGet()(async () => projectStageAndStatus);
    principalGet()(async () => principal);
    whitelabelConfigGet()(async () => Promise.reject('failed'));

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );
    await waitFor(() => expect(baseElement.textContent).toMatch('"whiteLabelSettingsFetchFailure":"failed"'));
  });

  it('should attempt to fetch the project stages if ownerName and projectName exist', async () => {
    pageLoadBasicMocks();
    const projectStageFetch = jest.fn(async () => projectStageAndStatus);
    projectStageAndStatusGet()(projectStageFetch);

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    await waitFor(() =>  expect(projectStageFetch).toHaveBeenCalled());
  });

  it('should not attempt to fetch the project stages if project fetch fails', async () => {
    pageLoadBasicMocks();
    projectGet()(async () => Promise.reject('fail'));
    const projectStageFetch = jest.fn(async () => projectStageAndStatus);
    projectStageAndStatusGet()(projectStageFetch);

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    await waitFor(() =>  expect(projectStageFetch).toHaveBeenCalledTimes(0));
  });

  it('should refetch project stages if the project changed in the url', async () => {
    pageLoadBasicMocks();
    const projectStageFetch = jest.fn(async () => projectStageAndStatus);
    projectStageAndStatusGet()(projectStageFetch);

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );
      await waitFor(() => expect(projectStageFetch).toHaveBeenCalledTimes(1));
      const newOwnerName = 'newownername';
      const newRoute = projectOverviewPage(newOwnerName, projectName);
      window.history.pushState({}, '', newRoute);
      history.push(newRoute);
      await waitFor(() => expect(projectStageFetch).toHaveBeenCalledTimes(2));
  });

  it('should not refetch project stages if go to another route and the projectName and ownerName are the same', async () => {
    pageLoadBasicMocks();
    const projectStageFetch = jest.fn(async () => projectStageAndStatus);
    projectStageAndStatusGet()(projectStageFetch);

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    const newRoute = projectEndpoints('section')(ownerName, projectName);
    window.history.pushState({}, '', newRoute);
    history.push(newRoute);
    await waitFor(() => expect(projectStageFetch).toHaveBeenCalledTimes(1));
  });

  it('should fetch principal details', async () => {
    pageLoadBasicMocks();
    const spy = jest.fn(async () => principal);
    principalGet()(spy);

    render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    const newRoute = projectEndpoints('section')(ownerName, projectName);
    window.history.pushState({}, '', newRoute);
    history.push(newRoute);
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should set fetched prop to failed when principal fetch fails', async () => {
    pageLoadBasicMocks();
    const spy = jest.fn(async () => Promise.reject('fail'));
    principalGet()(spy);

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    await waitFor(() => expect(baseElement.textContent).toMatch(`"fetched":"failed"`));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set principal fetching flag to "inflight" during the fetch', async () => {
    projectGet()(async () => project);
    projectStageAndStatusGet()(async () => projectStageAndStatus);
    principalGet()(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockPrincipal);
        }, 100);
      })
    });
    whitelabelConfigGet()(async () => whiteLabelConfiguration);

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );
    await waitFor(() => expect(baseElement.textContent).toMatch('"fetched":"inflight"'));
  });

  it('should set principal fetching flag to "success" if principal fetches succeeded', async () => {
    pageLoadBasicMocks();

    const { baseElement } = render(
      testableFlagManagerProvider(
        defaultProps,
        projectOverviewPage(ownerName, projectName),
        projectOverviewPage(),
      )
    );

    await waitFor(() => expect(baseElement.textContent).toMatch('"fetched":"success"'));
  });
});
