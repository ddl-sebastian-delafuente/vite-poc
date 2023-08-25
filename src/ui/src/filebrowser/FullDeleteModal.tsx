import * as React from 'react';
import { defaultTo, curry, filter, join, init, pipe, split, last } from 'ramda';
import { fullDelete } from '@domino/api/dist/Files';
import { browseFilesHead } from '../core/routes';
import { success as toastrSuccess } from '../components/toastr';
import { ExtendedButtonProps } from '../components/Button/Button';
import DangerButton from '../components/DangerButtonDark';
import ModalWithButton from '../components/ModalWithButton';
import FormattedForm, { InputType } from '../components/FormattedForm';

const Tinit: (arr: any[]) => any = init;
const cleanPath = pipe(split('/'), curry(filter)((x: string) => !!x) as unknown as (x: string[]) => string[]);
const getDirPath = pipe(cleanPath, Tinit, join('/'), x => x || undefined);
const getFileNameFromPath = pipe(cleanPath, last, defaultTo(''));

const fields = [
  [{
    inputType: 'error' as InputType,
    inputOptions: {
      key: 'deleteWarning',
      content: `
        A full delete will remove all instances of this file from the Domino File System. This includes all files with
        identical contents, regardless of file name. This cannot be undone.
      `,
    },
  }],
  [{
    inputType: 'textarea' as InputType,
    inputOptions: {
      key: 'fullDeleteMessage',
      label: 'Full Delete Message',
      sublabel: 'Provide a reason for the full delete',
      validated: true,
      validators: [{
        checker: (value: string) => !value,
        errorCreator: () => 'You must enter a reason for the full delete',
      }],
      className: 'full-delete-message'
    },
  }]
];

const handlSubmit = ({
    commitId,
    filePath,
    projectId,
  }: FileDetails,
  handleOnSuccessRedirect: () => void,
) => ({ fullDeleteMessage }: { fullDeleteMessage: string }) => {
  return fullDelete({
    body: {
      commitId,
      filePath,
      projectId,
      deleteReason: fullDeleteMessage,
    },
  }).then(() => {
    // show toast and do redirect
    toastrSuccess(`Full deletion of ${getFileNameFromPath(filePath)} successful.`);
    handleOnSuccessRedirect();
  });
};

export type FileDetails = {
  commitId: string;
  filePath: string;
  projectId: string;
};

export type FullDeleteModalProps = {
  disabled?: boolean;
  projectName: string;
  projectOwnerName: string;
  triggerRedirect?: (url: string) => void;
  OpenModalButton: React.FunctionComponent<ExtendedButtonProps> | React.ComponentClass<ExtendedButtonProps>;
} & FileDetails;

const FullDeleteModal = ({
  projectName,
  projectOwnerName,
  triggerRedirect = (url: string) => window.location.assign(url),
  OpenModalButton,
  commitId,
  filePath,
  projectId,
  disabled,
}: FullDeleteModalProps) => {
  return (
  <ModalWithButton
    testId="full-delete-modal"
    openButtonLabel="Full Delete"
    modalProps={{
      title: `Full Delete ${getFileNameFromPath(filePath)}?`,
    }}
    disabled={disabled}
    showFooter={false}
    ModalButton={OpenModalButton}
    handleFailableSubmit={handlSubmit({
      commitId,
      filePath,
      projectId,
    }, () => triggerRedirect(browseFilesHead(projectOwnerName, projectName, getDirPath(filePath))))}
  >
    {(ctx: ModalWithButton) => (
      <FormattedForm
        CustomSubmitButton={DangerButton}
        submitLabel="Full Delete"
        cancelLabel="Cancel"
        asModal={true}
        fieldMatrix={fields}
        onSubmit={ctx.handleOk}
        onCancel={ctx.handleCancel}
      />
    )}
  </ModalWithButton>);
}
export default FullDeleteModal;
