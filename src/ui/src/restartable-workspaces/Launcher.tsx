import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiOnDemandSparkClusterPropertiesSpec,
  DominoWorkspaceApiWorkspaceDto as Workspace,
  DominoWorkspaceWebUpdateWorkspaceRequest,
  DominoWorkspaceApiComputeClusterConfigDto as NewClusterProperties,
  DominoWorkspaceApiWorkspaceClusterConfigDto as OldClusterProperties,
  DominoDatamountApiDataMountDto
} from '@domino/api/dist/types';
import {
  createAndStartWorkspace
} from '@domino/api/dist/Workspace';
import { findDataMountsByProject } from '@domino/api/dist/Datamount';
import { getGitCredentials } from '@domino/api/dist/Accounts';
import withStore, { StoreProps } from '@domino/ui/dist/globalStore/withStore';
import Modal from '../components/Modal';
import {
  warning as toastrWarning
} from '../components/toastr';
import Button from '../components/Button/Button';
import WorkspaceLauncher, { handleWorkspaceLaunch } from './WorkspaceLauncher';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import {
  clearPreviousDataStorage,
  getPreviouslySelectedValue,
  previousDataStorageKeys
} from '../confirmRedirect/confirmRedirectToLogin';
import { ACTIVE_REVISION, LATEST_REVISION } from '../components/utils/envUtils';
import GitCredentialsModal, { ExecutionType } from './GitCredentialsModal';
import { isGitBasedProject } from '../runs/utils';
import { PlusOutlined } from '@ant-design/icons';

const ButtonLabel = styled.span`
  font-size: 14px;
  line-height: 14px;
`;

export enum WorkspaceLaunchMode {
  EDIT = 'edit',
  CREATE = 'create',
  RESTART = 'restart'
}

export type LaunchMode = `${WorkspaceLaunchMode}`;

export const RELOGIN_WS_LAUNCH_FAIL = 'Failed to launch the workspace, as credentials have not been successfully acquired after relogin';
export const RELOGIN_WS_START_FAIL = 'Failed to start the workspace, as credentials have not been successfully acquired after relogin';

export type Props = {
  projectId: string;
  projectName: string;
  ownerName: string;
  currentUserName: string;
  currentUserId: string;
  canUseDatasets: boolean;
  project: Project;
  enableSparkClusters: boolean;
  enableRayClusters: boolean;
  enableDaskClusters: boolean;
  launcherText?: string;
  launcherComponent?: React.ReactNode;
  launcherComponentOnClick?: () => void;
  onLaunchWorkspace?: () => void;
  submitHandler?: (projectId: string, body: React.ReactNode) => Promise<string>;
  redirector?: (path: string) => void;
  redirectLocation?: string;
  enableExternalDataVolumes?: boolean;
  workspace?: Workspace;
  launchMode: LaunchMode;
  disableNewWorkspace?: boolean;
  newWorkspaceDisabledReason?: string;
  launcherButtonType?: 'primary' | 'secondary';
  onSaveWorkspace?: (workspace: Workspace) => void;
  workspaceDefinitionId?: string;
  disabled?: boolean;
  dataTest?: string;
  previousValuesStorageKey?: string;
  onSaveRestart?: (payloadBody: DominoWorkspaceWebUpdateWorkspaceRequest) => void;
  showWorkspaceLauncher?: boolean;
  enableEnvironmentRevisions?: boolean;
} & StoreProps;

export type State = {
  isWorkspaceModalVisible: boolean;
  workspaceDefinitionId?: string;
  hardwareTierId?: string;
  selectedWorkspaceDefinitionTitle?: string;
  workspaceTitle?: string;
  disableLaunch: boolean;
  component: React.ReactNode;
  isPreviousDataSubmitted: boolean;
  clusterAdded: boolean;
  clusterProperties?: DominoProjectsApiOnDemandSparkClusterPropertiesSpec;
  environmentIdOverride?: string;
  externalVolumeMounts: Array<DominoDatamountApiDataMountDto>;
  hasGitCredentials: boolean;
  isGitCredentialModalVisible: boolean;
  loading: boolean;
};

