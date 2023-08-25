import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus
} from '@domino/api/dist/types';
import { Popover } from '../../../components';
import { colors } from '../../../styled';
import { themeHelper } from '../../../styled';
import ProjectStageSelect from './ProjectStageSelect';
import ProjectStatusSelect from './ProjectStatusSelect';
import { isComplete, isActive } from './Util';
import { StageIcon } from '../../../components/Icons';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import tooltipRenderer from '../../../components/renderers/TooltipRenderer';
import StageWrapper from './StageWrapper';

const Wrapper = styled.div`
  margin-bottom: 6px;
  padding: 4px;
  box-shadow: 1px 0 4px 0 ${colors.lightBlackThreeFive};
  cursor: pointer;
`;

const InnerWrapper = styled.div`
  padding: ${themeHelper('margins.tiny')};
  &:hover {
    border-radius: ${themeHelper('borderRadius.standard')};
  }
`;

const TitleWrapper = styled(FlexLayout)`
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const ProjectTitle = styled.div`
  max-width: 136px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 19px;
  color: ${themeHelper('nav.secondary.title.main.color')};
  font-weight: ${themeHelper('fontWeights.medium')};
`;

const OwnerName = styled.div`
  font-size: 11px;
  font-weight: ${themeHelper('fontWeights.medium')};
  line-height: 13px;
  letter-spacing: ${themeHelper('letterSpacings.tiny')};
  color: ${themeHelper('nav.secondary.title.sub.color')};
  margin-bottom: 12px;
`;

const StyledStageWrapper = styled(StageWrapper)`
  color: ${themeHelper('nav.secondary.title.sub.color')};
  font-size: 14px;
  line-height: 16px;
  font-weight: ${themeHelper('fontWeights.medium')};
`;

const StageTitle = styled.span`
  max-width: 165px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface StyledDotProps {
  size?: number;
  color?: string;
}

const StyledDot = styled('div')<StyledDotProps>`
  height: ${props => props.size || 10}px;
  width: ${props => props.size || 10}px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const statusToStatusDisplayColor = (status: string, isStatusBlocked?: boolean) => {
  return isStatusBlocked ? colors.rejectRedColor : isActive(status) ? colors.green : colors.neutralGrey;
};

export type Props = {
  project: Project;
  projectStageAndStatus?: ProjectStageAndStatus;
  updateProject?: (p: Project) => void;
  updateProjectStageAndStatus?: (projectStageAndStatus: ProjectStageAndStatus) => void;
  areStagesStale?: boolean;
  setAreStagesStale?: (areStagesStale: boolean) => void;
  theme?: any;
};

const StageContainer: React.FC<{stage: string, theme?: any}> = (props) => (
  <StyledStageWrapper circleStroke={1} noMargin={true}>
    <StageIcon primaryColor="none" secondaryColor={props.theme.nav.secondary.title.sub.color} viewBox="-1 -1 20 20" />
    <StageTitle>{props.stage}</StageTitle>
  </StyledStageWrapper>
);

const ProjectStageAndStatusSelect = (props: Props) => {
  const {project, projectStageAndStatus, updateProject, updateProjectStageAndStatus, areStagesStale,
    setAreStagesStale, theme} = props;
  if (!projectStageAndStatus) {
    return (
      <Wrapper>
        <InnerWrapper>
          <TitleWrapper justifyContent="flex-start" alignItems="center" data-test="titleWrap">
            {tooltipRenderer(props.project.name, <ProjectTitle data-test="projectTitle">{props.project.name}</ProjectTitle>, 'right')}
          </TitleWrapper>
          <OwnerName data-test="projectOwnerName">{project.owner.userName}</OwnerName>
        </InnerWrapper>
      </Wrapper>
    );
  }
  const {status, stage} = projectStageAndStatus;
  return (
    <Popover
      placement="rightTop"
      trigger="click"
      overlayClassName="appSwitcherPopover"
      overlayStyle={{zIndex: 1000}}
      title={!isComplete(status.status) &&
      <ProjectStageSelect
        project={project}
        updateProject={updateProject}
        updateProjectStageAndStatus={updateProjectStageAndStatus}
        areStagesStale={areStagesStale}
        setAreStagesStale={setAreStagesStale}
      />}
      content={(
        <ProjectStatusSelect
          project={project}
          updateProject={updateProject}
          updateProjectStageAndStatus={updateProjectStageAndStatus}
        />)}
    >
      <Wrapper>
        <InnerWrapper>
          <TitleWrapper justifyContent="flex-start" alignItems="center" data-test="titleWrap">
            <StyledDot color={statusToStatusDisplayColor(status.status, status.isBlocked)} size={8} data-test="status"/>
            {tooltipRenderer(props.project.name, <ProjectTitle data-test="projectTitle">{props.project.name}</ProjectTitle>, 'right')}
          </TitleWrapper>
          <OwnerName data-test="projectOwnerName">{project.owner.userName}</OwnerName>
          {stage && stage.stage && (
            <div className="sub-title" data-test="stageTitle">
              <StageContainer stage={stage.stage} theme={theme}/>
            </div>)}
        </InnerWrapper>
      </Wrapper>
    </Popover>
  );
};

export default withTheme(ProjectStageAndStatusSelect);
