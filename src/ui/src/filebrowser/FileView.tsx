import * as React from 'react';
import { isNil, defaultTo, pipe } from 'ramda';
import styled, { withTheme } from 'styled-components';
import { findProjectByOwnerAndName } from '@domino/api/dist/Gateway';
import { getCurrentUser } from '@domino/api/dist/Users';
import { fullyDeleted } from '@domino/api/dist/Files';
import {
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings,
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoCommonUserPerson as User
} from '@domino/api/dist/types';
import { getPrincipal } from '@domino/api/dist/Auth';
import { httpRequest } from '@domino/api/dist/httpRequest';
import { FlexLayout, FlexLayoutProps } from '../components/Layouts/FlexLayout';
import { warning } from '../components/toastr';
import { WaitSpinner } from '../components/WaitSpinner';
import { themeHelper } from '../styled/themeUtils';
import { renderFileContentsEndpoint } from '../core/legacyApiEndpoints';
import {
  dangerBoxBorderColor,
  secondaryWarningRed,
  dangerBoxBackground,
} from '../styled/colors';
import DataFetcher from '../utils/DataFetcher';
import { FileBrowserAppContent } from './FileBrowserAppContent';
import EditableFilePath, { BreadCrumbsProp } from './EditableFilePath';
import { RevertHistoryButton } from './RevertHistoryButton';
import RevisionControl from './RevisionControl';
import OldRevisionInteractiveMessage from './OldRevisionInteractiveMessage';
import FileViewDiscussionSection from './FileViewDiscussionSection';
import FileViewToolBar from './FileViewToolbar';
import { RevisionShape, ProjectVisibility } from './types';
import SecondaryButton from '../components/SecondaryButton';
import { FAILED_FILE_FETCH_MESSAGE, withFileDisplayElement } from './util';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';

const getRowMargin = themeHelper('margins.tiny');

type RenderedFileProps = {
  dangerouslySetInnerHTML: any;
  isEdgeNotebook: boolean;
};
const RenderedFile = styled.div<RenderedFileProps>`
  height: ${props => props.isEdgeNotebook ? '500px' : 'auto'};
  min-height: ${props => props.isEdgeNotebook ? '100px' : '200px'};
  overflow-y: ${props => props.isEdgeNotebook ? 'auto' : 'visible'};
  width: 100%;
  .fetch-error {
    color: ${secondaryWarningRed};
    background-color: ${dangerBoxBackground};
    border: 1px solid ${dangerBoxBorderColor};
    border-radius: ${themeHelper('borderRadius.standard')};
    padding: ${themeHelper('margins.small', '10px')} ${themeHelper('margins.medium', '15px')};
  }
`;

const NotebookIframeWrap = styled.div`
  width: 100%;
  .fetch-error {
    color: ${secondaryWarningRed};
    background-color: ${dangerBoxBackground};
    border: 1px solid ${dangerBoxBorderColor};
    border-radius: ${themeHelper('borderRadius.standard')};
    padding: ${themeHelper('margins.small', '10px')} ${themeHelper('margins.medium', '15px')};
  }
`;

const Row = ({ children, ...rest }: FlexLayoutProps & { theme?: any }) => (
  <FlexLayout
    padding={`${getRowMargin(rest)} 0px`}
    flexDirection="unset"
    flexWrap="unset"
    justifyContent="unset"
    alignItems="unset"
    alignContent="unset"
    {...rest}
  >
    {children}
  </FlexLayout>
);

interface WindowInterface extends Window {
  prettyPrint: (x: any, y: any) => any;
}

const formatContent = (fileContent: string, element: null | HTMLDivElement): void => {
  const prettyPrint = (window as WindowInterface & typeof globalThis).prettyPrint;
  if (Boolean(prettyPrint) && !!fileContent && element) {
    prettyPrint(null, element);
  }
};

export type OuterProps = {
  lastExistingCommitCreatedAt?: number;
  userIsAllowedToEditProject: boolean;
  revertFileEndpoint: string;
  runNumberForCommit: string;
  commitsRunLink: string;
  selectedRevision: RevisionShape;
  availableRevisions: RevisionShape[];
  commitId: string;
  lastCommitWhereFileExists?: string;
  projectId: string;
  path: string;
  csrfToken: string;
  isFileRunnableAsApp: boolean;
  isFileRunnableFromView: boolean;
  isFileLaunchableAsNotebook: boolean;
  publishAppEndpoint: string;
  action: string;
  locationUrl: string;
  ownerUsername: string;
  projectName: string;
  filename: string;
  breadCrumbs: BreadCrumbsProp['breadCrumbs'];
  headRevisionDirectoryLink: string;
  isCommentPreviewEnabled: boolean;
  userCanStartRuns: boolean;
  toolbarLinks: {
    editFileLink: string;
    compareRevisionsLink: string;
    downloadFileLink: string;
    viewRawFileLink: string;
    sharedFileViewLink: string;
  };
  projectVisibility: ProjectVisibility;
  enableExternalDataVolumes?: boolean;
  enableSparkClusters?: boolean;
  enableRayClusters?: boolean;
  enableDaskClusters?: boolean;
  whiteLabelSettings?: WhiteLabelSettings;
};

