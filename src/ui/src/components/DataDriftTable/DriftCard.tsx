import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../styled';

const OutOfRange = styled.span`
  color: ${colors.cabaret};
`;

interface DriftType {
  withinRange: boolean;
  value: number;
}

export interface DriftProps {
  drift: DriftType;
}

const DriftCard: React.FC<DriftProps> = ({ drift }) => (
  <>{drift.withinRange ? <OutOfRange>{drift.value}</OutOfRange> : drift.value}</>
);

export default DriftCard;
