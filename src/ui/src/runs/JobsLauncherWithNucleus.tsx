import * as React from 'react';
import { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import * as R from 'ramda';
import {
  DominoJobsWebStartJobRequest,
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier,
  DominoJobsInterfaceJob as StartJobResponse,
} from '@domino/api/dist/types';
import { startJob } from '@domino/api/dist/Jobs';
import { findProjectByOwnerAndName } from '@domino/api/dist/Gateway';
import { ConfirmRedirectToLogin } from '@domino/ui/dist/confirmRedirect/confirmRedirectToLogin';
import { error, success } from '@domino/ui/dist/components/toastr';
import { runDashboardRun } from '@domino/ui/dist/core/routes';
import withProjectSectionRouting from '@domino/ui/dist/containers/WithProjectSectionRouting';
import withJobsDashboardRouting from '@domino/ui/dist/containers/WithJobsDashboardRouting';
import withProjectFetching from '@domino/ui/dist/containers/WithProjectFetching';
import JobsLauncher from './Form/JobsLauncher';
import {
  StartNewJobParams,
  StartNewJobAPIHandler,
  ErrorMessageFormatter
} from './types';
import {
  getDefaultSubmitArguments,
  getHardwareTierIdFromJobSpec,
  getEnvironmentId,
  getClusterProperties,
  defaultErrorMessageFormatter,
  getMainRepoGitRef
} from './utils';
import Button, { ButtonProps } from '../components/Button/Button';

const OpenModalButton: any = (OpenModalDivProps: ButtonProps) =>
  <Button id="open-modal-button" {...OpenModalDivProps} type="primary" href={null as any} />;

export type NoReduxJobsLauncherCommonProps = {
  formatErrorMessage?: ErrorMessageFormatter;
  startNewJob?: StartNewJobAPIHandler;
  projectFetchFailure?: any;
  handleCancel?: any;
  handleSubmit?: any;
  canUseDatasetConfigs?: boolean;
  sparkClustersEnabled?: boolean;
  rayClustersEnabled?: boolean;
  daskClustersEnabled?: boolean;
  OpenModalButton?: any;
  disabled?: boolean;
  commandToRun?: string;
  isModalVisible?: boolean;
  fromFilesBrowser?: boolean;
  commitId?: string;
  atHeadCommit?: boolean;
  datasetAdvancedDefaultVal?: string;
  enableExternalDataVolumes?: boolean;
  withJobsDashboardRouting?: boolean;
  hasGitCredentials: boolean;
};

export type StartJobsWithNucleusProps = {
  project?: Project;
  projectId?: string;
  preReloginDataStorageKey: string;
} & NoReduxJobsLauncherCommonProps & RouteComponentProps;

// !!! ToDo !!! -> Need to implement the foll. functionalities:
//  1. Implement a version of submitStartRunFormWithPreReloginValues here.
//  2. MixPanel Event Tracking in 'startNewJob' method.

export const StartJobsWithNucleus: React.FC<StartJobsWithNucleusProps> = props => {
  const [project, setProject] = useState<Project>();
  const [redirectPath, setRedirectPath] = useState<string | undefined>(undefined);
  const [reloginPayload, setReloginPayload] = useState<string | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);

  const startNewJob: StartNewJobAPIHandler =  async ({
    projectId,
    commandToRun,
    hardwareTier,
    environment,
    externalVolumeMounts,
    clusterProperties,
    commitId,
    gitReferenceDetails,
    environmentRevisionSpec,
    overrideVolumeSizeGiB,
    snapshotDatasetsOnCompletion,
    title
  }: StartNewJobParams) => {
    const [ownerName, projectName]: [string, string] = (
      !R.isNil((props.match.params as any).ownerName) && !R.isNil((props.match.params as any).projectName)
        ? [(props.match.params as any).ownerName, (props.match.params as any).projectName]
        : getDefaultSubmitArguments(props.project) as [string, string]
    );

    const body: DominoJobsWebStartJobRequest = {
      projectId: projectId,
      commandToRun: commandToRun,
      overrideHardwareTierId: getHardwareTierIdFromJobSpec(hardwareTier as HardwareTier),
      environmentId: getEnvironmentId(environment as ComputeEnvironment),
      environmentRevisionSpec: environmentRevisionSpec,
      commitId: commitId,
      mainRepoGitRef: getMainRepoGitRef(gitReferenceDetails),
      computeClusterProperties: getClusterProperties(clusterProperties),
      externalVolumeMounts: externalVolumeMounts,
      overrideVolumeSizeGiB,
      snapshotDatasetsOnCompletion,
      title
    };

    try {
      const response = await startJob({ body });
      if (R.has('redirectPath', response)) {
        setRedirectPath((response as any).redirectPath);
        setReloginPayload(JSON.stringify(body));
        return 'token expired';
      } else {
        const result: StartJobResponse = response;
        success('Job created successfully.', '', 'bottomRight');
        window.location.assign(runDashboardRun(result.id)(ownerName, projectName));
        return result;
      }
    } catch (e) {
      console.error(e);
      const errorMessage = `[${e.status} ${e.name}] for more information, please check the job logs.`;
      error(`Something went wrong when fetching the response from 'startJob' endpoint.`, errorMessage);
      return Promise.reject(e);
    }
  };

  // Fetchers
  const fetchProjectDetails = async () => {
    const ownerName = (props.match.params as any).ownerName;
    const projectName = (props.match.params as any).projectName;
    try {
      if (R.isNil(props.project) || R.isNil(props.projectId)) {
        if (Boolean(projectName) && Boolean(ownerName)) {
          const response = await findProjectByOwnerAndName({
            ownerName: ownerName! as string,
            projectName: projectName! as string
          });
          setProject(response);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Effects
  useEffect(() => {
    fetchProjectDetails();
  }, []); // componentDidMount

  // Handlers
  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    if (visible) {
      setVisible(false);
    }
  };

  const onRunClick = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  const {
    preReloginDataStorageKey,
    disabled,
    fromFilesBrowser,
    isModalVisible,
    ...rest
  } = props;

  const RunButton = fromFilesBrowser ? (props.OpenModalButton ? props.OpenModalButton : OpenModalButton) : undefined;

  return (
    <>
      <span>
        {RunButton &&
          <RunButton
            onClick={onRunClick}
            disabled={!R.isNil(disabled) && disabled}
          >
            Run
          </RunButton>}
        <JobsLauncher
          {...rest}
          project={!R.isNil(props.project) ? props.project : project}
          formatErrorMessage={defaultErrorMessageFormatter}
          commandToRun={props.commandToRun}
          startNewJob={!R.isNil(props.startNewJob) ? props.startNewJob : startNewJob}
          isModalVisible={fromFilesBrowser ? visible : isModalVisible}
          handleSubmit={
            fromFilesBrowser
              ? handleSubmit
              : !props.withJobsDashboardRouting
                ? props.handleSubmit
                : props.handleSubmit()}
          handleCancel={!R.isNil(props.handleCancel) ? props.handleCancel : handleCancel}
        />
        {
          redirectPath &&
          <ConfirmRedirectToLogin
            redirectUri={redirectPath}
            storageKey={preReloginDataStorageKey}
            value={reloginPayload}
          />
        }
      </span>
    </>
  );
};

export const JobsLauncherWithJobsRouting = withJobsDashboardRouting(StartJobsWithNucleus);
export const ProjectSectionRestfulJobsLauncher = withProjectFetching(withProjectSectionRouting((StartJobsWithNucleus)));
export default ProjectSectionRestfulJobsLauncher;
