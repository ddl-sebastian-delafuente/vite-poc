import Button from '../components/Button/Button';
import * as React from 'react';
import FlexLayout from '../components/Layouts/FlexLayout';
import Link from '../components/Link/Link';
import Modal from '../components/Modal';
import styled from 'styled-components';
import EditInlineContainer from '../components/EditInline/EditInlineContainer';
import { EditInlineContainerProps } from '../components/EditInline/EditInlineContainer';
import EnvironmentSharingFields, { EnvironmentSharingFieldsProps } from './EnvironmentSharingFields';
import { themeHelper } from '../styled';
import { gallery, white } from '../styled/colors';
import withStore, { StoreProps } from '../globalStore/withStore';
import { getAppName } from '../utils/whiteLabelUtil';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const VisibilityModal = styled(Modal)`
  max-width: 480px;
  .ant-modal-footer {
    padding: 0;
    border: 0;
  }
`;

const StyledVisibilityModalFooter = styled(FlexLayout)`
  margin-top: ${themeHelper('margins.small')};
`;

const StyledForm = styled.form`
  margin: 0;
`;

const StyledSpan = styled.span`
  padding: 4px;
`;

const EnvironmentContainer = styled(FlexLayout)`
  letter-spacing: 0.65px;
`;

const EnvironmentHeader = styled(FlexLayout)`
  margin: ${themeHelper('margins.small')};
  box-sizing: border-box;
  border: 1px solid ${gallery};
  border-radius: ${themeHelper('borderRadius.standard')};
  background-color: ${white};
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2) 0 1px 5px 0 rgba(0,0,0,0.13);
  min-height: 113px;
  min-width: 1141px;
  padding: ${themeHelper('margins.small')};
`;

const StyledHeading = styled.div`
  font-size: ${themeHelper('fontSizes.small')};;
  line-height: 16px;
`;

export interface PageActionProps {
  visibilityInfo: string;
  canCreateEnvironments: boolean;
  environmentName: string;
  duplicateEnvironmentAction: string;
  setActiveRevisionAction: string;
  editAction: string;
  archiveAction: string;
  editVisibilityAction: string;
  activeRevisionIsEmpty: boolean;
  viewModelActiveRevisionFollowingLatest: boolean;
  canEdit: boolean;
  csrfFormToken: any;
  environmentsUrl: string;
  isDefaultEnvironment: boolean;
  description: string;
}

export interface EnvironmentsDetailProps extends StoreProps {
  environmentNameOptions: EditInlineContainerProps;
  pageActionProps: PageActionProps;
  environmentSharingFieldsProps: EnvironmentSharingFieldsProps;
}

export interface EnvironmentsDetailStateProps {
  archiveModalVisible: boolean;
  editVisibilityModalVisible: boolean;
}

class EnvironmentsDetail extends React.Component<EnvironmentsDetailProps, EnvironmentsDetailStateProps> {
  constructor(props: EnvironmentsDetailProps) {
    super(props);
    this.state = {
      archiveModalVisible: false,
      editVisibilityModalVisible: false,
    };
  }

  showVisibilityModal = () => {
    this.setState({
      editVisibilityModalVisible: true,
    });
  }

  showModal = () => {
    this.setState({
      archiveModalVisible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      archiveModalVisible: false,
      editVisibilityModalVisible: false,
    });
  }

