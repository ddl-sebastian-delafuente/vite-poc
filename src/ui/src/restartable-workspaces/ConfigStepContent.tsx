import * as React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { isEmpty, isNil } from 'ramda';
import {
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoEnvironmentsApiEnvironmentWorkspaceToolDefinition as WorkspaceDefinition,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments
} from '@domino/api/dist/types';
import { projectSettings } from '@domino/ui/dist/core/routes';
import { DDFormItem } from '../components/ValidatedForm';
import HardwareTierSelect, { ExecutionType } from '../components/HardwareTierSelect';
import ComputeEnvironmentDropdown, { unsuitableEnvErr } from '../components/ComputeEnvironmentDropdown';
import WorkspaceDefinitionSelector from '../components/WorkspaceDefinitionSelector';
import {
  HARDWARE_TIER_HELP_TEXT,
  COMPUTE_ENVIRONMENT_HELP_TEXT,
  COMPUTE_ENVIRONMENT_ERROR_TEXT,
  WORKSPACE_DEFINITION_SELECT_HELP_TEXT,
  WORKSPACE_DEFINITION_SELECT_ERROR_TEXT
} from '../constants';
import { themeHelper } from '../styled/themeUtils';
import { HwTierMessageType } from '../clusters/types';
import VolumeSizeSelector from '../components/VolumeSizeSelector';
import useStore from '../globalStore/useStore';
import { EnvRevision, getFormattedRevision } from '../components/utils/envUtils';
import ComputeEnvironmentRevisionFormItem from '../components/ComputeEnvironmentRevisionFormItem';

export const Container = styled.div`
  .ant-select-selection, .ant-legacy-form-item-control span input {
    height: 36px;
  }
  .ant-legacy-form-item-label, .ant-legacy-form-item-label {
    line-height: 1;
    height: ${themeHelper('sizes.medium')};
  }
  .ant-legacy-form-item-label {
    margin-bottom: ${themeHelper('margins.tiny')};
  }
  .ant-legacy-form-item-label > label > span {
    display: inline-block;
  }
  .ant-legacy-form-item {
    margin-bottom: 16px;
  }
  .ant-input {
    padding: 10px;
  }
  .ant-legacy-form-explain {
    margin-top: 0;
  }
  && .ant-legacy-form-item-children-icon {
    display: none;
  }
  .ant-col.ant-legacy-form-item-label {
    height: 17px;
  }
`;

const StyledDDFormItemWithNoMarginBottom = styled(DDFormItem)`
  &.ant-legacy-form-item {
    margin-bottom: 6px;
  }
  .ant-radio-group > div {
    margin: 0 8px 8px 0;
  }
  &.ant-legacy-form-item.empty-workspaceIDEs .ant-legacy-form-item-control {
    line-height: 22px;
    margin-bottom: 16px;
  }
`;

const HardwareTierWrapper = styled.div`
  .ant-select-selection__rendered {
    height: 36px;
  }
  .ant-legacy-form-item {
    margin-bottom: ${themeHelper('margins.small')} !important;
  }
`;

const StyledTooltipLink = styled.a`
  &, &:hover {
    color: inherit;
    text-decoration: underline;
  }
`;

export type ConfigStepContentProps = {
  projectId: string;
  displayUserName: string;
  ownerName: string;
  projectName: string;
  workspaceTitle?: string;
  hardwareTierId?: string;
  environmentId?: string;
  workspaceDefinitionId?: string;
  workspaceDefinitionTitle?: string;
  isEnvironmentControlled: boolean;
  hwTierMessage?: HwTierMessageType;
  projectEnvironments?: ProjectEnvironments;
  areProjectEnvironmentsFetching: boolean;
  handleWorkspaceTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleHWTierSelect: (hwTier: HardwareTierWithCapacity) => void;
  handleEnvironmentSelect: (env: ComputeEnvironment) => void;
  handleWorkspaceDefinitionSelect?: (selectedWs?: WorkspaceDefinition) => void;
  getContainer?: () => HTMLElement;
  handleEnvRevisionSelect: (revision: EnvRevision) => void;
  envRevision?: string;
  enableEnvironmentRevisions?: boolean;
  configStepContentHasError?: boolean;
  defaultVolumeSizeGiB: number;
  recommendedVolumeSizeGiB?: number;
  handleVolumeSizeChange: (volumeSize: number) => void;
  showVolumeSizeSelection: boolean;
  isVolumeSizeDataFetching: boolean;
  restrictToDataPlaneId?: string;
  isRestrictedProject?: boolean;
};

