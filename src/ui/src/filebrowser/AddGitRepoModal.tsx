import * as React from 'react';
import ModalWithButton from '../components/ModalWithButton';
import GitServiceProviderWrapper from './GitServiceProviderWrapper';
import AddGitRepoContent from './AddGitRepoContent';
import { GitCredentialsContext } from './util';

const openButtonProps = {
  'data-test': 'OpenAddGitRepoModalButton',
};

const modalProps = {
  title: 'Add a New Repository',
  'data-test': 'AddGitRepoModal',
};

// Adds an API call to provide the list of Git Service Providers as a prop
const WrappedAddGitRepoContent = GitServiceProviderWrapper(AddGitRepoContent);

export type Props = {
  hideLearnMoreOnFile: boolean;
  openButtonLabel: string;
  areReferencesCustomizable: boolean;
  onClose?: () => void;
  onSubmit: (data: any) => Promise<void>;
  url?: string;
  defaultReference?: string;
  isDisabled: boolean;
  hasError: boolean;
  errorMessage?: string;
};

const AddGitRepoModal = ({
  onClose,
  onSubmit,
  openButtonLabel,
  isDisabled,
  hasError,
  errorMessage,
  ...props
}: Props) => {
  return (
    <GitCredentialsContext.Consumer>
      {({allCredentials}) => 
        <ModalWithButton
          openButtonLabel={openButtonLabel}
          openButtonProps={openButtonProps}
          handleFailableSubmit={onSubmit}
          handleCancel={onClose}
          modalProps={modalProps}
          showFooter={false}
          disabled={isDisabled}
        >
          {(modalContext: ModalWithButton) => (
            <WrappedAddGitRepoContent
              onSubmit={modalContext.handleOk}
              onClose={modalContext.handleCancel}
              gitCredentials={allCredentials}
              hasError={hasError}
              errorMessage={errorMessage}
              {...props}
            />
          )}
        </ModalWithButton>}
    </GitCredentialsContext.Consumer>
  );
};

export default AddGitRepoModal;
