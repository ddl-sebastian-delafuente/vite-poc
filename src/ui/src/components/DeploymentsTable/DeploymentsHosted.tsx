import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../styled';

const Description = styled.span`
  font-size: 0.8rem;
  color: ${colors.silverGrayLighter};
`;

interface HostedType {
  name: string;
  description?: string;
}

export interface HostedProjectProps {
  hosted: HostedType;
}

const DeploymentsHosted: React.FC<HostedProjectProps> = ({ hosted }) => (
  <>
    <div>{hosted.name}</div>
    <Description>{hosted.description}</Description>
  </>
);

export default DeploymentsHosted;
