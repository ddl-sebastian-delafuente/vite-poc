import {
  fileProjectDatasetNameValidator,
  getInvalidNamespaceMessage,
} from '../fileProjectDatasetNameValidator';

export const cleanPath = (path: string) => path.split('/').filter((level: string) => !!level).join('/');

export function validateFileDirName(
    name: string, oldName: string, defaultEntityType?: string
  ): undefined | string {
  const entityType = defaultEntityType || 'file';
  if (!name) {
    return getEntityNameErrorMessage(entityType);
  }

  if (name === oldName) {
    return getNameMatchWarning(entityType);
  }

  if (!fileProjectDatasetNameValidator(name, entityType)) {
    const formattedEntityType = entityType.split(' ').map(e => capitalize(e)).join(' ');
    return getInvalidNamespaceMessage(formattedEntityType);
  }
  return;
}

export function getNameMatchWarning(entityType: string): string {
  return `New ${entityType} name must not match old ${entityType} name`;
}

export function getEntityNameErrorMessage(entityType: string): string {
  return `You must enter a ${entityType} name`;
}

export function getChangeEntityWarning(defaultEntityType?: string): string {
  const entityType = defaultEntityType || 'file';

  const directObject = entityType === 'file' ? ' its ' : ' its own and its files\' ';
  return `Renaming the ${entityType} will cut ties to ${directObject} version history - the version history is maintained with the old ${entityType} name and you will not be able to compare revisions.`;
}

export function getEntityExistsMessage(defaultEntityType?: string): string {
  const entityType = defaultEntityType || 'file';
  const type = capitalize(entityType);
  return `${type} already exists`;
}

export function getSubmitButtonLabel(entityType: string) {
  const type = capitalize(entityType);
  return `Rename ${type}`;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const createNewFilePath = (dirPath?: string, fileName?: string): string => {
  const formattedDirPath = (dirPath || '').split('/').filter(x => !!x).join('/');
  if (fileName) {
    if (formattedDirPath) {
      return `${formattedDirPath}/${fileName}`;
    }
    return fileName;
  }
  return formattedDirPath;
};

export function getNewFilePath(newName: string, oldPath: string): string {
  const isDir = oldPath.endsWith('/');
  if (isDir) {
    oldPath = oldPath.slice(0, oldPath.length - 1);
  }
  const splitPath = oldPath.split('/');
  splitPath.pop();
  splitPath.push(newName);
  let newPath = splitPath.join('/');

  if (isDir) {
    // is a directory
    newPath += '/';
  }

  return newPath;
}

export function getFileDirName(path: string): string | undefined {
  const splitPath = cleanPath(path).split('/');
  return splitPath.pop();
}
