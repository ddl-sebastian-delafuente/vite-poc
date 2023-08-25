import * as React from 'react';
import * as R from 'ramda';
import EditInlineContainer from '@domino/ui/dist/components/EditInline/EditInlineContainer';
import * as toastr from '@domino/ui/dist/components/toastr';
import { fetchApi, HttpMethods } from '../utils/fetchApi';

export enum Defaults {
  PLACEHOLDER = 'Set environment name',
  EMPTY_TEXT_ERROR = 'Environment name cannot be empty. Please enter a valid environment name.',
}

const { PLACEHOLDER, EMPTY_TEXT_ERROR } = Defaults;

// ToDo: This needs to be an API from backend.
const onUpdate = (url: string) => async (newName: string) =>
  fetchApi({ url, method: HttpMethods.PUT, data: { name: newName } });

export interface EnvironmentNameInputProps {
  updateUrl: string;
  environmentName: string;
  inputIsReadOnly: boolean;
}

const EnvironmentNameInput: React.FC<EnvironmentNameInputProps> = ({
  updateUrl,
  environmentName,
  inputIsReadOnly,
}) => {
  const onError = (err: Partial<Error>) => {
    toastr.error(err.message);
    return false;
  }

  const onSuccess = (response: any) => {
    toastr.success(response);
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
      value={environmentName}
      placeholder={PLACEHOLDER}
      disabled={inputIsReadOnly}
      handleFailableSubmit={handleFailableSubmit}
    />
  );
};

export default EnvironmentNameInput;
