import React from 'react';
import { CopyOutlined, PlusOutlined } from '@ant-design/icons';
import { cond, equals, T } from 'ramda';
import Button, { ButtonProps } from '../Button';
import DataIcon from '../../../icons/DataIcon';

export type ButtonWrapperType =
  'primary' | 'secondary' | 'tertiary';
export type IconWrapperType =
  'None' | 'Ant icon' | 'Domino icon';

interface ButtonWrapperProps extends ButtonProps {
  buttonType: ButtonWrapperType;
  iconType: IconWrapperType
}

export const ButtonWrapper = ({ buttonType, iconType, ...rest }: ButtonWrapperProps) =>
  <Button
    {...rest}
    btnType={buttonType}
    icon={cond([
      [equals('Ant icon'), () => rest.isIconOnlyButton ? <CopyOutlined /> : <PlusOutlined />],
      [equals('Domino icon'), () => rest.isIconOnlyButton ? <DataIcon /> :
        null], // domino icon is not supported for texted button icon
      [T, () => null],
    ])(iconType)}
  />;
