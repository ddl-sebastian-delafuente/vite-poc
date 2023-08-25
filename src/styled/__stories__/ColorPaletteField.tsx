import * as React from 'react';
import styled from 'styled-components';
import { useDarkMode } from 'storybook-dark-mode';
import { colors } from '..';
import * as colorPalette from './colorPalette';

type StyleProps = {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
};

const Container = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  border: solid ${props => props.borderColor};
  border-width: 1px 0 0 0;
  margin-right: 20px;
`;

const Wrapper = styled.div<StyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 185px;
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
`;

const Title = styled.div<StyleProps>`
  align-items: center;
  padding-left: 5px;
  width: 185px;
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  border: solid ${props => props.borderColor};
  border-width: 0 1px 1px 1px;
`;

const Text = styled.span<StyleProps>`
  align-items: center;
  padding-left: 5px;
  width: 100px;
  border: solid ${props => props.borderColor};
  border-width: 0 1px 1px 1px;
`;

const Hex = styled.span<StyleProps>`
  align-items: center;
  padding-left: 5px;
  width: 85px;
  border: solid ${props => props.borderColor};
  border-width: 0 1px 1px 0;
`;


export const ColorPaletteField = ({paletteName} : {paletteName: string}) => {
  const isDarkMode = useDarkMode();
  const borderColor = colors.neutral700;
  const type = colorPalette[paletteName];
  return (
    <Container borderColor={borderColor}>
      <Title
        color={isDarkMode ? colorPalette.lightText : colorPalette.darkText}
        backgroundColor={isDarkMode ? colorPalette.darkText : colors.neutral50}
        borderColor={borderColor}
      >
        {paletteName}
      </Title>
      {Object.keys(type).map(key =>
        <Wrapper
          key={key}
          color={type[key].textColor}
          backgroundColor={type[key].color}
          borderColor={borderColor}
        >
          <Text borderColor={borderColor}>{key}</Text>
          <Hex borderColor={borderColor}>{type[key].color}</Hex>
        </Wrapper>)}
    </Container>
  );
};
