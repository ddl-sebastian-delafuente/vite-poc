import * as React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import * as R from 'ramda';
import { kebabCase } from 'lodash';
import {
  DominoProjectsApiProjectGoal
} from '@domino/api/dist/types';
import { getProjectGoals } from '@domino/api/dist/Projects';
import Select from '@domino/ui/dist/components/Select';
import * as colors from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import Goal from '../icons/Goal';
import BadgeActionsModal from '../components/BadgeActionsModal';
import FlexLayout from '../components/Layouts/FlexLayout';

const LinkGoalContentHeaderWrap = styled.div`
  display: flex;
  align-items: center;
`;

const StyledGoalIcon = styled(Goal)`
  margin-right: 12px;
`;

const LinkGoalContent = styled.div`
  .ant-checkbox-wrapper {
    display: none;
  }
`;

const LinkGoalContentTitle = styled.div`
  color: ${colors.warmGrey};
  font-size: ${themeHelper('fontSizes.small')};
  font-weight: ${themeHelper('fontWeights.thick')};
  letter-spacing: ${themeHelper('letterSpacings.tiny')};
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const GoalOptionWrap = styled.div`
  display: inline-block;
  margin-left: ${themeHelper('margins.tiny')};
`;

const GoalDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const GoalTitle = styled.div`
  font-weight: ${themeHelper('fontWeights.bold')};
  text-overflow: ellipsis;
  overflow: hidden;
  width: 420px;
`;

const GoalDescription = styled.div`
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 420px;
`;

export interface GoalOptionProps {
  title: string;
  description?: string;
}

export const GoalOption = ({title, description}: GoalOptionProps) => (
  <GoalOptionWrap>
    <GoalDetails>
      <GoalTitle>{title}</GoalTitle>
      <GoalDescription>{description}</GoalDescription>
    </GoalDetails>
  </GoalOptionWrap>
);

export interface LinkGoalProps {
  isDisabled?: boolean;
  selectedIds: string[];
  buttonIcon: any;
  projectId: string;
  onSubmit: (selectedGoals: Array<string>) => void;
  onCancel?: () => void;
  noTooltip?: boolean;
  disabledReason?: string;
}

export interface LinkGoalState {
  goals: Array<DominoProjectsApiProjectGoal>;
  selectedGoals: Array<string>;
  loading: boolean;
}

class LinkGoal extends React.Component<LinkGoalProps, LinkGoalState> {
  constructor (props: LinkGoalProps) {
    super(props);
    this.state = {
      goals: [],
      selectedGoals: [],
      loading: false
    };
  }

  async componentDidMount() {
    await this.getGoals();
  }

  getGoals = async () => {
    const { projectId } = this.props;
    try {
      this.setState({ loading: true });
      const goals = await getProjectGoals({ projectId });
      this.setState({ goals });
    } catch (e) {
      console.error(e);
      this.setState({ goals: [] });
    }
    finally {
      this.setState({
        loading: false
      });
    }
  }

  setSelectedGoals = (selectedGoals: Array<string>) => {
    this.setState({ selectedGoals });
  }

  // this is how you custom search in antd Select components
  searchGoalsBasedOnTitle = (input: string, option: any) => {
    const title = R.pathOr('', ['props', 'children', 'props', 'title'], option);
    if (typeof title === 'string') {
      return title.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0;
    } else {
      return false;
    }
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.selectedGoals);
  }

  onCancel = () => {
    this.setState({
      selectedGoals: []
    });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render () {
    const { isDisabled, buttonIcon, selectedIds, noTooltip, disabledReason, ...rest } = this.props;
    const { loading } = this.state;
    const dataTest: string = rest['data-test'] || '';
    return (
      <BadgeActionsModal
        ids={selectedIds}
        disabled={isDisabled}
        buttonIcon={buttonIcon}
        submitButtonLabel="Link"
        disableSubmit={R.isEmpty(this.state.selectedGoals)}
        onHoverMessage={noTooltip ? undefined : 'Link Goals'}
        onSubmit={this.onSubmit}
        onCancel={this.onCancel}
        title={(
          <LinkGoalContentHeaderWrap>
            <StyledGoalIcon
              width={16}
              height={16}
              primaryColor={colors.basicLink}
            />
            <span>Link Goals</span>
          </LinkGoalContentHeaderWrap>
        )}
        disabledReason={disabledReason}
        testId={kebabCase(`${dataTest}-linkgoal`)}
        modalTestId={kebabCase(`${dataTest}-linkgoal-modal-`)}
        ariaLabel="link goals to job"
      >
        <LinkGoalContent>
          <LinkGoalContentTitle>Select Goals</LinkGoalContentTitle>
          <Select
            loading={loading}
            notFoundContent={loading ?
              <FlexLayout justifyContent={'center'}><Spin size="small" /></FlexLayout>
              : null}
            mode="multiple"
            style={{ width: '70%' }}
            dropdownStyle={{ zIndex: 2000, cursor: 'default' }}
            onChange={this.setSelectedGoals}
            filterOption={this.searchGoalsBasedOnTitle}
          >
            {
              R.map((goal: DominoProjectsApiProjectGoal) => (
                <Select.Option key={goal.id} value={goal.id}>
                  <GoalOption
                    title={goal.title}
                    description={goal.description}
                  />
                </Select.Option>
              ), this.state.goals)
            }
          </Select>
        </LinkGoalContent>
      </BadgeActionsModal>
    );
  }
}

export default LinkGoal;
