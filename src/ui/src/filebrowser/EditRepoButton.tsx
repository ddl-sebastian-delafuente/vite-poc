import * as React from 'react';
import SecondaryButton from '../components/SecondaryButton';
import ModalWithButton from '../components/ModalWithButton';
import EditGitRepoContent from './EditGitRepoContent';
import { returnUserToGitReposTab } from './gitRepoUtil';
import GitServiceProviderWrapper from './GitServiceProviderWrapper';
import {
  EditRepoValues
} from '../utils/shared-components/queryUtil';
import {
  editGitRepo
} from '@domino/api/dist/Projects';
import { RequestRefType } from './types';
import { GitCredentialsContext } from './util';

const openButtonProps = {
  'data-test': 'OpenEditGitRepoImportButton',
};

export type Props = {
  csrfToken: string;
  url: string;
  repoName: string;
  repoId: string;
  currentGitServiceProvider: string;
  ownerUsername: string;
  projectName: string;
  projectId: string;
  isGitBasedProject: boolean;
  areReferencesCustomizable: boolean;
  defaultReference?: RequestRefType;
  defaultRefLabel?: string;
  isDisabled: boolean;
};

// Adds an API call to provide the list of Git Service Providers as a prop
const WrappedEditGitRepoContent = GitServiceProviderWrapper(EditGitRepoContent);

class EditRepoButton extends React.PureComponent<Props> {
  onSubmit = (values: EditRepoValues): Promise<void> => {
    const {
      ownerUsername,
      projectName,
      projectId,
      repoId,
      isGitBasedProject,
    } = this.props;

    return editGitRepo({
      projectId,
      repositoryId: repoId,
      body: {
        id: repoId,
        name: values.repoName ? values.repoName : undefined,
        uri: values.url,
        ref: {
          type: values.defaultref,
          value: values.refdetails
        },
        serviceProvider: values.gitServiceProvider,
        credentialId: values.gitCredential ? values.gitCredential : undefined
      }
    }).then(() => {
      returnUserToGitReposTab(ownerUsername, projectName, isGitBasedProject);
    });
  }

  render() {
    const {
      repoName, 
      currentGitServiceProvider,
      isDisabled,
      repoId,
      ...rest
    } = this.props;
    return (
      <GitCredentialsContext.Consumer>
        {({allCredentials, getCredentialForRepo}) => 
          <ModalWithButton
            ModalButton={SecondaryButton}
            handleFailableSubmit={this.onSubmit}
            showFooter={false}
            openButtonLabel="Edit"
            openButtonProps={openButtonProps}
            modalProps={{
              'data-test': 'EditGitRepoImportModal',
              title: `Editing ${repoName}`,
            }}
            disabled={isDisabled}
          >
            {(modalContext: ModalWithButton) => (
              <WrappedEditGitRepoContent
                repoName={repoName}
                onSubmit={modalContext.handleOk}
                onClose={modalContext.handleCancel}
                gitCredentials={allCredentials}
                currentGitServiceProvider={currentGitServiceProvider}
                currentGitCredentialId={getCredentialForRepo(repoId)}
                {...rest}
              />
            )}
          </ModalWithButton>}
      </GitCredentialsContext.Consumer>
    );
  }
}

export default EditRepoButton;
