import * as React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 50px;
`;

export type SectionProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const SectionWithTitle = ({ title, children }: SectionProps) => (
  <SectionContainer>
    <h3>{title}</h3>
    {children}
  </SectionContainer>
);

export default SectionWithTitle;