  getPageActions = () => {
    const {
      environmentName,
      canCreateEnvironments,
      duplicateEnvironmentAction,
      setActiveRevisionAction,
      editAction,
      activeRevisionIsEmpty,
      archiveAction,
      viewModelActiveRevisionFollowingLatest,
      canEdit,
      csrfFormToken,
    } = this.props.pageActionProps;

    if (!canCreateEnvironments) {
      return (
        <React.Fragment>
          <div className="alert alert-warning text-left">
            Only System Administrators can create compute environments.
            Please contact your {getAppName(this.props.whiteLabelSettings)} Admin if you have any questions.
          </div>
        </React.Fragment>
      );
    }

    const csrfField = <input type="hidden" name="csrfToken" value={csrfFormToken} />;
    const archiveModalFooter = (
      <StyledForm action={archiveAction} method="POST">
        {csrfField}
        <FlexLayout justifyContent="flex-end">
          <Button btnType="secondary" onClick={this.handleCancel}>Cancel</Button>
          <Button isDanger={true} htmlType="submit">Archive</Button>
        </FlexLayout>
      </StyledForm>
    );
    return (
      <FlexLayout>
        {
          canEdit && (
            <React.Fragment>
              {
                !viewModelActiveRevisionFollowingLatest &&
                <span>
                  <StyledForm action={setActiveRevisionAction} method="POST">
                    {csrfField}
                    <Button htmlType="submit">Set Active Revision to Latest</Button>
                  </StyledForm>
                </span>
              }
              <Button href={editAction} btnType="icon" icon={<EditOutlined />} disabled={activeRevisionIsEmpty} />
            </React.Fragment>
          )
        }
        <span>
          <StyledForm action={duplicateEnvironmentAction} method="POST">
            {csrfField}
            <Button htmlType="submit" icon={<CopyOutlined />} btnType="icon" disabled={activeRevisionIsEmpty} />
          </StyledForm>
        </span>
        {
          canEdit && (<React.Fragment>
            <Button isDanger={true} btnType="icon" icon={<DeleteOutlined />} onClick={this.showModal} />
            <Modal
              title="Archive Environment"
              visible={this.state.archiveModalVisible}
              okText="Archive"
              footer={archiveModalFooter}
              onCancel={this.handleCancel}
            >
              <p><strong className="text-danger">You will not be able to undo this.</strong></p>
              <p>Are you sure you want to archive the environment
                <StyledSpan>
                  '{environmentName}'?
                </StyledSpan>
              </p>
            </Modal>
          </React.Fragment>
          )
        }
      </FlexLayout>
    );
  }

  render() {
    const {
      value,
      placeholder,
      disabled: disabledEditInline,
      handleFailableSubmit
    } = this.props.environmentNameOptions;

    const {
      environmentsUrl,
      visibilityInfo,
      isDefaultEnvironment,
      canEdit,
    } = this.props.pageActionProps;

    const {
      canTransferOwnership,
      canCreateGlobalEnvironment,
      visibility,
      selected,
      usersForEnvironment,
      isUsersForEnvironmentEmpty,
      ownerOrViewerId,
      ownerOrViewerUserName,
    } = this.props.environmentSharingFieldsProps;

    const pageActions = this.getPageActions();
    const EditableName = (
      <EditInlineContainer
        value={value}
        placeholder={placeholder}
        disabled={disabledEditInline}
        handleFailableSubmit={handleFailableSubmit}
      />);

    const {
      editVisibilityAction,
      csrfFormToken
    } = this.props.pageActionProps;
    const csrfField = <input type="hidden" name="csrfToken" value={csrfFormToken} />;
    const editVisibilityModalBody = (
      <StyledForm action={editVisibilityAction} method="POST">
        {csrfField}
        <EnvironmentSharingFields
          canTransferOwnership={canTransferOwnership}
          canCreateGlobalEnvironment={canCreateGlobalEnvironment}
          visibility={visibility}
          selected={selected}
          usersForEnvironment={usersForEnvironment}
          isUsersForEnvironmentEmpty={isUsersForEnvironmentEmpty}
          ownerOrViewerId={ownerOrViewerId}
          ownerOrViewerUserName={ownerOrViewerUserName}
        />
        <StyledVisibilityModalFooter justifyContent="flex-end">
          <Button btnType="secondary" onClick={this.handleCancel}>Cancel</Button>
          <Button isDanger={true} htmlType="submit">Update Visibility</Button>
        </StyledVisibilityModalFooter>
      </StyledForm>
    );
    return (
      <EnvironmentContainer flexDirection="column" alignItems="flex-start">
        <div>
          <Link type="backward-link" href={environmentsUrl}>Back to
            Environments List</Link>
        </div>
        <EnvironmentHeader justifyContent="space-between" >
          <div>
            {EditableName}
            <FlexLayout justifyContent="flex-start">
              <StyledHeading>Visibility:</StyledHeading>
              <div>{visibilityInfo}</div>
              <div>
                {(canEdit && !isDefaultEnvironment) &&
                  <React.Fragment>
                    <Button btnType="icon-small" icon={<EditOutlined />} onClick={this.showVisibilityModal} />
                    <VisibilityModal
                      title="Edit Environment Visibility"
                      visible={this.state.editVisibilityModalVisible}
                      footer={<React.Fragment />}
                      zIndex={1000}
                    >
                      {editVisibilityModalBody}
                    </VisibilityModal>
                  </React.Fragment>
                }
              </div>
            </FlexLayout>
          </div>
          {pageActions}
        </EnvironmentHeader>
      </EnvironmentContainer>
    );
  }
}

export default withStore(EnvironmentsDetail);
