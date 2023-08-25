import * as React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import { colors } from '../../styled';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import { NEW_EXPORTS_TOOLTIOP_TEXT } from '../../constants';

const Maincontainer = styled.div`
  width: 26rem;
`;

const MainTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`;

const Legend = styled.div`
  margin: 1rem 0 0.4rem 0;
  font-size: 0.9rem;
  .ant-switch-checked {
    background-color: ${colors.mantis};
  }
`;

export interface HostingProps {
  udfName: string;
  hostUrl: string;
  warehouseName: string;
  databaseName: string;
  stage: string;
  schema: string;
}

const SnowflakeHostingSettings: React.FC<HostingProps> = props => {
  return (
    <Maincontainer>
      <Legend>
        <MainTitle>Hosting Settings</MainTitle>
      </Legend>
      <Legend>Snowflake Host URL</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Input disabled style={{ width: '100%' }} defaultValue={props.hostUrl} />
          </span>
        )
      }
      <Legend>Warehouse</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Input disabled style={{ width: '100%' }} defaultValue={props.warehouseName} />
          </span>
        )
      }
      <Legend>Database</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Input disabled style={{ width: '100%' }} defaultValue={props.databaseName} />
          </span>
        )
      }
      <Legend>Stage</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Input disabled style={{ width: '100%' }} defaultValue={props.stage} />
          </span>
        )
      }
      <Legend>Schema</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Input disabled style={{ width: '100%' }} defaultValue={props.schema} />
          </span>
        )
      }
      <Legend>Snowflake UDF Name</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Input disabled style={{ width: '100%' }} defaultValue={props.udfName} />
          </span>
        )
      }
    </Maincontainer>
  );
};

export default SnowflakeHostingSettings;
