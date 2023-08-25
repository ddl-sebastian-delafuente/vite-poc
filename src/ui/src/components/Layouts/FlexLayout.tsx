import * as React from 'react';
import * as R from 'ramda';
import { CSSProperties } from 'react';
import styled from 'styled-components';

export interface FlexLayoutProps {
  'data-test'?: string;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'unset';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | 'unset';
  itemSpacing?: number;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'unset';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'unset';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'unset';
  padding?: string | number;
  margin?: string | number;
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

const formatSpacing = (space: string | number) => {
  if (R.is(String, space)) {
    return space;
  }

  return `${space}px`;
};

const FlexContainer = styled.div<FlexLayoutProps>`
  display: flex;
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
  flex-wrap: ${props => props.flexWrap};
  flex-direction: ${props => props.flexDirection};
  align-content: ${props => props.alignContent};
  ${props => props.padding ? `padding: ${formatSpacing(props.padding)}` : ''};
  ${props => props.margin ? `margin: ${formatSpacing(props.margin)}` : ''};

  > * {
    margin-left: ${props => (`${props.itemSpacing}px`)};
    margin-right: ${props => (`${props.itemSpacing}px`)};

    &:last-child {
      margin-right: 0px;
    }

    &:first-child {
      margin-left: 0px;
    }
  }

`;

export const FlexLayout = (props: FlexLayoutProps) => {
  const {
    flexDirection = 'row',
    itemSpacing = 8,
    justifyContent = 'center',
    alignItems = 'center',
    flexWrap = 'wrap',
    alignContent = 'space-between',
    className,
    padding,
    margin,
    style,
    ...rest
  } = props;
  return (
    <FlexContainer
      flexDirection={flexDirection}
      itemSpacing={itemSpacing / 2}
      justifyContent={justifyContent}
      alignItems={alignItems}
      alignContent={alignContent}
      flexWrap={flexWrap}
      className={className}
      padding={padding}
      margin={margin}
      data-test={rest['data-test']}
      // @ts-ignore
      style={style}
    >
      {props.children}
    </FlexContainer>);
};

export default FlexLayout;
