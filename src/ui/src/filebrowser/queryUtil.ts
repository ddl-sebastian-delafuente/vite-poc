import axios, { AxiosPromise } from 'axios';
import $ from 'jquery';
import { type, toPairs } from 'ramda';
import { httpRequest } from '@domino/api/dist/httpRequest';
import { getTargetPath, filterChildDirectories } from './bulkMoveUtil';
import {
  getChildDirectoriesAtPathUrl,
  getMoveFilesAndFoldersUrl,
} from '../core/legacyApiEndpoints';
import { SelectedEntity, CreateDatasetFromFilesPayload } from './types';

function createFormPostBody(data: { [key: string]: any }): URLSearchParams {
  const body = new URLSearchParams();
  toPairs(data).forEach(([key, value]: [string, any]) => {
    if (type(value) === 'Array') {
      value.forEach((v: any) => {
        body.append(`${key}[]`, v);
      });
    } else {
      body.append(key, value);
    }
  });
  return body;
}

export function createFormPost<Result = {}>(
  data: { [key: string]: any },
  endpoint: string,
  raw: boolean = false
): Promise<Result> {
  const body = createFormPostBody(data);
  return httpRequest('POST', endpoint, null, {}, {
    'Content-Type': 'application/x-www-form-urlencoded'
  }, body, false, raw);
}

export type ToMoveData = {
  files: string[];
  targetPath: string;
  directories: string[];
};

export const addFolderToProjectFiles = (
  createFolderEndpoint: string,
  data: { folderName: string; currentFolder: string; csrfToken: string }
) => createFormPost(data, createFolderEndpoint);

export function getInitialBulkMoveTreeData(
  ownerUsername: string,
  projectName: string,
  selectedEntities: SelectedEntity[],
  path?: string
): Promise<any> {
  const currPath: string = path || '/';
  return getChildDirectories(ownerUsername, projectName, currPath)
    .then(res => {
      if (res) {
        const formattedPaths =
          res.data.message.map(
          (scalaPath:  { path: { canonicalizedPathString: string }}) => scalaPath.path.canonicalizedPathString
          );
        return filterChildDirectories(formattedPaths, selectedEntities);
      }
      return [];
    })
    .then((childDirs: string[]) => {
      if (childDirs && childDirs.length) {
        // keep going
        return Promise.all(childDirs.map(nextPath =>
          getInitialBulkMoveTreeData(ownerUsername, projectName, selectedEntities, nextPath)))
          .then(subTrees => {
            return [currPath, subTrees];
          });
      }

      return [currPath, []];
    });
}

export function getChildDirectories(
  ownerUsername: string,
  projectName: string,
  directoryPath: string
): AxiosPromise<any> {
  const url = getChildDirectoriesAtPathUrl(ownerUsername, projectName);
  const data = { directoryPath };

  return axios({
    url,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function postMoveEntities(
  projectName: string, ownerUsername: string, toMoveData: ToMoveData
): AxiosPromise<void> {
  const { files, targetPath, directories } = toMoveData;
  const url = getMoveFilesAndFoldersUrl(ownerUsername, projectName);
  let data: { [key: string]: any } = {};

  if (files.length) {
    data.filesToMove = files.map(originPath => {
      return {
        originPath,
        targetPath: getTargetPath(originPath, targetPath),
      };
    });
  }

  if (directories.length) {
    data.foldersToMove = directories.map(originPath => ({
      originPath,
      targetPath: getTargetPath(originPath, targetPath),
    }));
  }

  return axios({
    url,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const createDatasetFromFiles = (submitUrl: string, data: CreateDatasetFromFilesPayload) => {
  const body = createFormPostBody(data);
  return axios({
    url: submitUrl,
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export function downloadUrl(url: string, method: string, selectedPaths?: string[]) {
  // TODO replace eventually
  var iframe = $('<iframe style="visibility: collapse;"></iframe>');
  $('body').append(iframe);
  const csrfInput = document.getElementById('csrfInput');
  if (csrfInput) {
    const s = new XMLSerializer();
    const serializedCSRFInput = s.serializeToString(csrfInput);
    // @ts-ignore
    const content = iframe[0].contentDocument;
    let form = '<form action="' + url + '" method="' + method + '"><input type="hidden" name="inline" value="false"/>';
    if (selectedPaths !== undefined) {
      form += serializedCSRFInput;
      selectedPaths.forEach((path: string) => {
        form += `<input type="hidden" name="selectedPaths[]" value="${path}"/>`;
      });
    }
    form += '</form>';
    content.write(form);
    $('form', content).submit();
    setTimeout(((innerIframe: any) => {
      return function() {
        innerIframe.remove();
      };
    })(iframe), 15000);
  } else {
    console.error('Couldn\'nt find csrfInput when downloading files');
  }
}

export { axios as queryUtilAxios };
