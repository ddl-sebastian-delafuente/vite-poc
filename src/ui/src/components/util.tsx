import * as React from 'react';
import * as R from 'ramda';
import {
  FileTextOutlined, CodeOutlined, FileImageOutlined,
  PlaySquareOutlined, FileZipOutlined, FileUnknownOutlined
} from '@ant-design/icons';

const textFileExtensions = ['atom', 'bash', 'cf', 'cfg', 'cnf', 'conf', 'csv', 'doc', 'docm', 'docx', 'err', 'geojson',
  'hocon', 'html', 'ini', 'js', 'json', 'jsonnet', 'jsonp', 'jsx', 'log', 'markdown', 'mathml', 'md', 'MLmodel',
  'MLproject', 'pdf', 'prop', 'properties', 'py', 'py3', 'r', 'R', 'rest', 'rss', 'rst', 'sh', 'ssml', 'toml', 'ts',
  'tsv', 'tsx', 'txt', 'xml', 'yaml', 'yml'];
const imageFileExtensions = ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp'];
const audioFileExtensions = ['aif', 'aifc', 'aiff', 'm4a', 'mp3', 'ogg', 'wav', 'wma'];
const videoFileExtensions = ['avi', 'mid', 'midi', 'mov', 'mp4', 'mpeg', 'vob', 'wmv'];
const zipFileExtensions = ['7z', 'gz', 'rar', 'tar', 'zip', 'bz2', 'gzip', 'tgz', 'taz', 'tar.xz', 'tg',
  'b6z', 'sitx', 'sit', 'zst', 'tzst', 'tbz', 'tbz2'];
export const unsupportedFileExtensions = ['aac', 'accdb', 'accde', 'accdr', 'accdt', 'adt', 'adts', 'aspx', 'bat', 'bin', 'cab',
  'cda', 'dif', 'dll', 'dot', 'dotx', 'eml', 'eps', 'exe', 'flv', 'htm', 'ipynb', 'iso', 'jar', 'mdb', 'mpg', 'msi',
  'mui', 'pkl', 'pot', 'potm', 'potx', 'ppam', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'psd', 'pst', 'pub', 'rtf',
  'sldm', 'sldx', 'swf', 'sys', 'tif', 'tmp', 'vsd', 'vsdm', 'vsdx', 'vss', 'vssm', 'vst', 'vstm', 'vstx', 'wbk', 'wks',
  'wmd', 'wms', 'wmz', 'wp5', 'wpd', 'xgb', 'xla', 'xlam', 'xll', 'xlm', 'xls', 'xls', 'xlsm', 'xlsx', 'xlt', 'xltm',
  'xltx', 'xps', 'xslx'];
const rootUrlPattern = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export const getIconByFileType = (fileName: string) => {
  const fileType = R.last(R.split('.', fileName))?.toLocaleLowerCase();
  return R.cond([
    [(type) => R.contains(type, textFileExtensions), () => <FileTextOutlined />],
    [(type) => R.contains(type, imageFileExtensions), () => <FileImageOutlined />],
    [(type) => R.contains(type, unsupportedFileExtensions), () => <CodeOutlined />],
    [(type) => R.contains(type, R.concat(audioFileExtensions, videoFileExtensions)), () => <PlaySquareOutlined />],
    [(type) => R.contains(type, zipFileExtensions), () => <FileZipOutlined />],
    [R.T, () => <FileUnknownOutlined />]
  ])(fileType);
};

export const bytesToKb = (bytes?: number) => bytes ? Number(R.divide(bytes, 1000)) : 0;

export const bytesToMb = (bytes?: number) => bytes ? Number(R.divide(bytes, 1000000).toFixed(2)) : 0;

export const isImage = (filename: string) => {
  const fileType = R.last(R.split('.', filename));
  return R.contains(fileType, imageFileExtensions);
};

export const isAudioFile = (filename: string) => {
  const fileType = R.last(R.split('.', filename));
  return R.contains(fileType, audioFileExtensions);
}

export const isVideoFile = (filename: string) => {
  const fileType = R.last(R.split('.', filename));
  return R.contains(fileType, videoFileExtensions);
}

export const isZipFile = (filename: string) => {
  if (R.endsWith('tar.gz', filename)) {
    return true;
  }
  if (R.endsWith('tar.z', filename)) {
    return true;
  }
  if (R.endsWith('tar.xz', filename)) {
    return true;
  }
  const fileType = R.last(R.split('.', filename));
  return R.contains(fileType, zipFileExtensions);
}

export const isSvgFile = (filename: string) => {
  const fileType = R.last(R.split('.', filename));
  return R.contains(fileType, ['svg']);
}

export const isCSVFile = (filename: string) => {
  const fileType = R.last(R.split('.', filename));
  return R.contains(fileType, ['csv', 'tsv']);
};

export const isPdfFile = (filename: string) => {
  const fileType = R.last(R.split('.', filename));
  return R.equals(fileType, 'pdf');
};

export const isTextFile = (fileType: string) => {
  return R.contains(fileType, textFileExtensions);
};

export const getFileType = (filename: string) => {
  if (R.endsWith('tar.gz', filename)) {
    return 'tar.gz';
  }
  if (R.endsWith('tar.z', filename)) {
    return 'tar.z';
  }
  if (R.endsWith('tar.xz', filename)) {
    return 'tar.xz';
  }
  let fileType = R.defaultTo('')(R.last(R.split('/', filename)));
  fileType = R.defaultTo('')(R.last(R.split('.', fileType)));
  return R.cond([
    [() => R.contains(fileType, ['MLproject', 'MLmodel']), R.always('yaml')],
    [R.equals('err'), R.always('log')],
    [R.equals('prop'), R.always('properties')],
    [R.equals('py3'), R.always('py')],
    [R.equals('rst'), R.always('rest')],
    [() => R.contains(fileType, ['hocon', 'jsonnet']), R.always('json')],
    [R.T, R.always(fileType)]
  ])(fileType);
};

export const isMapFile = (filename: string) => {
  const fileType = R.last(R.split('.', filename));
  return R.equals(fileType, 'geojson');
};

export const isValidRootUrl = (docsRoot: string) => {
  !rootUrlPattern.test(docsRoot) && console.log(docsRoot, "is invalid docsRootUrl");
  return rootUrlPattern.test(docsRoot);
};
