import {
  DominoHardwaretierApiHardwareTierDto as HWTier,
} from '@domino/api/dist/types';
import * as React from 'react';
import { path, pipe } from 'ramda';
import styled from 'styled-components';
import HardwareTierSelect, { ComputeClusterRestrictions, ExecutionType } from '../../components/HardwareTierSelect';
import { DDFormItem } from '../../components/ValidatedForm';
import {
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';

const StyledDDFormItem = styled(DDFormItem)`
  &.ant-legacy-form-item {
    margin-bottom: 0;
  }
  .ant-select {
    width: 100%;
  }
  .has-error.has-feedback .ant-legacy-form-item-children-icon {
    display: none;
  }
`;

export interface HardwareTierProps {
  label: string;
  projectId: string;
  selectedHwTierId?: string;
  testId: string;
  tooltip: string;
  clusterType: string;
  restrictToDataPlaneId?: string;
  onChange: (hardwareTier: HWTier) => void;
  getContainer?: () => HTMLElement;
  computeClusterRestrictions: ComputeClusterRestrictions;
  hardwareTiersData?: HardwareTierWithCapacity[];
  error?: boolean;
}

const HardwareTier = (props: HardwareTierProps) => {
  const changeHandler = pipe(path(['hardwareTier']), props.onChange);

  return (
    <StyledDDFormItem
      label={props.label}
      dashedUnderline={true}
      tooltip={props.tooltip}
      error={props.error ? 'Please select a hardware tier' : undefined}
    >
      <HardwareTierSelect
        getContainer={props.getContainer}
        projectId={props.projectId}
        selectedId={props.selectedHwTierId}
        changeHandler={changeHandler}
        overrideDefaultValue={true}
        testId={props.testId}
        computeClusterRestrictions={props.computeClusterRestrictions}
        hardwareTiersData={props.hardwareTiersData}
        executionType={ExecutionType.Cluster}
        restrictToDataPlaneId={props.restrictToDataPlaneId}
      />
    </StyledDDFormItem>
  );
};

export default HardwareTier;
