import * as React from 'react';
import * as R from 'ramda';
import { linkFileToGoal } from '@domino/api/dist/ProjectManagement';
import SecondaryButton from '../components/SecondaryButton';
import { FlexLayout } from '../components/Layouts/FlexLayout';
import { SeparatedToolbar as Toolbar } from '../components/Toolbar';
import { downloadUrl } from './queryUtil';
import FilePathBreadCrumbs, { Props as BreadcrumbProps } from './FilePathBreadCrumbs';
import CreateDataSetFromFilesModal from './CreateDataSetFromFilesModal';
import AddFolderModal from './AddFolderModal';
import CSRFInputField from './CSRFInputField';
import AddFileButton from './AddFileButton';
import UploadFilesButton from './UploadFilesButton';
import DownloadFilesButton from './DownloadFilesButton';
import BulkActionsDropdown from './BulkActionsDropdown';
import CloneFileTreeDropdown from './CloneFileTreeDropdown';
import {
  error as ToastError,
  success as ToastSuccess
} from '../components/toastr';
import { getErrorMessage } from '../components/renderers/helpers';

const createDatasetFromFilesInputProps = {
  componentClass: 'input',
  help: 'Data set name',
  id: 'inputName',
  label: 'Data Set Name',
};

const downloadSelectedFiles = (
  MaxDownloads: number,
  allowFolderDownloads: boolean,
  downloadSelectedUrl: string,
  selectedPaths: Entity[],
  currentCommitId: string,
  projectOwnername: string,
  projectName: string,
  onError: (message?: string) => void,
) => () => {
  onError();

  if (selectedPaths.length === 0)  {
      onError('Use the checkboxes on the left to select the files you want to download.');
      return;
  }

  if (selectedPaths.length > MaxDownloads) {
    onError(`At the moment you can't download more than ${MaxDownloads} files at a time, sorry.`);
    return;
  }

  const downloadAsZip = allowFolderDownloads && selectedPaths.length > 1;
  if (downloadAsZip) {
    downloadUrl(downloadSelectedUrl, 'POST', selectedPaths.map(x => x.path));
  } else {
    selectedPaths.forEach((path: Entity) => {
      downloadUrl(path.downloadUrl, 'GET');
    });
  }
};

export type Entity = {
  downloadUrl: string;
  isDir: boolean;
  path: string;
};

export type Props = {
  showDropZone: () => void;
  setDownloadErrorMessage: (message?: string) => void;
  successfulFilesRemovalEndpoint: string;
  currentCommitId: string;
  createFolderEndpoint: string;
  breadcrumbData: BreadcrumbProps['breadCrumbs'];
  selectedEntities: Entity[];
  ownerUsername: string;
  projectName: string;
  allowFolderDownloads: boolean;
  createDatasetFromProjectEndpoint: string;
  maxAllowedFileDownloads: number;
  csrfToken: string;
  areDataProjectsEnabled: boolean;
  currentDirPath: string;
  isAnalyticProject: boolean;
  userIsAllowedToEditProject: boolean;
  createFileEndpoint: string;
  projectContainsCommits: boolean;
  atHeadCommit: boolean;
  downloadSelectedEntitiesEndpoint: string;
  downloadCLIPageEndpoint: string;
  downloadProjectFolderAsZipEndpoint: string;
  projectId: string;
  isLiteUser?: boolean;
  hideCloneButton?: boolean;
};

export type State = {
  disableDownloadButton: boolean;
  disableRemoveFilesButton: boolean;
  disableBulkOperationsDropdown: boolean;
  disableMakeDatasetButton: boolean;
};

