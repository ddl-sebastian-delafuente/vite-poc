import * as React from 'react';
import { useEffect, useState } from 'react';
import * as R from 'ramda';
import {
  DominoJobsInterfaceJob as StartJobResponse,
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier,
  DominoDatasetrwApiDatasetRwProjectMountDto as Dataset,
  DominoWorkspaceApiComputeClusterConfigDto as NewClusterProperties,
  DominoJobsInterfaceComputeClusterConfigSpecDto as ComputeClusterProperties,
  DominoDatamountApiDataMountDto
} from '@domino/api/dist/types';
import { findDataMountsByProject } from '@domino/api/dist/Datamount';
import { currentUser } from '@domino/ui/dist/utils/getUserUtil';
import { error } from '@domino/ui/dist/components/toastr';
import Modal from '@domino/ui/dist/components/Modal';
import { getCommand } from '@domino/ui/dist/utils/common';
import withProjectSectionRouting from '@domino/ui/dist/containers/WithProjectSectionRouting';
import withProjectFetching from '../../containers/WithProjectFetching';
import {
  convertToJobComputeClusterProperties,
} from '../../clusters/util';
import { DataAnalystConditionalCSS } from '@domino/ui/dist/core/DataAnalystConditionalCSS';
import JobsLauncherView from './JobsLauncherView';
import {
  StartNewJobAPIHandler,
  StartNewJobParams,
  ErrorMessageFormatter
} from '../types';
import {
  getProjectIdDefault,
  isGitBasedProject,
  validateNewJobLaunchProperties
} from '../utils';
import { GitReferenceType } from '../../filebrowser/types';
import { NETWORK_ERROR_600 } from '@domino/api/dist/httpRequest';
import { EnvRevision, ACTIVE_REVISION } from '../../components/utils/envUtils';
import useStore from '@domino/ui/dist/globalStore/useStore';
import GitCredentialsModal, { ExecutionType } from '../../restartable-workspaces/GitCredentialsModal';

export type NoReduxJobsLauncherProps = {
  project?: Project;
  projectId?: string;
  formatErrorMessage?: ErrorMessageFormatter;
  startNewJob: StartNewJobAPIHandler;
  startJobResponse?: StartJobResponse;
  projectFetchFailure?: any;
  handleCancel?: any;
  handleSubmit?: any;
  canUseDatasetConfigs?: boolean;
};

export type JobsLauncherProps = {
  disabled?: boolean;
  errorMessage?: string;
  error?: any;
  commandToRun?: string;
  isModalVisible?: boolean;
  commitId?: string;
  atHeadCommit?: boolean;
  datasetAdvancedDefaultVal?: string;
  hasGitCredentials: boolean;
} & NoReduxJobsLauncherProps;

