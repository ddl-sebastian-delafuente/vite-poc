import * as React from 'react';
import styled from 'styled-components';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '@domino/ui/dist/utils/whiteLabelUtil';

import { themeHelper } from '../../../styled';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { LayoutFieldTextBlock } from '../DynamicField.types';

const TextBlockContainer = styled.div`
  margin-bottom: ${themeHelper('margins.medium')};
`

export const TextBlock = (props: LayoutFieldFactoryProps) => {
  const { whiteLabelSettings } = useStore();
  const field = props.field as LayoutFieldTextBlock;

  return <TextBlockContainer>{replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(field.text)}</TextBlockContainer>
}
