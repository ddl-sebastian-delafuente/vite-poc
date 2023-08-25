import * as React from 'react';
import * as R from 'ramda';
import EditInlineContainer from '@domino/ui/dist/components/EditInline/EditInlineContainer';
import * as toastr from '@domino/ui/dist/components/toastr';
import { fetchApi, HttpMethods } from '../utils/fetchApi';

export enum Defaults {
  PLACEHOLDER = 'Set model name',
  EMPTY_TEXT_ERROR = 'Model name cannot be empty. Please enter a valid model name.',
}

const { PLACEHOLDER, EMPTY_TEXT_ERROR } = Defaults;

// ToDo: This needs to be an API from backend.
const onUpdate = (url: string) => async (newName: string) =>
  fetchApi({ url, method: HttpMethods.PUT, data: { name: newName } });

export interface ModelNameInputProps {
  updateUrl: string;
  modelName: string;
  inputIsReadOnly: boolean;
}

const ModelNameInput: React.FC<ModelNameInputProps> = ({
  updateUrl,
  modelName,
  inputIsReadOnly,
}) => {
  const onError = (err: Partial<Error>) => {
    toastr.error(err.message);
    return false;
  }

  const onSuccess = (message: string) => {
    toastr.success(message);
    return true;
  }

  const handleFailableSubmit = async (value: string) => {
    if (!R.isNil(value)) {
      if (R.isEmpty(value)) {
        return onError({ message: EMPTY_TEXT_ERROR });
      } else {
        try {
          const response = await onUpdate(updateUrl)(value);
          return onSuccess(await response.text());
        } catch (err: any) {
          return onError(err);
        }
      }
    }
    return true;
  }

  return (
    <EditInlineContainer
      value={modelName}
      placeholder={PLACEHOLDER}
      disabled={inputIsReadOnly}
      handleFailableSubmit={handleFailableSubmit}
    />
  );
};

export default ModelNameInput;
