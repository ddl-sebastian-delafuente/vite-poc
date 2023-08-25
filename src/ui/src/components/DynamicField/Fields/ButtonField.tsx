import * as React from 'react';

import { makeTestId } from '../../../utils/common';
import Button from '../../Button/Button';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { LayoutFieldButton } from '../DynamicField.types';

export const ButtonField = ({
  testIdPrefix,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldButton;

  const { action } = field;
  const { onButtonAction } = props;
  
  const handleClick = React.useCallback(() => {
    if (onButtonAction) {
      onButtonAction(action);
    }
  }, [action, onButtonAction])

  return (
    <Button
      onClick={handleClick}
      btnType={field.buttonType}
      testId={makeTestId(`action-button-${field.action}`, testIdPrefix)}
    >{field.label}</Button>
  );
}
