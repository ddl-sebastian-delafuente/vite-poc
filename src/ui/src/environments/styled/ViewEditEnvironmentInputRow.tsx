import * as React from 'react';
import { withTheme } from 'styled-components';
import FlexLayout, { FlexLayoutProps } from '../../components/Layouts/FlexLayout';
import { ThemeType } from '../../utils';

type InputRowProps = { theme?: {} } & FlexLayoutProps;

const InputRow = (props: InputRowProps) => (
  <FlexLayout
    {...props}
    flexDirection="row"
    justifyContent="flex-start"
    alignItems="unset"
  />
);
export const ViewEditEnvironmentInputRow: ThemeType<InputRowProps> = withTheme(InputRow);