export type InnerProps = {
  userIsAllowedToFullDelete: boolean;
  renderedFile: string;
  theme?: any;
  userCanEditProjectFiles: boolean;
  project?: Project;
  user?: User;
  isFullDeleted: boolean
} & OuterProps;

export class View extends React.PureComponent<InnerProps> {
  renderedFileMount: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    this.prettyPrintRenderedFile();
  }

  componentDidUpdate() {
    this.prettyPrintRenderedFile();
  }

  prettyPrintRenderedFile = () => {
    formatContent(this.props.renderedFile, this.renderedFileMount.current);
  }

  render() {
    const {
      lastExistingCommitCreatedAt,
      lastCommitWhereFileExists,
      toolbarLinks,
      userIsAllowedToEditProject,
      revertFileEndpoint,
      runNumberForCommit,
      commitsRunLink,
      selectedRevision,
      availableRevisions,
      commitId,
      projectId,
      path,
      csrfToken,
      isFileRunnableAsApp,
      isFileRunnableFromView,
      isFileLaunchableAsNotebook,
      publishAppEndpoint,
      action,
      locationUrl,
      ownerUsername,
      projectName,
      filename,
      breadCrumbs,
      headRevisionDirectoryLink,
      renderedFile,
      isCommentPreviewEnabled,
      theme,
      projectVisibility,
      userCanEditProjectFiles,
      project,
      user,
      userIsAllowedToFullDelete,
      isFullDeleted,
      userCanStartRuns,
      enableExternalDataVolumes,
      enableSparkClusters,
      enableRayClusters,
      enableDaskClusters
    } = this.props;
    const rowMargin = getRowMargin(this.props);

    // Edge can't render iframes for notebooks correctly so need to render in div
    const getFileElem = () => {
      const isNotebook = filename.split('.').pop() === 'ipynb';
      const isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
      const isReadmeFile = filename.split('.').pop() === 'md';
      const FileDisplayElement = withFileDisplayElement(RenderedFile);
      const readmeReplacementRules = pipe(
        // Resolve these items in urls in the readme
        (text: string) => projectId ? text.replace(/:projectId/ig, projectId) : text,
        (text: string) => projectName ? text.replace(/:projectName/ig, projectName) : text,
        (text: string) => ownerUsername ? text.replace(/:ownerName/ig, ownerUsername) : text,
        (text: string) => text.replace(/raw\/latest/ig, '../raw/latest')
    );
      return (
        <NotebookIframeWrap ref={this.renderedFileMount}>
          <FileDisplayElement
            htmlStr={isReadmeFile ? readmeReplacementRules(renderedFile) : renderedFile}
            fileName={filename}
            iframeStyles={{height: '500px', minHeight: '100px', border: 0}}
            className="resizeable_iframe"
            // @ts-ignore
            dangerouslySetInnerHTML={{ __html: isReadmeFile ? readmeReplacementRules(renderedFile) : renderedFile }}
            isEdgeNotebook={isEdge && isNotebook}
          />
        </NotebookIframeWrap>);
    };

    return (
      <FileBrowserAppContent atOldFilesVersion={lastCommitWhereFileExists !== commitId} >
        <>
          <EditableFilePath
            showSaveAndRun={false}
            redirectToOverviewPageOnSave={false}
            editing={false}
            creating={false}
            resetStateOnSuccess={false}
            csrfToken={csrfToken}
            isFileRunnableAsApp={isFileRunnableAsApp && !isFullDeleted && userCanStartRuns}
            isFileRunnableFromView={isFileRunnableFromView && !isFullDeleted && userCanStartRuns}
            isFileLaunchableAsNotebook={isFileLaunchableAsNotebook && !isFullDeleted && userCanStartRuns}
            publishAppEndpoint={publishAppEndpoint}
            atHeadCommit={lastCommitWhereFileExists === commitId}
            currentCommitId={commitId}
            action={action}
            locationUrl={locationUrl}
            ownerUsername={ownerUsername}
            projectName={projectName}
            oldPath={path}
            filename={filename}
            breadCrumbs={breadCrumbs}
            canEditName={!isFullDeleted}
            enableExternalDataVolumes={enableExternalDataVolumes}
            projectId={projectId}
            enableSparkClusters={enableSparkClusters}
            enableRayClusters={enableRayClusters}
            enableDaskClusters={enableDaskClusters}
          />
          <Row justifyContent="flex-end" padding={`${rowMargin} 0px`}>
              {!isFullDeleted ? (
              <FileViewToolBar
                {...toolbarLinks}
                userIsAllowedToFullDelete={userIsAllowedToFullDelete}
                project={project}
                user={user}
                userCanEditProjectFiles={userCanEditProjectFiles}
                isLatestCommit={lastCommitWhereFileExists === commitId}
                projectId={projectId}
                commitId={commitId}
                path={path}
                projectVisibility={projectVisibility}
              /> ) : (
              <SecondaryButton href={breadCrumbs[0].url} isDanger={true}>
                Back to Browse
              </SecondaryButton> )}
          </Row>
          <Row theme={theme}>
            <RevisionControl
              projectId={projectId}
              asMessage={false}
              runNumber={runNumberForCommit}
              runLink={commitsRunLink}
              revision={selectedRevision}
              revisions={availableRevisions}
              showBranchPicker={false}
            />
            {lastCommitWhereFileExists && !isFullDeleted && (
              <RevertHistoryButton
                userIsAllowedToEditProject={userIsAllowedToEditProject}
                thisCommitId={commitId}
                headCommitId={lastCommitWhereFileExists}
                formId="revert-file-form"
                entityToRevert="File"
                csrfToken={csrfToken}
                revertEndpoint={revertFileEndpoint}
              />
            )}
          </Row>
          {lastCommitWhereFileExists && lastCommitWhereFileExists !== commitId && (
            <OldRevisionInteractiveMessage
              headCommitCreatedAt={lastExistingCommitCreatedAt}
              headRevisionDirectoryLink={headRevisionDirectoryLink}
            />
          )}
          <Row theme={theme}>
            {getFileElem()}
          </Row>
          {userCanEditProjectFiles && (
            <FileViewDiscussionSection
              fileName={path}
              projectId={projectId}
              commitId={commitId}
              isCommentPreviewEnabled={isCommentPreviewEnabled}
              useSmallStyle={false}
            />
          )}
        </>
      </FileBrowserAppContent>
    );
  }
}