export default class ActionBar extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disableDownloadButton: !this.isDownloadButtonEnabled(),
      disableRemoveFilesButton: !this.isBulkOperationsEnabled(),
      disableBulkOperationsDropdown: !this.isBulkOperationsEnabled(),
      disableMakeDatasetButton: !this.isBulkOperationsEnabled(),
    };
  }

  componentDidUpdate() {
    this.setState({
      disableDownloadButton: !this.isDownloadButtonEnabled(),
      disableRemoveFilesButton: !this.isBulkOperationsEnabled(),
      disableBulkOperationsDropdown: !this.isBulkOperationsEnabled(),
      disableMakeDatasetButton: !this.isBulkOperationsEnabled(),
    });
  }

  isDownloadButtonEnabled = () => {
    const { allowFolderDownloads } = this.props;
    return this.isBulkOperationsEnabled() && (
      allowFolderDownloads || this.getSelectedFolders().length === 0
    );
  }

  getSelectedFolders = () => {
    return this.props.selectedEntities.filter(({ isDir }: Entity) => isDir);
  }

  isBulkOperationsEnabled = () => this.props.selectedEntities.length > 0;

  onGoalsLink = async (goalIds: Array<string>) => {
    try {
      const { projectId, currentCommitId, selectedEntities } = this.props;
      const promises: Promise<any>[] = [];
      R.forEach(goalId => {
        R.forEach(({ path }) => {
          promises.push(linkFileToGoal({
            body: {
              projectId: projectId,
              goalId: goalId,
              commitId: currentCommitId,
              fileName: path
            }
          }));
        }, selectedEntities);
      }, goalIds);
      const responseArray = await Promise.all(promises);
      const errorResponse: any[] = R.filter(R.has('code'), responseArray);
      if (!R.isEmpty(errorResponse)) {
        R.forEach((response) => ToastError(response.message), errorResponse);
      } else {
        ToastSuccess('Successfully linked goals to selected files');
      }
    } catch (e) {
      ToastError(await getErrorMessage(e, 'Failed to link goals to one or more selected files'));
    }
  }

  render() {
    const {
      downloadCLIPageEndpoint,
      downloadProjectFolderAsZipEndpoint,
      currentDirPath,
      areDataProjectsEnabled,
      breadcrumbData,
      isAnalyticProject,
      ownerUsername,
      createDatasetFromProjectEndpoint,
      csrfToken,
      userIsAllowedToEditProject,
      createFileEndpoint,
      projectContainsCommits,
      atHeadCommit,
      createFolderEndpoint,
      maxAllowedFileDownloads,
      allowFolderDownloads,
      downloadSelectedEntitiesEndpoint,
      projectName,
      selectedEntities,
      currentCommitId,
      successfulFilesRemovalEndpoint,
      setDownloadErrorMessage,
      showDropZone,
      projectId,
      hideCloneButton
    } = this.props;
    const {
      disableDownloadButton,
      disableBulkOperationsDropdown,
      disableRemoveFilesButton,
    } = this.state;
    const selectedPaths = selectedEntities.map((entity: Entity) => entity.path);
    const isUserLite = Boolean(this.props.isLiteUser);

    return (
      <FlexLayout
        itemSpacing={0}
        flexDirection="unset"
        justifyContent="unset"
        alignItems="unset"
        flexWrap="unset"
        alignContent="unset"
      >
        <CSRFInputField csrfToken={csrfToken} />
        <FilePathBreadCrumbs
          breadCrumbs={breadcrumbData}
          shouldTruncate={true}
          data-test="FileBrowserFilePathBreadCrumbs"
        />
        <Toolbar data-test="FileBrowserActionsToolbar">
          {areDataProjectsEnabled && isAnalyticProject && (
            <CreateDataSetFromFilesModal
              CustomButton={SecondaryButton}
              inputField={createDatasetFromFilesInputProps}
              selectedFilePaths={selectedPaths}
              username={ownerUsername}
              submitUrl={createDatasetFromProjectEndpoint}
              csrfToken={csrfToken}
              submitLabel="Extract Data Set"
              cancelLabel="Cancel"
              title="Extract Data Set"
            />
          )}
          {userIsAllowedToEditProject &&
            <AddFileButton createFileEndpoint={createFileEndpoint} isLiteUser={isUserLite}/>}
          {userIsAllowedToEditProject && (
            <AddFolderModal
              projectName={projectName}
              ownerUsername={ownerUsername}
              createFolderEndpoint={createFolderEndpoint}
              csrfToken={csrfToken}
              dirPath={currentDirPath}
              isLiteUser={isUserLite}
            />
          )}
          {projectContainsCommits && atHeadCommit && userIsAllowedToEditProject && (
            <UploadFilesButton showDropZone={showDropZone} isLiteUser={isUserLite} />
          )}
          <DownloadFilesButton
            handleDownloadFiles={downloadSelectedFiles(
              maxAllowedFileDownloads,
              allowFolderDownloads,
              downloadSelectedEntitiesEndpoint,
              selectedEntities,
              currentCommitId,
              ownerUsername,
              projectName,
              setDownloadErrorMessage,
            )}
            disabled={disableDownloadButton}
            isLiteUser={isUserLite}
          />
          {userIsAllowedToEditProject && (
            <BulkActionsDropdown
              disableRemoveFilesButton={disableRemoveFilesButton}
              successfulFilesRemovalEndpoint={successfulFilesRemovalEndpoint}
              projectContainsCommits={projectContainsCommits}
              atHeadCommit={atHeadCommit}
              userIsAllowedToEditProject={userIsAllowedToEditProject}
              disabled={disableBulkOperationsDropdown}
              projectName={projectName}
              relativePath={currentDirPath}
              ownerUsername={ownerUsername}
              selectedEntities={selectedEntities}
              onGoalsLink={this.onGoalsLink}
              projectId={projectId}
              isLinkGoalsDisabled={!!this.getSelectedFolders().length}
              isLiteUser={isUserLite}
            />
          )}
          {!hideCloneButton && (
            <CloneFileTreeDropdown
              downloadProjectFolderAsZipEndpoint={downloadProjectFolderAsZipEndpoint}
              allowFolderDownloads={allowFolderDownloads}
              downloadCLIPageEndpoint={downloadCLIPageEndpoint}
              ownerUsername={ownerUsername}
              projectName={projectName}
              isLiteUser={isUserLite}
            />
          )}
        </Toolbar>
      </FlexLayout>
    );
  }
}
