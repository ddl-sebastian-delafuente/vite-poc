import * as React from 'react';
import styled from 'styled-components';
import { omit } from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { NativeButtonProps } from 'antd/lib/button/button';
import * as antIcons from '@ant-design/icons';
import * as dominoIcons from './Icons';
import Button from './Button/Button';
import DominoLogoOnSubmitButton from './DominoLogoOnSubmitButton';
import tooltipRenderer from './renderers/TooltipRenderer';
import { fontSizes, themeHelper } from '../styled';
import { lightishBlue, mineShaftColor, zumthor } from '../styled/colors';
import FlexLayout from './Layouts/FlexLayout';

const STANDARD_ICON_OUTER_SIZE = '32px';
const STANDARD_ICON_INNER_SIZE = '16px';

interface StyledModalProps {
  noFooter: boolean;
  headerBackground?: string;
  isStandardIcon?: boolean;
}
const StyledModal = styled(Modal) <StyledModalProps>`
  .ant-modal-body {
    padding-left: ${({ noFooter }) => noFooter ? '0px' : '24px'};
    padding-right: ${({ noFooter }) => noFooter ? '0px' : '24px'};
    padding-bottom: ${({ noFooter }) => noFooter ? '10px' : '24px'};
  }

  .ant-modal-content .ant-modal-header {
    background: ${({ headerBackground }) => typeof headerBackground === 'string' ? headerBackground : undefined};
  }
  
  .ant-modal-close:not(:disabled):hover {
    background-color: transparent;
  }

  .ant-modal-close-x {
    padding-top: ${({ isStandardIcon }) => isStandardIcon ? '5px' : '0px'};
  }
`;

export const Title = styled.div`
  color: ${mineShaftColor};
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.normal')};
  margin-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80%;
`;

export const ModalTitle = styled(FlexLayout)`
  font-size: ${fontSizes.LARGE};
  span:not([role='img']) {
    margin-left: 18px;
  }
`;

const SVG32 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 4px 0 0;
  background-color: ${zumthor};
  border-radius: ${themeHelper('icon.borderRadius')};
  width: ${STANDARD_ICON_OUTER_SIZE};
  height: ${STANDARD_ICON_OUTER_SIZE};
`;

export interface DominoModalFooterProps {
  cancelButtonOnClick?: (e: any) => void;
  cancelButtonText: string;
  confirmLoading?: boolean;
  footer?: string | React.ReactNode;
  hideCancelButton?: boolean;
  isDanger: boolean;
  okButtonOnClick?: (e: any) => void;
  okButtonProps?: NativeButtonProps;
  okButtonRef?: React.RefObject<Button>;
  okButtonText: string;
  okButtonTooltipText?: string;
  testId?: string;
  titleIcon?: React.ReactNode;
  titleText?: string;
  useLoadingButton?: boolean;
}

interface DominoModalFooterOkButtonProps {
  isDanger: boolean;
  okButtonText: string;
  okButtonOnClick?: (e: any) => void;
  useLoadingButton?: boolean;
  confirmLoading?: boolean;
  testId?: string;
  okButtonRef?: React.RefObject<Button>;
  okButtonTooltipText?: string;
  disabled: boolean;
}

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  div.button {
    margin-left: 8px;
  }
`;

const OkButton = (props: DominoModalFooterOkButtonProps) => {
  const {
    useLoadingButton,
    okButtonRef,
    okButtonText,
    okButtonOnClick,
    okButtonTooltipText,
    isDanger,
    confirmLoading,
    testId,
    disabled,
  } = props;

  const okButton = useLoadingButton ? (
    <DominoLogoOnSubmitButton
      key="submit"
      label={okButtonText}
      onSubmit={okButtonOnClick}
      isDanger={isDanger}
      submitted={confirmLoading || false}
      data-test={`${testId}submit-button`}
      disabled={disabled}
    />
  ) : (
    <Button
      key="submit"
      btnType="primary"
      isDanger={isDanger}
      onClick={okButtonOnClick}
      data-test={`${testId}submit-button`}
      ref={okButtonRef}
      disabled={disabled}
    >
      {okButtonText}
    </Button>
  );

  return tooltipRenderer(okButtonTooltipText, <span>{okButton}</span>);
};

