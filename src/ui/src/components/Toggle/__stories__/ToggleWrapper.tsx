import React, { useCallback, useState } from 'react';
import Toggle, { ToggleProps } from '../Toggle';
import { FlexLayout } from '../../Layouts/FlexLayout';

type ToggleWrapperProps = {
  onText?: string;
  offText?: string;
}

export const ToggleWrapper: React.FC<ToggleProps & ToggleWrapperProps> = (
  {
    onText = 'On',
    offText = 'Off',
    ...props
  }) => {
  const [isChecked, setIsChecked] = useState(true);

  const onChangeHandler = useCallback(() => setIsChecked((previousState: boolean) => !previousState), [])
  return (
    <FlexLayout justifyContent="flex-start">
      <div>State to be toggled</div>
      <Toggle checked={isChecked} {...props} onChange={onChangeHandler}/>
      <div>{isChecked ? onText : offText}</div>
    </FlexLayout>
  );
};
