import * as React from 'react';
import { last, dropLast } from 'ramda';
import { removeFile, removeFiles } from '@domino/api/dist/Files';
import { getErrorMessage } from '../utils/errorUtil';
import { error as errorToast } from '../components/toastr';
import { ExtendedButtonProps } from '../components/Button/Button';
import ModalWithButton from '../components/ModalWithButton';

const handleRemoveFailure = (errorMessage: string) => errorToast('Failed to remove entities', errorMessage);

const modalProps = {
  title: 'Delete Files & Folders',
  'data-test': 'RemoveFilesConfirmationModal',
};

const UNCHECKED_BOXES_ERROR = 'Use the checkboxes on the left to select the files you want to delete.';

const MAX_SHOWABLE_DELETE_PATHS = 100;

const getPathsMessage = (paths: string[]) => {
  if (paths.length > 1) {
    const initialPaths = dropLast(1, paths);
    const lastPath = last(paths);
    if (paths.length > 2) {
      if (paths.length <= MAX_SHOWABLE_DELETE_PATHS) {
        return `${initialPaths.join(', ')}, and ${lastPath}`;
      }
      const totalRemainingPaths = paths.length - MAX_SHOWABLE_DELETE_PATHS;
      return `${initialPaths.slice(0, MAX_SHOWABLE_DELETE_PATHS).join(', ')}, ... and ${totalRemainingPaths} more`;
    }
    return `${initialPaths[0]} and ${lastPath}`;
  }
  return paths[0] || 'the selected files';
};

export const onSubmit = (
  successfulRemoveUrl: string,
  paths: string[],
  ownerUsername: string,
  projectName: string,
) => () => {
  const withSuccessfulRemovalRedirect = (resolvedPromise: Promise<any>): Promise<any> =>
    resolvedPromise.then(() => {
      const nextHref = successfulRemoveUrl;
      window.location.href = nextHref;
      window.location.reload();
    })
    .catch((error: any) => {
      getErrorMessage(error)
      .then((message: string) => {
        handleRemoveFailure(message);
      })
      .catch(() => {
        handleRemoveFailure(JSON.stringify(error));
      });
      return Promise.reject(error); // keep modal from closing
    });

  if (paths.length === 0) {
    return withSuccessfulRemovalRedirect(Promise.reject(UNCHECKED_BOXES_ERROR));
  }

  if (paths.length === 1) {
    return withSuccessfulRemovalRedirect(
      removeFile({ body: { pathToRemove: paths[0], ownerUsername, projectName } })
    );
  }
  return withSuccessfulRemovalRedirect(removeFiles({
    body: {
      paths,
      ownerUsername,
      projectName,
    }
  }));
};

export type Props = {
  disabled?: boolean;
  CustomButton?: React.FunctionComponent<ExtendedButtonProps>;
  openButtonProps?: any;
  paths: string[];
  successfulFilesRemovalEndpoint: string;
  ownerUsername: string;
  projectName: string;
};

const RemoveFilesConfirmationModal = ({
  successfulFilesRemovalEndpoint,
  openButtonProps,
  paths,
  CustomButton,
  disabled,
  ownerUsername,
  projectName,
}: Props) => (
  <ModalWithButton
    disabled={disabled}
    ModalButton={CustomButton}
    handleFailableSubmit={
      onSubmit(
        successfulFilesRemovalEndpoint,
        paths,
        ownerUsername,
        projectName,
      )
    }
    openButtonLabel="Delete"
    modalSubmitButtonLabel="Delete"
    openButtonProps={{...openButtonProps, 'data-test': 'RemoveFilesConfirmationModalButton' }}
    modalProps={modalProps}
  >
    Are you sure you want to delete {getPathsMessage(paths)}?
  </ModalWithButton>
);

export default RemoveFilesConfirmationModal;
