import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { themeHelper } from '../styled/themeUtils';
import { AppContent } from '../components/Layouts/AppContent';
import EditableFilePath, { BreadCrumbsProp, Props as EditableFilePathProps } from './EditableFilePath';
import InfoBox from '../components/Callout/InfoBox';
import { HELP_PREFIX, SUPPORT_ARTICLE } from '../core/supportUtil';
import { env } from '../components/HelpLink';
import Link from '../components/Link/Link';
import ExternalLink from '../icons/ExternalLink';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

interface EditorWrapperProps {
  isDefaultAppSh: boolean;
}

const StyledInfoBox = styled(InfoBox)`
  margin: 0;
`;

const StyledAppContent = styled(AppContent)`
  .ace_editor, .ace_editor * {
    font-family: ${themeHelper('codeFontFamily')};
  }
`;

const EditorWrapper = styled.div<EditorWrapperProps>`
  #editor {
    top: ${({isDefaultAppSh}) => isDefaultAppSh ? '170px' : '110px'};
  }
`;

export type Props = EditableFilePathProps & {
  content?: string;
  isDefaultAppSh?: boolean;
};

export const CreateEditFileView: React.FC<Props> = ({
  getEditor,
  redirectToOverviewPageOnSave,
  action,
  csrfToken,
  locationUrl,
  ownerUsername,
  projectName,
  oldPath,
  creating,
  editing,
  filename,
  defaultValues,
  showSaveAndRun,
  cancelLink,
  breadCrumbs,
  isFileRunnableAsApp,
  isFileRunnableFromView,
  isFileLaunchableAsNotebook,
  publishAppEndpoint,
  atHeadCommit,
  currentCommitId,
  content = '',
  isDefaultAppSh = false,
  enableSparkClusters,
  enableRayClusters,
  enableDaskClusters
}) => {
  const { whiteLabelSettings } = useStore();
  return (
    <StyledAppContent>
      <div>
        <EditableFilePath
          getEditor={getEditor}
          resetStateOnSuccess={false}
          currentCommitId={currentCommitId}
          atHeadCommit={atHeadCommit}
          publishAppEndpoint={publishAppEndpoint}
          isFileRunnableAsApp={isFileRunnableAsApp}
          isFileRunnableFromView={isFileRunnableFromView}
          isFileLaunchableAsNotebook={isFileLaunchableAsNotebook}
          redirectToOverviewPageOnSave={redirectToOverviewPageOnSave}
          action={action}
          csrfToken={csrfToken}
          locationUrl={locationUrl}
          ownerUsername={ownerUsername}
          projectName={projectName}
          oldPath={oldPath}
          creating={creating}
          editing={editing}
          filename={filename}
          defaultValues={defaultValues}
          showSaveAndRun={showSaveAndRun}
          cancelLink={cancelLink}
          breadCrumbs={breadCrumbs}
          enableSparkClusters={enableSparkClusters}
          enableRayClusters={enableRayClusters}
          enableDaskClusters={enableDaskClusters}
        />
      </div>
      <>
        {isDefaultAppSh && <StyledInfoBox fullWidth>
          This is a template bash script for using {getAppName(whiteLabelSettings)} to publish your Flask, Dash, or Shiny app. 
          To learn more, go to: <Link
            href={`${HELP_PREFIX}${env.REACT_APP_DOC_LANGUAGE}/${env.REACT_APP_DOC_VERSION}/${SUPPORT_ARTICLE.APP_PUBLISH_OVERVIEW}`}
            openInNewTab
            type="icon-link-end"
            icon={<ExternalLink />}
          >
            App Publishing
          </Link>
        </StyledInfoBox>}
      </>
      <EditorWrapper isDefaultAppSh={isDefaultAppSh}>
        <div id="editor" aria-label="File Content">
          {content}
        </div>
      </EditorWrapper>
    </StyledAppContent>
  )
}

export type WithStateProps = {
  language?: string;
  content?: string;
  isDefaultAppSh: boolean;
  resetStateOnSuccess: boolean;
  isFileRunnableAsApp: boolean;
  isFileRunnableFromView: boolean;
  isFileLaunchableAsNotebook: boolean;
  publishAppEndpoint: string;
  atHeadCommit: boolean;
  action: string;
  ownerUsername: string;
  projectName: string;
  oldPath: string;
  redirectToOverviewPageOnSave: boolean;
  creating?: boolean;
  editing: boolean;
  saveAndRunHandler?: () => void;
  defaultValues?: {};
  showSaveAndRun: boolean;
  cancelLink?: string;
  filename?: string;
  locationUrl: string;
  csrfToken: string;
  currentCommitId: string;
  formProps?: {};
  breadCrumbs: BreadCrumbsProp['breadCrumbs'];
};

export class CreateEditFileViewWithState extends React.PureComponent<WithStateProps> {
  editor?: any;

  componentDidMount() {
    const { language } = this.props;
    // @ts-ignore
    const ace = window.ace;
    if (ace) {
      const editor = ace.edit('editor');
      if (editor && language) {
        /**
         * language value coming from 'fileCreateOrEdit.scala.html'.
         * Certain file types are not supported by ACE, in those cases language prop will be "".
         * when "", setMode will not get called and default to plain txt.
         */
        editor.getSession().setMode(`ace/mode/${language}`);
      }
      this.editor = editor;
    }
  }

  getEditor = () => {
    return this.editor;
  }

  render() {
    return (
      <CreateEditFileView
        {...R.omit(['language'], this.props)}
        getEditor={this.getEditor}
      />
    );
  }
}
