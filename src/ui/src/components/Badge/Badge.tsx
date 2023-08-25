import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Badge as AntBadge } from 'antd';
import styled from 'styled-components';

import { BadgeProps } from 'antd/lib/badge';
import { TooltipProps } from 'antd/lib/tooltip';
import { themeHelper } from '../../styled/themeUtils';
import { withTooltip } from '../../components/renderers/TooltipRenderer';

type AddedProps = {
  isWarning?: boolean;
};

export type BadgeComponentProps = BadgeProps & TooltipProps & AddedProps;

const BadgeContainer = styled.span<AddedProps>`
  cursor: pointer;
  .ant-badge-count {
    background: ${props => themeHelper(props.isWarning ? 'badge.warning.background' : 'badge.info.background')};
    color: ${themeHelper('badge.color')};
    box-shadow: 0 0 0 1px ${themeHelper('badge.color')};
  }
`;

const Badge = (
  {
    title,
    arrowPointAtCenter,
    autoAdjustOverflow,
    defaultVisible,
    getPopupContainer,
    mouseEnterDelay,
    mouseLeaveDelay,
    overlayClassName,
    overlayStyle,
    placement,
    trigger,
    visible,
    onVisibleChange,
    align,
    isWarning = true,
    ...rest
  }: BadgeComponentProps) => {
  const tooltipProps: TooltipProps = {
    title,
    arrowPointAtCenter,
    autoAdjustOverflow,
    defaultVisible,
    getPopupContainer,
    mouseEnterDelay,
    mouseLeaveDelay,
    overlayClassName,
    overlayStyle,
    placement,
    trigger,
    onVisibleChange,
    align,
  }
  if (visible !== undefined) {
    tooltipProps.visible = visible;
  }
  const TooltipComp = withTooltip(
    <BadgeContainer isWarning={isWarning}>
      <AntBadge {...rest}/>
    </BadgeContainer>);
  return (
    <TooltipComp {...tooltipProps}/>
  );
};

export default Badge;
