import * as React from 'react';

import DirectoryBreadcrumbs from './DirectoryBreadcrumbs';
import BrowserTable from './FileBrowserTable';
import { Repository } from '../types/filebrowserTypes';
import {
  DominoProjectsApiRepositoriesResponsesBrowseRepoBrowserEntryDto as BrowseEntryDto
} from '@domino/api/dist/types';
import { useCodeNavigationContext } from './CodeNavigationContext';

export interface GBPDirectoryBrowserProps {
    repo: Repository;
    contents: BrowseEntryDto[];
  }
const GBPDirectoryBrowser: React.FC<GBPDirectoryBrowserProps> = ({repo, contents}) => {
  const { directory: currentPath, setDirectory, branch: navBranch, commit: navCommit } = useCodeNavigationContext();

  const setPath = (path: string) => setDirectory(path.length === 0 ? [] : path.split('/'));
  const handleFileClick = (path: string) => {
    let url = `/v4/projects/${repo.projectId}/gitRepositories/${repo.id}/git/raw?fileName=${encodeURIComponent(path)}`;
    if (navCommit) {
      url += `&commit=${encodeURIComponent(navCommit)}`;
    } else if (navBranch) {
      url += `&branchName=${encodeURIComponent(navBranch)}`;
    }
    window.open(url, '_blank');
  };

  return (
    <>
      <DirectoryBreadcrumbs
        repositoryName={repo.name}
        currentPath={currentPath}
        setPath={setPath}
      />
      <BrowserTable
        entries={contents}
        onDirectoryClick={setPath}
        onFileClick={handleFileClick}
      />
    </>
  );
};
GBPDirectoryBrowser.displayName = 'GBPDirectoryBrowser';

export default GBPDirectoryBrowser;
