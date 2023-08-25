export interface Directory {
  contents: Array<DirectoryContentItem>;
  metadata?: DirectoryMetadata;
}

export interface DirectoryContentItem {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
  _links: {
    git: string,
    self: string,
    html: string
  };
}

export interface DirectoryMetadata {
  // TBD
}

export interface Repository {
  id: string;
  mountDir: string;
  name: string;
  projectId: string;
  url: string;
  refType: string;
  refLabel?: string;
}

export enum BrowserTab {
  MainRepository = 'mainRepository',
  ImportedRepositories = 'importedRepositories'
}
