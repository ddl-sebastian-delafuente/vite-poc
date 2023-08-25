import * as React from 'react';
import {
  urlInputField,
  defaultRefComponents,
  gitCredentialInputFields,
  GitRepoModifyForm,
  repoNameInputField,
  RefStyleWrapper,
} from './gitRepoUtil';
import { RequestRefType, GitCredential, GitProvider } from './types';

const CANT_EDIT_MESSAGE = 'You are not allowed to edit this git repository\'s details';

export type EditGitRepoProps = {
  defaultRefLabel?: string;
  defaultReference?: RequestRefType;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  areReferencesCustomizable: boolean;
  currentGitCredentialId: string;
  currentGitServiceProvider?: any;
  gitCredentials: GitCredential[],
  gitServiceProviders: GitProvider[],
  repoName?: string;
  url?: string;
};

const EditGitRepoContent = ({
  repoName = '',
  url = '',
  areReferencesCustomizable = false,
  currentGitCredentialId,
  currentGitServiceProvider,
  gitCredentials,
  gitServiceProviders,
  defaultReference = 'head',
  defaultRefLabel,
  onClose,
  ...rest
}: EditGitRepoProps) => {
  const credentials = gitCredentials;
  const fieldMatrix = urlInputField(false).concat(
    gitCredentialInputFields(
      credentials,  
      gitServiceProviders
    ),
    defaultRefComponents(
      areReferencesCustomizable, 
      CANT_EDIT_MESSAGE
    ),
    repoNameInputField
    );
  return (
    <RefStyleWrapper>
      <GitRepoModifyForm
        asModal={true}
        defaultValues={{
          gitCredential: currentGitCredentialId ? currentGitCredentialId : '',
          gitServiceProvider: currentGitServiceProvider ? currentGitServiceProvider : '',
          refdetails: defaultRefLabel,
          defaultref: defaultReference,
          repoName,
          url,
        }}
        fieldMatrix={fieldMatrix}
        onCancel={onClose}
        submitLabel="Edit Repository"
        {...rest}
      />
    </RefStyleWrapper>
  );
};

export default EditGitRepoContent;