const ViewWithTheme = withTheme(View);

type FetcherProps = {
  path: string;
  commitId: string;
  renderUnknownFilesAsText: boolean;
  projectName: string;
  projectId: string;
  ownerUsername: string;
};

type FetchResult = {
  userIsAllowedToFullDelete: boolean;
  fileContents: string;
  authorized: boolean;
  project?: Project;
  user?: User;
  isFullDeleted: boolean;
};

const Fetcher: new() => DataFetcher<FetcherProps, FetchResult> = DataFetcher as any;
const fetchFileContents = async ({
  path,
  commitId,
  renderUnknownFilesAsText,
  projectName,
  projectId,
  ownerUsername,
}: FetcherProps): Promise<FetchResult> => {
  const gettingFileContents = httpRequest(
    'GET',
    renderFileContentsEndpoint(ownerUsername, projectName, path, commitId, renderUnknownFilesAsText),
    undefined,
    {},
    {
      accept: '*/*',
      'Content-Type': 'text/html'
    },
    undefined,
    false
  );
  const gettingPrincipal = getPrincipal({});
  const gettingProject = findProjectByOwnerAndName({
    ownerName: ownerUsername,
    projectName,
  });
  const gettingUser = getCurrentUser({});

  const deletePropsDtoPromise = fullyDeleted({
    filePath: path,
    projectId: projectId,
    commitId: commitId,
  });

  const [fileContents, principal, project, user, deletePropsDto] = await Promise.all([
    gettingFileContents,
    gettingPrincipal,
    gettingProject,
    gettingUser,
    deletePropsDtoPromise
  ]);

  const isFullDeleted = !!deletePropsDto;

  if (isNil(fileContents) || isNil(principal) || isNil(project)) {
    warning('Couldn\'t get all data for this page.');
  }

  const finalFileContents = defaultTo('')(fileContents);
  const authorized = principal ? !principal.isAnonymous : false;
  const userIsAllowedToFullDelete = principal ? principal.isAdmin : false;
  return {
    userIsAllowedToFullDelete,
    user,
    project,
    fileContents: finalFileContents,
    authorized,
    isFullDeleted: isFullDeleted,
  };
};

export const FileView = (props: OuterProps) => (
  <Fetcher
    initialChildState={{
      userIsAllowedToFullDelete: false,
      fileContents: '',
      authorized: false,
      isFullDeleted: false,
    }}
    fetchData={fetchFileContents}
    renderUnknownFilesAsText={true}
    {...props}
  >
    {(
      {fileContents, isFullDeleted, authorized, ...result}: FetchResult,
      loading: boolean,
      delegatedFetcher: any,
      error: any) => (
      loading ? (
        <WaitSpinner forPage={true} />
      ) : (
        <ViewWithTheme
          {...props}
          {...result}
          userCanEditProjectFiles={authorized}
          isFullDeleted={isFullDeleted}
          renderedFile={error ? `<div class="fetch-error">${replaceWithWhiteLabelling(getAppName(props.whiteLabelSettings))(FAILED_FILE_FETCH_MESSAGE)}</div>` : fileContents}
        />
      )
    )}
  </Fetcher>
);
