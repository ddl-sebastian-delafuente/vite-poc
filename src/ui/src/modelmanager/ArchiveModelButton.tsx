import * as React from 'react';
import DangerButton from '../components/DangerButton';
import ModalWithButton from '../components/ModalWithButton';

export type Props = {
  onConfirm: () => void;
  isAsyncModel: boolean;
};

const syncMessage = "Once archived, this model won't show up in any searches, lists or on the Project/Publish tab. " +
  "Existing clients won't be able to invoke the model."

const asyncMessage = "Once archived, this model won't show up in any searches, lists or on the Project/Publish tab. " +
  "Existing clients won't be able to invoke the model and all in-flight requests will be canceled."

export const ArchiveModelButton = ({onConfirm, isAsyncModel}: Props) => (
  <ModalWithButton
    ModalButton={DangerButton}
    modalProps={{
      title: 'Archive this model?'
    }}
    openButtonLabel="Archive"
    modalSubmitButtonLabel="Archive this Model"
    modalCancelButtonLabel="Cancel"
    handleSubmit={onConfirm}
    testId="archive-model-button"
  >
    {isAsyncModel ? asyncMessage : syncMessage}
  </ModalWithButton>
);

export default ArchiveModelButton;
