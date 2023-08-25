import * as React from 'react';
import styled from 'styled-components';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '@domino/ui/dist/utils/whiteLabelUtil';

import { themeHelper } from '../../../styled';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { LayoutFieldTitle } from '../DynamicField.types';
import { 
  getFieldIcon,
} from '../DynamicField.utils';

export const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  height: ${themeHelper('sizes.large')};
`;

export const TitleText = styled.span`
  font-size: ${themeHelper('fontSizes.medium')};
  font-weight: ${themeHelper('fontWeights.bold')};
  line-height: ${themeHelper('fontSizes.medium')};
  margin-top: 1px;

  &:not(:first-child) {
    margin-left: ${themeHelper('paddings.tiny')};
  }
`;

export const TitleField = (props: LayoutFieldFactoryProps) => {
  const { whiteLabelSettings } = useStore();
  const field = props.field as LayoutFieldTitle;

  const Icon = getFieldIcon(field?.path || '', field?.value || '');

  return (
    <TitleWrapper>
      {Icon && <Icon/>}
      <TitleText>
        {replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(field.text)}
      </TitleText>
    </TitleWrapper>
  )
}
