import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Tooltip as AntTooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { StyledLabelWrapper } from '../ValidatedForm';

export const defaultPlacement = 'topLeft';
export const defaultMouseEnterDelay = 0.1;
export const defaultMouseLeaveDelay = 0.1;

export default (
  title: React.ReactNode,
  displayText: React.ReactNode,
  tooltipPlacement: TooltipPlacement = defaultPlacement,
  mouseEnterDelay: number = defaultMouseEnterDelay,
  mouseLeaveDelay: number = defaultMouseLeaveDelay,
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
) => (
  <AntTooltip
    title={title}
    placement={tooltipPlacement}
    mouseEnterDelay={mouseEnterDelay}
    mouseLeaveDelay={mouseLeaveDelay}
    getPopupContainer={getPopupContainer}
  >
    {displayText}
  </AntTooltip>
);

export interface TooltipProps {
  tooltipContent?: React.ReactNode;
  placement?: TooltipPlacement;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  isLabelDashed?: boolean;
}

export const withTooltip = (Component: React.ReactNode) => {
  const Tooltip = (
    {
      tooltipContent,
      placement = defaultPlacement,
      mouseEnterDelay = defaultMouseEnterDelay,
      mouseLeaveDelay = defaultMouseLeaveDelay,
      isLabelDashed,
      ...rest
    }: TooltipProps) => (
      <AntTooltip
        title={tooltipContent}
        placement={placement}
        mouseEnterDelay={mouseEnterDelay}
        mouseLeaveDelay={mouseLeaveDelay}
        {...rest}
      >
        {isLabelDashed ? <StyledLabelWrapper>{Component}</StyledLabelWrapper> : Component}
      </AntTooltip>
    );
  return Tooltip;
};
