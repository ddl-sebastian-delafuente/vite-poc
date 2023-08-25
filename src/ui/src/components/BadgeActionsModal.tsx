import * as React from 'react';
import classNames from 'classnames';
import * as R from 'ramda';
import { isNil } from 'ramda';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Badge } from 'antd';
import InvisibleButton from './InvisibleButton';
import Modal from './ModalWithButton';
import { lighterDarkEggplantPurple } from '../styled/colors';
import Button from './Button/Button';
import tooltipRenderer from './renderers/TooltipRenderer';

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    background-color: ${lighterDarkEggplantPurple};
  }
`;

export interface BadgeActionsModalProps {
  disabled?: boolean;
  ids: string[];
  children: any;
  buttonIcon?: any;
  title: string | number | JSX.Element;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  customModalFooter?: any;
  onSubmit?: () => void;
  testId?: string;
  modalTestId?: string;
  onCancel?: () => void;
  onHoverMessage?: string;
  disableSubmit?: boolean;
  closable?: boolean;
  modalOpenButtonProps?: any;
  onOpenModalButtonClick?: () => void;
  disabledReason?: string;
  handleFailableSubmit?: (data: any) => Promise<any>;
  ariaLabel?: string
}

export interface ModalButtonProps {
  onClick: any;
  className?: string;
}

export type ModalButtonWithCountProps = ModalButtonProps & {
  count: number; buttonIcon: JSX.Element; disabled?: boolean; testId?: string;
};

export interface ShowBadgeProps {
  count: number;
  disabled?: boolean;
}

export const showBadge = (props: ShowBadgeProps) => {
  return !props.disabled && !isNil(props.count);
};

export const ModalButton = ({
    count,
    buttonIcon,
    disabled,
    testId,
    ...props
  }: ModalButtonWithCountProps) => (
  <InvisibleButton
    disabled={disabled}
    testId={testId}
    {...props}
    className={classNames('icon-button-container', props.className)}
    onClick={props.onClick}
  >
    {showBadge({ count, disabled }) ?
      <StyledBadge count={count}>
        {buttonIcon}
      </StyledBadge> :
      buttonIcon}
  </InvisibleButton>
);

export const getStyledModalButton = (
  buttonIcon: any,
  onHoverMessage?: string,
  onOpenModalButtonClick?: () => void,
  disabledReason?: string,
  testId?: string,
  ariaLabel?: string) =>
  (props: ModalButtonWithCountProps) => {
    const button = (
      <ModalButton
        {...props}
        testId={testId}
        aria-label={ariaLabel}
        buttonIcon={buttonIcon}
        onClick={() => {
          props.onClick();
          if (onOpenModalButtonClick) {
            onOpenModalButtonClick();
          }
        }}
      />
    );
    return !props.disabled ? (onHoverMessage ? tooltipRenderer(onHoverMessage, button) : button) :
      (disabledReason ? tooltipRenderer(disabledReason, button) : button);
};

export const getModalButton = (modalOpenButtonProps: any, onOpenModalButtonClick?: () => void, testId?: string, ariaLabel?: string) =>
  (props: ModalButtonWithCountProps) => {
    return (
      <Button
        {...props}
        {...modalOpenButtonProps}
        testId={testId}
        aria-label={ariaLabel}
        onClick={() => {
          props.onClick();
          if (onOpenModalButtonClick) {
            onOpenModalButtonClick();
          }
        }}
      />
    );
  };

const BadgeActionsModal = ({
  disabled = false,
  ids,
  children,
  buttonIcon,
  title,
  submitButtonLabel,
  cancelButtonLabel,
  customModalFooter,
  onSubmit,
  handleFailableSubmit,
  onCancel,
  onHoverMessage,
  closable = false,
  disableSubmit = false,
  modalOpenButtonProps,
  onOpenModalButtonClick,
  disabledReason,
  testId,
  modalTestId,
  ariaLabel
}: BadgeActionsModalProps) => (
  <Modal
    ModalButton={
      buttonIcon ? getStyledModalButton(buttonIcon, onHoverMessage, onOpenModalButtonClick, disabledReason, testId, ariaLabel) :
        modalOpenButtonProps ? getModalButton(modalOpenButtonProps, onOpenModalButtonClick, testId, ariaLabel) : null
    }
    modalProps={{
      title,
      closable,
    }}
    callbackOnClose={true}
    openButtonProps={{
      count: R.length(ids),
      disabled,
    }}
    ModalCustomFooter={customModalFooter}
    modalSubmitButtonLabel={submitButtonLabel}
    modalCancelButtonLabel={cancelButtonLabel}
    modalSubmitButtonDisable={disableSubmit}
    handleSubmit={onSubmit}
    handleFailableSubmit={handleFailableSubmit}
    handleCancel={onCancel}
    testId={modalTestId}
    disabled={disabled}
  >
    {children}
  </Modal>
);

export default BadgeActionsModal;
