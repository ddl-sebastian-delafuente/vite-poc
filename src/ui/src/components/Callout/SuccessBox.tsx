import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import { CheckCircleFilled } from '@ant-design/icons';
import { mantis } from '../../styled/colors';
import { themeHelper } from '../../styled/themeUtils';
import { InfoBox, InfoBoxProps } from './InfoBox';
import { fontSizes } from '../../styled';

const SuccessBoxContainer = styled(InfoBox) <Props>`
  border-color: ${mantis};
  border-radius: ${themeHelper('borderRadius.standard')};

  .info-box-icon {
    path {
      fill: ${mantis};
    }
  }
`;

export type Props = InfoBoxProps;

export const SuccessBox: React.FC<Props> = props =>
	<SuccessBoxContainer
		icon={<CheckCircleFilled style={{ fontSize: fontSizes.SMALL, color: mantis }} />}
		{...props}
	/>;

export default withTheme(SuccessBox);
