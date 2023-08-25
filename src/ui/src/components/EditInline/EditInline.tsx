import * as React from 'react';
import { Typography } from 'antd';
import * as R from 'ramda';
import styled, { css } from 'styled-components';
import { colors, themeHelper, sizes } from '@domino/ui/dist/styled';
import { EditTwoTone, LoadingOutlined, EnterOutlined } from '@ant-design/icons';
import { InputSizeType, DominoInputSize } from '../TextInput/Input';
import tooltipRenderer from '../renderers/TooltipRenderer';

const { SMALL, DEFAULT } = DominoInputSize;
const noop = () => undefined;
const FOCUS_TIMEOUT = 1000;
export enum Defaults {
  ID = 'edit-inline-id',
  CLASS_NAME = 'edit-inline',
  DATA_TEST = 'edit-inline-test',
  TITLE = 'Click to edit',
  PLACEHOLDER = 'Set Text',
  TOOLTIP_TEXT = `Press 'Enter' to Save`,
  ENTER_ICON_DATA_TEST = 'edit-inline-enter-icon'
}

const StyledEnterSpan = styled.span`
  pointer-events: auto;
`;
const EmptyTextWrapper = styled.span`
  color: ${colors.neutral500};
`;

export type StyledParagraphProps = {
  /**
   * When `true` => it'll turn the textarea's border in a color related to error (red).
   */
  isError?: boolean;

  /**
   * Set size for `EditInline` with `"small" | "default"`.
   */
  size?: InputSizeType;
};
const StyledParagraph = styled(Typography.Paragraph)<StyledParagraphProps>`
  &&& {
    margin-bottom: 0;
    .ant-typography-edit-content-confirm {
      ${({ size }) => !R.equals(size, SMALL) ? '' : css`
        bottom: 5px;
      `}
    }
    .ant-input {
      ${({ size }) => !R.equals(size, SMALL) ? '' : css`
        padding: 0 7px;
        min-height: ${sizes.LARGE};
        height: ${sizes.LARGE} !important;
      `}
      margin-top: 6px !important;
      margin-left: ${sizes.TINY} !important;
      &::placeholder {
        line-height: 1.6;
        font-size: ${themeHelper('fontSizes.small')};
        font-style: normal;
      }
      ${({ isError }) => !isError ? '' : css`
        border-color: ${colors.torchRed} !important;
        :focus {
          box-shadow: 0 0 0 2px rgb(255 77 79 / 20%);
        }
      `}
    }
  }
`;

