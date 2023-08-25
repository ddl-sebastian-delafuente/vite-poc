import { always, cond, isEmpty, isNil, T } from 'ramda';

export const LEGACY_DATASETS_MOUNT_PREFIX = '/domino/datasets/local';
export const GBP_DATASETS_MOUNT_PREFIX = '/mnt/data';

export const ERROR_MESSAGE_INVALID_CHARS = [
  'Invalid Dataset Name.',
  'Only letter, numbers, underscore and hyphens are allowed.'
].join(' ');
export const ERROR_MESSAGE_NAME = 'Please enter a name for this Dataset.';
export const ERROR_MESSAGE_NEW_NAME = 'Please enter a new name for this Dataset.';
export const ERROR_MESSAGE_WHITESPACE = 'Dataset name cannot contain spaces.';

export const getError = (value: string, datasetName?: string): string | undefined => {
  const isRename = typeof datasetName !== 'undefined';
  return cond([
    [always(isNil(value) || isEmpty(value.trim()) || (isRename && value.trim() === datasetName)),
      always(isRename ? ERROR_MESSAGE_NEW_NAME : ERROR_MESSAGE_NAME)],
    [always(/\s/.test(value)), always(ERROR_MESSAGE_WHITESPACE)],
    [always(!/^[a-zA-Z0-9_-]*$/.test(value)),
      always(ERROR_MESSAGE_INVALID_CHARS)],
    [T, always(undefined)],
  ])();
};

export enum SnapshotStatus {
  Active = 'active',
  MarkedForDeletion = 'markedForDeletion',
  DeletionInProgress = 'deletionInProgress',
  Deleted = 'deleted',
}
