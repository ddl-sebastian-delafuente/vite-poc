import * as React from 'react';
import ModalWithButton from '../../components/ModalWithButton';
import AddGitCredentialsContent from './AddGitCredentialsContent';
import styled from 'styled-components';
import Button from '../../components/Button/Button';

// @ts-ignore
const AddRepoButton = styled(Button)`
  display: flex;
  width:100%;
  .ant-btn-group {
    width: 100%;
  }
`;

const openButtonProps = {
  'data-test': 'OpenAddCredentialsModalButton',
  'btnType': 'secondary',
  'className': 'modal-button',
  'style': {
    'justifyContent': 'center',
  },
};

const modalProps = {
  title: 'Add Git Credentials',
  'data-test': 'AddGitCredentialsModal',
  closable: true,
  destroyOnClose: true
};

export type Props = {
  hideLearnMoreOnFile: boolean;
  openButtonLabel?: string;
  areReferencesCustomizable: boolean;
  onClose?: () => void;
  onSubmit: any;
  url?: string,
  defaultReference?: string,
  isDisabled: boolean;
  user?: any;
  gitServiceProviders: any;
};

const AddGitCredentialsModal = ({
  onSubmit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openButtonLabel,
  isDisabled,
  gitServiceProviders,
  ...props
 }: Props) => {
  // forceClose is used to tie the cancel button's state in the validated form's footer to the modal state
  const [
    forceClose,
    setForceClose
  ] = React.useState(false)

  const closeModal = () => setForceClose(true)
  const resetForceClose = () => setForceClose(false)

  // Resets forceClose so that it can be used again
  React.useEffect(() => {
    if (forceClose) {
      resetForceClose()
    }
  }, [forceClose]);

  const closeAndSubmit = (data: any) => {
    closeModal()
    return onSubmit(data)
  }

  return (
    <ModalWithButton
      openButtonLabel={"Add Credentials"}
      openButtonProps={openButtonProps}
      handleFailableSubmit={closeAndSubmit}
      modalProps={modalProps}
      handleCancel={resetForceClose}
      showFooter={false}
      disabled={isDisabled}
      ModalButton={AddRepoButton}
      forceClose={forceClose}
    >
      {() => (
        <AddGitCredentialsContent
          onSubmit={closeAndSubmit}
          onClose={closeModal}
          user={props.user}
          gitServiceProviders={gitServiceProviders}
        />
      )}
    </ModalWithButton>
  );
};

export default AddGitCredentialsModal;
