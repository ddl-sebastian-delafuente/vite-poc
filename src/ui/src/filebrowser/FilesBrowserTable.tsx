import * as React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import styled, { withTheme } from 'styled-components';
import { InfoCircleFilled, MoreOutlined } from '@ant-design/icons';
import {
  DominoNucleusLibAuthPrincipalWithFeatureFlags as PrincipalWithFeatureFlags,
} from '@domino/api/dist/types';
import { linkFileToGoal } from '@domino/api/dist/ProjectManagement';
import { isLiteUser } from '@domino/api/dist/Users';
import { startJob } from '@domino/api/dist/Jobs';
import { getPrincipal } from '@domino/api/dist/Auth';
import { atOldFilesVersion, FileSummary, renderFileName } from './filesBrowserUtil';
import { FlexLayout } from '../components/Layouts/FlexLayout';
import DangerBox from '../components/Callout/DangerBox';
import { prettyBytes } from '../utils/prettyBytes';
import { getFileDirName } from '../utils/shared-components/validateFileNameFormUtil';
import { themeHelper } from '../styled/themeUtils';
import OldRevisionInteractiveMessage from './OldRevisionInteractiveMessage';
import BulkMoveDialog from './BulkMoveDialog';
import { browseFilesHead, runDashboardRun } from '../core/routes';
import DropZoneUploader from './DropZoneUploader';
import RenameFileDirModal from './RenameFileDirModal';
import { ProjectSectionRestfulJobsLauncher as JobsLauncherModal } from '../runs/JobsLauncherWithNucleus';
import RevisionControl from './RevisionControl';
import FileTable from '../components/FileBrowserTable';
import ActionBar from './ActionBar';
import RemoveFilesConfirmationModal from './RemoveFilesConfirmationModal';
import WarningBox from '../components/WarningBox';
import ActionDropdown from '../components/ActionDropdown';
import LinkGoal from '../goals/LinkGoal';
import * as colors from '../styled/colors';
import {
  error as ToastError,
  success as ToastSuccess,
  warning as ToastWarning
} from '../components/toastr';
import { getErrorMessage } from '../components/renderers/helpers';
import { titleWithGoalsInfoRenderer } from '../components/renderers/tableColumns';
import {
  clearPreviousDataStorage,
  getPreviouslySelectedValue,
  previousDataStorageKeys
} from '../confirmRedirect/confirmRedirectToLogin';
import { RELOGIN_JOB_START_FAIL }  from '../navbar/projects/SubNavJobLauncher';
import { RELOGIN_WS_LAUNCH_FAIL } from '../restartable-workspaces/Launcher';
import { RevertHistoryButton } from './RevertHistoryButton';
import { EntityType, RevisionShape, FileBrowserNameColumnData, ProjectVisibility } from './types';
import { copyShareLink } from './util';
import FullDeleteModal from './FullDeleteModal';
import HelpLink from '../components/HelpLink';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import LaunchNotebook from './LaunchNotebook';
import { launchNotebookAfterRelogin, ReturnValues } from './LaunchNotebookUtil';
import { getCommand } from '../utils/common';
import { PRINCIPAL } from '../utils/principalConstants';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import withStore, { StoreProps } from '../globalStore/withStore';
import { fontSizes } from '../styled';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';

const ProjectSizeInfoTooltipText = `This includes Domino file storage, linked projects and connected Git repos.
To maintain Job and Workspace performance, consider reducing mounted file size by using Domino Datasets for more
effecient data storage.`;

const enableDiskUsageVolumeCheck = false;

const FileMenuWrapper = styled.div`
  .ant-dropdown-menu-item {
    padding-left: 0;
    padding-right: 0;
  }
  .ant-dropdown-menu-item div {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const StyledHelpLink = styled(HelpLink)`
  padding-left: 0.25em;
`

const ProjectSizeInfo = styled.div`
  display: inline-flex;
  border: 1px solid ${colors.greylight3};
  border-radius: ${themeHelper('borderRadius.standard')};
  color: ${colors.mineShaftColor};
`;

const ProjectSizeLabel = styled.div`
  display: inline-flex;
  padding: ${themeHelper('margins.tiny')};
  border-right: 1px solid ${colors.greylight3};
