import React from 'react';
import styled from 'styled-components';
import { withTooltip, TooltipProps } from '../../components/renderers/TooltipRenderer';
import { themeHelper } from '../../styled';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    color: ${themeHelper('text.color')};
  }
`;

export const TooltipWrapper: React.FC<TooltipProps> = (props) => {
  const LabelWithTooltip = withTooltip('Tooltip');
  return (
    <Wrapper>
      <LabelWithTooltip {...props}/>
    </Wrapper>
  );
};
