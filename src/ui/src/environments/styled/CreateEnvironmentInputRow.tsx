import * as React from 'react';
import { withTheme } from 'styled-components';
import FlexLayout, { FlexLayoutProps } from '../../components/Layouts/FlexLayout';
import { themeHelper } from '../../styled';
import { ThemeType } from '../../utils';

type InputRowProps = { theme?: {} } & FlexLayoutProps;

const InputRow = (props: InputRowProps) => (
  <FlexLayout
    {...props}
    margin={`${themeHelper('margins.tiny')(props)} 0 ${themeHelper('margins.small')(props)} 0`}
    justifyContent="flex-start"
    alignItems="unset"
    itemSpacing={12}
  />
);
export const CreateEnvironmentInputRow: ThemeType<InputRowProps> = withTheme(InputRow);
