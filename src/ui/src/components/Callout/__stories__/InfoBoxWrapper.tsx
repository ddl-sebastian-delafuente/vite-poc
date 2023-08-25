import * as React from 'react';
import * as R from 'ramda';
import InfoBox, { InfoBoxProps } from '../InfoBox';
import DangerBox from '../DangerBox';
import { WarningBox } from '../WarningBox';
import { SuccessBox } from '../SuccessBox';

interface InfoBoxWrapperProps extends InfoBoxProps {
  type: 'info' | 'warning' | 'success' | 'error';
}

const InfoBoxWrapper = (props: InfoBoxWrapperProps) => {
  const {type, ...rest} = props;
  return R.cond([
    [R.equals('info'), () => <InfoBox {...rest} />],
    [R.equals('warning'), () => <WarningBox {...rest} />],
    [R.equals('error'), () => <DangerBox {...rest} />],
    [R.T, () => <SuccessBox {...rest} />]
  ])(type);
};

export default InfoBoxWrapper;
