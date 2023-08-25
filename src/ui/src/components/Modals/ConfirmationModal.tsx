import * as React from 'react';
import styled from 'styled-components';
import { WarningFilled } from '@ant-design/icons';
import { colors, themeHelper } from '../../styled';
import Modal from '../Modal';
import Button from '../Button/Button';
import FlexLayout from '../Layouts/FlexLayout';
import { WarningBox } from '../Callout/WarningBox';

const ModalContent = styled.div`
  padding: 0 ${themeHelper('paddings.large')};
`;

const DangerButtonWrapper = styled.span`
  .ant-btn {
    background-color: ${colors.cabaret};
  }
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  div.button {
    margin-left: ${themeHelper('margins.tiny')};
  }
`;

export interface ConfirmationModalProps {
  isVisible: boolean;
  children?: JSX.Element | string | never[];
  okText?: string;
  cancelText?: string;
  modalTestId?: string;
  okTestId?: string;
  cancelTestId?: string;
  setVisible: (visible: boolean) => void;
  handleOk: () => void;
  header?: string;
  description?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = (
  {isVisible, setVisible, children, handleOk, okText = 'OK', cancelText = 'Cancel',
    modalTestId = 'modal', okTestId = 'confirm-button', cancelTestId = 'cancel-button',
    header = '', description = ''}) => {
  return (
    <Modal
      visible={isVisible}
      bodyStyle={{padding: 0, background: colors.white}}
      centered={true}
      closable={true}
      testId={modalTestId}
      onCancel={() => setVisible(false)}
      title={header}
      footer={
        <FooterContainer>
          <Button
            btnType="secondary"
            testId={cancelTestId}
            onClick={() => setVisible(false)}
          >
            {cancelText}
          </Button>
          <DangerButtonWrapper>
            <Button isDanger={true} testId={okTestId} onClick={handleOk}>{okText}</Button>
          </DangerButtonWrapper>
        </FooterContainer>
      }
    >
      <ModalContent>
        {description &&
          <FlexLayout justifyContent="flex-start">
            <WarningBox icon={<WarningFilled />} fullWidth={true}>{description}</WarningBox>
          </FlexLayout>
        }
        {children}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
