export interface DatasetGlobalRouteProps {
  datasetId?: string;
  snapshotId?: string;
}

export interface DatasetProjectRouteProps extends DatasetGlobalRouteProps {
  datasetName?: string;
  ownerName?: string;
  projectName?: string;
}

interface PathOrder {
  key: string,
  value?: string,
}

export const PARAMS = {
  datasetId: ':datasetId([a-f0-9]{24})',
  datasetName: ':datasetName',
  dirPath: ':dirPath(.*)?',
  filePath: ':filePath(.*)?',
  ownerName: ':ownerName',
  projectName: ':projectName',
  snapshotId: ':snapshotId([a-f0-9]{24})?',
}

const optionalRegexp = new RegExp(/\?$/);

export const buildPathDef = <T extends {}>(pathVars: T, pathOrder: PathOrder[]) => {
  const pathVarValues = Object.keys(pathVars).map((name) => pathVars[name]).filter(Boolean);
  if (pathVarValues.length === 0) {
    const pathDef = pathOrder.map(({ key }) => key).join('/');
    return `/${pathDef}`;
  }

  const genPath = pathOrder.reduce((memo, part) => {
    if (part.key && !part.value) {
      if (optionalRegexp.test(part.key)) {
        return memo;
      }

      return memo.concat(part.key);
    }

    if (part.value) {
      return memo.concat(part.value);
    }
    return memo;
  }, [] as string[]).join('/');
  return `/${genPath}`.replace('//', '/');
}

export interface GetDatasetGlobalDirectoryViewPathDefProps extends DatasetGlobalRouteProps {
  dirPath?: string;
}

export const datasetUploadViewPathDef = (
    ownerName?: string,
    projectName?: string,
    datasetId?: string,
    datasetName?: string,
    snapshotId?: string,
    dirPath?: string,
) => {
  const pathVars = {
    datasetId,
    datasetName,
    dirPath,
    ownerName,
    projectName,
    snapshotId,
  };

  const pathOrder = [
    { key: 'u' },
    { key: PARAMS.ownerName, value: ownerName },
    { key: PARAMS.projectName, value: projectName },
    { key: 'data' },
    { key: 'rw' },
    { key: 'upload' },
    { key: PARAMS.datasetName, value: datasetName },
    { key: PARAMS.datasetId, value: datasetId },
    { key: PARAMS.snapshotId, value: snapshotId },
    { key: PARAMS.dirPath, value: dirPath },
  ];

  return buildPathDef(pathVars, pathOrder);
}

export const datasetDetailsGlobalPathDef = (pathVars: GetDatasetGlobalDirectoryViewPathDefProps = {}) => {
  const {
    datasetId,
    snapshotId,
    dirPath,
  } = pathVars;
  const parts = [
    { key: 'data' },
    { key: 'dataset' },
    { key: PARAMS.datasetId, value: datasetId },
    { key: PARAMS.snapshotId, value: snapshotId },
    { key: PARAMS.dirPath, value: dirPath }
  ];

  return buildPathDef<GetDatasetGlobalDirectoryViewPathDefProps>(pathVars, parts);
}

export interface GetDatasetGlobalFileViewPathDefProps extends DatasetGlobalRouteProps {
  filePath?: string;
}

export const getDatasetGlobalFileViewPathDef = (pathVars: GetDatasetGlobalFileViewPathDefProps = {}) => {
  const {
    datasetId,
    filePath,
    snapshotId,
  } = pathVars;

  const pathOrder = [
    { key: 'data' },
    { key: 'dataset' },
    { key: 'view' },
    { key: PARAMS.datasetId, value: datasetId },
    { key: PARAMS.snapshotId, value: snapshotId },
    { key: PARAMS.filePath, value: filePath },
  ];

  return buildPathDef<GetDatasetGlobalFileViewPathDefProps>(pathVars, pathOrder);
}

export interface GetDatasetProjectFileViewPathDefProps extends DatasetProjectRouteProps {
  filePath?: string;
}

export const getDatasetProjectFileViewPathDef = (pathVars: GetDatasetProjectFileViewPathDefProps = {}) => {
  const {
    datasetId,
    datasetName,
    filePath,
    ownerName,
    projectName,
    snapshotId,
  } = pathVars;

  const pathOrder = [
    { key: 'u' },
    { key: PARAMS.ownerName, value: ownerName },
    { key: PARAMS.projectName, value: projectName },
    { key: 'data' },
    { key: 'rw' },
    { key: 'upload' },
    { key: PARAMS.datasetName, value: datasetName },
    { key: 'view' },
    { key: PARAMS.datasetId, value: datasetId },
    { key: PARAMS.snapshotId, value: snapshotId },
    { key: PARAMS.filePath, value: filePath },
  ];

  return buildPathDef<GetDatasetProjectFileViewPathDefProps>(pathVars, pathOrder);
}
