import * as React from 'react';
import styled from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier
} from '@domino/api/dist/types';
import HardwareTierSelect, { ExecutionType } from '@domino/ui/dist/components/HardwareTierSelect';
import { DDFormItem, DDFormItemProps } from '@domino/ui/dist/components/ValidatedForm';
import { HARDWARE_TIER_HELP_TEXT_FOR_JOB } from '@domino/ui/dist/constants';
import { HwTierMessageType } from '../../clusters/types';
import HwtierError from '../../clusters/HwtierError';

export type HardwareTierSelectFormItemProps = {
  hardwareTierId?: string;
  hwTierMessage?: HwTierMessageType;
  onHardwareTierChange: (hardwareTier: HardwareTier) => void;
  error?: boolean;
  project: Project;
  hardwareTiersData?: HardwareTier[];
} & Pick<DDFormItemProps, 'dataDenyDataAnalyst'>;

const StyledDDFormItem = styled(DDFormItem)`
  .ant-select {
    width: 100%;
  }
  .has-error.has-feedback .ant-legacy-form-item-children-icon {
    display: none;
  }
`;

export const HardwareTierSelectFormItem: React.FC<HardwareTierSelectFormItemProps> = ({
  dataDenyDataAnalyst,
  hardwareTierId,
  hwTierMessage,
  onHardwareTierChange,
  project,
  error,
  hardwareTiersData
}) => (
  <>
    <StyledDDFormItem
      dataDenyDataAnalyst={dataDenyDataAnalyst}
      label="Hardware Tier"
      dashedUnderline={true}
      tooltip={HARDWARE_TIER_HELP_TEXT_FOR_JOB}
      error={error ? 'Please select a hardware tier' : undefined}
    >
      <HardwareTierSelect
        testId={'jobs-hardware-tier-select'}
        projectId={project.id}
        selectedId={hardwareTierId}
        changeHandler={onHardwareTierChange}
        overrideDefaultValue={false}
        executionType={ExecutionType.Job}
        hardwareTiersData={hardwareTiersData}
      />
    </StyledDDFormItem>
    <HwtierError hwTierMessage={hwTierMessage} />
  </>
);

export default HardwareTierSelectFormItem;
