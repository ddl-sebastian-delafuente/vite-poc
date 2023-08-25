import * as React from 'react';
import styled from 'styled-components';
import { HeaderProps } from './H3';

const Header = styled.h4<HeaderProps>`
  display: ${({ inline }) => inline ? 'inline-block' : 'block'};
`;

export type Props = {
  inline?: boolean;
  children: string | number | JSX.Element | JSX.Element[];
  className?: string;
};

const H4 = ({
  children,
  inline = false,
  className,
}: Props) => (
  <Header inline={inline} className={className}>
    {children}
  </Header>
);

export default H4;
