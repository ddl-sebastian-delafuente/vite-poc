import * as React from 'react';
import * as R from 'ramda';
import {
  success as ToastSuccess,
  warning as ToastWarning
} from '../components/toastr';
import { copyToClipboard } from '../utils/copyToClipboard';
import { ProjectVisibility, GitCredential, GitProvider } from './types';
import Octicon from '../icons/Octicon';
import GitLogoMark from '../icons/GitLogoMark';
import GitLogoMarkColor from '../icons/GitLogoMarkColor';
import GitLabLogoMark from '../icons/GitLabLogoMark';
import GitLabLogoMarkColor from '../icons/GitLabLogoMarkColor';
import BitBucketLogoMark from '../icons/BitBucketLogoMark';
import BitBucketLogoMarkColor from '../icons/BitbucketLogoMarkColor';
import { setCredentialMapping, deleteCredentialMapping } from '@domino/api/dist/Projects';
import { success as toastrSuccess, error as toastrError } from '../components/toastr';

/**
 * Returns empty string if the path is a /.
 * Appends a / if there is no slash at the end
 * Prepends a / if there is no slash at the start
 */
const formatRelativePath = (relativePath: string, overrideRootSlash = false) => {
  let path = relativePath;
  if (R.equals(path, '/') && !overrideRootSlash) {
    return '';
  }
  if (!path.startsWith('/')) {
    path = R.concat('/', path);
  }
  if (!relativePath.endsWith('/') && !overrideRootSlash) {
    path = R.concat(path, '/');
  }
  return path;
};

export const FAILED_FILE_FETCH_MESSAGE = `Oops!  We failed to fetch this file.
  Please refresh the page to try again.  If this continues, please contact your Domino administrator`;

export const isPrivateProject = (projectVisibility: string) => projectVisibility === ProjectVisibility.Private;

export const copyShareLink = (url: string, projectVisibility: string) => {
  copyToClipboard(url);
  const isPrivate = isPrivateProject(projectVisibility);
  const message = 'Shareable link copied to the clipboard.' +
    (isPrivate ? ' Your project is not public, so this link will only be viewable by collaborators.' : '');

  if (isPrivate) {
    ToastWarning(message);
  } else {
    ToastSuccess(message);
  }
};

export const getCreateFolderEndpoint = (ownerUserName: string, projectName: string) =>
  `/u/${ownerUserName}/${projectName}/files/createFolder`;

export const getCreateDatasetFromProjectEndpoint = (ownerUserName: string, projectName: string) =>
  `/data/new/${ownerUserName}/${projectName}`;

export const getRevertProjectEndpoint = (ownerUserName: string, projectName: string) =>
  `/u/${ownerUserName}/${projectName}/revert`;

export const getSuccessfulFilesRemovalEndpoint = (ownerUserName: string, projectName: string, relativePath: string) =>
  `/u/${ownerUserName}/${projectName}/browse${formatRelativePath(relativePath)}#successfulRemoval`;

export const getSuccessfulUploadUrl = (ownerUserName: string, projectName: string, relativePath: string) =>
  `/u/${ownerUserName}/${projectName}/browse${formatRelativePath(relativePath)}#successfulUpload`;

export const getUploadEndpoint = (ownerUserName: string, projectName: string, relativePath: string) =>
  `/u/${ownerUserName}/${projectName}/files/upload${formatRelativePath(relativePath, true)}`;

export const getHeadRevisionDirectoryLink = (ownerUserName: string, projectName: string, relativePath: string) =>
  `/u/${ownerUserName}/${projectName}/browse${formatRelativePath(relativePath)}`;

export const getDownloadSelectedEntitiesEndpoint = (
  ownerUserName: string,
  projectName: string,
  relativePath: string,
  headCommitId: string
) => `/u/${ownerUserName}/${projectName}/downloadSelected/${headCommitId}${formatRelativePath(relativePath)}`;

export const getDownloadProjectFolderAsZipEndpoint = (
  ownerUserName: string,
  projectName: string,
  headCommitId: string
) => `/u/${ownerUserName}/${projectName}/downloadFolder/${headCommitId}`;

