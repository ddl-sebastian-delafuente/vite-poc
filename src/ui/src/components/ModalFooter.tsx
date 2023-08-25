import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { themeHelper } from '../styled/themeUtils';
import SuccessButton from './SuccessButton';
import Button from './Button/Button';

const getCancelButton = R.defaultTo(Button);
const getSubmitButton = R.defaultTo(SuccessButton);

const ModalFooterButtonsContainer = styled.div`
  display: inline-flex;
`;

const ButtonContainer = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
`;

export type ModalFooterProps = {
  visible?: boolean;
  disableSubmit?: boolean;
  className?: string;
  testId?: string;
  ModalCustomFooter?: any;
  modalSubmitButtonLabel?: string;
  modalCancelButtonLabel?: string;
  handleCancel: () => void;
  handleOk: (data: any) => void | Promise<any>;
  CustomSubmitButton?: any;
  CustomCancelButton?: any;
  submitButtonProps?: any;
};

export const BasicModalFooter = ({
    visible,
    submitButtonProps = {},
    ModalCustomFooter,
    testId,
    ...props
  }: ModalFooterProps) => {
  const CancelButton = getCancelButton(props.CustomCancelButton);
  const SubmitButton = getSubmitButton(props.CustomSubmitButton);
  const dataTestId = testId ? testId : '';
  return (
    <div className={`modal-footer-container ${props.className}`}>
      <div className="modal-footer-left">
        {R.is(Function, ModalCustomFooter) ? <ModalCustomFooter {...props} /> : ModalCustomFooter}
      </div>
      <ModalFooterButtonsContainer className="modal-footer-buttons-container">
        <ButtonContainer>
          <CancelButton
            data-test={dataTestId + 'cancel-button'}
            onClick={props.handleCancel}
            visible={visible}
            btnType="secondary"
          >
            {props.modalCancelButtonLabel}
          </CancelButton>
        </ButtonContainer>
        <ButtonContainer>
          <SubmitButton
            data-test={dataTestId + 'submit-button'}
            disabled={!!props.disableSubmit}
            onClick={props.handleOk}
            visible={visible}
            {...submitButtonProps}
          >
            {props.modalSubmitButtonLabel}
          </SubmitButton>
        </ButtonContainer>
      </ModalFooterButtonsContainer>
    </div>
  );
};

const StyledModalFooter = styled(BasicModalFooter)`
  &.modal-footer-container {
    display: flex;
    justify-content: space-between;
  }
`;

const ModalFooter = (props: ModalFooterProps) => <StyledModalFooter {...props} />;

export default ModalFooter;
