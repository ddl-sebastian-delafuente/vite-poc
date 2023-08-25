import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../styled/themeUtils';
import { UnionToMap } from '../utils/typescriptUtils';

export type UnitPosition = 'prefix' | 'suffix';
export const UnitPosition: UnionToMap<UnitPosition> = {
  prefix: 'prefix',
  suffix: 'suffix',
};
 
const BigValueLabel = styled.span`
  font-size: ${themeHelper('fontSizes.tiny')};
  padding-top: 2px;
  text-transform: uppercase;
`;

const BigValueWrapper = styled.div`
  align-items: start;
  display: flex;
  flex-direction: column;
`

const ValueWrapper = styled.div<{ $unitPosition: UnitPosition }>`
  align-items: end;
  display: flex;
  flex-direction: ${(props) => props.$unitPosition === UnitPosition.suffix ? 'row' : 'row-reverse'}
`;

const BigValueValue = styled.span`
  font-size: 26px;
  line-height: 20px;
`;

const BigValueUnit = styled.span`
  font-size: ${themeHelper('fontSizes.tiny')};
  line-height: ${themeHelper('fontSizes.tiny')};
`;

export interface BigValueProps {
  /**
   * Optional value defines a label for the value
   */
  label?: JSX.Element | string;

  /**
   * Defines where the unit is positioned in relation to the value
   * defaults to Suffix
   */
  unitPosition?: UnitPosition;
  unit: string;
  value: number | string;
  
}

export const BigValue = ({ 
  label, 
  unitPosition = UnitPosition.suffix,
  unit, 
  value 
}: BigValueProps) => (
  <BigValueWrapper>
    <ValueWrapper $unitPosition={unitPosition}>
      <BigValueValue>{value}</BigValueValue>
      <BigValueUnit>{unit}</BigValueUnit>
    </ValueWrapper>
    {label && (
      <BigValueLabel>{label}</BigValueLabel>
    )}
  </BigValueWrapper>
)
