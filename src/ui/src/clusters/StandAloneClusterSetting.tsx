import * as React from 'react';
import styled from 'styled-components';
import FlexLayout from '../components/Layouts/FlexLayout';
import Link from '../components/Link/Link';
import ClusterIcon from '../icons/ClusterIcon';
import * as colors from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import { projectRoutes } from '../navbar/routes';

const StyledClusterIcon = styled(ClusterIcon)`
  margin: ${themeHelper('margins.tiny')} 0 ${themeHelper('margins.large')};
`;

const StyledLabel = styled.label`
  font-weight: ${themeHelper('fontWeights.bold')};
  color: ${colors.brownGrey};
  margin-bottom: 0  ;
`;

const HelpText = styled.div`
  margin-top: ${themeHelper('margins.medium')};
  font-size: 13px;
  width: 100%;
  text-align: center;
`;

const StyledLink = styled(Link)`
  margin-left: 10px;
  font-size: 13px;
`;

export interface StandAloneClusterProps {
  projectName: string;
  ownerName: string;
  sparkClusterMode: string;
}

const StandAloneClusterSetting = ({ projectName, ownerName,
  sparkClusterMode }: StandAloneClusterProps) => (
  <FlexLayout flexDirection="column" data-test="standalone-cluster-settings">
    <StyledClusterIcon height={50} width={50} primaryColor={colors.brownGrey} />
    <StyledLabel>Spark Cluster:</StyledLabel>
    <div>{`${sparkClusterMode} mode`}</div>
    <HelpText>This setting can be changed under 
      <StyledLink
        href={`${projectRoutes.children.SETTINGS_INTEGRATION.path(ownerName, projectName)}`}
        data-test="project-settings-navlink"
      >
        Project Settings
      </StyledLink>
    </HelpText>
  </FlexLayout>
);

export default StandAloneClusterSetting;
