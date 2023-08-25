import * as React from 'react';
import { withTheme } from 'styled-components';
import { themeHelper } from '../styled/themeUtils';
import WaitSpinner from '../components/WaitSpinner';
import X from '../icons/X';

export type Props = {
  errorMessage?: string;
  errored?: boolean;
  children?: any;
  theme?: {};
  dataTest?: string;
};

const Spinner: React.FC<Props> = ({
    errored = false,
    errorMessage = 'Something went wrong. Please contact support if this continues.',
    children,
    dataTest,
    ...rest
  }) => (
  <WaitSpinner
    dataTest={dataTest}
    fill={
      errored ?
      themeHelper('icon.failure.color')(rest) :
      themeHelper('mainFontColor')(rest)
    }
    DominoIcon={errored ? X : undefined}
  >
    {errored ? errorMessage : children}
  </WaitSpinner>
);

export default withTheme(Spinner);
