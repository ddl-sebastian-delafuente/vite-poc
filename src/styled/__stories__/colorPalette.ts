import { colors } from '..';

export type ColorType = {
  name: string,
  color: string,
  textColor: string,
}

export type ColorPaletteType = {
  [key: string]: ColorType;
}

// Text Colors
export const darkText = colors.neutral900;
export const lightText = colors.neutral400;

// blue palette
export const Blue: ColorPaletteType = {
  blue50: {
    name: 'blue50',
    color: colors.blue50,
    textColor: darkText,
  },
  blue100: {
    name: 'blue100',
    color: colors.blue100,
    textColor: darkText,
  },
  blue200: {
    name: 'blue200',
    color: colors.blue200,
    textColor: darkText,
  },
  blue300: {
    name: 'blue300',
    color: colors.blue300,
    textColor: darkText,
  },
  blue400: {
    name: 'blue400',
    color: colors.blue400,
    textColor: darkText,
  },
  blue500: {
    name: 'blue500',
    color: colors.blue500,
    textColor: lightText,
  },
  blue600: {
    name: 'blue600',
    color: colors.blue600,
    textColor: lightText,
  },
  blue700: {
    name: 'blue700',
    color: colors.blue700,
    textColor: lightText,
  },
  blue800: {
    name: 'blue800',
    color: colors.blue800,
    textColor: lightText,
  },
  blue900: {
    name: 'blue900',
    color: colors.blue900,
    textColor: lightText,
  },
}

// Navy palette
export const Navy: ColorPaletteType = {
  navy50: {
    name: 'navy50',
    color: colors.navy50,
    textColor: darkText,
  },
  navy100: {
    name: 'navy100',
    color: colors.navy100,
    textColor: darkText,
  },
  navy200: {
    name: 'navy200',
    color: colors.navy200,
    textColor: darkText,
  },
  navy300: {
    name: 'navy300',
    color: colors.navy300,
    textColor: lightText,
  },
  navy400: {
    name: 'navy400',
    color: colors.navy400,
    textColor: lightText,
  },
  navy500: {
    name: 'navy500',
    color: colors.navy500,
    textColor: lightText,
  },
  navy600: {
    name: 'navy600',
    color: colors.navy600,
    textColor: lightText,
  },
  navy700: {
    name: 'navy700',
    color: colors.navy700,
    textColor: lightText,
  },
  navy800: {
    name: 'navy800',
    color: colors.navy800,
    textColor: lightText,
  },
  navy900: {
    name: 'navy900',
    color: colors.navy900,
    textColor: lightText,
  },
}

// Red palette
export const Red: ColorPaletteType = {
  red50: {
    name: 'red50',
    color: colors.red50,
    textColor: darkText,
  },
  red100: {
    name: 'red100',
    color: colors.red100,
    textColor: darkText,
  },
  red200: {
    name: 'red200',
    color: colors.red200,
    textColor: darkText,
  },
  red300: {
    name: 'red300',
    color: colors.red300,
    textColor: darkText,
  },
  red400: {
    name: 'red400',
    color: colors.red400,
    textColor: darkText,
  },
  red500: {
    name: 'red500',
    color: colors.red500,
    textColor: lightText,
  },
  red600: {
    name: 'red600',
    color: colors.red600,
    textColor: lightText,
  },
  red700: {
    name: 'red700',
    color: colors.red700,
    textColor: lightText,
  },
  red800: {
    name: 'red800',
    color: colors.red800,
    textColor: lightText,
  },
  red900: {
    name: 'red900',
    color: colors.red900,
    textColor: lightText,
  },
}

// Green palette
export const Green: ColorPaletteType = {
  green50: {
    name: 'green50',
    color: colors.green50,
    textColor: darkText,
  },
  green100: {
    name: 'green100',
    color: colors.green100,
    textColor: darkText,
  },
  green200: {
    name: 'green200',
    color: colors.green200,
    textColor: darkText,
  },
  green300: {
    name: 'green300',
    color: colors.green300,
    textColor: darkText,
  },
  green400: {
    name: 'green400',
    color: colors.green400,
    textColor: darkText,
  },
  green500: {
    name: 'green500',
    color: colors.green500,
    textColor: darkText,
  },
  green600: {
    name: 'green600',
    color: colors.green600,
    textColor: darkText,
  },
  green700: {
    name: 'green700',
    color: colors.green700,
    textColor: darkText,
  },
  green800: {
    name: 'green800',
    color: colors.green800,
    textColor: lightText,
  },
  green900: {
    name: 'green900',
    color: colors.green900,
    textColor: lightText,
  },
}

// Orange palette
export const Orange: ColorPaletteType = {
  orange50: {
    name: 'orange50',
    color: colors.orange50,
    textColor: darkText,
  },
  orange100: {
    name: 'orange100',
    color: colors.orange100,
    textColor: darkText,
  },
  orange200: {
    name: 'orange200',
    color: colors.orange200,
    textColor: darkText,
  },
  orange300: {
    name: 'orange300',
    color: colors.orange300,
    textColor: darkText,
  },
  orange400: {
    name: 'orange400',
    color: colors.orange400,
    textColor: darkText,
  },
  orange500: {
    name: 'orange500',
    color: colors.orange500,
    textColor: darkText,
  },
  orange600: {
    name: 'orange600',
    color: colors.orange600,
    textColor: darkText,
  },
  orange700: {
    name: 'orange700',
    color: colors.orange700,
    textColor: darkText,
  },
  orange800: {
    name: 'orange800',
    color: colors.orange800,
    textColor: darkText,
  },
  orange900: {
    name: 'orange900',
    color: colors.orange900,
    textColor: darkText,
  },
}

// Neutral palette
export const Neutral: ColorPaletteType = {
  neutral50: {
    name: 'neutral50',
    color: colors.neutral50,
    textColor: darkText,
  },
  neutral100: {
    name: 'neutral100',
    color: colors.neutral100,
    textColor: darkText,
  },
  neutral200: {
    name: 'neutral200',
    color: colors.neutral200,
    textColor: darkText,
  },
  neutral300: {
    name: 'neutral300',
    color: colors.neutral300,
    textColor: darkText,
  },
  neutral400: {
    name: 'neutral400',
    color: colors.neutral400,
    textColor: darkText,
  },
  neutral500: {
    name: 'neutral500',
    color: colors.neutral500,
    textColor: darkText,
  },
  neutral600: {
    name: 'neutral600',
    color: colors.neutral600,
    textColor: lightText,
  },
  neutral700: {
    name: 'neutral700',
    color: colors.neutral700,
    textColor: lightText,
  },
  neutral800: {
    name: 'neutral800',
    color: colors.neutral800,
    textColor: lightText,
  },
  neutral900: {
    name: 'neutral900',
    color: colors.neutral900,
    textColor: lightText,
  },
}
