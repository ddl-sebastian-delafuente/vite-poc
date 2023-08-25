import { DominoProjectsApiRepositoriesGitProviderDto as GitProviderDto } from '@domino/api/dist/types';

export type SelectedEntity = {
  isDir: boolean;
  path: string;
};

export type BulkMoveTreeNode = {
  dirName: string;
  childDirs: BulkMoveTreeNode[];
  isOpen: boolean;
};

export type CreateDatasetFromFilesPayload = {
  paths: string[];
  name: string;
  importDataSet: boolean;
  removeFilesFromParent: boolean;
  'working-folder-env-var-name': string;
};

export type CommonRefType = 'head' | 'commitId' | 'ref';

export type RefType = CommonRefType | 'branch' | 'tag';

export type RequestRefType = CommonRefType | 'branches' | 'tags';

export type GitRepo = {
  location: string;
  repoName: string;
  uri: string;
  id: string;
  refLabel: string;
  refType: RefType;
  domain: string;
  serviceProvider: string;
};

export type GitCredential = {
  id: string;
  name: string;
  gitServiceProvider: string;
  domain: string;
  fingerprint: string;
  protocol: string;
};

export type GitReferenceType = {
  defaultRef?: string;
  refDetails?: string;
};

export type CredentialRepoMapping = {
  repoId: string;
  credentialId: string;
};

export type GitProvider = GitProviderDto;

export type RevisionShape = {
  runId: number | string;
  sha: string;
  message: string;
  timestamp: number;
  url: string;
  author: {
    username: string;
  };
  runNumberStr: string;
  runLink: string
};

export type ImportedProject = {
  availableReleases: AvailableRelease[];
  id: string;
  projects: string[];
  isReleaseOptionSelected: boolean;
  variablesAvailable: boolean;
  ownerUsername: string;
  projectName: string;
  isActive: boolean;
  mountPath: string;
  isArchived: boolean;
  filesAvailable: boolean;
  packageAvailable: boolean;
};

export type FilesPermissions = {
  globalUseFileStorage: boolean;
  canRun: boolean;
  canEdit: boolean;
  canBrowseReadFiles: boolean;
  canListProject: boolean;
  canFullDelete: boolean;
  canChangeProjectSettings: boolean;
}

export type AvailableRelease = {
  releaseId: string;
  runNumber: number;
  runHeading: string;
  createdAt: string;
  isSelected: boolean;
};

export type FileBrowserNameColumnData = {
  isDir?: boolean;
  disableLink?: boolean;
  sortableName: string;
  label: string;
  fileName: string;
  url: string;
  helpUrl: string;
};

export enum EntityType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export enum ProjectVisibility {
  Private = 'Private',
  Searchable = 'Searchable',
  Public = 'Public'
}
