import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Button, Input } from 'antd';
import styled from 'styled-components';
import { isEmpty, isNil } from 'ramda';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus
} from '@domino/api/dist/types';
import {
  raiseBlockerToProject,
  markProjectActive,
  markProjectComplete
} from '@domino/api/dist/Projects';
import DangerButton from '../../../components/DangerButton';
import Modal from '../../../components/Modal';
import { colors, themeHelper } from '../../../styled';
import { projectStatus, isBlocked, isComplete } from './Util';
import {
  getLink,
  routes,
  Routes
} from '../../routes';
import { filterTypes } from '../../../project/enum';
import { error } from '../../../components/toastr';
import Radio, { RadioChangeEvent } from '@domino/ui/dist/components/Radio';

export enum TestIds {
  MODAL = 'project-status-complete-modal-',
  RADIO_SELECT = 'project-status-radio-select'
}

const PROJECT_ITEMS: Routes = routes.LAB.children.PROJECTS.children;

const ContentWrapper = styled.div`
  width: 500px;
  padding: 10px 25px 0;
  .ant-radio-group {
    padding-bottom: 15px;
    width: 100%;
  }
  .ant-radio-button-wrapper {
    width: 225px;
    text-align: center;
    height: 40px;
    padding: 5px;
    font-size: ${themeHelper('fontSizes.medium')};
    line-height: 30px;
  }
  .ant-radio-button-wrapper-checked, .ant-radio-button-wrapper:active {
    margin: 0px;
    padding: 4px;
  }
  .ant-radio-button {
    width: calc(100% - 30px);
    height: 100%;
    position: absolute;
    input {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  .ant-space {
    gap: 0 !important;
  }
  .ant-btn-danger {
    background-color: ${colors.white};
    border-color: ${colors.rejectRedColor};
  }
  .ant-btn-primary {
    background-color: ${colors.white};
    border-color: ${colors.linkBlue};
    color: ${colors.linkBlue};
  }
`;
const SubmitButtonWrapper = styled.div`
  text-align: right;
  padding: 10px 0;
`;
const CompletedBlock = styled.div`
  padding: 30px;
  text-align: center;
`;
const CompletedTitle = styled.div`
  margin-bottom: 20px;
`;
const LabelWrapper = styled.span`
  margin-left: 15px;
`;
const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 15px 25px 0;
    text-align: center;
  }
  .ant-modal-footer {
    border: 0;
    padding: 25px;
    .ant-btn {
      width: 200px;
      height: 35px;
    }
    button + button {
      margin-left: 20px;
    }
  }
`;
const ModalTitle = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  padding: 10px;
`;

interface StyledDotProps {
  size?: number;
  color?: string;
}

const StyledDot = styled('span')<StyledDotProps>`
  height: ${props => props.size || 10}px;
  width: ${props => props.size || 10}px;
  border-radius: 50%;
  background-color: ${props => props.color};
  position: absolute;
  margin: 10px 0;
`;

export type Props = {
  project: Project;
  updateProject?: (p: Project) => void;
  updateProjectStageAndStatus?: (projectStageAndStatus: ProjectStageAndStatus) => void;
  className?: string;
};

export type State = {
  selectedStatus: string;
  blockedReason?: string | null;
  completedMessage?: string | null;
  modalVisible: boolean;
};

