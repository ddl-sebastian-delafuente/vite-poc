import * as React from 'react';
import styled from 'styled-components';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { getIconSize, InfoBox, InfoBoxProps } from './Callout/InfoBox';
import {
  warningBoxBorderColor,
  warningBoxIconFill,
} from '../styled/colors';

const StyledWarningBox = styled(InfoBox)<Props>`
  border-color: ${warningBoxBorderColor};

  .warning-box-icon {
    svg {
      background: white;
      height: ${getIconSize};
      width: ${getIconSize};
    }

    path {
      fill: ${warningBoxIconFill};
    }
  }
`;

export type Props = InfoBoxProps;

const WarningBox = (props: Props) => (
  <StyledWarningBox
    {...props}
    icon={
      props.icon ?? <ExclamationCircleFilled className="warning-box-icon" />
    }
  />
);

export default WarningBox;