export type TriggerType = Array<'icon' | 'text'>;
export type KeyboardEventExtraProps = { target?: Partial<{ value: string }> };
export type ValueParamCallbackType = (value?: string) => void;
export type ClickEventCallbackType = (ev?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
export type NoParamCallbackType = () => void;

export const textTrigger: TriggerType = ['text'];
export const iconTrigger: TriggerType = ['icon'];
export const defaultTrigger: TriggerType = ['icon', 'text'];

export interface EditInlineCommonProps extends StyledParagraphProps {
  /**
   * While editing, this is the `value`, otherwise, it acts as a display text.
   */
  value?: string;

  /**
   * Disable editing of the text.
   * When `true` => editing is completely disabled.
   */
  disabled?: boolean;

  /**
   * Tooltip when `disabled` is `true`.
   */
  disabledReason?: React.ReactNode;

  /**
   * While editing, show the `placeholder` text whenever the textarea has no text.
   */
  placeholder?: string;

   /**
    * When `false` => this component will only be a normal input, otherwise,
    * it'll be a text, which `onClick` event converts into a textarea which can be edited.
    */
  isEditInline?: boolean;

  /**
   * Gets triggered on every keystroke when editing.
   */
  onChange?: ValueParamCallbackType;

  /**
   * Gets triggered when clicking outside or pressing `Esc` key.
   */
  onCancel?: NoParamCallbackType;

  /**
   * Only gets triggered when the edit mode starts.
   */
  onStart?: NoParamCallbackType;
}

export interface EditInlineProps extends EditInlineCommonProps {
  /**
   * Icon rendered beside the display text.
   *
   * **NOTE**: `editIcon` is not rendered when `disabled` prop is `true`.
   */
  editIcon?: React.ReactNode;

  /**
   * Controls editing of text inline.
   * When `true` => component renders a textarea, otherwise renders a text display.
   */
  isEditing?: boolean;

  /**
   * When `true` => by default, it shows a loader icon in the textarea.
   * The loader icon can be changed through `loadingIcon` prop.
   */
  loading?: boolean;

  /**
   * Icon rendered when `loading` is `true`.
   */
  loadingIcon?: React.ReactNode;

  /**
   * Show a tooltip info on the Edit Icon.
   */
  tooltip?: React.ReactNode;

  /**
   * By default, trigger is set for both `text` & `icon` click.
   */
  trigger?: TriggerType;

  /**
   * Gets triggered when clicked on the display text/icon (while not editing).
   */
  onClick?: ClickEventCallbackType;

  /**
   * Gets triggered only when `Enter` key is pressed when editing.
   */
  onUpdate?: ValueParamCallbackType;
  emptyText?: string;
}

export const EditInline: React.FC<EditInlineProps> = ({
  size = DEFAULT,
  value = '',
  disabled = false,
  disabledReason = false,
  isEditing = false,
  loading = false,
  loadingIcon = <LoadingOutlined />,
  tooltip = false,
  trigger = defaultTrigger,
  placeholder = Defaults.PLACEHOLDER,
  isError = false,
  isEditInline = true,
  onStart = noop,
  onClick = noop,
  onChange = noop,
  onUpdate = noop,
  onCancel = noop,
  editIcon= <EditTwoTone twoToneColor={disabled ? colors.darkerGray : undefined}/>,
  emptyText
}) => {
  const internalRef = React.useRef<HTMLSpanElement>(null);
  const [canCallUpdateStart, setCanCallUpdateStart] = React.useState<boolean>(false);
  const [canFocus, setCanFocus] = React.useState<boolean>(true);

  const onInputChange: ValueParamCallbackType = val => onChange(val);
  const onTextOrIconClick: ClickEventCallbackType = ev => {
    onClick(ev);
    setCanCallUpdateStart(true);
  };

  const onTextAreaChange = (ev: KeyboardEvent & KeyboardEventExtraProps) => {
    if (!R.isNil(ev.target)) {
      const { value: targetValue } = ev.target;
      const trimmedTargetValue = R.trim(targetValue ?? '');
      onChange(trimmedTargetValue);
      if (R.equals(ev.key, 'Enter')) {
        onUpdate(trimmedTargetValue);
      }
    }
  }

  const onInputCancel = () => {
    onCancel();
    if (!canFocus) {
      setTimeout(() => setCanFocus(true), FOCUS_TIMEOUT);
    }
  };
  const onFocus = () => {
    if (canFocus && !isEditing && !disabled) {
      setCanFocus(false);
      onTextOrIconClick();
    }
  };

  React.useEffect(() => {
    if (canCallUpdateStart) {
      onStart();
      setCanCallUpdateStart(false);
    }

    if (!R.isNil(internalRef.current)) {
      const { current } = internalRef;
      const textarea = current.querySelector('textarea');
      if (!R.isNil(textarea)) {
        if (!R.equals(textarea.placeholder, placeholder)) {
          textarea.placeholder = placeholder;
        }
        if (!R.equals(textarea.onkeyup, onTextAreaChange)) {
          textarea.onkeyup = onTextAreaChange;
        }
        if (!R.equals(textarea.onblur, onInputCancel)) {
          textarea.onblur = onInputCancel;
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, isEditInline, canCallUpdateStart]);

  const editing = isEditInline ? isEditing : true;
  const triggerType = disabled ? iconTrigger : trigger;
  const actualTooltip = disabled ? disabledReason : tooltip;
  const enterIconWithTooltip = tooltipRenderer(
    Defaults.TOOLTIP_TEXT,
    <StyledEnterSpan data-test={Defaults.ENTER_ICON_DATA_TEST}><EnterOutlined /></StyledEnterSpan>,
    'bottom'
  );
  const enterIcon = isEditInline ? (loading ? loadingIcon : enterIconWithTooltip) : null;

  return (
    <span
      ref={internalRef}
      id={Defaults.ID}
      data-test={Defaults.DATA_TEST}
    >
      <StyledParagraph
        size={size}
        title={!disabled ? Defaults.TITLE : undefined}
        className={Defaults.CLASS_NAME}
        onClick={onTextOrIconClick}
        isError={isError}
        disabled={disabled}
        editable={{
          enterIcon,
          triggerType,
          icon: editIcon,
          tooltip: actualTooltip,
          editing: !disabled && editing,
          onCancel: onInputCancel,
          onChange: onInputChange,
        }}
        style={disabled ? {color: 'rgba(0, 0, 0, 0.85)'} : {}}
      >
        {editing ? value : <span tabIndex={0} onFocus={onFocus}>
          {value || (
            <EmptyTextWrapper>
              {emptyText}
            </EmptyTextWrapper>
          )}
        </span>}
      </StyledParagraph>
    </span>
  );
};

export default EditInline;
