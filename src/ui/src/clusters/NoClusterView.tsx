import * as React from 'react';
import styled from 'styled-components';
import { SUPPORT_ARTICLE } from '@domino/ui/dist/core/supportUtil';
import * as colors from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import FlexLayout from '../components/Layouts/FlexLayout';
import HelpLink from '../components/HelpLink';
import ClusterIcon from '../icons/ClusterIcon';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const StyledFlexLayout = styled(FlexLayout)`
  height: 350px;
`;

const StyledIcon = styled(ClusterIcon)`
  margin-bottom: 12px;
  line-height: 1;
`;

const Title = styled.div`
  font-size: ${themeHelper('fontSizes.large')};
  line-height: 24px;
  text-align: center;
  margin-bottom: 12px;
  color: ${colors.mineShaftColor};
`;

const Description = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  line-height: 18px;
  text-align: center;
  margin-bottom: 12px;
  color: ${colors.mineShaftColor};
`;

const Note = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  line-height: 16px;
  text-align: center;
  margin-bottom: ${themeHelper('margins.medium')};
  color: ${colors.boulder};
`;

const NoClusterView: React.FC<{}> = () => {
  const { whiteLabelSettings } = useStore();
  return (
  <StyledFlexLayout flexDirection="column" alignContent="center">
    <StyledIcon height={70} width={70} primaryColor={colors.darkGray} />
    <Title>Compute Clusters</Title>
    <Description>
      {getAppName(whiteLabelSettings)} managed compute clusters provide additional distributed computational power for workspaces and jobs.
    </Description>
    <Note>
      Note: First choose an execution environment that has the corresponding client libraries for the
      cluster you desire.
    </Note>
    <HelpLink
      text="Learn about Compute Clusters in our docs"
      showIcon={false}
      articlePath={SUPPORT_ARTICLE.COMPUTE_CLUSTER}
    />
  </StyledFlexLayout>);
};

export default NoClusterView;
