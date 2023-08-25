import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier,
  DominoDatasetrwApiDatasetRwProjectMountDto as Dataset,
  DominoWorkspaceApiComputeClusterConfigDto as NewClusterProperties,
  DominoComputeclusterApiDefaultComputeClusterSettings as DefaultComputeClusterProperties,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments,
  ComputeClusterType
} from '@domino/api/dist/types';
import { getDefaultComputeClusterSettings } from '@domino/api/dist/Jobs';
import { getProjectSettings } from '@domino/api/dist/Projects';
import { getUseableEnvironments } from '@domino/api/dist/Projects';
import StepperContent, { StepProps } from '@domino/ui/dist/components/StepperContent/StepperContent';
import ExecutionStepFormElements from '@domino/ui/dist/runs/Form/ExecutionStepFormElements';
import DatasetsStepContent from '@domino/ui/dist/restartable-workspaces/DatasetsStepContent';
import ClusterContent from '@domino/ui/dist/clusters/ClusterContent';
import { GitReferenceType } from '@domino/ui/dist/filebrowser/types';
import * as colors from '@domino/ui/dist/styled/colors';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import {
  getProjectId,
  getProjectOwnerName,
  getDefaultMaximumExecutionSlots
} from '../utils';
import { ErrorMessageFormatter } from '../types';
import { HwTierMessageType } from '../../clusters/types';
import { checkHwtierMessageForWorkerCount } from '../../clusters/util';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import { NETWORK_ERROR_600 } from '@domino/api/dist/httpRequest';
import { error } from '@domino/ui/dist/components/toastr';
import { getDefaultComputeClusterProperties } from '@domino/ui/dist//clusters/util';
import { useAccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import { EnvRevision } from '../../components/utils/envUtils';
import { mixpanel, types as mixpanelTypes } from '../../mixpanel';
import { MISSING_FILE_OR_COMMAND_MESSAGE } from '../components/FileNameInputFormItem';
import { listHardwareTiersForProject } from '@domino/api/dist/Projects';

const Content = styled.div`
  .step-title {
    line-height: 16px;
    margin-bottom: 5px;
  }
`;
const StepDescription = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100px;
  line-height: 14px;
`;
const StepDescriptionWithLineClamp = styled(StepDescription)`
  width: fit-content;
  white-space: pre-wrap;
`;
// TODO: can be removed after antd upgrade to 4.18.5
const StyledContainer = styled.div`
  padding: 0 4px;
`;

export interface JobsLauncherViewProps {
  project?: Project;
  projectId?: string;
  datasets?: Array<Dataset>;
  canUseDatasetConfigs?: boolean;
  environmentId?: string;
  environmentName?: string;
  enableHybrid?: boolean;
  selectedEnvironment?: ComputeEnvironment;
  username?: string;
  commandToRun?: string;
  hardwareTierId?: string;
  selectedHardwareTier?: HardwareTier;
  selectedDataPlaneId: string;
  commitId?: string;
  atHeadCommit?: boolean;
  isGitBasedProject?: boolean;
  enableExternalDataVolumes?: boolean;
  externalVolumeMounts: string[];
  height?: string;
  disabled?: boolean;
  className?: string;
  submitText: 'Start';
  formatErrorMessage?: ErrorMessageFormatter;
  gitReferenceDetails?: GitReferenceType;
  sparkClustersEnabled?: boolean;
  rayClustersEnabled?: boolean;
  daskClustersEnabled?: boolean;
  mpiClustersEnabled?: boolean;
  computeClusterProperties?: NewClusterProperties;
  onCancel?: () => void;
  handleSubmit: () => Promise<void>;
  setComputeClusterSelection?: () => void;
  onDatasetsFetch: (datasets: Array<Dataset>) => void;
  onEnvironmentChange: (environment: ComputeEnvironment) => void;
  onHardwareTierChange: (hardwareTier: HardwareTier) => void;
  onClusterConfigChange: (payload: NewClusterProperties) => void;
  onCommandToRunPrefixChange: (data: string) => void;
  onCommandToRunChange: (data: string) => void;
  onGitRefChange: (gitReference?: GitReferenceType) => void;
  handleEnvRevisionSelect: (revision: EnvRevision) => void;
  enableEnvironmentRevisions?: boolean;
  isCommandToRunTouched: boolean;
  isHardwareTierTouched: boolean;
  isEnvironmentTouched: boolean;
  isGitRefValueTouched: boolean;
  touchAllFields: () => void;
  defaultVolumeSizeGiB: number;
  recommendedVolumeSizeGiB?: number;
  setDefaultVolumeSizeGiB: React.Dispatch<React.SetStateAction<number>>;
  setRecommendedVolumeSizeGiB: React.Dispatch<React.SetStateAction<number | undefined>>;
  handleVolumeSizeChange: (volumeSize: number) => void;
  allowDatasetSnapshotsOnExecutionCompletion: boolean;
  saveSnapshot?: boolean;
  setSaveSnapshot?: (val: boolean) => void;
  jobTitle?: string;
  setJobTitle: (value?:string) => void;
}

export const JobsLauncherView: React.FC<JobsLauncherViewProps> = ({
  project,
  isGitBasedProject,
  sparkClustersEnabled,
  rayClustersEnabled,
  daskClustersEnabled,
  mpiClustersEnabled,
  onDatasetsFetch,
  enableExternalDataVolumes,
  onCancel,
  className,
  selectedEnvironment,
  computeClusterProperties,
  hardwareTierId,
  environmentId,
  environmentName,
  submitText,
  commandToRun,
  onHardwareTierChange,
  onEnvironmentChange,
  onClusterConfigChange,
  onCommandToRunChange,
  onCommandToRunPrefixChange,
  onGitRefChange,
  gitReferenceDetails,
  handleSubmit,
  username = 'Anonymous',
  handleEnvRevisionSelect,
  enableEnvironmentRevisions,
  isCommandToRunTouched,
  isHardwareTierTouched,
  isEnvironmentTouched,
  isGitRefValueTouched,
  touchAllFields,
  defaultVolumeSizeGiB,
  recommendedVolumeSizeGiB,
  setDefaultVolumeSizeGiB,
  setRecommendedVolumeSizeGiB,
  handleVolumeSizeChange,
  enableHybrid,
  selectedDataPlaneId,
  allowDatasetSnapshotsOnExecutionCompletion,
  saveSnapshot,
  setSaveSnapshot,
  jobTitle,
  setJobTitle
}) => {
  const [isSubmitInProgress, setIsSubmitInProgress] = useState<boolean>(false);
  const [maximumExecutionSlotsPerUser, setMaximumExecutionSlotsPerUser] = useState<number>();
  const [sparkClusterMode, setSparkClusterMode] = useState<string>();
  const [workerCountMax, setWorkerCountMax] = React.useState<number>();
  const [workspaceHwTierMessage, setWorkspaceHwTierMessage] = React.useState<HwTierMessageType>();
  const [projectEnvironments, setProjectEnvironments] = React.useState<ProjectEnvironments>();
  const [areProjectEnvironmentsFetching, setAreProjectEnvironmentsFetching] = React.useState<boolean>(true);
  const [isVolumeSizeDataFetching, setIsVolumeSizeDataFetching] = React.useState<boolean>(true);
  const [isClusterAutoScaleOptionEnabled, setIsClusterAutoScaleOptionEnabled] = useState<boolean>(false);
  const [isComputeClusterStepValidationExecuted, setIsComputeClusterStepValidationExecuted] = useState<boolean>(false);
  const [isAdditionalDetailsStepValidationExecuted, setIsAdditionalDetailsStepValidationExecuted] = useState<boolean>();
  const [defaultComputeClusterProperties, setDefaultComputeClusterProperties] =
    useState<DefaultComputeClusterProperties>(updateDefaultComputeClusterProperties());
  const [dataplanesMatch, setDataplanesMatch] = useState<boolean>(true);
  const [clusterTypeSelected, setClusterTypeSelected] = useState<boolean>(false);
  const [hwtsForProject, setHwtsForProject] = useState<HardwareTier[]>([]);
  const [clusterType, setClusterType] = useState<'none' | ComputeClusterType>('none');

  const accessControl = useAccessControl();

  const containerRef = useRef<HTMLDivElement>(null);

  // Utility Functions / Handlers
  const resetState = () => {
    setIsSubmitInProgress(false);
    setIsClusterAutoScaleOptionEnabled(false);
    setIsComputeClusterStepValidationExecuted(false);
    setDefaultComputeClusterProperties(updateDefaultComputeClusterProperties());
    setMaximumExecutionSlotsPerUser(getDefaultMaximumExecutionSlots(defaultComputeClusterProperties));
  };

  const handleJobLaunch = () => {
    setIsSubmitInProgress(true);
    handleSubmit()
      .then(() => resetState())
      .catch((err: any) => {
        console.error(err);
        return Promise.reject(err);
      })
      .finally(() => setIsSubmitInProgress(false));
    mixpanel.track(() =>
      new mixpanelTypes.NewJobAdded({
        projectId: project ? project.id : '',
        location: mixpanelTypes.Locations.NewJobAdded
      })
    );
  };

  const onExecutionStepCompleted = () => {
    touchAllFields();
    return !checkExecutionStepError(false);
  };

  const onDataStepCompleted = (fromNavigationButton?: boolean) => {
    setIsAdditionalDetailsStepValidationExecuted(true);
    if (checkExecutionStepError(false) || checkComputeClusterStepError()) {
      return false;
    }
    if (fromNavigationButton) {
      handleJobLaunch();
    }
    return true;
  };

  const onComputeClusterStepCompleted = () => {
    setIsComputeClusterStepValidationExecuted(true);
    return !checkComputeClusterStepError();
  };

  const computeClusterPropertiesValid = R.isNil(computeClusterProperties) ? undefined : (
    Boolean(computeClusterProperties.clusterType) &&
    Boolean(computeClusterProperties.computeEnvironmentId) &&
    (
      computeClusterProperties.clusterType === ComputeClusterLabels.MPI ||
      Boolean(computeClusterProperties.masterHardwareTierId?.value)
    ) &&
    Boolean(computeClusterProperties.workerHardwareTierId?.value) &&
    (
      Boolean(computeClusterProperties.workerCount) &&
      computeClusterProperties.workerCount >= 1 &&
      Number.isInteger(computeClusterProperties.workerCount) &&
      !R.isNil(workerCountMax) &&
      computeClusterProperties.workerCount <= workerCountMax
    ) &&
    (
      !isClusterAutoScaleOptionEnabled ||
      (!R.isNil(computeClusterProperties.maxWorkerCount) &&
        Number.isInteger(computeClusterProperties.maxWorkerCount) &&
      (!R.isNil(workerCountMax) && computeClusterProperties.maxWorkerCount <= workerCountMax) &&
      computeClusterProperties.workerCount < computeClusterProperties.maxWorkerCount)
    )
  );

  const onWorkerCountMaxChange = (maxValue?: number) => {
    setWorkerCountMax(maxValue);
  };
  const onClusterAutoScaleOptionChange = (isEnabled: boolean) => {
    setIsClusterAutoScaleOptionEnabled(isEnabled);
  };

  const checkForRunHwtierErr = () => {
    if (
      !R.isNil(computeClusterProperties) &&
      !R.isNil(computeClusterProperties.workerHardwareTierId) &&
      hardwareTierId === computeClusterProperties.workerHardwareTierId.value
    ) {
      setWorkspaceHwTierMessage(checkHwtierMessageForWorkerCount(workerCountMax));
    } else {
      setWorkspaceHwTierMessage(undefined);
    }
  };

  const checkGitRefDetailsValid = () => {
    if (
      !R.isNil(isGitBasedProject) &&
      Boolean(isGitBasedProject) &&
      !R.isNil(gitReferenceDetails) &&
      !R.isNil(gitReferenceDetails.defaultRef)
    ) {
      const { defaultRef, refDetails } = gitReferenceDetails;
      if (defaultRef === 'head') {
        return true;
      } else if (!R.isNil(refDetails) && !R.isEmpty(refDetails)) {
        return true;
      } else if (isGitRefValueTouched) {
        return false;
      }
    }
    return true;
  }

  const fetchDefaultComputeClusterSettings = async () => {
    if (!R.isNil(project)) {
      try {
        const defaultComputeClusterProps = await getDefaultComputeClusterSettings({
          projectId: project.id,
          clusterType: ComputeClusterLabels.Spark
        });
        setDefaultComputeClusterProperties(defaultComputeClusterProps);
        setMaximumExecutionSlotsPerUser(getDefaultMaximumExecutionSlots(defaultComputeClusterProperties));
      } catch (e) {
        console.error(e);
        if (e.status !== NETWORK_ERROR_600) {
          error(`Something went wrong when fetching the compute cluster details`);
        }
      }
    }
  };

  function updateDefaultComputeClusterProperties() {
    return getDefaultComputeClusterProperties(
      Boolean(sparkClustersEnabled || rayClustersEnabled || daskClustersEnabled || mpiClustersEnabled),
      computeClusterProperties
        ? computeClusterProperties.clusterType as ComputeClusterType
        : ComputeClusterLabels.Spark
    ) as DefaultComputeClusterProperties;
  }

  // Effects
  useEffect(() => {
    fetchDefaultComputeClusterSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!R.isNil(project) && R.isNil(sparkClusterMode)) {
      setIsVolumeSizeDataFetching(true);
      getProjectSettings({ projectId: project.id })
        .then(settings => {
          setSparkClusterMode(settings.sparkClusterMode);
          setDefaultVolumeSizeGiB(settings.defaultVolumeSizeGiB);
          setRecommendedVolumeSizeGiB(settings.recommendedVolumeSizeGiB);
          setIsVolumeSizeDataFetching(false);
        })
        .catch(err => {
          console.warn(`getProjectSettings`, err);
          setIsVolumeSizeDataFetching(false);
        });
    }

    if (!R.isNil(project)) {
      getUseableEnvironments({ projectId: project.id })
        .then(response => setProjectEnvironments(response))
        .catch(err => console.warn(`getUseableEnvironments`, err))
        .finally(() => setAreProjectEnvironmentsFetching(false));
      listHardwareTiersForProject({ projectId: project ? project.id : '' }).then(fetchedHardwareTiers => {
        setHwtsForProject(fetchedHardwareTiers);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    checkForRunHwtierErr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerCountMax, computeClusterProperties]);

  // returns true when execution step form values are invalid
  const checkExecutionStepError = (validateTouchedFieldsOnly = true) => {
    if (!R.isNil(selectedEnvironment) && !R.isEmpty(selectedEnvironment.supportedClusters)) {
      return false;
    }
    if(!checkGitRefDetailsValid()) {
      return true;
    }
    if (validateTouchedFieldsOnly) {
      if (!isCommandToRunTouched) {
        return undefined;
      }
      return (isCommandToRunTouched && (R.isNil(commandToRun) || R.isEmpty(commandToRun))) ||
        (isHardwareTierTouched && (R.isNil(hardwareTierId) || R.isEmpty(hardwareTierId))) ||
        (isEnvironmentTouched && (R.isNil(environmentId) || R.isEmpty(environmentId)));
    }
    return (R.isNil(commandToRun) || R.isEmpty(commandToRun)) || R.isNil(hardwareTierId) || R.isEmpty(hardwareTierId) || R.isNil(environmentId);
  };

  //comparing that masterHardwareTierId and workerHardwareTierId use same dataplane as selected in 1at step
  const checkSameDataplane = (masterHardwareTierId: string | undefined, workerHardwareTierId: string | undefined, computeClusterProperties: NewClusterProperties | undefined) => {
      const masterHardwareTier = hwtsForProject.find(hwt => hwt.hardwareTier.id === masterHardwareTierId);
      const workerHardwareTier = hwtsForProject.find(hwt => hwt.hardwareTier.id === workerHardwareTierId);

      if ((masterHardwareTier?.dataPlane.id !== selectedDataPlaneId && computeClusterProperties?.clusterType !== 'MPI') || workerHardwareTier?.dataPlane.id !== selectedDataPlaneId) {
        setDataplanesMatch(false)
      } else {
        setDataplanesMatch(true);
      }
  }

  useEffect(() => {
    const masterHardwareTierId = computeClusterProperties?.masterHardwareTierId?.value;
    const workerHardwareTierId = computeClusterProperties?.workerHardwareTierId?.value;
    checkSameDataplane(masterHardwareTierId, workerHardwareTierId, computeClusterProperties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeClusterProperties, hardwareTierId, selectedDataPlaneId]);

  const checkComputeClusterStepError = () => {
    if (!dataplanesMatch && clusterTypeSelected) {
      return true;
    }
    if (isComputeClusterStepValidationExecuted && R.isNil(computeClusterProperties)) {
      return false;
    }
    return R.isNil(computeClusterProperties) ? undefined : !computeClusterPropertiesValid;
  };

  const description = {
    EXECUTION: (
      <>
        {Boolean(isGitBasedProject) &&
          <StepDescriptionWithLineClamp>
            {`GitRef: ${!R.isNil(gitReferenceDetails)
              ? gitReferenceDetails.defaultRef === 'head'
                ? 'Default Branch - \'head\''
                : gitReferenceDetails.refDetails
              : ''}`}
          </StepDescriptionWithLineClamp>}
        <StepDescriptionWithLineClamp data-test="command-to-run-value">
          {!R.isNil(commandToRun) && !R.isEmpty(commandToRun) ? `FILE: ${commandToRun}` : ''}
        </StepDescriptionWithLineClamp>
        <StepDescriptionWithLineClamp>
          {`ENV: ${environmentName}`}
        </StepDescriptionWithLineClamp>
      </>
    ),
    DATASET: (
      <>
        <StepDescriptionWithLineClamp>
          Data
        </StepDescriptionWithLineClamp>
      </>
    )
  };

  const renderElement = {
    EXECUTION: (
      <span>
        {Boolean(isGitBasedProject) &&
          <StepDescription>
            {`GitRef: ${!R.isNil(gitReferenceDetails)
              ? gitReferenceDetails.defaultRef === 'head'
                ? 'Default Branch - \'head\''
                : gitReferenceDetails.refDetails
              : ''}`}
          </StepDescription>}
        {!R.isNil(commandToRun) && !R.isEmpty(commandToRun) &&
          <StepDescription data-test="command-to-run-value">
            FILE: {commandToRun}
          </StepDescription>
        }
        {(!R.isNil(environmentName) && !R.isEmpty(environmentName)) &&
          <StepDescription>
            ENV: {environmentName}
          </StepDescription>}
      </span>
    ),
    CLUSTER_CONTENT: (
      <StepDescription color={colors.brownishGrey}>
        <span>{R.equals('none', clusterType) ? 'None' : clusterType}</span>
      </StepDescription>
    ),
    DATA: (
      <StepDescription color={colors.brownishGrey}>
        Snapshot: {saveSnapshot ? 'On' : 'Off'}
      </StepDescription>
    )
  };

  const jobsLauncherSteps: StepProps[] = [
    {
      title: 'Execution',
      description: tooltipRenderer(description.EXECUTION, renderElement.EXECUTION),
      content: (
        <StyledContainer>
          {project &&
            <ExecutionStepFormElements
              key="execution-step"
              data-test="execution-step"
              project={project}
              commandToRun={commandToRun}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              setCommandToRun={onCommandToRunChange}
              setCommandToRunPrefix={onCommandToRunPrefixChange}
              environmentId={environmentId!}
              isGitBasedProject={!R.isNil(isGitBasedProject) && isGitBasedProject}
              onGitRefChange={onGitRefChange}
              onHardwareTierChange={onHardwareTierChange}
              onEnvironmentChange={onEnvironmentChange}
              hardwareTierId={hardwareTierId}
              ref={containerRef}
              hwTierMessage={workspaceHwTierMessage}
              areProjectEnvironmentsFetching={areProjectEnvironmentsFetching}
              projectEnvironments={projectEnvironments}
              handleEnvRevisionSelect={handleEnvRevisionSelect}
              enableEnvironmentRevisions={enableEnvironmentRevisions}
              fileNameInputFormItemError={isCommandToRunTouched && !commandToRun ? MISSING_FILE_OR_COMMAND_MESSAGE : undefined}
              gitRefDetailsInputError={!checkGitRefDetailsValid()}
              isGitRefValueTouched={isGitRefValueTouched}
              defaultVolumeSizeGiB={defaultVolumeSizeGiB}
              recommendedVolumeSizeGiB={recommendedVolumeSizeGiB}
              handleVolumeSizeChange={handleVolumeSizeChange}
              isVolumeSizeDataFetching={isVolumeSizeDataFetching}
              hardwareTierError={isHardwareTierTouched && !hardwareTierId}
              isRestrictedProject={project.details?.isRestricted}
            />}
        </StyledContainer>
      ),
      hasError: checkExecutionStepError(),
      onNavigationAttempt: onExecutionStepCompleted,
      isSubmitInProgress: isSubmitInProgress,
      finalAction: {
        label: submitText,
        showSpinnerOnSubmit: true,
        testId: 'start-job-now',
        ariaBusy: !commandToRun || R.isNil(environmentId) || R.isNil(hardwareTierId)
      },
      onStepLoad: () => {
        if (project) {
          mixpanel.track(() =>
            new mixpanelTypes.CreateJobExecutionStep({
              projectId: getProjectId(project),
              location: mixpanelTypes.Locations.CreateJobExecutionStep
            }));
        }
      }
    },
    accessControl.hasAccess() ? {
      title: 'Compute Cluster',
      description: renderElement.CLUSTER_CONTENT,
      content: (
        <>
          {project &&
            <ClusterContent
              key="cluster-step"
              data-test="cluster-step"
              projectId={project.id}
              enableSparkClusters={Boolean(sparkClustersEnabled)}
              enableRayClusters={Boolean(rayClustersEnabled)}
              enableDaskClusters={Boolean(daskClustersEnabled)}
              executionSlots={maximumExecutionSlotsPerUser}
              onChange={onClusterConfigChange}
              projectName={project.name}
              ownerName={getProjectOwnerName(project)}
              sparkClusterMode={sparkClusterMode}
              fetchDefaultClusterSettings={(clusterType: string) => getDefaultComputeClusterSettings({
                projectId: project.id,
                clusterType: clusterType
              })}
              runHwTierId={hardwareTierId}
              onWorkerCountMaxChange={onWorkerCountMaxChange}
              areProjectEnvironmentsFetching={areProjectEnvironmentsFetching}
              projectEnvironments={projectEnvironments}
              onClusterAutoScaleOptionChange={onClusterAutoScaleOptionChange}
              enableEnvironmentRevisions={enableEnvironmentRevisions}
              isClusterFormValidated={isComputeClusterStepValidationExecuted}
              hideDefaultRevisionOptions={true}
              selectedDataPlaneId={selectedDataPlaneId}
              setClusterTypeSelected={setClusterTypeSelected}
              setClusterType={setClusterType}
              isRestrictedProject={project.details?.isRestricted}
            />}
        </>
      ),
      onNavigationAttempt: onComputeClusterStepCompleted,
      hasError: isComputeClusterStepValidationExecuted ? checkComputeClusterStepError() : undefined,
      isSubmitInProgress: isSubmitInProgress,
      finalAction: {
        label: submitText,
        showSpinnerOnSubmit: true,
        testId: 'start-job-now'
      },
      onStepLoad: () => {
        if (project) {
          mixpanel.track(() =>
          new mixpanelTypes.CreateJobClusterStep({
            projectId: getProjectId(project),
            location: mixpanelTypes.Locations.CreateJobClusterStep
          }));
        }
      },
    } : undefined,
    {
      title: enableHybrid ? 'Data' : 'Additional Details',
      description: !enableHybrid ? description.DATASET : allowDatasetSnapshotsOnExecutionCompletion ? renderElement.DATA : undefined,
      content: (
        <>
          {project &&
            <DatasetsStepContent
              key="dataset-step"
              data-test="dataset-step"
              projectId={getProjectId(project)}
              onDatasetsFetch={onDatasetsFetch}
              enableExternalDataVolumes={enableExternalDataVolumes}
              currentUser={username}
              enableHybrid={enableHybrid}
              selectedDataPlaneId={selectedDataPlaneId}
              saveSnapshot={saveSnapshot}
              setSaveSnapshot={setSaveSnapshot}
              showSaveSnapshotCheckbox={allowDatasetSnapshotsOnExecutionCompletion}
            />}
        </>
      ),
      btnText: submitText,
      showSpinnerOnSubmit: true,
      isSubmitInProgress: isSubmitInProgress,
      hasError: isAdditionalDetailsStepValidationExecuted ? false : undefined,
      onStepLoad: () => {
        if (project) {
          mixpanel.track(() =>
            new mixpanelTypes.CreateJobDataStep({
              projectId: getProjectId(project),
              location: mixpanelTypes.Locations.CreateJobDataStep
            }));
        }
      },
      onNavigationAttempt: onDataStepCompleted
    }
  ].filter(Boolean) as StepProps[];

  return (
    <div ref={containerRef}>
      <Content className={className}>
        <StepperContent
          stepsWidth="200px"
          contentWidth="505px"
          cancelBtnText="Cancel"
          onCancel={!R.isNil(onCancel) ? onCancel : () => undefined}
          height="670px"
          hideNextButton={!accessControl.hasAccess()}
          steps={jobsLauncherSteps}
          data-test="job-stepper-content"
          outlineSecondaryButton={true}
        />
      </Content>
    </div>
  );
};

export default JobsLauncherView;
