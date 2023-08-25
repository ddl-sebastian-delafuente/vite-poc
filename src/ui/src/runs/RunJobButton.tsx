import * as React from 'react';
import * as R from 'ramda';
import { startJob } from '@domino/api/dist/Jobs';
import { getCurrentUser } from '@domino/api/dist/Users';
import {
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier,
  DominoProjectsApiOnDemandSparkClusterPropertiesSpec as SparkClusterProperties,
  ComputeClusterType
} from '@domino/api/dist/types';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoCommonUserPerson,
  DominoJobsWebStartJobRequest
} from '@domino/api/dist/types';
import { error, success } from '../components/toastr';
import { JobsLauncher } from './Form/JobsLauncher';
import { JobsLauncherWithJobsRouting } from './JobsLauncherWithNucleus';
import { ButtonProps } from '../components/Button/Button';
import { showConfirmRedirectModalToLogin } from '../confirmRedirect/confirmRedirectToLogin';
import {
  NewRunSpec,
  StartNewJobAPIHandler,
  StartNewJobParams
} from './types';
import {
  getHardwareTierIdFromJobSpec,
  getEnvironmentId as getEnvId,
  getClusterProperties,
  getMainRepoGitRef
} from './utils';
import { mixpanel } from '../mixpanel';
import { Locations, JobLaunchEvent } from '../mixpanel/types';

export interface RunJobButtonProps {
  handleSubmit: (isSuccessful: boolean, clusterType?: ComputeClusterType) => void;
  handleCancel: () => void;
  withJobsDashboardRouting: boolean;
  projectId: string;
  visible: boolean;
  disabled?: boolean;
  project?: Project;
  previousValuesStorageKey: string;
  hasGitCredentials: boolean;
}

export interface RunJobButtonState {
  component: React.ReactNode;
  isJobRunSuccess: boolean;
  visible: boolean;
}

const OpenModalButton: any = (OpenModalDivProps: ButtonProps) =>
  <div id="open-modal-button" {...OpenModalDivProps} />;

const getHardwareTierId: (data: NewRunSpec) => string | undefined =
  R.pathOr(undefined, ['overrideHardwareTier', 'hardwareTier', 'id']);

const getEnvironmentId: (data: NewRunSpec) => string | undefined =
  R.pathOr(undefined, ['environment', 'id']);

interface OptionalProps {
  withJobsDashboardRouting: boolean;
  preReloginDataStorageKey: string;
}

const getOptionalProps = ({ withJobsDashboardRouting, preReloginDataStorageKey }: OptionalProps) =>
  R.cond([
    [R.equals(withJobsDashboardRouting), R.always({ withJobsDashboardRouting, preReloginDataStorageKey })],
    [R.T, R.always({})]
  ])(true) as {} | OptionalProps;

class RunJobButton extends React.PureComponent<RunJobButtonProps, RunJobButtonState> {
  constructor(props: RunJobButtonProps) {
    super(props);
    this.state = {
      component: undefined,
      isJobRunSuccess: false,
      visible: !R.isNil(props.visible) ? props.visible : false
    };
  }

