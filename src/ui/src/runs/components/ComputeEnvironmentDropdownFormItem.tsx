import * as React from 'react';
import { isEmpty } from 'ramda';
import styled from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments
} from '@domino/api/dist/types';
import { DDFormItem, DDFormItemProps } from '../../components/ValidatedForm';
import { COMPUTE_ENVIRONMENT_HELP_TEXT_FOR_JOB } from '../../constants';
import ComputeEnvironmentDropdown, { unsuitableEnvErr } from '../../components/ComputeEnvironmentDropdown';
import ComputeEnvironmentRevisionFormItem from '../../components/ComputeEnvironmentRevisionFormItem';
import { EnvRevision, getFormattedRevision, getRevisionFromFormattedRevision } from '../../components/utils/envUtils';

const Wrapper = styled.div`
  .ant-legacy-form-explain {
    margin-top: 0;
  }
  && .ant-legacy-form-item-children-icon {
    display: none;
  }

  & .select-compute-env.ant-select.ant-select-enabled .ant-select-selection.ant-select-selection--single {
    height: 36px;

    > div {
      height: 34px;

      > div.ant-select-selection-selected-value {
        height: inherit;
      }
    }
  }
`;

export type ComputeEnvironmentDropdownFormItemProps = {
  areProjectEnvironmentsFetching: boolean;
  enableEnvironmentRevisions?: boolean;
  environmentId?: string;
  handleEnvRevisionSelect: (revision: EnvRevision) => void;
  hideDefaultRevisionOptions?: boolean;
  onEnvironmentChange: (environment: ComputeEnvironment) => void;
  project: Project;
  projectEnvironments?: ProjectEnvironments;
  isRestrictedProject?: boolean;
} & Pick<DDFormItemProps, 'dataDenyDataAnalyst'>;

export const ComputeEnvironmentDropdownFormItem: React.FC<ComputeEnvironmentDropdownFormItemProps> = ({
  areProjectEnvironmentsFetching,
  enableEnvironmentRevisions,
  environmentId,
  handleEnvRevisionSelect,
  onEnvironmentChange,
  project,
  projectEnvironments,
  isRestrictedProject
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<ComputeEnvironment>();
  const [revision, setRevision] = React.useState<string | undefined>();

  const handleEnvChange = (rev: string) => {
    setRevision(rev);
    handleEnvRevisionSelect(getFormattedRevision(rev));
  }

  const onRevisionChange = (rev: EnvRevision) => {
    getRevisionFromFormattedRevision(rev, setRevision);
    handleEnvRevisionSelect(rev);
  }

  return (
    <Wrapper>
      <ComputeEnvironmentRevisionFormItem
        dashedUnderline={true}
        enableEnvironmentRevisions={enableEnvironmentRevisions && !isRestrictedProject}
        environmentId={environmentId}
        error={selectedEnvironment && !isEmpty(selectedEnvironment.supportedClusters) ? unsuitableEnvErr : undefined}
        formItem={DDFormItem}
        key="environment"
        label="Environment"
        onChangeRevision={onRevisionChange}
        revTestId="job-env-revision"
        revisionSpec={revision}
        tooltip={COMPUTE_ENVIRONMENT_HELP_TEXT_FOR_JOB}
      >
        <ComputeEnvironmentDropdown
          testId={'compute-environment-select'}
          projectId={project.id}
          environmentId={environmentId}
          isControlled={Boolean(environmentId)}
          updateProjectEnvironmentOnSelect={false}
          onChangeEnvironment={env => {
            setSelectedEnvironment(env);
            onEnvironmentChange(env);
          }}
          canEditEnvironments={false}
          canSelectEnvironment={true}
          shouldEnvironmentBeInSyncWithProject={false}
          projectEnvironments={projectEnvironments}
          areProjectEnvironmentsFetching={areProjectEnvironmentsFetching}
          handleEnvChange={handleEnvChange}
          isRestrictedProject={isRestrictedProject}
        />
      </ComputeEnvironmentRevisionFormItem>
    </Wrapper>);
};

export default ComputeEnvironmentDropdownFormItem;
