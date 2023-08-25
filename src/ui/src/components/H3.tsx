import * as React from 'react';
import styled from 'styled-components';

export interface HeaderProps {
  inline: boolean;
}
const Header = styled.h3<HeaderProps>`
  display: ${({ inline }) => inline ? 'inline-block' : 'block'};
`;

export type Props = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
};

const H3 = ({ inline = false, className, children }: Props) => (
  <Header inline={inline} className={className}>
    {children}
  </Header>
);

export default H3;
