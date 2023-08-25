import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { redirectToLogin, shouldRedirectToLogin } from '../core/authUtil';
import NavBar from './Navbar';
import FlagManagerProvider, { FlagManagerProviderProps } from '../core/FlagManagerProvider';
import withStore from '../containers/WithStore';
import { DMM_LINK } from '../dmmConfiguration';

const handleAnonymousRedirect = (() => {
  let redirected = false;
  return (coreState: FlagManagerProviderProps) => {
    const {
      flagFetchFailure,
      projectFetchFailure,
      fetched,
      fetchedOps,
      userIsAnonymous,
    } = coreState;
    if (!redirected && shouldRedirectToLogin(
      { fetchedOps, fetched },
      flagFetchFailure,
      projectFetchFailure,
      userIsAnonymous
    )) {
      redirected = true;
      redirectToLogin();
    }
  };
})();

export type AppProps = RouteComponentProps<void>

class App extends React.PureComponent<AppProps> {
  constructor(props: AppProps) {
    super(props);
  }

  public render() {
    return (
      <FlagManagerProvider {...this.props}>
        {(coreState: FlagManagerProviderProps) => {
          handleAnonymousRedirect(coreState);
          return (
            <NavBar
              isNucleusApp={true}
              project={coreState.project}
              updateProject={coreState.setProjectAction}
              projectStageAndStatus={coreState.projectStageAndStatus}
              updateProjectStageAndStatus={coreState.setProjectStageAndStatusAction}
              username={coreState.flags && coreState.flags.canonicalName}
              userId={coreState.flags && coreState.flags.canonicalId}
              loading={
                coreState.fetched !== 'success' &&
                coreState.fetched !== 'inflight' &&
                coreState.fetchedOps !== 'success' &&
                coreState.fetchedOps !== 'inflight'
              }
              whiteLabelSettings={coreState.whiteLabelSettings}
              flags={{
                showEndpointSpend: coreState.showEndpointSpend, // Obsolete
                showComputeInControlCenter: coreState.showComputeInControlCenter,
                showTagsNavItem: coreState.showTagsNavItem,
                showAdminMenu: coreState.showAdminMenu,
                showDSLFeatures: coreState.showDSLFeatures,
                enableSparkClusters: coreState.enableSparkClusters,
                enableRayClusters: coreState.enableRayClusters,
                enableDaskClusters: coreState.enableDaskClusters,
                enableGitBasedProjects: coreState.enableGitBasedProjects,
                enableFeedbackModal: coreState.enableFeedbackModal,
                enableExternalDataVolumes: coreState.enableExternalDataVolumes,
                externalDataVolumesFullCensor: coreState.externalDataVolumesFullCensor,
                enableModelAPIs: coreState.enableModelAPIs,
                enableModelRegistry: coreState.enableModelRegistry,
                enableApps: coreState.enableApps,
                enableLaunchers: coreState.enableLaunchers,
                showUserNotifications: coreState.showUserNotifications,
                enablePinProjects: coreState.enablePinProjects,
                enableExportsWorkflow: coreState.enableExportsWorkflow,
                enableGitCredentialFlowForCollaborators: coreState.enableGitCredentialFlowForCollaborators,
                enableSagemakerExportUI: coreState.enableSagemakerExportUI,
                hideWelcomeCarousel: coreState.hideWelcomeCarousel,
                twirlConversionFor58: coreState.twirlConversionFor58,
                detwirlEnvironments58: coreState.detwirlEnvironments58
              }}
              dmmLink={coreState.enableModelMonitoringForModelAPIs ? DMM_LINK : undefined}
              areStagesStale={coreState.areStagesStale}
              setAreStagesStale={coreState.setAreStagesStaleAction}
              globalSocket={coreState.globalSocket}
              setGlobalSocket={coreState.setGlobalSocket}
              currentUser={coreState.currentUser}
            />
          );
        }}
      </FlagManagerProvider>
    );
  }
}

const _Foo = withRouter(App);

export default withStore(_Foo);
