import * as React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import Select, { Option } from '../Select/Select';
import { colors } from '../../styled';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import { NEW_EXPORTS_TOOLTIOP_TEXT, NEW_VERSION_TOOLTIP_TEXT } from '../../constants';
import ComputeEnvironmentDropdown from '@domino/ui/dist/components/ComputeEnvironmentDropdown';

const Maincontainer = styled.div`
  width: 26rem;
`;

const Legend = styled.div`
  margin: 1rem 0 0.4rem 0;
  font-size: 0.9rem;
  .ant-switch-checked {
    background-color: ${colors.mantis};
  }
`;
export interface HostingInfoProps {
  hostName: string;
  fileName: string;
  functionName: string;
  environmentId: string;
  projectId: string;
}

const HostingInfo: React.FC<HostingInfoProps> = ({
  hostName,
  fileName,
  functionName,
  environmentId,
  projectId
}) => {
  return (
    <Maincontainer>
      <Legend>Host</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Select disabled style={{ width: '49%' }} defaultValue={hostName} >
              <Option value={hostName}>{hostName}</Option>
            </Select>
          </span>
        )
      }
      <Legend>File Name (containing code to invoke)</Legend>
      {
        tooltipRenderer(NEW_VERSION_TOOLTIP_TEXT,
          <span><Input disabled style={{ width: '100%' }} defaultValue={fileName} /></span>
        )
      }
      <Legend>Function to invoke</Legend>
      {
        tooltipRenderer(NEW_VERSION_TOOLTIP_TEXT,
          <span><Input disabled style={{ width: '100%' }} defaultValue={functionName} /></span>
        )
      }
      <Legend>Environment</Legend>
      {
        tooltipRenderer(NEW_VERSION_TOOLTIP_TEXT,
          <span>
            <ComputeEnvironmentDropdown
              projectId={projectId}
              canEditEnvironments={false}
              canSelectEnvironment={false}
              isControlled={true}
              environmentId={environmentId}
              updateProjectEnvironmentOnSelect={false}
            />
          </span>
        )
      }
    </Maincontainer>
  );
};

export default HostingInfo;
