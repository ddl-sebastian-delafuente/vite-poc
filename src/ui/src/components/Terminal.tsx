import * as React from 'react';
import styled from 'styled-components';
import { themeHelper } from '../styled/themeUtils';

interface TerminalProps {
  height: string;
  width: string;
  marginTop: string;
}
const Terminal = styled.code<TerminalProps>`
  position: relative;
  background: black;
  color: white;
  padding: ${themeHelper('margins.tiny')};
  border-radius: ${themeHelper('borderRadius.standard')};
  width: ${({ width }) => width};
  display: block;
  margin: ${({ marginTop }) => `${marginTop} auto 20px auto`};
  height: ${({ height }) => height};
`;

export type Props = {
  height?: string;
  width?: string;
  marginTop?: string;
  children: any;
};

const TerminalComponent = ({
  height = '125px',
  width = '545px',
  children,
  ...rest
}: Props) => {
  const marginTop = rest.marginTop || themeHelper('margins.small')(rest);
  return (
    <Terminal height={height} width={width} marginTop={marginTop}>
      {children}
    </Terminal>
  );
};

export default TerminalComponent;
