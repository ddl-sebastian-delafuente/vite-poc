import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { fontSizes } from '../../styled';
import { cabaret } from '../../styled/colors';
import { themeHelper } from '../../styled/themeUtils';
import { InfoBox, InfoBoxProps } from './InfoBox';

const DangerBoxContainer = styled(InfoBox) <Props>`
  border-color: ${cabaret};
  border-radius: ${themeHelper('borderRadius.standard')};

  .info-box-icon {
    path {
      fill: ${cabaret};
    }
  }
`;

export type Props = InfoBoxProps;

export const DangerBox: React.FC<Props> = props =>
  <DangerBoxContainer
    icon={<ExclamationCircleFilled style={{ fontSize: fontSizes.SMALL, color: cabaret }} />}
    {...props}
  />;

export default withTheme(DangerBox);
