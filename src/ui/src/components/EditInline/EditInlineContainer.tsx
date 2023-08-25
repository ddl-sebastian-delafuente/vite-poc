import * as React from 'react';
import * as R from 'ramda';
import EditInline, {
  EditInlineCommonProps,
  ValueParamCallbackType,
} from './EditInline';

const noop = () => undefined;

export type FailableSubmitFnType = (currVal: string, prevVal?: string) => Promise<boolean>;
export interface EditInlineContainerProps extends EditInlineCommonProps {
  /**
   * Async callback, triggered `on`(↵ | Enter)`keyup` event.
   *
   * Callback should return `true` if the value is valid, otherwise return `false`.
   * For more details, look into `FailableSubmitFnType`.
   *
   * **NOTE**: Returning a `false` value from the callback will trigger an error state & keeps the edit mode ON.
   */
  handleFailableSubmit?: FailableSubmitFnType;
  emptyText?: string;
}

export const EditInlineContainer: React.FC<EditInlineContainerProps> = ({
  size,
  value,
  disabled,
  disabledReason,
  placeholder,
  isEditInline,
  isError: error,
  onStart = noop,
  onCancel = noop,
  onChange = noop,
  handleFailableSubmit = noop,
  emptyText
}) => {
  const [isEditing, setIsEditing] = React.useState<boolean>();
  const [internalValue, setInternalValue] = React.useState<string | undefined>(value);
  const [isError, setIsError] = React.useState<boolean>();
  const [persistedValue, setPersistedValue] = React.useState<string | undefined>(value);
  const [loading, setLoading] = React.useState<boolean>();

  const onInputUpdate = React.useCallback<ValueParamCallbackType>(async updateValue => {
    setLoading(true);
    if (!R.isNil(updateValue)) {
      const isSubmitSuccess = await handleFailableSubmit(updateValue, persistedValue);
      if (isSubmitSuccess) {
        setIsError(false);
        setIsEditing(false);
        setPersistedValue(updateValue);
        setInternalValue(updateValue);
        setIsEditing(false);
      } else {
        setIsEditing(true);
        setIsError(true);
      }
    }
    setLoading(false);
  }, [handleFailableSubmit, persistedValue]);

  const onInputChange = React.useCallback<ValueParamCallbackType>((updateValue) => {
    onChange(updateValue);
    setInternalValue(updateValue);
  }, [onChange]);

  const onInputCancel = React.useCallback(() => {
    onCancel();
    setIsEditing(false);
    setIsError(false);
    setInternalValue(persistedValue);
  }, [persistedValue, onCancel]);

  const onInputClick = React.useCallback(() => {
    if (!disabled) {
      setIsEditing(true);
    }
  }, [disabled]);

  const actualValue = isEditing ? internalValue : persistedValue;
  return (
    <EditInline
      size={size}
      value={actualValue}
      placeholder={placeholder}
      isEditInline={isEditInline}
      isError={error || isError}
      loading={loading}
      isEditing={isEditing}
      disabled={disabled}
      disabledReason={disabledReason}
      onClick={onInputClick}
      onStart={onStart}
      onUpdate={onInputUpdate}
      onChange={onInputChange}
      onCancel={onInputCancel}
      emptyText={emptyText}
    />
  );
};

export default EditInlineContainer;