  // !!! ToDo !!! -> Remove all code related to StartRunModal component
  // Called by: StartRunModal (deprecated)
  startRun = (
    projectId: string,
    externalVolumeMounts: Array<string>,
    clusterProperties?: SparkClusterProperties
  ) => (data: NewRunSpec) => {
    const body: DominoJobsWebStartJobRequest = {
      projectId: projectId,
      commandToRun: data.command,
      overrideHardwareTierId: getHardwareTierId(data),
      environmentId: getEnvironmentId(data),
      commitId: data.commitId,
      mainRepoGitRef: {
        type: data.defaultref,
        value: data.refdetails
      },
      onDemandSparkClusterProperties: clusterProperties,
      externalVolumeMounts: externalVolumeMounts
    };

    getCurrentUser({}).then((user: DominoCommonUserPerson) => {
      const { userName } = user;
      mixpanel.track(() =>
        new JobLaunchEvent({
          creator: userName,
          location: Locations.JobLaunchModal,
          project: projectId,
          timeLaunched: new Date(),
          jobConfiguration: {
            // TODO: jobName should be replaced with jobName from UI when implemented
            // (currently not accepting job name).
            jobName: body.commandToRun,
            jobCommand: body.commandToRun,
            hardwareTierId: body.overrideHardwareTierId,
            environmentId: body.environmentId,
            sparkClusterConfiguration: body.onDemandSparkClusterProperties,
          }
        })
      );
    })
      .catch((err) => {
        console.error(err);
        error(`'getCurrentUser' fetch error`, `Couldn't fetch the current user`, 3);
      });

    this.setState({ component: undefined });

    return startJob({ body })
      .then(result => {
        if (R.has('redirectPath', result)) {
          this.setState({
            component: showConfirmRedirectModalToLogin(
              (result as any).redirectPath,
              this.props.previousValuesStorageKey,
              JSON.stringify(body)
            )
          });
          this.setState({ isJobRunSuccess: false });
          return 'token expired';
        } else {
          this.setState({ isJobRunSuccess: true });
          return result;
        }
      })
      .catch((err: any) => {
        console.error(err, body);
        error(`'startJob' fetch error`, `Couldn't start the job. Check the request body.`, 3);
      });
  }

  // Used by: JobLauncherModal
  startNewJob: StartNewJobAPIHandler = async ({
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
    const { withJobsDashboardRouting } = this.props;
    const body: DominoJobsWebStartJobRequest = {
      projectId: projectId,
      commandToRun: commandToRun,
      title: title,
      overrideHardwareTierId: getHardwareTierIdFromJobSpec(hardwareTier as HardwareTier),
      environmentId: getEnvId(environment as ComputeEnvironment),
      environmentRevisionSpec: environmentRevisionSpec,
      commitId: commitId,
      mainRepoGitRef: getMainRepoGitRef(gitReferenceDetails),
      computeClusterProperties: getClusterProperties(clusterProperties),
      externalVolumeMounts: externalVolumeMounts,
      overrideVolumeSizeGiB,
      snapshotDatasetsOnCompletion
    };

    try {
      const response = await startJob({ body });
      if (R.has('redirectPath', response)) {
        this.setState({
          component: showConfirmRedirectModalToLogin(
            (response as any).redirectPath,
            this.props.previousValuesStorageKey,
            JSON.stringify(body)
          )
        });
        this.setState({ isJobRunSuccess: false });
        return 'token expired';
      } else {
        this.setState({ isJobRunSuccess: true });
        if (withJobsDashboardRouting) {
          success('Job started successfully.');
        }
        return response;
      }
    } catch (e) {
      console.error(e);
      const errorMessage = await e.body.text();
      error(errorMessage);
    }
    return undefined;
  }

  onOpenModalButtonClick = () => {
    const { visible } = this.state;
    if (!R.isNil(visible) && visible) {
      this.setState({ visible: true });
    }
  }

  render() {
    const {
      visible,
      project,
      projectId,
      disabled,
      withJobsDashboardRouting,
      previousValuesStorageKey,
      hasGitCredentials
    } = this.props;
    const optionalProps: OptionalProps = {
      withJobsDashboardRouting, preReloginDataStorageKey: previousValuesStorageKey
    };
    const JobLauncherModal = withJobsDashboardRouting ? JobsLauncherWithJobsRouting : JobsLauncher;
    return (
      <div className="run-modal-container" data-test="runModalContainer">
        <span>
          {Boolean(OpenModalButton) &&
            <OpenModalButton
              onClick={this.onOpenModalButtonClick}
              disabled={!R.isNil(disabled) && disabled}
            >
              Run
            </OpenModalButton>}
          <JobLauncherModal
            startNewJob={this.startNewJob}
            project={project}
            projectId={projectId}
            handleSubmit={(isRunSuccess: boolean) => this.props.handleSubmit(isRunSuccess || this.state.isJobRunSuccess)}
            handleCancel={this.props.handleCancel}
            isModalVisible={visible}
            hasGitCredentials={hasGitCredentials}
            {...getOptionalProps(optionalProps)}
          />
        </span>
        {this.state.component}
      </div>
    );
  }
}

export default RunJobButton;
