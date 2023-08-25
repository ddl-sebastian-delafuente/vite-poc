import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { DDFormItem } from './ValidatedForm';
import ComputeEnvironmentDropdown from './ComputeEnvironmentDropdown';

const StyledDDFormItem = styled(DDFormItem)`
  margin-bottom: 0 !important;
`;

interface Props {
  projectId: string;
  isEnvironmentRevisionsEnabled: boolean;
  isRestrictedProject?: boolean;
}

const ModelComputeEnvironment: React.FC<Props> = (props) => {
  const [selectedEnvironmentId, setSelectedEnvironmentId] = React.useState<string>();
  return (
    <React.Fragment>
      <input type="hidden" value={selectedEnvironmentId} name="environmentId" />
      <StyledDDFormItem
        label="Choose an Environment"
      >
        <ComputeEnvironmentDropdown
          projectId={props.projectId}
          onChangeEnvironment={R.pipe(R.prop('id'), setSelectedEnvironmentId)}
          canEditEnvironments={false}
          canSelectEnvironment={true}
          testId="cluster-environment"
          updateProjectEnvironmentOnSelect={false}
          isRestrictedProject={props.isRestrictedProject}
        />
      </StyledDDFormItem>
    </React.Fragment>
  );
};

export default ModelComputeEnvironment;