export const DominoModalFooter = (props: DominoModalFooterProps) => {
  const {
    cancelButtonOnClick,
    cancelButtonText,
    confirmLoading,
    hideCancelButton,
    isDanger,
    okButtonOnClick,
    okButtonProps,
    okButtonRef,
    okButtonText,
    okButtonTooltipText,
    testId,
    useLoadingButton,
  } = props;
  const disabled = okButtonProps ? !!okButtonProps.disabled : false;

  return (
    <FooterContainer>
      {!hideCancelButton && (
        <Button
          key="cancel"
          btnType="secondary"
          onClick={cancelButtonOnClick}
          data-test={testId + 'cancel-button'}
        >
          {cancelButtonText}
        </Button>
      )}
      <OkButton
        useLoadingButton={useLoadingButton}
        okButtonRef={okButtonRef}
        okButtonText={okButtonText}
        okButtonOnClick={okButtonOnClick}
        okButtonTooltipText={okButtonTooltipText}
        isDanger={isDanger}
        confirmLoading={confirmLoading}
        testId={testId}
        disabled={disabled}
      />
    </FooterContainer>
  );
};

export interface DominoModalProps extends ModalProps,
  Pick<DominoModalFooterProps, 'hideCancelButton'> {
  /**
   * Indicates whether this button performs some destructive operation that demands extra attention
   */
  isDanger?: boolean;
  children?: React.ReactNode;
  useLoadingButton?: boolean;
  noFooter?: boolean;
  headerBackground?: string;
  testId?: string;
  okButtonRef?: React.RefObject<Button>;
  okButtonTooltipText?: string;
  /**
   * It is recommended to use titleIconName and titleText to compose the modal title.
   * If you want to build a custom title, the title prop is still available.
   * titleIconNam   - It is for the modal title icon name, the icon is set to 16x16 in the middle of a 32x32 lightishBlue square.
   * titleIconProps - It is for custom props of the modal title icon.
   * titleText      - It is for the modal title text.
   */
  titleIconName?: string;
  titleIconProps?: {};
  titleText?: React.ReactNode;
  maskClosable?: boolean;
}

const DominoModal: React.FC<DominoModalProps> = (props: DominoModalProps) => {
  const {
    cancelText = 'Cancel',
    children,
    confirmLoading,
    headerBackground,
    hideCancelButton,
    isDanger = false,
    maskClosable = false,
    noFooter = false,
    okButtonProps,
    okButtonRef,
    okButtonTooltipText,
    okText = 'Ok',
    onCancel,
    onOk,
    testId,
    title,
    titleIconName,
    titleIconProps = {},
    titleText,
    useLoadingButton,
    zIndex = 1000,
  } = props;

  const iconObject = React.useMemo(() => {
    let isStandardIcon = false;
    let isAntIcon = false;
    if (titleText && titleIconName) {
      isStandardIcon = true;
      if (antIcons[titleIconName]) {
        isAntIcon = true;
      } else {
        if (dominoIcons[titleIconName] === undefined) {
          throw new Error(`The icon, ${titleIconName}, is not available.`);
        }
      }
    }
    return (
      {
        isStandardIcon,
        isAntIcon,
      });
  }, [titleText, titleIconName]);

  return (
    <StyledModal
      closable={false}
      noFooter={noFooter}
      headerBackground={headerBackground}
      zIndex={zIndex}
      maskClosable={maskClosable}
      footer={noFooter ? null : DominoModalFooter({
        cancelButtonOnClick: onCancel,
        cancelButtonText: cancelText as string,
        confirmLoading: confirmLoading,
        hideCancelButton,
        isDanger: isDanger,
        okButtonOnClick: onOk,
        okButtonProps: okButtonProps,
        okButtonRef: okButtonRef,
        okButtonText: okText as string,
        okButtonTooltipText: okButtonTooltipText,
        testId: testId,
        useLoadingButton: useLoadingButton,
      })}
      isStandardIcon={iconObject.isStandardIcon}
      title={iconObject.isStandardIcon ?
        <ModalTitle justifyContent={'flex-start'}>
          <SVG32>{iconObject.isAntIcon ?
            React.createElement(antIcons[titleIconName!],
              {
                style: {
                  fontSize: fontSizes.MEDIUM,
                  color: lightishBlue
                },
                ...titleIconProps,
              }
            ) :
            React.createElement(dominoIcons[titleIconName!],
              {
                primaryColor: lightishBlue,
                width: STANDARD_ICON_INNER_SIZE,
                height: STANDARD_ICON_INNER_SIZE,
                ...titleIconProps,
              }
            )
          }</SVG32>
          <Title>{titleText}</Title>
        </ModalTitle> : title
      }
      {...omit(['children'], props)}
    >
        {children}
    </StyledModal>
  );
};

export default DominoModal;