export const JobsLauncher: React.FC<JobsLauncherProps> = props => {
  const { formattedPrincipal } = useStore();
  const enableExternalDataVolumes = formattedPrincipal?.enableExternalDataVolumes || false;
  const enableGitCredentialFlowForCollaborators = formattedPrincipal?.enableGitCredentialFlowForCollaborators || false;

  const [username, setUsername] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>();
  const [datasets, setDataSets] = useState<Array<Dataset>>([]);
  const [externalVolumeMounts, setExternalVolumeMounts] = useState<Array<DominoDatamountApiDataMountDto>>([]);
  const [selectedHardwareTier, setSelectedHardwareTier] = useState<HardwareTier | undefined>(undefined);
  const [selectedDataPlaneId, setDataPlaneId] = useState<string>("000000000000000000000000");
  const [isHardwareTierTouched, setIsHardwareTierTouched] = useState<boolean>(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<ComputeEnvironment | undefined>(undefined);
  const [isEnvironmentTouched, setIsEnvironmentTouched] = useState<boolean>(false);
  const [defaultVolumeSizeGiB, setDefaultVolumeSizeGiB] = React.useState<number>(0);
  const [recommendedVolumeSizeGiB, setRecommendedVolumeSizeGiB] = React.useState<number>();
  const [selectedVolumeSizeGiB, setSelectedVolumeSizeGiB] = React.useState<number>();
  const [computeClusterProperties, setComputeClusterProperties] = useState<NewClusterProperties | undefined>(undefined);
  const [commandToRun, setCommandToRun] = useState<string | undefined>(props.commandToRun);
  const [commandToRunPrefix, setCommandToRunPrefix] = useState<string>('');
  const [isCommandToRunTouched, setIsCommandToRunTouched] = useState<boolean>(false);
  const [isGitRefValueTouched, setIsGitRefValueTouched] = useState<boolean>(false);
  const [gitReferenceDetails, setGitReferenceDetails] =
    useState<GitReferenceType>({ defaultRef: undefined, refDetails: undefined });
  const [isJobsLauncherVisible, setIsJobsLauncherVisible] = useState<boolean>(false);

  const [canSetGitReference, setCanSetGitReference] = useState<boolean>(false);
  const [revision, setRevision] = useState<EnvRevision>(ACTIVE_REVISION);
  const [saveSnapshot, setSaveSnapshot] = useState<boolean>(false);

  const {
    project,
    handleCancel,
    hasGitCredentials
  } = props;

  // API Calls/Helpers
  const fetchDataMountsByProject = async () => {
    if (enableExternalDataVolumes && !R.isNil(project)) {
      try {
        const dataMounts = await findDataMountsByProject({ projectId: project.id });
        setExternalVolumeMounts(dataMounts);
      } catch (e) {
        if (e.status !== NETWORK_ERROR_600) {
          console.error(e);
          error(`Something went wrong. ${e}`);
        }
      }
    }
  };

  const fetchCurrentUserDetails = async () => {
    try {
      const { userName } = await currentUser();
      setUsername(userName);
    } catch (error) {
      console.error(`Couldn't fetch current user's username. ${error}`);
    }
  };

  // Effects
  useEffect(() => {
    fetchCurrentUserDetails();
    fetchDataMountsByProject();
    setCanSetGitReference(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDataMountsByProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  // Util Functions for resetting/setting state
  const resetState = () => {
    setSelectedHardwareTier(undefined);
    setSelectedEnvironment(undefined);
    setComputeClusterProperties(undefined);
    setDataSets([]);
    setIsJobsLauncherVisible(false);
    setCommandToRun(props.commandToRun);
    setIsCommandToRunTouched(false);
    setIsHardwareTierTouched(false);
    setCommandToRunPrefix('');
  };

  const handleSubmit = async () => {
    const clusterPayload = convertToJobComputeClusterProperties(computeClusterProperties);
    const clusterParams = R.cond([
      [R.equals(true), R.always(clusterPayload)],
      [R.equals(false), () => !R.isNil(clusterPayload) ? R.omit(['computeEnvironmentRevisionSpec'], clusterPayload) : clusterPayload],
      [R.T, R.always(clusterPayload)]
    ])(formattedPrincipal?.enableEnvironmentRevisions) as ComputeClusterProperties | undefined;
    const effectiveExternalVolumeMounts = externalVolumeMounts.filter(mount => mount.dataPlanes.map(dp => dp.id).includes(selectedHardwareTier!.dataPlane.id));

    const params: StartNewJobParams = {
      projectId: getProjectIdDefault(project),
      commandToRun: commandToRun ? commandToRunPrefix + commandToRun : '',
      title: jobTitle,
      hardwareTier: selectedHardwareTier,
      environment: selectedEnvironment,
      commitId: props.commitId,
      gitReferenceDetails,
      externalVolumeMounts: effectiveExternalVolumeMounts.map(mount => mount.id),
      clusterProperties: clusterParams,
      environmentRevisionSpec: revision,
      overrideVolumeSizeGiB: !R.equals(defaultVolumeSizeGiB, selectedVolumeSizeGiB) ? selectedVolumeSizeGiB : undefined,
      ...formattedPrincipal?.allowDatasetSnapshotsOnExecutionCompletion ? { snapshotDatasetsOnCompletion: saveSnapshot } : { snapshotDatasetsOnCompletion: undefined }
    };
    const payload = formattedPrincipal?.enableEnvironmentRevisions ? params : R.omit(['environmentRevisionSpec'], params);
    const canLaunchNewJob = validateNewJobLaunchProperties(payload);
    if (typeof canLaunchNewJob === 'boolean' && canLaunchNewJob) {
      try {
        const { redirectPath } = await props.startNewJob(payload);
        if (!R.isNil(props.handleSubmit)) {
          props.handleSubmit(!redirectPath);
        }
        resetState();
      } catch (error) {
        console.error(error);
      }
    } else if (typeof canLaunchNewJob === 'string') {
      console.error(canLaunchNewJob);
      error(canLaunchNewJob);
    } else {
      error(`Something went wrong when Starting the Job`);
    }
  };

  const onEnvironmentChange = (environment: ComputeEnvironment) => {
    setIsEnvironmentTouched(true);
    setSelectedEnvironment(environment);
  };

  const onHardwareTierChange = (hwTier: HardwareTier) => {
    setIsHardwareTierTouched(true);
    setSelectedHardwareTier(hwTier);
    setDataPlaneId(hwTier.dataPlane.id);
  };

  const onDatasetsFetch = (dataSets: Array<Dataset>) => {
    setDataSets(dataSets);
  };

  const onClusterConfigChange = (clusterConfiguration: NewClusterProperties) => {
    setComputeClusterProperties(clusterConfiguration as NewClusterProperties);
  };

  const onCommandToRunPrefixChange = (data: string) => {
    setCommandToRunPrefix(data);
  }

  const onCommandToRunChange = (data: string, isSelect?: boolean) => {
    setIsCommandToRunTouched(true);
    setCommandToRun(getCommand(data, isSelect));
  };

  const onGitRefChange = (gitReference?: GitReferenceType) => {
    if (gitReference && !R.equals(gitReference.defaultRef, gitReferenceDetails.defaultRef)) {
      setIsGitRefValueTouched(false);
    }
    if (!isGitRefValueTouched && !R.equals(gitReference?.defaultRef, 'head') && !R.isNil(gitReference?.refDetails)) {
      setIsGitRefValueTouched(true);
    }

    if (Boolean(canSetGitReference) && !R.isNil(gitReference)) {
      const { defaultRef, refDetails } = gitReference;
      if (!R.equals(gitReference, gitReferenceDetails)) {
        const gitRefDetails: GitReferenceType = {
          defaultRef: gitReferenceDetails.defaultRef !== defaultRef ? defaultRef : gitReferenceDetails.defaultRef,
          refDetails: gitReferenceDetails.refDetails !== refDetails ? refDetails : gitReferenceDetails.refDetails
        };
        setGitReferenceDetails(gitRefDetails);
      }
    }
  };

  const handleEnvRevisionSelect = (revision: EnvRevision) => {
    setRevision(revision);
  };

  const touchAllFields = () => {
    setIsCommandToRunTouched(true);
    setIsHardwareTierTouched(true);
    setIsEnvironmentTouched(true);
    if (!R.equals(gitReferenceDetails.defaultRef, 'head')) {
      setIsGitRefValueTouched(true);
    }
  };

  const handleVolumeSizeChange = (volSize: number) => {
    setSelectedVolumeSizeGiB(volSize);
  }

  const showGitCredentialModal = isGitBasedProject(project) && enableGitCredentialFlowForCollaborators &&
    !hasGitCredentials;

  const jobsLauncherVisible = (!R.isNil(props.isModalVisible) && props.isModalVisible) || isJobsLauncherVisible;

  return (
    <>
      <Modal
        titleIconName="RunsIcon"
        titleText="Start a Job"
        width={720}
        bodyStyle={{
          padding: 0
        }}
        className={'jobs-launcher'}
        visible={jobsLauncherVisible && !showGitCredentialModal}
        onCancel={() => {
          !R.isNil(handleCancel) ? handleCancel() : setIsJobsLauncherVisible(false);
          resetState();
        }}
        destroyOnClose={true}
        footer={null}
        okText={'Start'}
        okButtonProps={{ disabled: props.disabled }}
        closable={true}
        style={{ minHeight: '400px', maxHeight: '690px' }}
        testId={'start-new-job-'}
        data-test="jobs-launcher"
      >
        <DataAnalystConditionalCSS>
          <JobsLauncherView
            project={project}
            submitText="Start"
            username={username}
            datasets={datasets}
            environmentId={!R.isNil(selectedEnvironment) ? selectedEnvironment.id : ''}
            environmentName={!R.isNil(selectedEnvironment) ? selectedEnvironment.name : ''}
            selectedEnvironment={selectedEnvironment}
            selectedHardwareTier={selectedHardwareTier}
            hardwareTierId={!R.isNil(selectedHardwareTier) ? selectedHardwareTier.hardwareTier.id : ''}
            commandToRun={commandToRun}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            gitReferenceDetails={gitReferenceDetails}
            onCancel={handleCancel}
            handleSubmit={handleSubmit}
            onCommandToRunChange={onCommandToRunChange}
            isCommandToRunTouched={isCommandToRunTouched}
            onGitRefChange={onGitRefChange}
            onDatasetsFetch={onDatasetsFetch}
            onEnvironmentChange={onEnvironmentChange}
            isEnvironmentTouched={isEnvironmentTouched}
            onHardwareTierChange={onHardwareTierChange}
            isHardwareTierTouched={isHardwareTierTouched}
            onClusterConfigChange={onClusterConfigChange}
            externalVolumeMounts={externalVolumeMounts.map(mount => mount.id)}
            isGitBasedProject={isGitBasedProject(project)}
            canUseDatasetConfigs={Boolean(formattedPrincipal?.enableDatasets)}
            sparkClustersEnabled={Boolean(formattedPrincipal?.enableSparkClusters)}
            rayClustersEnabled={Boolean(formattedPrincipal?.enableRayClusters)}
            daskClustersEnabled={Boolean(formattedPrincipal?.enableDaskClusters)}
            mpiClustersEnabled={Boolean(formattedPrincipal?.enableMpiClusters)}
            enableExternalDataVolumes={enableExternalDataVolumes}
            data-test="jobs-launcher-view"
            handleEnvRevisionSelect={handleEnvRevisionSelect}
            enableEnvironmentRevisions={formattedPrincipal?.enableEnvironmentRevisions}
            touchAllFields={touchAllFields}
            isGitRefValueTouched={isGitRefValueTouched}
            handleVolumeSizeChange={handleVolumeSizeChange}
            defaultVolumeSizeGiB={defaultVolumeSizeGiB}
            recommendedVolumeSizeGiB={recommendedVolumeSizeGiB}
            setDefaultVolumeSizeGiB={setDefaultVolumeSizeGiB}
            onCommandToRunPrefixChange={onCommandToRunPrefixChange}
            setRecommendedVolumeSizeGiB={setRecommendedVolumeSizeGiB}
            enableHybrid={formattedPrincipal?.enableHybrid}
            selectedDataPlaneId={selectedDataPlaneId}
            allowDatasetSnapshotsOnExecutionCompletion={Boolean(formattedPrincipal?.allowDatasetSnapshotsOnExecutionCompletion)}
            saveSnapshot={saveSnapshot}
            setSaveSnapshot={setSaveSnapshot}
          />
        </DataAnalystConditionalCSS>
      </Modal>
      <GitCredentialsModal
        visible={jobsLauncherVisible && showGitCredentialModal}
        hideModal={handleCancel}
        executionType={ExecutionType.Job}
      />
    </>
  );
};

export const JobsLauncherWithProject = withProjectFetching(withProjectSectionRouting(JobsLauncher));
export default JobsLauncher;