const ConfigStepContent: React.FC<ConfigStepContentProps> = ({
  projectId,
  displayUserName,
  ownerName,
  projectName,
  workspaceTitle,
  hardwareTierId,
  environmentId,
  workspaceDefinitionId,
  workspaceDefinitionTitle,
  isEnvironmentControlled,
  hwTierMessage,
  projectEnvironments,
  areProjectEnvironmentsFetching,
  handleWorkspaceTitleChange,
  handleHWTierSelect,
  handleEnvironmentSelect,
  handleWorkspaceDefinitionSelect,
  getContainer,
  handleEnvRevisionSelect,
  envRevision,
  enableEnvironmentRevisions,
  configStepContentHasError,
  defaultVolumeSizeGiB,
  recommendedVolumeSizeGiB,
  handleVolumeSizeChange,
  showVolumeSizeSelection,
  isVolumeSizeDataFetching,
  restrictToDataPlaneId,
  isRestrictedProject
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<ComputeEnvironment>();
  const [workspaceIDEs, setWorkspaceIDEs] = React.useState<WorkspaceDefinition[]>();
  const [workspaceIDEsLoading, setWorkspaceIDEsLoading] = React.useState<boolean>(false);
  const { formattedPrincipal } = useStore();
  const [revision, setRevision] = React.useState<string | undefined>();
  const [curatedHwTiers, setCuratedHwTiers] = React.useState<HardwareTierWithCapacity[]>();

  React.useEffect(() => {
    setRevision(envRevision);
  }, [envRevision]);

  const handleEnvChange = (rev: string) => {
    setRevision(rev);
    handleEnvRevisionSelect(getFormattedRevision(rev));
  };

  const fetchCuratedHwTiers = () => {
    // ToDo: Fetch and set curated HwTiers here, when the API is ready
    // https://dominodatalab.atlassian.net/browse/DOM-41734
    setCuratedHwTiers([]);
  };

  const canShowHwTiers = isNil(selectedEnvironment) ? false : (
    selectedEnvironment.isCurated ? !isNil(curatedHwTiers) : true);

  let isError = false;

  const hwTierErrorMessageFactory = () => {
    if (!hardwareTierId && configStepContentHasError) {
      isError = true;
      return 'Please select a hardware tier';
    }
    if (!isNil(hwTierMessage) && !isNil(hwTierMessage.err)) {
      isError = true;
      return hwTierMessage.err;
    }
    return null;
  };

  return (
  <Container className={'workspace-launcher-config'}>
    <div>
      <DDFormItem
        label="Workspace Name (optional)"
      >
        <Input
          value={workspaceTitle}
          autoFocus={true}
          placeholder={`${displayUserName}'s ${workspaceDefinitionTitle} session`}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
          onChange={handleWorkspaceTitleChange}
          data-test={'workspace-name'}
        />
      </DDFormItem>
      <ComputeEnvironmentRevisionFormItem
        label="Workspace Environment"
        dashedUnderline={true}
        tooltip={COMPUTE_ENVIRONMENT_HELP_TEXT}
        error={configStepContentHasError ?
          (selectedEnvironment && !isEmpty(selectedEnvironment.supportedClusters) ?
            unsuitableEnvErr : isEmpty(workspaceIDEs) ?
              COMPUTE_ENVIRONMENT_ERROR_TEXT : undefined)
          : undefined}
        formItem={DDFormItem}
        enableEnvironmentRevisions={enableEnvironmentRevisions && !isRestrictedProject}
        onChangeRevision={handleEnvRevisionSelect}
        revisionSpec={revision}
        revTestId="workspace-environment-revision"
        environmentId={environmentId}
      >
        <ComputeEnvironmentDropdown
          getContainer={getContainer}
          projectId={projectId}
          updateProjectEnvironmentOnSelect={false}
          onChangeEnvironment={env => {
            if (env.isCurated) {
              fetchCuratedHwTiers();
            } else {
              setCuratedHwTiers(undefined);
            }
            setSelectedEnvironment(env);
            handleEnvironmentSelect(env);
          }}
          canEditEnvironments={false}
          canSelectEnvironment={true}
          shouldEnvironmentBeInSyncWithProject={false}
          testId={'workspace-environment'}
          environmentId={environmentId}
          isControlled={isEnvironmentControlled}
          projectEnvironments={projectEnvironments}
          areProjectEnvironmentsFetching={areProjectEnvironmentsFetching}
          handleEnvChange={handleEnvChange}
          isRestrictedProject={isRestrictedProject}
        />
      </ComputeEnvironmentRevisionFormItem>
      <StyledDDFormItemWithNoMarginBottom
        label="Select an IDE"
        dashedUnderline={true}
        tooltip={WORKSPACE_DEFINITION_SELECT_HELP_TEXT}
        error={!workspaceIDEsLoading && !workspaceDefinitionId && configStepContentHasError && !isEmpty(workspaceIDEs) ? WORKSPACE_DEFINITION_SELECT_ERROR_TEXT : null}
        className={isEmpty(workspaceIDEs) ? 'empty-workspaceIDEs' : undefined}
      >
        <WorkspaceDefinitionSelector
          projectId={projectId}
          environmentId={environmentId}
          selectedWorkspaceDefId={workspaceDefinitionId}
          setWorkspaceIDEs={setWorkspaceIDEs}
          onWorkspaceDefinitionSelect={handleWorkspaceDefinitionSelect}
          setWorkspaceIDEsLoading={setWorkspaceIDEsLoading}
          testId={'workspace-ide'}
        />
      </StyledDDFormItemWithNoMarginBottom>
      {
        canShowHwTiers && (
          <HardwareTierWrapper>
            <DDFormItem
              label="Hardware Tier"
              dashedUnderline={true}
              data-deny-data-analyst={true}
              tooltip={HARDWARE_TIER_HELP_TEXT}
              error={hwTierErrorMessageFactory()}
            >
              <HardwareTierSelect
                isError={isError}
                getContainer={getContainer}
                projectId={projectId}
                selectedId={hardwareTierId}
                changeHandler={handleHWTierSelect}
                overrideDefaultValue={true}
                testId={'hardware-tier'}
                executionType={ExecutionType.Workspace}
                restrictToDataPlaneId={restrictToDataPlaneId}
                hardwareTiersData={curatedHwTiers}
              />
            </DDFormItem>
          </HardwareTierWrapper>)
      }
      {
        showVolumeSizeSelection && formattedPrincipal?.enableDiskUsageVolumeCheck &&
        <DDFormItem
          key="volumeSize"
          label="Volume Size"
          dashedUnderline={true}
          tooltip={(
            <>
              Volume size selection applies only to this workspace.
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
    </div>
  </Container>);
};

export default ConfigStepContent;