export class Launcher extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      disableLaunch: false,
      component: undefined,
      isPreviousDataSubmitted: false,
      clusterAdded: false,
      isWorkspaceModalVisible: props.showWorkspaceLauncher || false,
      externalVolumeMounts: [],
      isGitCredentialModalVisible: false,
      hasGitCredentials: false,
      loading: true
    };
  }

  componentDidMount() {
    if (this.props.previousValuesStorageKey) {
      this.checkAndLaunchPreviousWorkspace();
    }
    this.setState({
      hardwareTierId: this.props.project.hardwareTierId
    });
    this.fetchDataMountsByProject();
    this.fetchGitCredentials();
  }

  componentDidUpdate(prevProps: Props) {
    if (!R.equals(prevProps.formattedPrincipal?.enableGitCredentialFlowForCollaborators,
      this.props.formattedPrincipal?.enableGitCredentialFlowForCollaborators)) {
      this.fetchGitCredentials();
    }
  }

  fetchGitCredentials = async () => {
    try {
      this.setState({ loading: true });
      const { project, currentUserId, formattedPrincipal } = this.props;
      if (project.mainRepository?.uri && formattedPrincipal?.enableGitCredentialFlowForCollaborators) {
        const credentials = await getGitCredentials({
          userId: currentUserId,
        });
        this.setState({ hasGitCredentials: !R.isEmpty(credentials) });
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  hideGitCredentialModal = () => this.setState({ isGitCredentialModalVisible: false })

  checkAndLaunchPreviousWorkspace = async () => {
    try {
      const { currentUserId, projectId, previousValuesStorageKey } = this.props;
      const previousUserId = getPreviouslySelectedValue(previousDataStorageKeys.credPropInitiator);
      if (R.equals(previousUserId, currentUserId)) {
        const previousData = getPreviouslySelectedValue(previousValuesStorageKey!);
        if (!R.isNil(previousData)) {
          const { ownerName, projectName, ...payload } = JSON.parse(previousData);

          if (R.equals(payload.projectId, projectId)) {
            const result = await createAndStartWorkspace(payload);

            clearPreviousDataStorage(previousValuesStorageKey!);
            clearPreviousDataStorage(previousDataStorageKeys.credPropInitiator);
            if (R.has('redirectPath', result)) {
              toastrWarning(RELOGIN_WS_LAUNCH_FAIL, '', 0);
            } else {
              handleWorkspaceLaunch(
                result,
                ownerName,
                projectName,
                this.handleSubmit
              );
            }
          }
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  fetchDataMountsByProject = async () => {
    if (this.props.enableExternalDataVolumes) {
      try {
        const dataMounts = await findDataMountsByProject({ projectId: this.props.projectId });
        this.setState({ externalVolumeMounts: dataMounts });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (this.props.project.hardwareTierId !== nextProps.project.hardwareTierId) {
      this.setState({
        hardwareTierId: nextProps.project.hardwareTierId,
      });
    }
  }

  handleSubmit = () => {
    this.setState({ isWorkspaceModalVisible: false });
    const { onLaunchWorkspace } = this.props;
    if (onLaunchWorkspace) {
      onLaunchWorkspace();
    }
  }

  getWorkspaceClusterConfig = (): NewClusterProperties | OldClusterProperties | undefined => {
    const { workspace } = this.props;
    const clusterPropsFromNewDTO = R.pathOr(undefined, ['configTemplate', 'computeClusterResponseProps'], workspace);
    const clusterProps = !R.isNil(clusterPropsFromNewDTO) ?
      clusterPropsFromNewDTO :
      R.pathOr(undefined, ['configTemplate', 'clusterProps'], workspace);

    return clusterProps ?
      {
        clusterType: !R.isNil(clusterPropsFromNewDTO) ? clusterProps.clusterType : undefined,
        computeEnvironmentId: clusterProps.computeEnvironment.id,
        computeEnvironmentRevisionSpec: R.cond([
          [R.equals('Active'), () => ACTIVE_REVISION],
          [R.equals('Latest'), () => LATEST_REVISION],
          [R.T, () => ({ revisionId: R.path(['computeEnvironment', 'revisionId'], clusterProps) })]
        ])(R.path(['computeEnvironment', 'revisionType'], clusterProps)),
        executorCount: R.isNil(clusterPropsFromNewDTO) ? clusterProps.executorCount : undefined,
        workerCount: !R.isNil(clusterPropsFromNewDTO) ? clusterProps.workerCount : undefined,
        maxWorkerCount: !R.isNil(clusterPropsFromNewDTO) ? clusterProps.maxWorkerCount : undefined,
        masterHardwareTierId: clusterProps.masterHardwareTierId,
        executorHardwareTierId: R.isNil(clusterPropsFromNewDTO) ? clusterProps.executorHardwareTierId : undefined,
        workerHardwareTierId: !R.isNil(clusterPropsFromNewDTO) ? clusterProps.workerHardwareTierId : undefined,
        volumeSize: R.isNil(clusterPropsFromNewDTO) ? clusterProps.volumeSize : undefined,
        workerStorage: !R.isNil(clusterPropsFromNewDTO) ? clusterProps.workerStorage : undefined
      } : undefined;
  }

  handleOpenWorkspaceLauncher = () => {
    const { project, launcherComponentOnClick, formattedPrincipal } = this.props;
    const showGitCredentialModal = formattedPrincipal?.enableGitCredentialFlowForCollaborators &&
      project.mainRepository?.uri && !this.state.hasGitCredentials
    this.setState({
      isWorkspaceModalVisible: !showGitCredentialModal,
      isGitCredentialModalVisible: !!showGitCredentialModal
    });
    launcherComponentOnClick && launcherComponentOnClick();
  }

  render() {
    const {
      projectName,
      ownerName,
      canUseDatasets,
      projectId,
      project,
      enableSparkClusters,
      enableRayClusters,
      enableDaskClusters,
      launcherText = 'New Workspace',
      launcherComponent,
      currentUserName,
      workspace,
      launchMode,
      disableNewWorkspace,
      newWorkspaceDisabledReason,
      enableExternalDataVolumes,
      launcherButtonType = 'primary',
      onSaveWorkspace,
      workspaceDefinitionId,
      disabled = false,
      dataTest,
      previousValuesStorageKey,
      onSaveRestart,
      enableEnvironmentRevisions,
      formattedPrincipal
    } = this.props;
    const { isWorkspaceModalVisible, clusterProperties,
      externalVolumeMounts, isGitCredentialModalVisible, loading } = this.state;
    const canLaunchWorkspace = R.contains('Run', project.allowedOperations);

    const workspaceClusterConfig = this.getWorkspaceClusterConfig();

    return (
      <>
        {
          R.isNil(launcherComponent) ?
            tooltipRenderer(
              disableNewWorkspace && newWorkspaceDisabledReason,
              <span>
                <Button
                  data-test={dataTest || 'new-workspace'}
                  className={'add-workspace'}
                  disabled={!canLaunchWorkspace || disableNewWorkspace || loading}
                  btnType={launcherButtonType}
                  icon={<PlusOutlined />}
                  title="Add New Workspace"
                  onClick={this.handleOpenWorkspaceLauncher}
                >
                  <ButtonLabel>
                    {launcherText}
                  </ButtonLabel>
                </Button>
              </span>
            ) : (
              <div
                onClick={() => {
                  // We want the modal to be visible only after any relevant state changes are performed in the launcherComponent
                  // (for example: the launchers from workspace empty state set the selected tool). So using the setTimeout without
                  // any extra delay will solve the issue at hand.
                  // Refer the following PR for more information: https://github.com/cerebrotech/domino/pull/22025
                  setTimeout(() => {
                    if (canLaunchWorkspace && !disabled) {
                      const showGitCredentialModal = formattedPrincipal?.enableGitCredentialFlowForCollaborators &&
                        project.mainRepository?.uri && !this.state.hasGitCredentials;
                      this.setState({
                        isWorkspaceModalVisible: !showGitCredentialModal,
                        isGitCredentialModalVisible: !!showGitCredentialModal
                      });
                    }
                  });
                }}
              >
                {launcherComponent}
              </div>
            )
        }
        <Modal
          titleIconName="DesktopOutlined"
          titleText={R.cond([
            [R.equals('edit'), () => 'Update Workspace'],
            [R.equals('restart'), () => 'Update Workspace'],
            [R.T, () => 'Launch New Workspace']
          ])(launchMode)}
          width={760}
          bodyStyle={{
            padding: 0
          }}
          className={'workspace-launcher'}
          visible={isWorkspaceModalVisible}
          onCancel={() => {
            this.setState({ isWorkspaceModalVisible: false });
          }}
          destroyOnClose={true}
          footer={null}
          okText={'Launch'}
          okButtonProps={{
            disabled: this.state.disableLaunch
          }}
          onOk={this.handleSubmit}
          closable={true}
          testId={'create-workspace-'}
          data-test="workspace-launcher"
        >
          <WorkspaceLauncher
            projectId={projectId}
            projectName={projectName}
            ownerName={ownerName}
            currentUserName={currentUserName}
            canUseDatasets={canUseDatasets}
            project={project}
            clusterProperties={clusterProperties}
            workspaceDefinitionId={workspaceDefinitionId}
            selectedWorkspaceDefinitionTitle={this.state.selectedWorkspaceDefinitionTitle}
            selectedHardwareTierId={this.state.hardwareTierId}
            workspaceTitle={this.state.workspaceTitle}
            onCancel={() => {
              this.setState({ isWorkspaceModalVisible: false });
            }}
            enableSparkClusters={enableSparkClusters}
            enableRayClusters={enableRayClusters}
            enableDaskClusters={enableDaskClusters}
            clusterAdded={this.state.clusterAdded}
            onSubmit={this.handleSubmit}
            workspace={workspace}
            workspaceClusterConfig={workspaceClusterConfig}
            launchMode={launchMode}
            enableExternalDataVolumes={enableExternalDataVolumes}
            externalVolumeMounts={externalVolumeMounts}
            onSaveWorkspace={onSaveWorkspace}
            previousValuesStorageKey={previousValuesStorageKey}
            onSaveRestart={onSaveRestart}
            enableEnvironmentRevisions={enableEnvironmentRevisions}
            enableHybrid={formattedPrincipal?.enableHybrid}
            isGitBasedProject={isGitBasedProject(project)}
          />
        </Modal>
        <GitCredentialsModal
          visible={isGitCredentialModalVisible}
          hideModal={this.hideGitCredentialModal}
          executionType={ExecutionType.Workspace}
        />
      </>
    );
  }
}

export default withStore(Launcher);
