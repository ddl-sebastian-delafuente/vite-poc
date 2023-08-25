import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments
} from '@domino/api/dist/types';
import { projectSettings } from '@domino/ui/dist/core/routes';
import { defaultRefComponents } from '@domino/ui/dist/filebrowser/gitRepoUtil';
import { GitReferenceType } from '@domino/ui/dist/filebrowser/types';
import FormattedForm from '@domino/ui/dist/components/FormattedForm';
import FileNameInputFormItem from '../components/FileNameInputFormItem';
import HardwareTierSelectFormItem from '../components/HardwareTierSelectFormItem';
import ComputeEnvironmentDropdownFormItem from '../components/ComputeEnvironmentDropdownFormItem';
import { HwTierMessageType } from '../../clusters/types';
import { EnvRevision } from '../../components/utils/envUtils';
import { InputValues } from '../../components/ValidatedForm';
import VolumeSizeSelector from '../../components/VolumeSizeSelector';
import { DDFormItem } from '../../components/ValidatedForm';
import useStore from '../../globalStore/useStore';
import { useAccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import { DynamicFieldDisplay, FieldStyle } from '../../components/DynamicField';

const StyledTooltipLink = styled.a`
  &, &:hover {
    color: inherit;
    text-decoration: underline;
  }
`;

export interface ExecutionStepFormElementsProps {
  project: Project;
  commandToRun?: string;
  setCommandToRun: (command: string, isSelect?: boolean) => void;
  setCommandToRunPrefix: (data: string) => void;
  onHardwareTierChange: (hwTier: HardwareTier) => void;
  onEnvironmentChange: (environment: ComputeEnvironment) => void;
  onGitRefChange: (gitReference?: GitReferenceType) => void;
  isGitBasedProject?: boolean;
  environmentId?: string;
  hardwareTierId?: string;
  ref?: React.RefObject<HTMLDivElement>;
  hwTierMessage?: HwTierMessageType;
  projectEnvironments?: ProjectEnvironments;
  areProjectEnvironmentsFetching: boolean;
  handleEnvRevisionSelect: (revision: EnvRevision) => void;
  enableEnvironmentRevisions?: boolean;
  fileNameInputFormItemError?: string;
  gitRefDetailsInputError?: boolean;
  isGitRefValueTouched: boolean;
  defaultVolumeSizeGiB: number;
  recommendedVolumeSizeGiB?: number;
  handleVolumeSizeChange: (volumeSize: number) => void;
  isVolumeSizeDataFetching?: boolean;
  hardwareTierError?: boolean;
  isRestrictedProject?: boolean;
  jobTitle?: string;
  setJobTitle: (value?: string) => void;
}

export const ExecutionStepFormElements: React.FC<ExecutionStepFormElementsProps> = ({
  project,
  commandToRun,
  isGitBasedProject,
  environmentId,
  setCommandToRun,
  setCommandToRunPrefix,
  onHardwareTierChange,
  onEnvironmentChange,
  onGitRefChange,
  hardwareTierId,
  hwTierMessage,
  ref,
  projectEnvironments,
  areProjectEnvironmentsFetching,
  handleEnvRevisionSelect,
  enableEnvironmentRevisions,
  fileNameInputFormItemError,
  gitRefDetailsInputError,
  isGitRefValueTouched,
  defaultVolumeSizeGiB,
  recommendedVolumeSizeGiB,
  handleVolumeSizeChange,
  isVolumeSizeDataFetching,
  hardwareTierError,
  isRestrictedProject,
  jobTitle,
  setJobTitle
}) => {
  const [curatedHwTiers, setCuratedHwTiers] = React.useState<HardwareTier[]>();
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<ComputeEnvironment>();

  const errors: InputValues = { refdetails: 'You must specify a reference' };
  const { formattedPrincipal } = useStore();
  const accessControl = useAccessControl();
  const { name: projectName, owner: { userName: ownerName } } = project;

  const fetchCuratedHwTiers = () => {
    // ToDo: Fetch and set curated HwTiers here, when the API is ready
    // https://dominodatalab.atlassian.net/browse/DOM-41734
    setCuratedHwTiers([]);
  };

  const canShowHwTiers = R.isNil(selectedEnvironment) ? false : (
    selectedEnvironment.isCurated ? !R.isNil(curatedHwTiers) : true);

  const onJobTitleChange = (fieldName: string, value: string) => {
    setJobTitle(value);
  }

  return (
    <>
      <DynamicFieldDisplay
        data={{ jobTitle }}
        onChange={onJobTitleChange}
        fieldStyle={FieldStyle.FormItem}
        layout={{
          elements: [{
            id: "jobTitle",
            path: 'jobTitle',
            label: 'Job Title',
            height: 1,
            placeholder: 'Job run name',
          }]
        }}
        fullWidthInput={true}
        antFormProps={{ layout: 'vertical', requiredMark: 'optional' }}
        editable={true}
      />
      {!R.isNil(isGitBasedProject) && Boolean(isGitBasedProject) &&
        <FormattedForm
          submitOnEnter={false}
          asModal={false}
          onlyFields={true}
          defaultValues={{defaultref: 'head'}}
          fieldMatrix={defaultRefComponents(isGitBasedProject, '', onGitRefChange)}
          key="git-reference"
          submitErrors={(isGitRefValueTouched && gitRefDetailsInputError) ? errors : undefined}
        />}
      <FileNameInputFormItem
        projectId={project.id}
        gitRepoUri={project.mainRepository?.uri}
        enabledGitRepos={project.enabledGitRepositories}
        commandToRun={commandToRun}
        isGitBasedProject={!R.isNil(isGitBasedProject) && Boolean(isGitBasedProject)}
        setCommandToRun={setCommandToRun}
        setCommandToRunPrefix={setCommandToRunPrefix}
        ref={ref}
        key="command-to-run"
        error={fileNameInputFormItemError}
      />
      <ComputeEnvironmentDropdownFormItem
        areProjectEnvironmentsFetching={areProjectEnvironmentsFetching}
        dataDenyDataAnalyst={!accessControl.hasAccess()}
        enableEnvironmentRevisions={enableEnvironmentRevisions}
        environmentId={environmentId}
        handleEnvRevisionSelect={handleEnvRevisionSelect}
        hideDefaultRevisionOptions={true}
        key="compute-environment"
        onEnvironmentChange={env => {
          if (env.isCurated) {
            fetchCuratedHwTiers();
          } else {
            setCuratedHwTiers(undefined);
          }
          setSelectedEnvironment(env);
          onEnvironmentChange(env);
        }}
        project={project}
        projectEnvironments={projectEnvironments}
        isRestrictedProject={isRestrictedProject}
      />
      {
        canShowHwTiers && (
          <HardwareTierSelectFormItem
            dataDenyDataAnalyst={!accessControl.hasAccess()}
            hardwareTierId={hardwareTierId}
            hwTierMessage={hwTierMessage}
            error={hardwareTierError}
            key="hardware-tier"
            onHardwareTierChange={onHardwareTierChange}
            project={project}
            hardwareTiersData={curatedHwTiers}
          />)
      }
      {
        formattedPrincipal?.enableDiskUsageVolumeCheck &&
        <DDFormItem
          key="volumeSize"
          label="Volume Size"
          dashedUnderline={true}
          tooltip={(
            <>
              Volume size selection applies only to this job.
              <div>
                {'View '}
                <StyledTooltipLink
                  target="_blank"
                  rel="noreferrer noopener"
                  href={projectSettings('execution')(ownerName, projectName)}
                >
                  Project Settings
                </StyledTooltipLink>
                {' for more.'}
              </div>
            </>)}
        >
          <VolumeSizeSelector
            projectVolumeSizeInGiB={defaultVolumeSizeGiB}
            recommendedVolumeSizeInGiB={recommendedVolumeSizeGiB}
            onVolumeSizeChange={handleVolumeSizeChange}
            isVolumeSizeDataFetching={isVolumeSizeDataFetching}
          />
        </DDFormItem>
      }
    </>
  );
};

export default ExecutionStepFormElements;