export const getCreateFileEndpoint = (ownerUserName: string, projectName: string, relativePath: string) =>
  `/u/${ownerUserName}/${projectName}/create${formatRelativePath(relativePath, true)}`;

export type ProviderName =
  'github' | 'gitlab' | 'githubEnterprise' | 'unknown' | 'gitlabEnterprise' | 'bitbucket' | 'bitbucketServer';
export const getRepositoryIconByProvider = (repositoryType?: ProviderName, color = false) => {
  switch (repositoryType) {
    case 'github':
    case 'githubEnterprise':
      // Github icon
      return Octicon;
    case 'bitbucket':
    case 'bitbucketServer':
      // Bitbucket icon
      if (color) {
        return BitBucketLogoMarkColor;
      } else {
        return BitBucketLogoMark;
      }
    case 'gitlab':
    case 'gitlabEnterprise':
      // Gitlab icon
      if (color) {
        return GitLabLogoMarkColor;
      } else {
        return GitLabLogoMark;
      }
    default:
      // Git SCM icon
      if (color) {
        return GitLogoMarkColor;
      } else {
        return GitLogoMark;
      }
  }
};

export interface DisplayFileElementProps {
  fileName: string;
  htmlStr: string;
  iframeStyles?: React.CSSProperties;
  className?: string;
}

export function withFileDisplayElement<P extends DisplayFileElementProps>(Component: React.ComponentType<P>) {
  return class OutputComponent extends React.Component<P, {}> {
    iframeRef: React.RefObject<HTMLIFrameElement>;
    constructor (props: P) {
      super(props);
      this.iframeRef = React.createRef();
    }

    resizeIframeHandler = (event: MessageEvent) => {
      const msgPrefix = "resize:";
      if (this.iframeRef.current != null && event.origin === "null" && event.source === this.iframeRef.current.contentWindow && event.data.startsWith(msgPrefix)) {
        this.iframeRef.current.style.height = event.data.substr(msgPrefix.length);
      }
    }


    render() {
      window.addEventListener("message", this.resizeIframeHandler);

      const { fileName, htmlStr, iframeStyles } = this.props;
      const isNotebook = fileName.split('.').pop() === 'ipynb';
      const isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
      if (isNotebook && !isEdge) {
        const blob = new Blob([htmlStr], {type: 'text/html'});
        const blobUrl = window.URL.createObjectURL(blob);
        return (
          <iframe
            ref={this.iframeRef}
            className="resizeable_iframe"
            src={blobUrl}
            sandbox="allow-scripts"
            // @ts-ignore
            style={iframeStyles || {}}
          />
        );
      }
      return <Component {...this.props as P} />;
    }
  };
}

export type GitCredentialsContextProps = {
  allCredentials: GitCredential[],
  getCredentialForRepo: (repoId: string) => string | undefined
};
export const GitCredentialsContext = React.createContext<GitCredentialsContextProps>({
  allCredentials: [],
  getCredentialForRepo: () => undefined
});
GitCredentialsContext.displayName = 'GitCredentialsContext';

export const GitProvidersContext = React.createContext<GitProvider[]>([]);
GitProvidersContext.displayName = 'GitProvidersContext';

export const ProjectIdContext = React.createContext<string>('');
ProjectIdContext.displayName = 'ProjectIdContext';

export async function onGitCredentialsChange (newCredentialsId: string,
                                              repoId: string,
                                              projectId: string,
                                              credentialMapState: {[repoId: string]: string},
                                              setCredentialMapState: (mapState: {[repoId: string]: string}) => void) {

  const oldCredentialsId = credentialMapState[repoId];
  if (newCredentialsId === oldCredentialsId) { return; }
  try {
    if (newCredentialsId) {
      await setCredentialMapping({ projectId, repoId, body: { credentialId: newCredentialsId } });
    } else {
      await deleteCredentialMapping({ projectId, repoId });
    }
    setCredentialMapState({...credentialMapState, [repoId]: newCredentialsId});
    toastrSuccess(`Git credentials updated.`);
  } catch (e) {
    console.error('Failed to update git credentials.', e);
    toastrError('Failed to update git credentials.');
  }
}
