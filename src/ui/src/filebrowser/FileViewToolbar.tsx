import * as React from 'react';
import * as R from 'ramda';
import {
  linkFileToGoal
} from '@domino/api/dist/ProjectManagement';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoCommonUserPerson as User,
} from '@domino/api/dist/types';
import Button, { ExtendedButtonProps } from '../components/Button/Button';
import { SeparatedToolbar as Toolbar } from '../components/Toolbar';
import DangerButtonDark from '../components/DangerButtonDark';
import SecondaryButton from '../components/SecondaryButton';
import {
  error as ToastError,
  success as ToastSuccess
} from '../components/toastr';
import { baseFileViewPath } from '../core/routes';
import { getErrorMessage } from '../components/renderers/helpers';
import { ReduxlessWithForm as ForkProjectActions } from '../components/ForkActions';
import LinkGoal from '../goals/LinkGoal';
import { copyShareLink } from './util';
import FullDeleteModal from './FullDeleteModal';
import { ProjectVisibility } from './types';
import EditFileModal from './EditFileModal';
import { listBranchesForProject } from '@domino/api/dist/Files';

const ForkButton = (props: ExtendedButtonProps) => (
  // @ts-ignore
  <Button {...props} btnType="secondary">
    Fork
  </Button>
);

const getFileViewUrl = (filePath: string) => (userName: string, projectName: string): string =>
  baseFileViewPath(userName, projectName, filePath);

const handleNavigation = {
  push: (route: string) => {
    // navigate using the window
    window.location.assign(route);
  },
};

export type Props = {
  userCanEditProjectFiles: boolean;
  project?: Project;
  user?: User;
  editFileLink: string;
  compareRevisionsLink: string;
  downloadFileLink: string;
  viewRawFileLink: string;
  sharedFileViewLink: string;
  isLatestCommit: boolean;
  projectId: string;
  commitId: string;
  path: string;
  projectVisibility: ProjectVisibility;
  userIsAllowedToFullDelete: boolean;
};

type State = {
  hasMultipleBranches: boolean
};

class FileViewToolBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // show the modal by default in case the request fails
    this.state = {hasMultipleBranches : true};
  }

  componentDidMount = async () => {
    try {
      const allBranches = await listBranchesForProject({
        projectId: this.props.projectId!,
        query: ''
      });
      this.setState({
        hasMultipleBranches: allBranches.length > 1
      });
    } catch (e: any) {
      console.error(e);
      this.setState({
        hasMultipleBranches: true
      });
    }
  }

  onGoalsLink = async (goalIds: Array<string>) => {
    try {
      const { projectId, commitId, path } = this.props;
      const promises: Promise<any>[] = [];

      R.forEach(goalId => {
        promises.push(linkFileToGoal({
          body: {
            projectId: projectId,
            goalId: goalId,
            commitId: commitId,
            fileName: path
          }
        }));
      }, goalIds);

      const responseArray = await Promise.all(promises);
      const errorResponse: any[] = R.filter(R.has('code'), responseArray);
      if (!R.isEmpty(errorResponse)) {
        R.forEach((response) => ToastError(response.message), errorResponse);
      } else {
        ToastSuccess('Successfully linked goals to this file');
      }
    } catch (e) {
      ToastError(await getErrorMessage(e, 'Failed to link goals to this file'));
    }
  }

  copyShareableLink = () => {
    const {
      sharedFileViewLink,
      projectVisibility
    } = this.props;
    copyShareLink(sharedFileViewLink, projectVisibility);
  }

  render () {
    const {
      userIsAllowedToFullDelete,
      editFileLink,
      compareRevisionsLink,
      downloadFileLink,
      viewRawFileLink,
      isLatestCommit,
      projectId,
      userCanEditProjectFiles,
      project,
      user,
      path,
      commitId,
    } = this.props;

    return (
      <Toolbar data-test="FileViewToolBar">
        {!!project && (
          <ForkProjectActions
            ForkButton={ForkButton}
            getOnForkSuccessRedirectUrl={getFileViewUrl(path)}
            showForkButton={true}
            project={project}
            currentUser={user}
            isAnonymous={!userCanEditProjectFiles}
            history={handleNavigation}
          />
        )}
        {userCanEditProjectFiles && ((this.state.hasMultipleBranches && !isLatestCommit) ?
          <EditFileModal
            editFileLink={editFileLink}
            OpenModalButton={SecondaryButton}
          /> :
          <SecondaryButton href={editFileLink} data-test="EditButton">
            Edit
          </SecondaryButton>
        )}
        <SecondaryButton href={compareRevisionsLink} data-test="CompareRevisionsButton">
          Compare Revisions
        </SecondaryButton>
        <SecondaryButton href={downloadFileLink} data-test="DownloadButton">
          Download
        </SecondaryButton>
        <SecondaryButton href={viewRawFileLink} data-test="ViewLatestRawFileButton">
          View Latest Raw File
        </SecondaryButton>
        <SecondaryButton onClick={this.copyShareableLink} data-test="ShareButton">
          Copy Shareable Link
        </SecondaryButton>
        {userCanEditProjectFiles && (
          <LinkGoal
            selectedIds={[]}
            isDisabled={false}
            projectId={projectId}
            onSubmit={this.onGoalsLink}
            buttonIcon={(
              <SecondaryButton data-test="LinkGoalButton">
                Link to Goal
              </SecondaryButton>
            )}
          />
        )}
        {userIsAllowedToFullDelete && project && (
          <FullDeleteModal
            OpenModalButton={DangerButtonDark}
            commitId={commitId}
            filePath={path}
            projectId={project.id}
            projectName={project.name}
            projectOwnerName={project.owner.userName}
          />
        )}
      </Toolbar>
    );
  }
}

export default FileViewToolBar;