`;

const ProjectSizeInfoIconWrapper = styled.span`
  display: inline-block;
  margin-left: 10px;
`;

const ProjectSizeValue = styled.div`
  display: inline-flex;
  padding: ${themeHelper('margins.tiny')};
  .unit {
    margin-left: ${themeHelper('margins.tiny')};
    color: ${colors.boulderLight};
    font-size: ${themeHelper('fontSizes.tiny')};
    line-height: 22px;
  }
`;

const getRowMargin = themeHelper('margins.tiny');

const isAtPreviousCommit = (userIsAllowedToEditProject: boolean, thisCommitId: string, headCommitId: string): boolean =>
  userIsAllowedToEditProject && thisCommitId !== headCommitId;

// Below style values are required to neutralise the button styles inserting by BadgeActionModal component
const LinkGoalsBtnLabel = styled.div`
  margin-left: -5px;
  color: ${colors.lightBlackThree};
`;

const rowIsDir = (x: Row) => x.name.isDir || false;

const handleRenderEntityName = (ownerUsername: string, projectName: string) => (name: string, row: Row) => {
  const entityName = renderFileName(name, row.name);
  const fileDetails = (row.details as FileDetails).associatedGoalIds;
  return (
    <>
      {titleWithGoalsInfoRenderer(ownerUsername, projectName, fileDetails, entityName, true)}
    </>
  );
};

const getSortableName = (x: Row) => x.name.sortableName;

const getSortableBytes = (x: Row) => x.size.inBytes;

const getEntityName = (row: Row) => row.name.label;

const rowKey = (row: Row) => row.name.fileName;

const columns = (detailsHeaderCellCreator: (details: Row['details'], row: Row) => React.ReactNode) => [
  {
    title: 'Modified',
    dataIndex: 'modified',
    key: 'modified',
    sorterDataIndex: ['modified', 'time'],
    render: (value: ModifiedDetails) =>
      value.time === 0 ?
      '' :
      moment(value.label).format('MMMM Do YYYY, h:mm:ss a'),
    width: 250,
  },
  {
    dataIndex: 'details',
    hideFilter: true,
    key: 'details',
    sorter: false,
    render: detailsHeaderCellCreator,
    width: 50,
  },
];

const InvisibleButton: any = ({ disabled, onClick, ...rest }: any) =>
  <div onClick={disabled ? undefined : onClick} {...rest} />;

const SuggestDatasetContainer = styled.div`
  padding-bottom: 20px;
