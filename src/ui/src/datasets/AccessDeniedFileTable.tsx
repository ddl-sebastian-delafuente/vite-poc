import * as React from 'react';
import styled from 'styled-components';

import Card from '../components/Card/Card';
import EmptyDatabase from '../icons/EmptyDatabase';
import { secondaryGray } from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';

const StyledCard = styled(Card)`
  .ant-card-body {
    padding-top: ${themeHelper('paddings.extraLarge')};
    padding-bottom: ${themeHelper('paddings.extraLarge')};
    width: 100%;
  }

  .card-content {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const StyledEmptyDatabase = styled(EmptyDatabase)`
  margin-bottom: ${themeHelper('margins.medium')};
`;

const Title = styled.div`
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.medium')};
`;

const Subtitle = styled.div`
  color: ${secondaryGray};
  text-align: center;
  width: 550px;
`;

export const AccessDeniedFileTable = ({appName}: {appName: string}) => {
  return (
    <StyledCard width="100%">
      <StyledEmptyDatabase/>
      <Title>Access Denied</Title>
      <Subtitle>{`The contents of this dataset are hidden because you do not have permission to see them. Please contact the project owner or a ${appName} admin to get access.`}</Subtitle>
    </StyledCard>
  );
}
