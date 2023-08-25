import * as React from 'react';
import {
  defaultRefComponents,
  GitRepoModifyForm,
  urlInputField,
  gitCredentialInputFields,
  repoNameInputField,
  RefStyleWrapper,
  importedReposInfoBox,
  importedReposErrorBox,
} from './gitRepoUtil';
import { GitCredential } from './types';

export type Props = {
  onSubmit: (data: any) => Promise<void>;
  onClose?: () => void;
  areReferencesCustomizable: boolean;
  gitCredentials: GitCredential[];
  gitServiceProviders: any[];
  projectOwner?: string;
  repoName?: string;
  url?: string;
  defaultReference?: string;
  hideLearnMoreOnFile: boolean;
  hasError: boolean;
  errorMessage?: string;
};

const AddGitRepoContent = ({
  areReferencesCustomizable = false,
  repoName = '',
  url = '',
  defaultReference = 'head',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hideLearnMoreOnFile = false,
  onClose,
  gitCredentials,
  gitServiceProviders,
  hasError,
  errorMessage,
  ...rest
}: Props) => {
  const credentials = gitCredentials;
  const fieldMatrix = urlInputField(true).concat(
    gitCredentialInputFields(
      credentials,
      gitServiceProviders
    ),
    defaultRefComponents(
      areReferencesCustomizable
    ),
    repoNameInputField,
    importedReposErrorBox(hasError, errorMessage),
    importedReposInfoBox
  );

  return (
    <RefStyleWrapper>
      <GitRepoModifyForm
        asModal={true}
        defaultValues={{
          repoName,
          url,
          defaultref: defaultReference,
          gitCredential: ''
        }}
        fieldMatrix={fieldMatrix}
        onCancel={onClose}
        submitLabel="Add Repository"
        {...rest}
      />
    </RefStyleWrapper>
  );
};

export default AddGitRepoContent;
