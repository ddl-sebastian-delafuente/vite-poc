import { kebabCase } from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import useStore from '../../../globalStore/useStore';
import { themeHelper } from '../../../styled';
import { getAppName, replaceWithWhiteLabelling } from '../../../utils/whiteLabelUtil';
import InfoBox from '../../Callout/InfoBox';
import SuccessBox from '../../SuccessBox';
import WarningBox from '../../WarningBox';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { BannerType, LayoutFieldBanner } from '../DynamicField.types';
import { BannerMapping } from './Banners';

const StyledInfoBox = styled(InfoBox)`
  margin-bottom: ${themeHelper('margins.medium')};
  width: 100%;
`;

const StyledSuccessBox = styled(SuccessBox)`
  margin-bottom: ${themeHelper('margins.medium')};
  width: 100%;
`;

const StyledWarningBox = styled(WarningBox)`
  margin-bottom: ${themeHelper('margins.medium')};
  width: 100%;
`;

export const BannerField = ({
  testIdPrefix,
  ...props
}: LayoutFieldFactoryProps) => {
  const { whiteLabelSettings } = useStore();
  const field = props.field as LayoutFieldBanner;

  const fieldProps = {
    'data-test': field.id ? kebabCase(`${testIdPrefix}-${field.id}`) : undefined
  };


  const fieldMessage = React.useMemo(() => {
    if (field.id && BannerMapping[field.id]) {
      return BannerMapping[field.id];
    }

    return replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(field.message);
  }, [field.id, field.message, whiteLabelSettings]);

  switch(field.bannerType) {
    case BannerType.Info:
      return (
        <StyledInfoBox {...fieldProps}>{fieldMessage}</StyledInfoBox>
      );
    case BannerType.Warning:
      return (
        <StyledWarningBox {...fieldProps}>{fieldMessage}</StyledWarningBox>
      );
    case BannerType.Success:
    default:
      return (
        <StyledSuccessBox {...fieldProps}>{fieldMessage}</StyledSuccessBox>
      );
  }
}
