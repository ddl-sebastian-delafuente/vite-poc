import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../../../styled/themeUtils';

export interface FeatureStoreDescriptionProps {
  shouldDisplayForEmptyState?: boolean;
}

type StyleProps = Pick<FeatureStoreDescriptionProps, 'shouldDisplayForEmptyState'>

const Container = styled.div<StyleProps>`
  margin-bottom: ${props => props.shouldDisplayForEmptyState ? '36px' : '29px'};
  margin-top: ${props => props.shouldDisplayForEmptyState ? '43px' : 0};
`;

const Heading = styled.div<StyleProps>`
  // not a standard font size
  font-size: ${props => props.shouldDisplayForEmptyState ? '24px' : themeHelper('fontSizes.large')};
  text-align: ${props => props.shouldDisplayForEmptyState ? 'center' : 'left'};
`;

const Description = styled.div<StyleProps>`
  text-align: ${props => props.shouldDisplayForEmptyState ? 'center' : 'left'};
`;

export const FeatureStoreDescription = ({
  shouldDisplayForEmptyState
}: FeatureStoreDescriptionProps) => {
  return (
    <Container shouldDisplayForEmptyState={shouldDisplayForEmptyState}>
      <Heading shouldDisplayForEmptyState={shouldDisplayForEmptyState}>Feature Store</Heading>
      <Description shouldDisplayForEmptyState={shouldDisplayForEmptyState}>Feature Store is a centralized repository of features. It enables feature sharing and discovery across your organization and also ensures that the same feature computation code is used for model training and inference.</Description>
    </Container>
  )
}