`;

const MENU = {
  FULL_DELETE: 'fulldelete',
  LAUNCH_NOTEBOOK: 'launchnotebook',
  PUBLISH: 'publish',
  RUN: 'run',
  BULK_MOVE: 'bulkMove',
  RENAME: 'renamefile',
  EDIT: 'edit',
  DOWNLOAD: 'download',
  SHARE: 'share',
  DELETE: 'delete_link',
  LINK_GOAL: 'linkGoal'
};

export type LabelDetail = {
  label: string;
};

export type BasicDetails = {
  url: string,
} & LabelDetail;

export type DirDetails = {
  isDir: boolean;
  dirPath?: string;
  filePath?: string;
  download: BasicDetails,
  delte: LabelDetail;
};

export type FileDetails = {
  isDir: boolean;
  dirPath?: string;
  isFileLaunchableAsNotebook: boolean;
  isFileRunnableFromView: boolean;
  isFileRunnableAsApp: boolean;
  filePath?: string;
  filePathName: string;
  quotedFilePath: string;
  launchNotebook: {
    url: string;
    stringifiedGitId: string;
  } & LabelDetail;
  run: LabelDetail;
  edit: BasicDetails;
  download: BasicDetails;
  share: BasicDetails;
  delte: LabelDetail;
  publish: BasicDetails;
  associatedGoalIds: Array<string>;
};

export type OuterProps = {
  theme?: any;
  createFolderEndpoint: string;
  breadcrumbData: { url: string, label: string }[];
  successfulFilesRemovalEndpoint: string;
  createDatasetFromProjectEndpoint: string;
  areDataProjectsEnabled: boolean;
  isAnalyticProject: boolean;
  userIsAllowedToEditProject: boolean;
  createFileEndpoint: string;
  downloadSelectedEntitiesEndpoint: string;
  downloadCLIPageEndpoint: string;
  downloadProjectFolderAsZipEndpoint: string;
  headRevisionDirectoryLink: string;
  headCommitCreatedAt: number;
  previousDirectoryUrl?: string;
  relativePath: string;
  ownerUsername: string;
  projectName: string;
  csrfToken: string;
  commitsNonEmpty: boolean;
  thisCommitId: string;
  headCommitId: string;
  rows: Row[];
  allowFolderDownloads: boolean;
  canEdit?: boolean;
  projectSizeBytes: number;
  suggestDatasets: boolean;
  revertProjectEndpoint: string;
  runNumberForCommit: string;
  commitsRunLink: string;
  selectedRevision: RevisionShape;
  showUploadComponentOnStart: boolean;
  maxUploadFiles: number;
  maxUploadFileSizeInMegabytes: number;
  uploadEndpoint: string;
  successfulUploadUrl: string;
  projectId: string;
  projectVisibility: ProjectVisibility;
  isGitBasedProject?: boolean;
  enableExternalDataVolumes?: boolean;
} & StoreProps;

export type Props = {
  userIsAllowedToFullDelete: boolean;
  enableDiskUsageVolumeCheck: boolean;
} & OuterProps;

export type FullDeleteDetails = {
  deleteReason: string;
  date: number;
  userName: string;
};

export type Row = {
  checkbox: {
    dataPath: string;
    dataUrl: string;
  };
  name: FileBrowserNameColumnData;
  size: {
    inBytes: number;
  };
  modified: ModifiedDetails;
  details: DirDetails | FileDetails;
};

export type ModifiedDetails = {
  label: string;
  time: number;
};

export interface State {
  filePath: string;
  selectedRows: Row[];
  downloadErrorMessage: null | string;
  showDropZone: boolean;
  isLiteUser: boolean;
  sparkClustersEnabled: boolean;
  rayClustersEnabled: boolean;
  daskClustersEnabled: boolean;
}

class FilesBrowserTable extends React.PureComponent<Props, State> {

  static defaultProps = {
    previousDirectoryUrl: '',
    rows: [],
  };

  ctrRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      filePath: '',
      selectedRows: [],
      downloadErrorMessage: null,
      showDropZone: props.showUploadComponentOnStart || false,
      isLiteUser: true,
      sparkClustersEnabled: false,
      rayClustersEnabled: false,
      daskClustersEnabled: false
    };
  }

  async componentDidMount () {
    let principal: PrincipalWithFeatureFlags | undefined;

    try {
      // eslint-disable-next-line prefer-const
      principal = await getPrincipal({});
    } catch (e) {
      console.error(`getPrincipal error`, e);
    }

    try {
      const { isLiteUser: isLiteUserValue } = await isLiteUser({});
      this.setState({ isLiteUser: isLiteUserValue });
    } catch (e: any) {
      console.error(`Something went wrong with 'isLiteUser' API`, e.status, e.message);
    }

    // Check if any job details stored after credentials expired. If any, pick details and run job
    const { ownerUsername, projectName, projectId } = this.props;
    const jobPreviousData = getPreviouslySelectedValue(previousDataStorageKeys.runJobFromFiles);

    if (!R.isNil(jobPreviousData) && !R.isNil(principal)) {
      try {
        const previousUserId = getPreviouslySelectedValue(previousDataStorageKeys.credPropInitiator);
        if (R.equals(previousUserId, principal.canonicalId!)) {
          const payload = JSON.parse(jobPreviousData);
          if (R.equals(payload.projectId, projectId)) {
            clearPreviousDataStorage(previousDataStorageKeys.runJobFromFiles);
            clearPreviousDataStorage(previousDataStorageKeys.credPropInitiator);
            startJob({ body: payload })
              .then(result => {
                if (R.has('redirectPath', result)) {
                  ToastWarning(RELOGIN_JOB_START_FAIL, '', 0);
                } else {
                  window.location.assign(runDashboardRun(result.id)(ownerUsername, projectName));
                }
              });
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }

    const { csrfToken } = this.props;
    // Check if any launch notebook details stored after credentials expired. If any, pick details and launch notebook
    const res: ReturnValues = await launchNotebookAfterRelogin(ownerUsername, projectName, csrfToken, projectId);
    if (res === ReturnValues.RELOGIN_FAILED_TO_ACQUIRE_CREDENTIALS) {
      ToastWarning(RELOGIN_WS_LAUNCH_FAIL, '', 0);
    }

    if (!R.isNil(principal)) {
      const { SparkClustersEnabled, RayClustersEnabled, DaskClustersEnabled } = PRINCIPAL.FeatureFlags;
      const sparkClustersEnabled = principal.featureFlags.indexOf(SparkClustersEnabled) > -1;
      const rayClustersEnabled = principal.featureFlags.indexOf(RayClustersEnabled) > -1;
      const daskClustersEnabled = principal.featureFlags.indexOf(DaskClustersEnabled) > -1;
      this.setState({ sparkClustersEnabled, rayClustersEnabled, daskClustersEnabled });
    }
  }

  getDropdownContainer = () => this.ctrRef && this.ctrRef.current || document.body;

  setDownloadErrorMessage = (downloadErrorMessage: string) => {
    this.setState({ downloadErrorMessage });
  }

  showFileRenameModal = (filePath: string) => {
    this.setState({ filePath });
  }

  uncheckCheckboxes = () => this.setState({ selectedRows: [] });

  createHiddenInput(name: string, value: any, otherProps?: {}) {
    return <input type="hidden" name={name} value={value} {...(otherProps || {})} />;
  }

  submitClosestForm = (id: string) => () => {
    const form = document.getElementById(id) as (HTMLFormElement | null);
    if (form) {
      form.submit();
    }
  }

  sortByNameAndDir = (a: Row, b: Row, sortDirection: 'ascend' | 'descend' | undefined) => {
    const result = a.name.fileName.localeCompare(b.name.fileName);
    const isAscending = R.equals(sortDirection, 'ascend');
    if (a.name.isDir && !b.name.isDir) {
      return isAscending ? -1 : 1;
    }
    if (!a.name.isDir && b.name.isDir) {
      return isAscending ? 1 : -1;
    }
    return result;
  }

  renderBulkMoveButton(isDir: boolean, path: string) {
    const {
      ownerUsername,
      projectName,
      relativePath,
    } = this.props;
    return (
      <BulkMoveDialog
        isBulkAction={false}
        CustomButton={InvisibleButton}
        key="bulkmovebutton"
        ownerUsername={ownerUsername}
        projectName={projectName}
        relativePath={relativePath}
        selectedEntities={[{ isDir, path }]}
      />
    );
  }

  createMenuItem(content: React.ReactNode[], clickHandler: () => void) {
    const onClick = () => {
      if (clickHandler) {
        clickHandler();
      }
      return false;
    };

    return (
      <div onClick={onClick}>
        {content}
      </div>
    );
  }

  navigate(url: string) {
    window.location.href = url;
  }

  onGoalsLink = async (goalIds: Array<string>, filePath: string) => {
    try {
      const { projectId, thisCommitId } = this.props;
      const promises: Promise<any>[] = [];

      R.forEach(goalId => {
        promises.push(linkFileToGoal({
          body: {
            projectId: projectId,
            goalId: goalId,
            commitId: thisCommitId,
            fileName: filePath
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

  copyShareableLink(url: string) {
    copyShareLink(url, this.props.projectVisibility);
  }

  renderFileDetailsDropdown(data: FileDetails) {
    const {
      canEdit,
      thisCommitId,
      headCommitId,
      commitsNonEmpty,
      relativePath,
      ownerUsername,
      projectName,
      projectId,
      successfulFilesRemovalEndpoint,
      csrfToken,
      userIsAllowedToFullDelete,
      enableExternalDataVolumes
    } = this.props;
    const {
      isFileLaunchableAsNotebook,
      isFileRunnableFromView,
      isFileRunnableAsApp,
      launchNotebook,
      edit,
      download,
      share,
      filePath,
      publish,
    } = data;
    const commitIsHead = thisCommitId === headCommitId;
    const menuItems: { key: string, content: React.ReactNode }[] = [];

    const onFileMenuClick = ({ key }: { key: string }) => {
      switch (key) {
        case MENU.LAUNCH_NOTEBOOK:
          break;
        case MENU.PUBLISH:
          this.navigate(publish.url);
          break;
        case MENU.BULK_MOVE:
          break;
        case MENU.RENAME:
          break;
        case MENU.EDIT:
          this.navigate(edit.url);
          break;
        case MENU.DOWNLOAD:
          this.navigate(download.url);
          break;
        case MENU.SHARE:
          this.copyShareableLink(share.url);
          break;
        default:
          break;
      }
    };

    if (commitsNonEmpty && isFileLaunchableAsNotebook) {
      menuItems.push({
        key: MENU.LAUNCH_NOTEBOOK,
        content: (
          <LaunchNotebook
            csrfToken={csrfToken}
            commitId={thisCommitId}
            filePath={filePath!}
            btnLabel={launchNotebook.label}
            submitUrl={launchNotebook.url}
            reloginDataStorageKey={previousDataStorageKeys.launchNotebookFromFiles}
            ownerUsername={ownerUsername}
            projectName={projectName}
            projectId={projectId}
          />
        )
      });
    }

    if (commitsNonEmpty && isFileRunnableFromView) {
      if (commitIsHead && isFileRunnableAsApp) {
        menuItems.push({
          key: MENU.PUBLISH,
          content: <div>{publish.label}</div>,
        });
      }
      menuItems.push({
        key: MENU.RUN,
        content: (
          <JobsLauncherModal
            OpenModalButton={InvisibleButton}
            commandToRun={getCommand(filePath ?? '', true)}
            preReloginDataStorageKey={previousDataStorageKeys.runJobFromFiles}
            enableExternalDataVolumes={enableExternalDataVolumes}
            sparkClustersEnabled={this.state.sparkClustersEnabled}
            rayClustersEnabled={this.state.rayClustersEnabled}
            daskClustersEnabled={this.state.daskClustersEnabled}
            fromFilesBrowser={true}
          />
        )
      });
    }

    menuItems.push({
      key: MENU.BULK_MOVE,
      content: this.renderBulkMoveButton(false, filePath!)
    });

    menuItems.push({
      key: MENU.RENAME,
      content: (
        <RenameFileDirModal
          defaultValues={{
            newName: getFileDirName(filePath!.trim()),
          }}
          OpenButton={InvisibleButton}
          editLabel="Rename"
          locationUrl={browseFilesHead(ownerUsername, projectName, relativePath)}
          ownerUsername={ownerUsername}
          projectName={projectName}
          entityType={EntityType.FILE}
          oldPath={filePath!}
        />
      )
    });

    if (canEdit) {
      menuItems.push({
        key: MENU.EDIT,
        content: (
          <div>{edit.label}</div>)
      });
    }

    menuItems.push({
      key: MENU.DOWNLOAD,
      content: (
        <div>{download.label}</div>)
    });

    menuItems.push({
      key: MENU.SHARE,
      content: (
        <div>Copy Shareable Link</div>)
    });

    if (canEdit) {
      menuItems.push({
        key: MENU.DELETE,
        content: (
          <RemoveFilesConfirmationModal
            ownerUsername={ownerUsername}
            projectName={projectName}
            successfulFilesRemovalEndpoint={successfulFilesRemovalEndpoint}
            openButtonProps={{
              className: 'delete-link',
              href: '#',
            }}
            paths={[filePath!]}
            CustomButton={InvisibleButton}
          />
        )
      });
    }

    if (userIsAllowedToFullDelete) {
      menuItems.push({
        key: MENU.FULL_DELETE,
        content: (
          <FullDeleteModal
            projectName={projectName}
            projectOwnerName={ownerUsername}
            commitId={thisCommitId}
            filePath={filePath || ''}
            projectId={this.props.projectId}
            OpenModalButton={InvisibleButton}
          />
        )
      });
    }

    menuItems.push({
      key: MENU.LINK_GOAL,
      content: (
        <LinkGoal
          selectedIds={[]}
          projectId={this.props.projectId}
          onSubmit={(goalIds: Array<string>) => this.onGoalsLink(goalIds, filePath!)}
          buttonIcon={(
            <LinkGoalsBtnLabel>
              Link to Goals
            </LinkGoalsBtnLabel>
          )}
          noTooltip={true}
        />
      )
    });

    return (
      <FileMenuWrapper>
        <ActionDropdown
          menuTestKey="FileDetailsDropdownMenu"
          dataTest="action-dropdown"
          closeOnClick={true}
          menuItems={menuItems}
          onMenuClick={onFileMenuClick}
          icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />}
          getPopupContainer={this.getDropdownContainer}
          disabled={this.state.isLiteUser}
        />
      </FileMenuWrapper>
    );
  }

  renderDirDetailsDropdown(data: DirDetails) {
    const {
      successfulFilesRemovalEndpoint,
      ownerUsername,
      projectName,
      relativePath,
    } = this.props;
    const { allowFolderDownloads, canEdit } = this.props;
    const { dirPath, download } = data;

    const menuItems: { key: string, content: React.ReactNode }[] = [];

    const onDirMenuClick = ({ key }: { key: string }) => {
      switch (key) {
        case MENU.DOWNLOAD:
          this.navigate(download.url);
          break;
        default:
          break;
      }
    };

    if (allowFolderDownloads) {
      menuItems.push({
        key: MENU.DOWNLOAD,
        content: download.label
      });
    }

    menuItems.push({
      key: MENU.BULK_MOVE,
      content: this.renderBulkMoveButton(true, dirPath!)
    });

    menuItems.push({
      key: MENU.RENAME,
      content: (
        <RenameFileDirModal
          defaultValues={{
            newName: getFileDirName(dirPath!.trim()),
          }}
          OpenButton={InvisibleButton}
          editLabel="Rename"
          locationUrl={browseFilesHead(ownerUsername, projectName, relativePath)}
          ownerUsername={ownerUsername}
          projectName={projectName}
          entityType={EntityType.DIRECTORY}
          oldPath={dirPath!}
        />
      )
    });

    if (canEdit) {
      menuItems.push({
        key: MENU.DELETE,
        content: (
          <RemoveFilesConfirmationModal
            successfulFilesRemovalEndpoint={successfulFilesRemovalEndpoint}
            openButtonProps={{
              className: 'delete-link',
              href: '#',
            }}
            paths={[dirPath!]}
            CustomButton={InvisibleButton}
            ownerUsername={ownerUsername}
            projectName={projectName}
          />
        )
      });
    }

    return (
      <ActionDropdown
        menuTestKey="DirectoryDetailsDropdownMenu"
        dataTest="action-dropdown"
        closeOnClick={true}
        menuItems={menuItems}
        onMenuClick={onDirMenuClick}
        icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />}
        getPopupContainer={this.getDropdownContainer}
        disabled={this.state.isLiteUser}
      />);
  }

  detailsHeaderCellCreator = (details: Row['details']) => {
    if (!details) {
      return '';
    }

    if (details.isDir) {
      return this.renderDirDetailsDropdown(details as DirDetails);
    }

    return this.renderFileDetailsDropdown(details as FileDetails);
  }

  // Todo: Wrapped in another function as getCheckboxProps is not being called again on rerender. Need to figure out
  //  a better way to do this
  getCheckboxProps = () => (row: Row) => {
    if (this.state.isLiteUser) {
      return { disabled: true };
    }

    const {
      canEdit,
      allowFolderDownloads,
    } = this.props;
    const { isDir } = row.name;
    const { dataPath, dataUrl } = row.checkbox;

    if (isDir && (allowFolderDownloads || canEdit)) {
      return {
        key: dataPath,
        'data-type': 'directory',
        datatype: 'directory',
        className: 'selected-file-checkbox',
        type: 'checkbox',
        'data-path': dataPath,
        'data-url': dataUrl,
      };
    } else if (!isDir) {
      return {
        key: dataPath,
        'data-type': 'file',
        type: 'checkbox',
        className: 'selected-file-checkbox',
        'data-path': dataPath,
        'data-url': dataUrl,
      };
    }
    return { style: { display: 'none' }, disabled: true };
  }

  getOldRevisionMessage() {
    const {
      headCommitCreatedAt,
      headRevisionDirectoryLink,
    } = this.props;

    return (
      <OldRevisionInteractiveMessage
        headCommitCreatedAt={headCommitCreatedAt}
        headRevisionDirectoryLink={headRevisionDirectoryLink}
      />
    );
  }

  handleOnRowSelect = (record: Row, selected: boolean, newSelectedRows: Row[]) => {
    this.setState({ selectedRows: newSelectedRows });
  }

  handleSelectAll = (selected: boolean, selectedRows: Row[]) =>
    this.handleOnRowSelect({} as Row, selected, selectedRows)

  handleDrilldown = async (row: Row) => {
    window.location.href = row.name.url;
    return;
  }

  handleGoUpDirectory = async () => {
    window.location.href = this.props.previousDirectoryUrl || '';
    return;
  }

  showDropZone = () => {
    this.setState({ showDropZone: true });
  }

  hideDropZone = () => {
    this.setState({ showDropZone: false });
  }

  render() {
    const {
      whiteLabelSettings,
      projectSizeBytes,
      thisCommitId,
      headCommitId,
      suggestDatasets,
      relativePath,
      rows,
      ownerUsername,
      projectName,
      csrfToken,
      commitsNonEmpty,
      allowFolderDownloads,
      createFolderEndpoint,
      breadcrumbData,
      createDatasetFromProjectEndpoint,
      areDataProjectsEnabled,
      isAnalyticProject,
      userIsAllowedToEditProject,
      createFileEndpoint,
      downloadSelectedEntitiesEndpoint,
      downloadCLIPageEndpoint,
      downloadProjectFolderAsZipEndpoint,
      successfulFilesRemovalEndpoint,
      revertProjectEndpoint,
      runNumberForCommit,
      commitsRunLink,
      selectedRevision,
      maxUploadFiles,
      maxUploadFileSizeInMegabytes,
      uploadEndpoint,
      successfulUploadUrl,
      projectId,
      isGitBasedProject
    } = this.props;
    const { showDropZone, selectedRows, downloadErrorMessage } = this.state;
    return (
      <div ref={this.ctrRef}>
        <ActionBar
          showDropZone={this.showDropZone}
          setDownloadErrorMessage={this.setDownloadErrorMessage}
          successfulFilesRemovalEndpoint={successfulFilesRemovalEndpoint}
          currentCommitId={thisCommitId}
          createFolderEndpoint={createFolderEndpoint}
          breadcrumbData={breadcrumbData}
          selectedEntities={selectedRows.map(
            row => ({
              downloadUrl: row.details.download.url,
              isDir: row.details.isDir,
              path: row.details.filePath || row.details.dirPath || '',
            }))
          }
          ownerUsername={ownerUsername}
          projectName={projectName}
          allowFolderDownloads={allowFolderDownloads}
          createDatasetFromProjectEndpoint={createDatasetFromProjectEndpoint}
          maxAllowedFileDownloads={30}
          csrfToken={csrfToken}
          areDataProjectsEnabled={areDataProjectsEnabled}
          currentDirPath={relativePath}
          isAnalyticProject={isAnalyticProject}
          userIsAllowedToEditProject={userIsAllowedToEditProject}
          createFileEndpoint={createFileEndpoint}
          projectContainsCommits={commitsNonEmpty}
          atHeadCommit={thisCommitId === headCommitId}
          downloadSelectedEntitiesEndpoint={downloadSelectedEntitiesEndpoint}
          downloadCLIPageEndpoint={downloadCLIPageEndpoint}
          downloadProjectFolderAsZipEndpoint={downloadProjectFolderAsZipEndpoint}
          projectId={projectId}
          hideCloneButton={isGitBasedProject}
          isLiteUser={this.state.isLiteUser}
        />
        <FlexLayout
          padding={`${getRowMargin(this.props)} 0px`}
          flexDirection="unset"
          flexWrap="unset"
          justifyContent="unset"
          alignItems="unset"
          alignContent="unset"
        >
          <RevisionControl
            width={
              isAtPreviousCommit(userIsAllowedToEditProject, thisCommitId, headCommitId) ?
                'calc(100% - 120px)' :
                undefined
            }
            asMessage={false}
            runNumber={runNumberForCommit}
            runLink={commitsRunLink}
            revision={selectedRevision}
            projectId={projectId}
            ownerUsername={ownerUsername}
            projectName={projectName}
            relativePath={relativePath}
            showBranchPicker={true}
          />
          <RevertHistoryButton
            userIsAllowedToEditProject={userIsAllowedToEditProject}
            thisCommitId={thisCommitId}
            headCommitId={headCommitId}
            formId="reactrevertprojectbtn"
            entityToRevert="Project"
            csrfToken={csrfToken}
            revertEndpoint={revertProjectEndpoint}
          />
        </FlexLayout>
        {/* Disabling this for now, will be enabled when backend work is done for this feature */}
        {
          enableDiskUsageVolumeCheck && (
          <ProjectSizeInfo>
            <ProjectSizeLabel>
              Project Size
              {
                tooltipRenderer(
                  replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(ProjectSizeInfoTooltipText),
                  <ProjectSizeInfoIconWrapper>
                    <InfoCircleFilled style={{color: colors.basicLink}} width="11px" height="11px" />
                  </ProjectSizeInfoIconWrapper>
                )
              }
            </ProjectSizeLabel>
            <ProjectSizeValue>
              5.6
              <div className="unit">GiB</div>
            </ProjectSizeValue>
          </ProjectSizeInfo>)
        }
        {downloadErrorMessage && (
          <DangerBox>
            {downloadErrorMessage}
          </DangerBox>
          )}
        {suggestDatasets &&
          <SuggestDatasetContainer>
            <WarningBox>
              <strong>This Project appears to contain large files.</strong> You can improve the performance of Jobs
              and Workspaces by storing these large files in a Dataset.
              <StyledHelpLink
                articlePath={SUPPORT_ARTICLE.DATASETS_OVERVIEW}
                text="Learn more about Datasets here."
                showIcon={false}
              />
            </WarningBox>
          </SuggestDatasetContainer>
        }
        {atOldFilesVersion(thisCommitId, headCommitId) && this.getOldRevisionMessage()}
        {showDropZone && (
          <DropZoneUploader
            hideDropZone={this.hideDropZone}
            maxUploadFiles={maxUploadFiles}
            maxUploadFileSizeInMegabytes={maxUploadFileSizeInMegabytes}
            uploadEndpoint={uploadEndpoint}
            successfulUploadUrl={successfulUploadUrl}
            downloadCLIPageEndpoint={downloadCLIPageEndpoint}
          />)}
        <FileTable
          tableName='project-file-browser-table'
          hideRowSelection={false}
          data-test="ProjectFileBrowserTable"
          renderEntityName={handleRenderEntityName(ownerUsername, projectName)}
          path={relativePath}
          onGoUpDirectory={this.handleGoUpDirectory}
          sizeDataIndex={['size', 'inBytes']}
          nameDataIndex={['name', 'label']}
          isDir={rowIsDir}
          getSortableName={getSortableName}
          getSortableBytes={getSortableBytes}
          showBreadcrumbs={false}
          showPagination={false}
          onDrilldown={this.handleDrilldown}
          dataSource={rows}
          columns={columns(this.detailsHeaderCellCreator)}
          rowKey={rowKey}
          filterPlaceHolder="Filter by filename"
          emptyMessage="No files in this folder."
          sortByNameAndDir={this.sortByNameAndDir}
          rowSelection={{
            getCheckboxProps: this.getCheckboxProps(),
            onSelect: this.handleOnRowSelect,
            onSelectAll: this.handleSelectAll
          }}
          filterSelector={getEntityName}
        />
        <FileSummary>
          Total size: <strong>{prettyBytes(projectSizeBytes)}</strong>
        </FileSummary>
      </div>
    );
  }
}

function withIsAdmin(
  Component: React.ComponentClass<Props>
): React.FunctionComponent<OuterProps> {
  return ({ principal, formattedPrincipal, ...props }) => (
    <Component
      {...props}
      userIsAllowedToFullDelete={principal ? principal.isAdmin : false}
      enableDiskUsageVolumeCheck={formattedPrincipal?.enableDiskUsageVolumeCheck || false}
    />
  );
}

export default withTheme(withStore(withIsAdmin(FilesBrowserTable)));
