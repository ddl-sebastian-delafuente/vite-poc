import styled from 'styled-components';
import DominoLogo from './DominoLogo';
import { IconProps } from './Icon';

const SpinningDominoLogo = styled(DominoLogo)<IconProps>`
  transform-origin: center center;
  animation: spin 1s infinite;
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default SpinningDominoLogo;
