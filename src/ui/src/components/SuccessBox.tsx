import * as React from 'react';
import styled from 'styled-components';
import {
  goodGreenColor,
  green,
} from '../styled/colors';
import InfoBox, { InfoBoxProps } from './Callout/InfoBox';

const SuccessBoxContainer = styled(InfoBox)<Props>`
  border-color: ${goodGreenColor};

  .info-box-icon {
    path {
      fill: ${green};
    }
  }
`;

export type Props = InfoBoxProps;

export const SuccessBox = (props: Props) => <SuccessBoxContainer {...props} />;

export default SuccessBox;
