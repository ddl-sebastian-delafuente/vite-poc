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
  hostUrl: string;
}

const ArbitraryHostingSettings: React.FC<HostingProps> = ({ hostUrl }) => {
  return (
    <Maincontainer>
      <Legend>
        <MainTitle>Hosting Settings</MainTitle>
      </Legend>
      <Legend>Host URL</Legend>
      {
        tooltipRenderer(NEW_EXPORTS_TOOLTIOP_TEXT,
          <span>
            <Input disabled style={{ width: '100%' }} defaultValue={hostUrl} />
          </span>
        )
      }
    </Maincontainer>
  );
};

export default ArbitraryHostingSettings;
