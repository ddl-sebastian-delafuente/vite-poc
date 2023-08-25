import axios, { AxiosPromise } from 'axios';
import {
  renameFileOrDirUrl,
} from '../../core/legacyApiEndpoints';

export const FILE = 'file';
export const DIRECTORY = 'directory';

const getRenameEndpointType = (entityType: string) => {
  switch (entityType) {
    case FILE:
      return 'renameFile';
    case DIRECTORY:
      return 'renameFolder';
    default:
      break;
  }

  throw new Error(`cannot rename type: ${entityType}, is not a recognized entity type.`);
};

export function postRenameFileOrDir(
  ownerUsername: string,
  projectName: string,
  oldPath: string,
  newPath: string,
  entityType: string
): AxiosPromise<any> {
  const renameEndptType = getRenameEndpointType(entityType);
  const url = renameFileOrDirUrl(ownerUsername, projectName, renameEndptType);
  const data = {
    originPath: oldPath,
    targetPath: newPath,
  };

  return axios({
    url,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export type EditRepoValues = {
  defaultref: string;
  url: string;
  repoName: string;
  refdetails: string;
  gitCredential: string;
  gitServiceProvider: string;
};
