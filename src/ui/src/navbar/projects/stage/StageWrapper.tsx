import styled from 'styled-components';

export interface StageWrapperProps {
  circleStroke?: number;
  noMargin?: boolean;
}
  
const StageWrapper = styled.div<StageWrapperProps>`
  margin: ${({ noMargin }) => noMargin ? '0' : '0 10px 10px 0'};
  display: flex;
  align-items: center;
  line-height: 1;
  & > svg {
    margin-right: 4px;
    & circle {
      stroke-width: ${({ circleStroke }) => circleStroke || 0};
    }
  } 
`;

export default StageWrapper;
