import * as React from 'react';
import { WarningFilled } from '@ant-design/icons';
import { ExtendedButtonProps } from '../components/Button/Button';
import ModalWithButton from '../components/ModalWithButton';
import { ModalTitle } from '../data/data-sources/CommonStyles';
import { colors } from '..';

export type EditFileModalProps = {
  editFileLink: string;
  OpenModalButton: React.FunctionComponent<ExtendedButtonProps> | React.ComponentClass<ExtendedButtonProps>;
};

const EditFileModal = ({
  editFileLink,
  OpenModalButton
}: EditFileModalProps) => (
  <ModalWithButton
    openButtonLabel="Edit"
    closable={true}
    modalProps={{
      title: (
        <ModalTitle
          alignItems={'center'}
          justifyContent={'flex-start'}
        >
          <WarningFilled style={{ fontSize: '22px', color: colors.tulipTree }} />
          <span>Edits will be saved to default branch</span>
        </ModalTitle>
      ),
    }}
    ModalButton={OpenModalButton}
    modalSubmitButtonLabel={'Edit Anyway'}
    handleSubmit={() => {window.location.href = editFileLink; }}
    testId={'EditButton'}
  >
    <p>
      Currently, edits to this file can only be saved to the default branch. 
    </p>
    <p>
      If you are ok with this, continue with editing. 
      If not, cancel or close this message to go back to the file.
    </p>
  </ModalWithButton>
);

export default EditFileModal;
