import * as React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import { colors, themeHelper } from '../styled';

const StyledIcon = styled(InfoCircleOutlined)`
  color: ${colors.lightishBlue};
  &.anticon.anticon-info-circle {
    margin: 0 ${themeHelper('margins.tiny')};
  }
`;

export type InfoTooltipIconProps = {
  title?: React.ReactNode;
  placement?: TooltipPlacement;
  testId?: string;
};

const InfoTooltipIcon = ({
  title,
  placement = 'topLeft',
  testId,
}: InfoTooltipIconProps) => (
  <Tooltip
    placement={placement}
    title={title}
  >
    <StyledIcon data-test={testId}/>
  </Tooltip>
);

export default InfoTooltipIcon;
