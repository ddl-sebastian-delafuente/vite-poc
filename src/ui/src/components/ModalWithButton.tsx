import * as React from 'react';
import { isNil } from 'ramda';
import Modal from './Modal';
import Button from './Button/Button';
import ModalFooter from './ModalFooter';

export type ModalWButtonProps<T = any> = {
  testId?: string;
  openButtonLabel?: any;
  openButtonProps?: any;
  modalSubmitButtonLabel?: string;
  modalCancelButtonLabel?: string;
  ModalCustomFooter?: any;
  modalProps?: any;
  handleFailableSubmit?: (data: T) => Promise<T | void>;
  handleSubmit?: () => void;
  handleCancel?: () => void;
  children?: any;
  ModalButton?: any;
  showFooter?: boolean;
  submitButtonProps?: any;
  callbackOnClose?: boolean;
  modalSubmitButtonDisable?: boolean;
  CustomSubmitButton?: React.FC;
  onBeforeCancel?: () => Promise<{}>;
  onBeforeClose?: () => Promise<{}>;
  onBeforeOpen?: () => Promise<{}>;
  onVisibilityChange?: (visible: boolean) => void;
  disabled?: boolean;
  submitDebounceInterval?: number;
  forceClose?: boolean;
  headerBackground?: string;
  closable?: boolean;
  onOpenButtonClick?: () => void;
  visibility?: boolean;
  maskClosable?: boolean;
};

export type ModalWButtonState = {
  visible: boolean;
  canSubmit: boolean;
};

class ModalWithButton<T = any> extends React.PureComponent<ModalWButtonProps, ModalWButtonState> {
  static defaultProps = {
    showFooter: true,
    disabled: false,
    openButtonLabel: 'Open',
    modalSubmitButtonLabel: 'OK',
    modalCancelButtonLabel: 'Cancel',
    openButtonProps: {},
    modalProps: {},
    ModalCustomFooter: null,
    handleSubmit: () => { return; },
    handleCancel: () => { return; },
    submitButtonProps: {},
    callbackOnClose: true,
    // Interval with which to debounce assuming API doesn't return successfully
    submitDebounceInterval: 500,
    forceClose: false,
  };

  state = {
    visible: false,
    canSubmit: true
  };

  componentDidUpdate(_prevProps: ModalWButtonProps, prevState: ModalWButtonState) {
    if (this.props.onVisibilityChange && prevState.visible !== this.state.visible) {
      this.props.onVisibilityChange(this.state.visible);
    }

    if (this.props.forceClose && prevState.visible) {
      this.setState({visible: false});
    }
  }

  showModal = () => {
    const { onBeforeOpen, onOpenButtonClick } = this.props;

    if (onBeforeOpen) {
      onBeforeOpen().then(() => {
        if (onOpenButtonClick) {
          onOpenButtonClick();
        }
        this.setState({visible: true});
      });
    } else {
      if (onOpenButtonClick) {
        onOpenButtonClick();
      }
      this.setState({visible: true});
    }
  }

  handleOk: (data: T) => Promise<T | void> = (data) => {
    const {
      handleFailableSubmit,
      submitDebounceInterval
  } = this.props;
    // Make sure you can't submit multiple times
    if (this.state.canSubmit) {
      if (handleFailableSubmit) {
        this.setState({canSubmit: false});
        // Set timeout to reset can submit to allow for resubmissions if submit fails
        setTimeout(() => {
          this.setState({canSubmit: true});
        }, submitDebounceInterval);
        // only close modal if submit succeeds
        return handleFailableSubmit(data)
          .then(() => {
            // If successful, reset flags and hide modal
            this.setState({canSubmit: true, visible: false}, this.props.handleSubmit);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
          }, () => {});
      } else {
        this.setState({canSubmit: true, visible: false}, this.props.handleSubmit);
      }
    }
    return Promise.resolve();
  }

  handleCancel = () => {
    const { onBeforeCancel } = this.props;
    const onSuccess = () => {
      this.setState(
        {visible: false},
        this.props.handleCancel
      );
    };

    if (!isNil(onBeforeCancel)) {
      onBeforeCancel().then(() => {
        onSuccess();
      });
    } else {
      onSuccess();
    }
  }

  handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const { onBeforeClose } = this.props;
    const onSuccess = () => {
      this.setState(
        {visible: false},
        this.props.callbackOnClose ? this.props.handleCancel : undefined
      );
    };
    if (!isNil(onBeforeClose)) {
      onBeforeClose().then(() => {
        onSuccess();
      });
    } else {
      onSuccess();
    }
  }

  render() {
    const {
      disabled,
      openButtonProps,
      openButtonLabel,
      children,
      modalProps,
      ModalButton,
      modalSubmitButtonLabel,
      modalCancelButtonLabel,
      ModalCustomFooter,
      showFooter,
      submitButtonProps,
      modalSubmitButtonDisable = false,
      CustomSubmitButton,
      headerBackground,
      closable = false,
      maskClosable = false,
      visibility
    } = this.props;
    const {
      visible,
    } = this.state;
    const modalVisible = visibility ?? (isNil(this.props.modalProps.visible) ?
     this.state.visible : this.props.modalProps.visible);
    const testId = this.props.testId;

    return (
      <span>
        {
          ModalButton ?
            <ModalButton
              data-test={testId}
              onClick={this.showModal}
              visible={visibility ?? visible}
              {...openButtonProps}
              disabled={disabled}
            >
              {openButtonLabel}
            </ModalButton> :
            <Button
              data-test={testId}
              btnType="secondary"
              onClick={this.showModal}
              {...openButtonProps}
              disabled={disabled}
            >
              {openButtonLabel}
            </Button>
        }
        <Modal
          data-test={testId}
          visible={visibility ?? visible}
          onCancel={this.handleClose}
          noFooter={!showFooter}
          headerBackground={headerBackground}
          closable={closable}
          maskClosable={maskClosable}
          footer={showFooter ? <ModalFooter
            testId={testId}
            CustomSubmitButton={CustomSubmitButton}
            submitButtonProps={submitButtonProps}
            modalSubmitButtonLabel={modalSubmitButtonLabel}
            modalCancelButtonLabel={modalCancelButtonLabel}
            ModalCustomFooter={ModalCustomFooter}
            handleCancel={this.handleCancel}
            handleOk={this.handleOk}
            visible={visibility ?? visible}
            disableSubmit={modalSubmitButtonDisable}
          /> : null}
          {...modalProps}
        >
          {
            /* Only mount the children when required
             * Because when modal children are making api calls, we need not make api calls
             * until the modal is visible
             */
            modalVisible && ( typeof children === 'function' ? children(this) : children )
          }
        </Modal>
      </span>
    );
  }
}

export default ModalWithButton;
