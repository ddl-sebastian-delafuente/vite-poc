import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../styled';
import { themeHelper } from '../../styled/themeUtils';

const Description = styled.span`
  font-size: 0.8rem;
  color: ${colors.silverGrayLighter};
`;

const DescriptionBordered = styled.div`
  display: flex;
  div {
    font-size: 0.8rem;
    color: ${colors.silverGrayLighter};
    border: 1px solid ${colors.silverGrayLighter};
    border-radius: ${themeHelper('borderRadius.standard')};
    padding: 0 0.2rem;
    margin-right: 0.4rem;
  }
`;

interface FeatureType {
  name: string;
  category?: string;
  range: number;
  type?: string;
}

export interface HostedProjectProps {
  feature: FeatureType;
}

const FeatureCard: React.FC<HostedProjectProps> = ({
  feature: { name, range, category, type }
}) => (
  <>
    <div>{name}</div>
    <Description>{category}</Description>
    <DescriptionBordered>
      <div>{range}</div>
      {type ? <div>{type}</div> : ''}
    </DescriptionBordered>
  </>
);

export default FeatureCard;
