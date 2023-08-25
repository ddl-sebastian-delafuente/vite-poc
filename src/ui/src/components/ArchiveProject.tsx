import * as React from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import * as R from 'ramda';
import styled  from 'styled-components';
import { archiveProjectById } from '@domino/api/dist/Projects';
import Button from './Button/Button';
import Link from './Link/Link';
import Modal from './Modal';
import { projectRoutes } from '../navbar/routes';
import { colors } from '../styled';
import { error, success } from './toastr';
import { getProvisionedWorkspaceCount } from '@domino/api/dist/Workspace';
import pluralize from 'pluralize';

const ModalTitle = styled.span`
   > * {
    padding-right: 12px;
  }
  .anticon.anticon-warning {
    color: ${colors.rejectRedColor};
  }
`;
const WarningText = styled.p`
  color: ${colors.secondaryWarningRed};
`;

export type Props = {
  projectId: string;
  errorPageContactEmail: string
} & RouteComponentProps;

export type State = {
  visible: boolean;
  isDeletingProject: boolean;
  unarchivedWorkspaceCount: number;
};

class ArchiveProject extends React.Component<Props, State> {
  state: State = {
    visible: false,
    isDeletingProject: false,
    unarchivedWorkspaceCount: 0
  };

  getWorkspaceCount = (projectId: string) => getProvisionedWorkspaceCount({projectId});

  showModal = () => {
    this.getWorkspaceCount(this.props.projectId)
      .then(count => {
        this.setState({unarchivedWorkspaceCount: count});
      })
      .catch(err => {
        console.error(err);
      });
    this.setState({visible: true});
  }

  hideModal = () => this.setState({visible: false});

  handleArchiveButton = async () => {
    if (!this.state.isDeletingProject) {
      try {
        this.setState({isDeletingProject: true});
        await archiveProjectById({projectId: this.props.projectId});
        success(`Successfully archived the project.`);
        window.location.assign(projectRoutes.path());
      } catch (err) {
        console.warn(err);
        error('Project could not be archived.');
      } finally {
        this.setState({isDeletingProject: false});
      }
    }
  }

  render() {
    const workspaceCount = this.state.unarchivedWorkspaceCount;
    const archiveDisabled = workspaceCount > 0;
    const toolTipText = archiveDisabled ?
      `This project has ${workspaceCount} ${pluralize('workspace', workspaceCount)}.
      You must delete all workspaces before proceeding`
      : undefined;

    return <>
      <Button isDanger={true} onClick={this.showModal} testId="archive-project">Archive This Project</Button>
      <Modal
        title={
          <ModalTitle>
            <WarningOutlined />
            <span>Archive This Project?</span>
          </ModalTitle>
        }
        visible={this.state.visible}
        isDanger={true}
        okText="Archive"
        onCancel={this.hideModal}
        onOk={this.handleArchiveButton}
        confirmLoading={this.state.isDeletingProject}
        useLoadingButton={true}
        okButtonProps={{disabled: archiveDisabled}}
        okButtonTooltipText={toolTipText}
      >
        <div>
          <WarningText>You will not be able to undo this.</WarningText>
          <p>
            Data, code, and run history will no longer be available on the server and scheduled runs will stop
            running.
            None of the collaborators of this project will be able to upload or download using the command-line
            client.
          </p>

          <p>If this project has published an app to Launchpad, archiving this project will remove the app,
            and users will lose access to it.
          </p>

          <p>
            If any published models use this project, you must manually deactivate them to archive this project
            successfully.
          </p>
          <p>
            Once archived, please <Link
              href={`mailto:${!R.isNil(this.props.errorPageContactEmail)
              && this.props.errorPageContactEmail}`}
            > contact support
            </Link> if you wish to unarchive this project later.
          </p>
        </div>
      </Modal>
    </>;
  }
}

export default withRouter(ArchiveProject);