class ProjectStatusSelect extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedStatus: projectStatus.Active,
      modalVisible: false
    };
  }

  onSelectedStatusChange = (e: RadioChangeEvent) => {
    this.setState({selectedStatus: e.target.value});
  }

  raiseBlocker = async () => {
    if (this.state.blockedReason) {
      try {
        const newStageAndStatus = await raiseBlockerToProject({body: {
            projectId: this.props.project.id,
            blockerReason: this.state.blockedReason
          }});
        this.updateProjectStageAndStatus(newStageAndStatus);
      } catch (e) {
        console.warn(e);
        error('Failed to update project state');
      }
    }
  }

  markProjectComplete = async () => {
    if (this.state.completedMessage) {
      try {
        const newStageAndStatus = await markProjectComplete({body: {
            projectId: this.props.project.id,
            completeReason: this.state.completedMessage
          }});
        this.updateProjectStageAndStatus(newStageAndStatus);
        this.toggleModalVisibility();
      } catch (e) {
        error('Failed to update project state');
      }
    }
  }

  markProjectActive = async () => {
    try {
      const newStageAndStatus = await markProjectActive({body: {
          projectId: this.props.project.id,
        }});
      this.updateProjectStageAndStatus(newStageAndStatus);
    } catch (e) {
      error('Failed to update project state');
    }
  }

  updateProjectStageAndStatus = (newStageAndStatus: ProjectStageAndStatus) => {
    if (this.props.updateProject) {
      this.props.updateProject({...this.props.project, status: newStageAndStatus.status});
      if (this.props.updateProjectStageAndStatus) {
        this.props.updateProjectStageAndStatus(newStageAndStatus);
      }
      this.setState({completedMessage: null, blockedReason: null});
    }
  }

  onChange = (event: { target: { id: any, value: any } }) => {
    this.setState({ [event.target.id]: event.target.value } as Pick<State, keyof State>);
  }

  toggleModalVisibility = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  // Removing the @ts-ignore comments in the Button component might take an update to 'antd',
  // since it is mentioned in one of the SO answers for a similar problem that's prevalent in here.
  // Link: https://stackoverflow.com/questions/55631546/type-error-while-using-antd-button-with-typescript/55718521

  getStatusChangeContent = (project: Project) => {
    const { status } = project;
    if (status.isBlocked) {
      const link = getLink(PROJECT_ITEMS.ACTIVITY, project.owner.userName, project.name,
        filterTypes.Projects, 'true');
      return (
        <div>
          <div>{status.blockedReason}</div>
          <a href={link.href}>View and Reply</a>
          <SubmitButtonWrapper>
            {/* @ts-ignore */}
            <Button
              type="primary"
              onClick={this.markProjectActive}
              data-test="unblockButton"
            >
              Unblock
            </Button>
          </SubmitButtonWrapper>
        </div>
      );
    } else if (isComplete(status.status)) {
      return (
        <CompletedBlock>
          <CompletedTitle>The project has been completed</CompletedTitle>
          {/* @ts-ignore */}
          <Button
            type="primary"
            onClick={this.markProjectActive}
            data-test="reopneProjectButton"
          >
            Reopen Project
          </Button>
        </CompletedBlock>
      );
    } else {
      return (
        <div>
          {isBlocked(this.state.selectedStatus) && (
            <div>
              <Input.TextArea
                placeholder="Write a blocker description..."
                onChange={this.onChange}
                id="blockedReason"
                data-test="blockedReason"
              />
              <SubmitButtonWrapper>
                <DangerButton
                  onClick={this.raiseBlocker}
                  disabled={isEmpty(this.state.blockedReason) || isNil(this.state.blockedReason)}
                  data-test="raiseBlockerButton"
                >
                  Raise a Blocker
                </DangerButton>
              </SubmitButtonWrapper>
            </div>)}
          {isComplete(this.state.selectedStatus) && (
            <div>
              <Input.TextArea
                placeholder="Add a conclusion..."
                onChange={this.onChange}
                id="completedMessage"
                data-test="completedMessage"
              />
              <SubmitButtonWrapper>
                {/* @ts-ignore */}
                <Button
                  type="primary"
                  onClick={this.toggleModalVisibility}
                  // @ts-ignore
                  disabled={
                    isEmpty(this.state.completedMessage) || isNil(this.state.completedMessage)
                  }
                  data-test="endProjectButton"
                >
                  End Project
                </Button>
              </SubmitButtonWrapper>
            </div>)}
        </div>
      );
    }
  }

  render() {
    const { status } = this.props.project;
    const items = [
      {
        key: projectStatus.Blocked,
        value: projectStatus.Blocked,
        'data-test': 'ImBlockedButton',
        label: <><StyledDot className="circle" color={colors.rejectRedColor} />
          <LabelWrapper>I'm Blocked</LabelWrapper></>,
        style: { borderRadius: '20px 0 0 20px' }
      },
      {
        key: projectStatus.Completed,
        value: projectStatus.Completed,
        disabled: status.isBlocked,
        'data-test': 'CompleteProjectButton',
        label: <><StyledDot className="circle" color={colors.neutralGrey} />
          <LabelWrapper>Complete Project</LabelWrapper></>,
        style: { borderRadius: '0 20px 20px 0' }
      }
    ];
    return (
      <ContentWrapper className={this.props.className}>
        {!isComplete(status.status) && (
          <Radio
            onChange={this.onSelectedStatusChange}
            value={this.state.selectedStatus}
            optionType="button"
            dataTest={TestIds.RADIO_SELECT}
            size='large'
            direction='horizontal'
            spaceSize='small'
            items={items}
          />)}
        {this.getStatusChangeContent(this.props.project)}
        <StyledModal
          visible={this.state.modalVisible}
          okText={'Confirm'}
          onOk={this.markProjectComplete}
          onCancel={this.toggleModalVisibility}
          width="470px"
          zIndex={1200}
          testId={TestIds.MODAL}
        >
          <ModalTitle>Are you sure about to end this project?</ModalTitle>
        </StyledModal>
      </ContentWrapper>
    );
  }
}

export default ProjectStatusSelect;
