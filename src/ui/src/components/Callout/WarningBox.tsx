import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import { WarningFilled } from '@ant-design/icons';
import { tulipTree } from '../../styled/colors';
import { themeHelper } from '../../styled/themeUtils';
import { InfoBox, InfoBoxProps } from './InfoBox';

export type WarningBoxProps = InfoBoxProps

const WarningBoxContainer = styled(InfoBox)<WarningBoxProps>`
  border-color: ${tulipTree};
  border-radius: ${themeHelper('borderRadius.standard')};

  .info-box-icon, .anticon {
    path {
      fill: ${tulipTree};
    }
  }
`;

export const WarningBox = (props: WarningBoxProps ) => (
  <WarningBoxContainer 
    icon={<WarningFilled/>}
    {...props} 
  />
);

export default withTheme(WarningBox);
