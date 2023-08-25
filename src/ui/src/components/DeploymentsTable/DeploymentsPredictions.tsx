import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../styled';

const Description = styled.span`
  font-size: 0.8rem;
  color: ${colors.silverGrayLighter};
`;

const DescriptionRight = styled.div`
  text-align: right;
  padding-right: 2rem;
`;

interface PredictionsType {
  predictions: string | number;
}

const DeploymentsPredictions: React.FC<PredictionsType> = ({ predictions }) => {
  // using any type below to resolve linting issue. any needs to be explicitily used.
  const predictionsAlign = (value: any) => {
    return isNaN(value) ? <Description>{value}</Description> : <DescriptionRight>{value}</DescriptionRight>;
  };
  return predictionsAlign(predictions);
};

export default DeploymentsPredictions;
