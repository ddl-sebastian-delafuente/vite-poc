import * as React from 'react';
import { AxiosResponse } from 'axios';
import { isNil } from 'ramda';
import styled from 'styled-components';
import InfoBox from '../components/Callout/InfoBox';
import Button, { ExtendedButtonProps } from '../components/Button/Button';
import ModalWithButton from '../components/ModalWithButton';
import FormattedForm, { FormattedFormInputValues, InputType, InputOptions } from '../components/FormattedForm';
import { CreateDatasetFromFilesPayload } from './types';
import {
  getInvalidNamespaceMessage,
  fileProjectDatasetNameValidator,
} from '../utils/fileProjectDatasetNameValidator';
import { createDatasetFromFiles } from './queryUtil';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const openButtonProps = {
  'data-test': 'CreateDataSetFromFilesModalButton',
};

const defaultValues = {
  name: 'example_data_set_name',
  importDataSet: true,
  removeFilesFromParent: true,
};

const noFilesSelectedError = 'No files selected';

const StyledCodeBlock = styled.code`
    display: block;
    white-space: pre-line;
    word-wrap: break-word;
    text-align: left;
`;

function getWorkingDirEnvName(name?: string, username?: string, appName?: string) {
  const formattedUsername = (username || '').toUpperCase();
  const formattedName = (name || '').toUpperCase();
  const prefixWhiteLabel = (appName || '').toUpperCase() + (appName ? '_' : '');
  return `${prefixWhiteLabel}${formattedUsername}_${formattedName}_WORKING_DIR`;
}

const shouldShowHelpBlock = (name?: string) => name !== defaultValues.name && name !== '' && !isNil(name);

export type DataSetNameHelpBlockProps = {
  username?: string;
  name?: string;
  appName: string;
};

export const DataSetNameHelpBlock = ({ username = 'username', name, appName = '' }: DataSetNameHelpBlockProps) => (
  !shouldShowHelpBlock(name) ? null : (
    <div data-test="dataset-name-help-block">
      <InfoBox>
        {`When creating a Data Set from an existing Project, selecting "Import
        data set", and selecting "Delete selected files" will cause all existing relative
        references to these files to stop working. Instead use this environment variable name
        as an alias to the path where the imported files can be accessed.`}
      </InfoBox>
      <div id="env-var-usage-python-example">
        To use this environment variable in Python:
        <StyledCodeBlock>
          import os
          os.environ['<span className="example">{getWorkingDirEnvName(name, username, appName)}</span>']
        </StyledCodeBlock>
      </div>
    </div>
  )
);

const fields = (parentProps: Props, appName = '') => [
  [{
    inputType: 'input' as InputType,
    inputOptions: {
      key: 'name',
      label: 'Data Set Name',
      help: 'Data set name',
      className: 'dataset-name'
    } as InputOptions,
  }],
  [{
    inputType: 'checkbox' as InputType,
    inputOptions: {
      key: 'importDataSet',
      label: 'Import data set',
      help: 'Import the newly created data set into this project',
      className: 'import-dataset'
    },
  }],
  [{
    inputType: 'checkbox' as InputType,
    inputOptions: {
      key: 'removeFilesFromParent',
      label: 'Delete selected files',
      help: 'Delete the selected files from this project',
      className: 'remove-files-from-parent'
    },
  }],
  [{
    inputType: 'input' as InputType,
    inputOptions: {
      key: 'working-folder-env-var-name',
      onValuesUpdate: (value: string, context: any, values: FormattedFormInputValues) => {
        const name = values.name || '';
        const { username } = parentProps;
        return {
          formGroupStyle: shouldShowHelpBlock(name) ? {} : { display: 'none' },
          value: getWorkingDirEnvName(name, username, appName),
          disabled: true,
          help: (
            <DataSetNameHelpBlock
              name={name}
              username={username}
              appName={appName}
            />
          ),
        };
      },
      label: 'Working Folder Environment Variable Name',
      help: (
        <DataSetNameHelpBlock
          name={(parentProps.defaultValues || {}).name}
          username={parentProps.username}
          appName={appName}
        />
      ),
    },
  }]
];

export type Props = {
  CustomButton?: React.FunctionComponent<ExtendedButtonProps>;
  selectedFilePaths: string[];
  inputField: {
    type?: string;
    componentClass: string;
    disabled?: boolean;
    help?: string;
    error?: string;
    id?: string;
    defaultValue?: string;
    placeholder?: string;
    name?: string;
    label?: string;
  };
  username: string;
  submitUrl: string;
  csrfToken: string;
} & DefaultProps;

export type DefaultProps = {
  defaultValues?: FormattedFormInputValues;
  submitLabel?: string,
  cancelLabel?: string,
  title?: string,
};

export type FormProps = {
  defaultValues?: FormattedFormInputValues;
};

class CreateDataSetFromFilesForm extends FormattedForm {
  validate = ({ name }: FormattedFormInputValues) => {
    return {
      name: fileProjectDatasetNameValidator(name) ?
        undefined :
        getInvalidNamespaceMessage('Data Set', name),
    };
  }
}

const onSubmit = (selectedFilePaths: string[], submitUrl: string, username: string, appName = '') =>
  async (values: FormattedFormInputValues) => {
  if (selectedFilePaths.length === 0) {
    throw new Error(noFilesSelectedError);
  }

  const data: CreateDatasetFromFilesPayload = {
    importDataSet: values.importDataSet,
    removeFilesFromParent: values.removeFilesFromParent,
    name: values.name,
    'working-folder-env-var-name': getWorkingDirEnvName(values.name, username, appName),
    paths: selectedFilePaths,
  };

  return createDatasetFromFiles(submitUrl, data)
    .then((response: AxiosResponse<any>) => {
        const successUrl: string = response.headers.location || 'there was no location';
        window.location.href = successUrl;
      });
};

const CreateDataSetFromFilesModal = (props: Props) => {
  const {
    whiteLabelSettings
  } = useStore();
  const {
    CustomButton = Button,
    cancelLabel = 'Cancel',
    submitLabel = 'Submit',
    csrfToken,
    title = '',
    submitUrl,
    username,
    selectedFilePaths,
  } = props;
  
  const appName = React.useMemo(
    () => getAppName(whiteLabelSettings),
    [whiteLabelSettings]
  );
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFailableSubmit = React.useCallback(
    onSubmit(selectedFilePaths, submitUrl, username, appName),
    [appName]
  );
  
  return (
    <ModalWithButton
      ModalButton={CustomButton}
      showFooter={false}
      openButtonLabel="Extract Data Set"
      handleFailableSubmit={handleFailableSubmit}
      modalProps={{
        title,
        'data-test': 'CreateDataSetFromFilesModal',
      }}
      openButtonProps={openButtonProps}
    >
      {(modalContext: ModalWithButton) => (
        <CreateDataSetFromFilesForm
          fieldMatrix={fields(props, appName)}
          csrfToken={csrfToken}
          onSubmit={modalContext.handleOk}
          onCancel={modalContext.handleCancel}
          asModal={true}
          cancelLabel={cancelLabel}
          submitLabel={submitLabel}
          defaultValues={defaultValues}
        />
      )}
    </ModalWithButton>
  );
};

export default CreateDataSetFromFilesModal;
