import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { themeHelper } from '../styled/themeUtils';
import * as colors from '../styled/colors';
import FlexLayout from './Layouts/FlexLayout';

const LabelValueLayout = styled(FlexLayout)`
  margin-bottom: ${themeHelper('margins.tiny')};
  width: 100%;

  a {
    margin: 0;
  }
`;

export const Label = styled.div`
  font-size: 11px;
  font-weight: ${themeHelper('fontWeights.thick')};
  text-transform: uppercase;
  color: ${colors.darkGrey};
`;

export const LabelValue = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.greyishBrown};
  margin-left: 0;
`;

export enum Direction {
  Row = 'row',
  Column = 'column'
}

export interface LabelAndValueProps {
  label?: string | React.ReactNode;
  value: string | React.ReactNode;
  testId?: string;
  direction?: Direction;
  wrapperStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  valueStyles?: React.CSSProperties;
  className?: string;
}

const LabelAndValue = (props: LabelAndValueProps) => {
  const {
    label,
    value,
    wrapperStyles,
    valueStyles,
    labelStyles,
    direction = Direction.Column,
    testId,
    className
  } = props;
  return (
    <LabelValueLayout
      flexDirection={!R.isNil(direction) ? direction : 'unset'}
      alignItems={R.equals(Direction.Row, direction) ? 'center' : 'flex-start'}
      justifyContent="flex-start"
      alignContent="flex-start"
      className={className}
      style={wrapperStyles}
    >
      {/* @ts-ignore */}
      <Label style={labelStyles}>{label}</Label>
      {/* @ts-ignore */}
      <LabelValue data-test={testId} style={valueStyles}>{value}</LabelValue>
    </LabelValueLayout>
  );
};

export default LabelAndValue;
