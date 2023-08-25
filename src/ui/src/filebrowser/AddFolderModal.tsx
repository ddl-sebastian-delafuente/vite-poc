import * as React from 'react';
import * as R from 'ramda';
import { Tooltip } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';
import { correctDirNamespacePattern } from '../utils/fileProjectDatasetNameValidator';
import { AntIconButton } from '../components/IconButton';
import FormattedForm, { CustomOption, InputOptions, InputType, } from '../components/FormattedForm';
import ModalWithButton from '../components/ModalWithButton';
import { addFolderToProjectFiles } from './queryUtil';
import nucleusFileBrowserReloader from './nucleusFileBrowserReloader';

const openButtonProps = {
  'data-test': 'AddFolderModalButton',
};

const onSubmit = (
  createFolderEndpoint: string
) => async (data: { folderName: string; currentFolder: string; csrfToken: string }) => {
  return addFolderToProjectFiles(createFolderEndpoint, data)
  .then(() => {
    nucleusFileBrowserReloader();
  });
};

const fields = [
  [
    {
      inputType: 'input' as InputType,
      inputOptions: {
        key: 'folderName',
        label: 'Folder Name',
        name: 'folderName',
        className: 'folder-name',
        autoFocus: true,
        validated: true,
        validators: [
          {
            checker: (value: string) => !value,
            errorCreator: () => 'Please provide a folder name.',
          },
          {
            checker: (value: string) => !correctDirNamespacePattern.test(value),
            errorCreator: () => 'Folder names can only consist of letters, numbers, underscores, and hyphens; and ' +
            'they must start with a letter or a number.',
          },
        ],
      } as InputOptions,
    },
  ],
  [
    {
      inputType: 'custom' as InputType,
      inputOptions: {
        key: 'currentFolder',
        onValuesUpdate: () => ({
          formItemOverrides: { formGroupStyle: { display: 'none' } },
        }),
        Component: ({ value }: any) => <input type="hidden" name="currentFolder" value={value} />
      } as CustomOption,
    },
  ],
];

type ToggleButtonProps = {
  onClick: () => void;
  visible?: boolean;
};

const AddFolderButton = (props: ToggleButtonProps) => (
  <AntIconButton {...R.omit(['visible'], props)}>
    <FolderAddOutlined />
  </AntIconButton>
);

export type Props = {
  createFolderEndpoint: string;
  csrfToken: string;
  dirPath: string;
  projectName: string;
  ownerUsername: string;
  disabled?: boolean;
  isLiteUser?: boolean;
};

const AddFolderModal = (props: Props) => (
  <Tooltip title={props.isLiteUser ? 'Contact admin for folder creation permission' : 'New Folder'} placement="top">
    <span>
      <ModalWithButton
        ModalButton={AddFolderButton}
        showFooter={false}
        handleFailableSubmit={onSubmit(props.createFolderEndpoint)}
        modalProps={{
          'data-test': 'AddFolderModal',
          id: 'add-folder-modal',
          title: 'Add a New Folder',
        }}
        openButtonProps={openButtonProps}
        disabled={props.isLiteUser || Boolean(props.disabled)}
      >
        {(modalCtx: ModalWithButton) => (
          <FormattedForm
            submitOnEnter={true}
            submitLabel="Create Folder"
            defaultValues={{
              csrfToken: props.csrfToken,
              currentFolder: props.dirPath,
            }}
            fieldMatrix={fields}
            onSubmit={modalCtx.handleOk}
            onCancel={modalCtx.handleCancel}
            asModal={true}
          />
        )}
      </ModalWithButton>
    </span>
  </Tooltip>
);

export default AddFolderModal;
