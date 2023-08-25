import * as React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { mergeDeepRight, isNil } from 'ramda';
import {
  backgroundWhite,
  black,
  brandBlue,
  cornFlower,
  darkEggplantPurple,
  darkPurpleLabelBackground,
  disabledLabelBackground,
  disabledBackground,
  disabledLabelColor,
  dominoBlue,
  dusk,
  green,
  inactiveSquareButtonColor,
  lightGreyCardBorderColor,
  lightGreyFontColor,
  lightLightBlueGrey,
  paleGrayTwo,
  radioBackground,
  semiBlack,
  shady4,
  transparent,
  warning,
  white,
  linkBlue,
  rejectRedColor,
  borderGrey,
  borderTableGrey,
  deletedLink,
  deletedLinkLight,
  basicLink,
  basicLinkLight,
  cardHoverBackgroundColor,
  lightishBlue,
  btnDarkBlue,
  cornflowerBlue,
  brownishGrey,
  shamrockGreenO2,
  zircon,
  mantis,
  successDark
} from './colors';
import * as colors from './colors';
import * as fontSizes from './fontSizes';
import * as margins from './margins';
import * as paddings from './paddings';
import * as sizes from './sizes';
import * as letterSpacings from './letterSpacings';
import * as fontWeights from './fontWeights';
import * as tableWidths from './tableWidths';
import { MEDIUM } from './fontSizes';
import useStore from '../globalStore/useStore';
import { themeHelper } from './themeUtils';

const defaultColorPaletteStorageKey = 'default-color-palette';
const darkColorPaletteStorageKey = 'dark-color-palette';

const GlobalStyle = createGlobalStyle`
  .ant-tooltip-inner {
    color: ${themeHelper('tooltip.color')};
    background: ${themeHelper('tooltip.background')};
  }
  .ant-tooltip-arrow-content {
    --antd-arrow-background-color: ${themeHelper('tooltip.background')};
  }
`;

const defaultColorPalette = {
  content: 'neutral900',
  contentD1: 'neutral500',
  contentD2: 'neutral300',
  background: 'neutral50',
  backgroundD1: 'neutral100',
  backgroundD2: 'neutral200',
  highlight: 'blue50',
  action: 'blue700',
  actionE: 'blue900',
  danger: 'red500',
  dangerD: 'red200',
  warning: 'orange500',
  warningD: 'orange300',
  success: 'green500',
  successD: 'green200',
  navContent: 'navy200',
  navContentE: 'neutral50',
  navHighlight: 'navy300',
  navBackground: 'navy600',
  navBackgroundD1: 'navy800'
};

const darkColorPalette = {
  content: 'neutral200',
  contentD1: 'neutral400',
  contentD2: 'neutral600',
  background: 'neutral900',
  backgroundD1: 'neutral800',
  backgroundD2: 'neutral700',
  highlight: 'navy900',
  action: 'blue700',
  actionE: 'blue900',
  danger: 'red500',
  dangerD: 'red200',
  warning: 'orange500',
  warningD: 'orange300',
  success: 'green500',
  successD: 'green200',
  navContent: 'navy200',
  navContentE: 'neutral50',
  navHighlight: 'navy300',
  navBackground: 'navy600',
  navBackgroundD1: 'navy800'
};

const nvidiaColorPalette = {
  content: 'neutral900',
  contentD1: 'neutral500',
  contentD2: 'neutral300',
  background: 'neutral50',
  backgroundD1: 'neutral100',
  backgroundD2: 'neutral200',
  highlight: 'nvidiaHighlight',
  action: 'nvidiaAction',
  actionE: 'nvidiaActionE',
  danger: 'red500',
  dangerD: 'red200',
  warning: 'orange500',
  warningD: 'orange200',
  success: 'nvidiaSuccess',
  successD: 'nvidiaSuccessD',
  navContent: 'neutral100',
  navContentE: 'neutral50',
  navHighlight: 'neutral600',
  navBackground: 'neutral800',
  navBackgroundD1: 'neutral900',
}

const theme = {
  borders: {
    tiny: {
      border: `1px solid ${borderGrey}`,
      hover: `1px solid ${cornFlower}`,
    },
    small: {
      border: `2px solid ${borderGrey}`,
      hover: `2px solid ${cornFlower}`,
    },
    medium: {
      border: `3px solid ${borderGrey}`,
      hover: `3px solid ${cornFlower}`,
    },
    large: {
      border: `4px solid ${borderGrey}`,
      hover: `4px solid ${cornFlower}`,
    }
  },
  paddings: {
    tiny: paddings.TINY,
    small: paddings.SMALL,
    medium: paddings.MEDIUM,
    large: paddings.LARGE,
    extraLarge: paddings.EXTRA_LARGE,
  },
  margins: {
    tiny: margins.TINY,
    small: margins.SMALL,
    medium: margins.MEDIUM,
    large: margins.LARGE,
    largeInt: margins.LARGE_INT,
    extraLarge: margins.EXTRA_LARGE,
  },
  letterSpacings: {
    tiny: letterSpacings.TINY,
    small: letterSpacings.SMALL,
  },
  fontWeights: {
    thin: fontWeights.THIN,
    normal: fontWeights.NORMAL,
    medium: fontWeights.MEDIUM,
    thick: fontWeights.THICK,
    bold: fontWeights.BOLD
  },
  fontFamily: 'Roboto, Lato, Helvetica Neue, Helvetica, Arial, sans-serif',
  codeFontFamily: 'RobotoMono, Monaco, Menlo, Consolas, Courier-New, monospace, serif',
  fontSizes: {
    extraTiny: fontSizes.EXTRA_TINY,
    tiny: fontSizes.TINY,
    small: fontSizes.SMALL,
    medium: fontSizes.MEDIUM,
    large: fontSizes.LARGE,
    extraLarge: fontSizes.EXTRA_LARGE,
  },
  iconSizes: {
    small: sizes.ICON_SMALL,
    medium: sizes.ICON_MEDIUM,
    large: sizes.ICON_LARGE
  },
  sizes: {
    tiny: sizes.TINY,
    small: sizes.SMALL,
    medium: sizes.MEDIUM,
    large: sizes.LARGE,
    extraLarge: sizes.EXTRA_LARGE,
  },
  borderRadius: {
    standard: sizes.STANDARD_BORDER_RADIUS,
    left: sizes.LEFT_BORDER_RADIUS,
    right: sizes.RIGHT_BORDER_RADIUS,
    top: sizes.TOP_BORDER_RADIUS,
    bottom: sizes.BOTTOM_BORDER_RADIUS,
  },
  tableWidths: {
    tiny: tableWidths.TINY,
    small: tableWidths.SMALL,
    medium: tableWidths.MEDIUM,
    large: tableWidths.LARGE,
    extraLarge: tableWidths.EXTRA_LARGE,
  },
  statusDotSizePx: 8,
  link: {
    delete: {
      color: deletedLink,
      disabledColor: deletedLinkLight
    },
    basic: {
      color: basicLink,
      disabledColor: basicLinkLight
    },
    color: linkBlue,
  },
  icon: {
    failure: {
      color: rejectRedColor,
    },
    borderRadius: sizes.ICON_BORDER_RADIUS,
  },
  body: {
    background: backgroundWhite,
  },
  contentMain: {
    // Added 84px bottom margin so that when the user scrolls all the way down to the bottom, 
    // the Intercom bubble would land on an empty space
    margin: `${margins.MEDIUM} ${margins.MEDIUM} 84px ${margins.SMALL}`,
    maxWidth: '1200px',
    title: {
      color: semiBlack,
      fontSize: fontSizes.LARGE,
      height: '24px'
    },
    section: {
      borderColor: disabledLabelBackground
    }
  },
  mainFontColor: semiBlack,
  form: {
    field: {
      marginBottom: 12
    }
  },
  authform: {
    link: {
      color: '#4466ff',
    },
    footer: {
      textalign: 'center',
      borderradius: sizes.BOTTOM_BORDER_RADIUS,
      padding: '18px',
      background: '#f4f6ff',
      border: 'solid 1px #e9eaec',
    },
    input: {
      background: radioBackground,
    },
    container: {
      background: white,
      borderradius: sizes.TOP_BORDER_RADIUS,
      boxshadow: `0 4px 6px 0 rgba(0, 0, 0, 0.04), inset 0 -1px 0 0 #e9eaec,
        inset 1px 0 0 0 #e9eaec, inset -1px 0 0 0 #e9eaec, inset 0 1px 0 0 #e9eaec`,
      padding: margins.LARGE,
    },
    header: {
      textalign: 'center',
    },
  },
  avatar: {
    fallback: {
      color: '#ccc',
    },
  },
  nav: {
    menuItem: {
      height: '36px',
      collapsed: {
        width: '36px',
      }
    },
    primary: {
      logoColor: {
        dark: disabledLabelColor,
        light: white,
      },
      menuItem: {
        focused: {
          color: defaultColorPalette.navContentE,
          background: defaultColorPalette.navBackground,
          hover: {
            color: defaultColorPalette.navContentE,
            background: defaultColorPalette.navBackground,
          },
        },
        hover: {
          color: defaultColorPalette.navContent,
          background: defaultColorPalette.navBackground,
        },
        disabled: {
          color: defaultColorPalette.navContent,
          background: defaultColorPalette.navBackgroundD1,
        },
        color: defaultColorPalette.navContent,
        background: defaultColorPalette.navBackgroundD1,
        hPadding: '25px'
      },
      color: defaultColorPalette.navContent,
      background: defaultColorPalette.navBackgroundD1,
      search: {
        background: white,
        backIcon: {
          color: paleGrayTwo,
          fill: white,
          fillHover: dominoBlue,
        },
      },
      switcher: {
        hover: {
          background: '#f5f7fa',
          color: dominoBlue,
          fontWeight: '500'
        }
      },
    },
    secondary: {
      border: {
        color: dominoBlue,
        focused: {
          color: transparent,
        },
      },
      search: {
        width: '300px',
        icon: {
          primaryColor: defaultColorPalette.navContent,
          secondaryColor: darkPurpleLabelBackground,
        },
        input: {
          fontColor: dusk,
          border: '1px solid rgba(0, 0, 0, .05)',
        },
        overlayColor: black,
        backgroundColor: white,
        results: {
          headerColor: dusk,
          emphasis: 'rgba(255, 255, 140, 0.9)',
          icon: {
            primaryColor: defaultColorPalette.navContent,
            secondaryColor: dominoBlue,
          },
          hoverColor: lightLightBlueGrey,
        }
      },
      title: {
        icon: {
          container: {
            height: sizes.EXTRA_LARGE,
            width: sizes.EXTRA_LARGE,
            border: {
              radius: sizes.STANDARD_BORDER_RADIUS,
            },
            background: white,
            boxShadow: '1px 1px 4px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.05)',
          },
          height: sizes.MEDIUM,
          width: sizes.MEDIUM,
          color: '#4473ff',
        },
        main: {
          hasSubtitle: {
            fontSize: fontSizes.MEDIUM,
            lineHeight: 'normal',
            marginBottom: margins.TINY,
          },
          marginBottom: 'auto',
          fontWeight: '500',
          lineHeight: '45px',
          fontSize: fontSizes.LARGE,
          color: white,
        },
        sub: {
          lineHeight: 'normal',
          fontSize: fontSizes.TINY,
          color: white,
        },
      },
      menuItem: {
        hover: {
          color: defaultColorPalette.navContent,
          background: defaultColorPalette.navBackground,
        },
        disabled: {
          color: defaultColorPalette.navContent,
          background: defaultColorPalette.navBackgroundD1,
        },
        focused: {
          color: defaultColorPalette.navContentE,
          background: defaultColorPalette.navHighlight,
          hover: {
            color: defaultColorPalette.navContentE,
            background: defaultColorPalette.navHighlight,
          },
        },
        color: defaultColorPalette.navContent,
        background: defaultColorPalette.navBackground,
      },
      breadcrumb: {
        first: {
          color: lightGreyFontColor,
        },
        intermediate: {
          color: lightGreyFontColor,
        },
        last: {
          color: dusk,
        },
        hover: {
          color: dominoBlue,
        },
      },
      color: defaultColorPalette.navContent,
      background: defaultColorPalette.navBackground,
    },
  },
  card: {
    light: {
      footer: {
        color: disabledLabelColor,
        background: lightLightBlueGrey,
        borderColor: lightGreyCardBorderColor,
      },
      content: {
        color: brownishGrey,
        barColor: dominoBlue,
        titleColor: dominoBlue,
      },
      container: {
        borderColor: lightGreyCardBorderColor,
        background: white,
      },
    },
    footer: {
      fontSize: fontSizes.TINY,
      border: '1px solid',
      padding: margins.SMALL,
    },
    content: {
      padding: `${margins.TINY} ${margins.MEDIUM}`,
      fontSize: fontSizes.SMALL,
      lineHeight: '22px',
      height: '55px',
    },
    container: {
      border: '1px solid',
      boxShadow: 'rgba(0, 0, 0, 0.04) 0px 4px 6px 0px',
      borderRadius: sizes.STANDARD_BORDER_RADIUS,
    },
    header: {
      padding: margins.MEDIUM,
    },
  },
  tabs: {
    tabpane: {
      active: {
        color: darkPurpleLabelBackground,
        underlineColor: darkPurpleLabelBackground,
      },
      inactive: {
        color: lightGreyFontColor,
      },
    },
  },
  squareIconButton: {
    active: {
      color: darkPurpleLabelBackground,
      background: disabledLabelBackground,
    },
    inactive: {
      color: inactiveSquareButtonColor,
      background: transparent,
    },
  },
  label: {
    disabled: {
      color: disabledLabelColor,
      background: disabledLabelBackground,
    },
    basic: {
      color: disabledLabelColor,
      background: disabledLabelBackground,
    },
    dark: {
      color: disabledLabelColor,
      background: shamrockGreenO2,
    },
  },
  table: {
    boxShadow: 'rgba(0, 0, 0, 0.04) 0px 4px 6px 0px',
    border: borderTableGrey,
    row: {
      hover: {
        background: zircon,
        link: dominoBlue,
      },
      active: {
        fontWeight: '500',
      }
    },
    resizable: {
      border: `1px solid ${cardHoverBackgroundColor}`
    }
  },
  button: {
    splitButton: {
      splitBorder: {
        color: cornflowerBlue,
      }
    },
    secondary: {
      container: {
        background: defaultColorPalette.background,
        color: defaultColorPalette.action,
        borderColor: defaultColorPalette.action,
      },
      hover: {
        background: defaultColorPalette.background,
        color: defaultColorPalette.actionE,
        borderColor: defaultColorPalette.actionE,
      },
      active: {
        background: defaultColorPalette.background,
        color: defaultColorPalette.actionE,
        borderColor: defaultColorPalette.actionE,
      },
      icon: {
        fontSize: '12px'
      },
      disabled: {
        container: {
          background: defaultColorPalette.backgroundD2,
          color: defaultColorPalette.contentD1,
          borderColor: defaultColorPalette.contentD2,
        },
        icon: {
          fontSize: '12px'
        }
      }
    },
    primary: {
      container: {
        background: defaultColorPalette.action,
        color: defaultColorPalette.background,
        borderColor: defaultColorPalette.action,
      },
      hover: {
        background: defaultColorPalette.actionE,
        color: defaultColorPalette.background,
        borderColor: defaultColorPalette.actionE,
      },
      active: {
        background: defaultColorPalette.actionE,
        color: defaultColorPalette.background,
        borderColor: defaultColorPalette.actionE,
      },
      icon: {
        fontSize: '12px'
      },
      disabled: {
        container: {
          background: defaultColorPalette.contentD1,
          color: defaultColorPalette.background,
          borderColor: defaultColorPalette.contentD1,
        },
        icon: {
          fontSize: '12px'
        }
      }
    },
    tertiary: {
      container: {
        background: transparent,
        color: defaultColorPalette.action,
        borderColor: transparent,
      },
      hover: {
        background: transparent,
        color: defaultColorPalette.actionE,
        borderColor: defaultColorPalette.actionE,
      },
      active: {
        background: transparent,
        color: defaultColorPalette.actionE,
        borderColor: defaultColorPalette.actionE,
      },
      disabled: {
        container: {
          background: transparent,
          color: defaultColorPalette.contentD1,
          borderColor: transparent,
        }
      }
    },
    disabled: {
      dark: {
        container: {
          background: disabledBackground,
          borderColor: disabledBackground,
          color: lightGreyFontColor,
        },
        icon: {
          fontSize: fontSizes.MEDIUM,
          color: lightGreyFontColor,
        }
      }
    },
    basic: {
      dark: {
        container: {
          background: darkEggplantPurple,
          borderColor: darkEggplantPurple,
          color: white,
        },
        active: {
          borderColor: dominoBlue,
          background: dominoBlue,
          color: white,
        }
      },
      light: {
        container: {
          background: white,
          borderColor: brandBlue,
          color: brandBlue,
        },
        active: {
          borderColor: dominoBlue,
          background: dominoBlue,
          color: white,
        },
      },
    },
    danger: {
      primary: {
        container: {
          background: defaultColorPalette.danger,
          borderColor: defaultColorPalette.danger,
          color: defaultColorPalette.background,
        },
        icon: {
          color: defaultColorPalette.background,
          fontSize: fontSizes.MEDIUM,
        },
        active: {
          background: defaultColorPalette.danger,
          borderColor: defaultColorPalette.danger,
          color: defaultColorPalette.background,
        },
      },
      secondary: {
        container: {
          background: defaultColorPalette.background,
          borderColor: defaultColorPalette.danger,
          color: defaultColorPalette.danger,
        },
        icon: {
          color: defaultColorPalette.danger,
          fontSize: fontSizes.MEDIUM,
        },
        active: {
          background: defaultColorPalette.background,
          borderColor: defaultColorPalette.danger,
          color: defaultColorPalette.danger,
        },
      },
    },
    success: {
      primary: {
        container: {
          background: mantis,
          borderColor: mantis,
          color: white,
        },
        icon: {
          color: mantis,
          fontSize: fontSizes.MEDIUM,
        },
        active: {
          background: successDark,
          borderColor: successDark,
          color: white,
        },
      },
      secondary: {
        container: {
          background: white,
          borderColor: mantis,
          color: mantis,
        },
        icon: {
          color: mantis,
          fontSize: fontSizes.MEDIUM,
        },
        active: {
          background: white,
          borderColor: successDark,
          color: successDark,
        },
      },
    },
    add: {
      dark: {
        container: {
          background: darkEggplantPurple,
          borderColor: darkEggplantPurple,
          color: white,
        },
        icon: {
          color: green,
          fontSize: fontSizes.MEDIUM,
        },
        active: {
          background: dominoBlue,
          borderColor: dominoBlue,
          color: white,
        },
      },
      light: {
        container: {
          background: lightishBlue,
          color: white,
          borderColor: lightishBlue,
        },
        active: {
          background: btnDarkBlue,
          color: white,
          borderColor: btnDarkBlue,
        },
        icon: {
          fontSize: '12px'
        }
      }
    },
  },
  radio: {
    default: {
      container: {
        borderColor: defaultColorPalette.contentD1,
        color: defaultColorPalette.content,
        background: defaultColorPalette.background,
        icon: defaultColorPalette.navHighlight,
      },
      selected: {
        borderColor: defaultColorPalette.action,
        color: defaultColorPalette.content,
      },
      disabled: {
        borderColor: defaultColorPalette.contentD1,
        color: defaultColorPalette.contentD1
      }
    },
    button: {
      container: {
        borderColor: defaultColorPalette.contentD1,
        color: defaultColorPalette.content,
        background: defaultColorPalette.backgroundD2
      },
      selected: {
        borderColor: defaultColorPalette.action,
        color: defaultColorPalette.content,
        background: defaultColorPalette.backgroundD2
      }
    }
  },
  modal: {
    header: {
      fontSize: MEDIUM,
      fontWeight: 'bold',
    },
    input: {
      borderColor: dominoBlue,
    }
  },
  projectsDependencyGraph: {
    svg: {
      border: shady4,
      background: white,
    },
    node: {
      stroke: semiBlack,
      fill: white,
      highlighted: warning,
      linkFill: linkBlue,
    },
    edge: {
      stroke: semiBlack,
      fill: semiBlack,
    },
  },
  errorPage: {
    status: {
      fontSize: '84px'
    }
  },
  accordion: {
    backgroundColor: defaultColorPalette.backgroundD1,
    contentColor: defaultColorPalette.content,
    borderColor: defaultColorPalette.contentD2
  },
  carousel: {
    backgroundColor: defaultColorPalette.contentD2,
    color: defaultColorPalette.navHighlight,
  },
  checkbox: {
    container: {
      borderColor: defaultColorPalette.contentD1,
      color: defaultColorPalette.content,
      backgroundColor: defaultColorPalette.background
    },
    selected: {
      borderColor: defaultColorPalette.action,
      color: defaultColorPalette.content,
    },
    intermediate: {
      default: {
        borderColor: defaultColorPalette.action,
        backgroundColor: defaultColorPalette.content
      },
      disabled: {
        borderColor: defaultColorPalette.action,
        backgroundColor: defaultColorPalette.contentD1
      }
    },
    disabled: {
      borderColor: defaultColorPalette.contentD1,
      color: defaultColorPalette.contentD1,
      backgroundColor: defaultColorPalette.backgroundD2
    }
  }
};


const updateTheme = (theme: Record<string, any>, colorPalette: any) => mergeDeepRight(theme,
  {
    badge: {
      warning: {
        background: colors[colorPalette.danger]
      },
      info: {
        background: colors[colorPalette.contentD1]
      },
      color: colors[colorPalette.background],
      background: colors[colorPalette.danger],
    },
    button: {
      primary: {
        container: {
          background: colors[colorPalette.action],
          color: colors[colorPalette.background],
          borderColor: colors[colorPalette.action],
        },
        hover: {
          background: colors[colorPalette.actionE],
          color: colors[colorPalette.background],
          borderColor: colors[colorPalette.actionE],
        },
        active: {
          background: colors[colorPalette.actionE],
          color: colors[colorPalette.background],
          borderColor: colors[colorPalette.actionE],
        },
        disabled: {
          container: {
            background: colors[colorPalette.contentD1],
            color: colors[colorPalette.background],
            borderColor: colors[colorPalette.contentD1],
          }
        }
      },
      secondary: {
        container: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.action],
          borderColor: colors[colorPalette.action],
        },
        hover: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.actionE],
          borderColor: colors[colorPalette.actionE],
        },
        active: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.actionE],
          borderColor: colors[colorPalette.actionE],
        },
        disabled: {
          container: {
            background: colors[colorPalette.backgroundD2],
            color: colors[colorPalette.contentD1],
            borderColor: colors[colorPalette.contentD2],
          }
        }
      },
      tertiary : {
        container: {
          background: transparent,
          color: colors[colorPalette.action],
          borderColor: transparent,
        },
        hover: {
          background: transparent,
          color: colors[colorPalette.actionE],
          borderColor: colors[colorPalette.actionE],
        },
        active: {
          background: transparent,
          color: colors[colorPalette.actionE],
          borderColor: colors[colorPalette.actionE],
        },
        disabled: {
          container: {
            background: transparent,
            color: colors[colorPalette.contentD1],
            borderColor: transparent,
          }
        }
      },
      danger: {
        primary: {
          container: {
            background: colors[colorPalette.danger],
            borderColor: colors[colorPalette.danger],
            color: colors[colorPalette.background],
          },
          icon: {
            color: colors[colorPalette.background],
            fontSize: fontSizes.MEDIUM,
          },
          active: {
            background: colors[colorPalette.danger],
            borderColor: colors[colorPalette.danger],
            color: colors[colorPalette.background],
          },
        },
        secondary: {
          container: {
            background: colors[colorPalette.background],
            borderColor: colors[colorPalette.danger],
            color: colors[colorPalette.danger],
          },
          icon: {
            color: colors[colorPalette.danger],
            fontSize: fontSizes.MEDIUM,
          },
          active: {
            background: colors[colorPalette.background],
            borderColor: colors[colorPalette.danger],
            color: colors[colorPalette.danger],
          },
        },
        tertiary: {
          container: {
            background: transparent,
            borderColor: transparent,
            color: colors[colorPalette.danger],
          },
          hover: {
            background: transparent,
            color: colors[colorPalette.danger],
            borderColor: colors[colorPalette.danger],
          },
          icon: {
            color: colors[colorPalette.danger],
            fontSize: fontSizes.MEDIUM,
          },
          active: {
            background: transparent,
            borderColor: colors[colorPalette.danger],
            color: colors[colorPalette.danger],
          },
        }
      }
    },
    select: {
      selector: {
        hover: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.content],
          borderColor: colors[colorPalette.action],
        },
        container: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.content],
          borderColor: colors[colorPalette.contentD1],
        },
        focus: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.content],
          borderColor: colors[colorPalette.action],
        },
        disabled: {
          background: colors[colorPalette.backgroundD2],
          color: colors[colorPalette.contentD1],
          borderColor: colors[colorPalette.contentD1],
        }
      },
      item: {
        active: {
          background: colors[colorPalette.highlight],
          color: colors[colorPalette.content]
        },
        container: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.content]
        },
        hover: {
          background: colors[colorPalette.backgroundD2],
          color: colors[colorPalette.content]
        },
        disabled: {
          background: colors[colorPalette.background],
          color: colors[colorPalette.contentD1]
        }
      }
    },
    tag: {
      background: colors[colorPalette.contentD2],
      color: colors[colorPalette.content],
    },
    tooltip: {
      background: colors[colorPalette.content],
      color: colors[colorPalette.background],
    },
    text: {
      color: colors[colorPalette.content],
    },
    radio: {
      default: {
        container: {
          borderColor: colors[colorPalette.contentD1],
          color: colors[colorPalette.content],
          background: colors[colorPalette.background],
          icon: colors[colorPalette.navHighlight],
        },
        selected: {
          borderColor: colors[colorPalette.action],
          color: colors[colorPalette.content],
        },
        disabled: {
          borderColor: colors[colorPalette.contentD1],
          color: colors[colorPalette.contentD1],
          background: colors[colorPalette.backgroundD2]
        }
      },
      button: {
        container: {
          borderColor: colors[colorPalette.contentD1],
          color: colors[colorPalette.content],
          background: colors[colorPalette.backgroundD2]
        },
        selected: {
          borderColor: colors[colorPalette.action],
          color: colors[colorPalette.content],
          background: colors[colorPalette.backgroundD2]
        }
      }
    },
    tabs: {
      tabpane: {
        active: {
          color: colors[colorPalette.action],
          underlineColor: colors[colorPalette.action],
        },
        inactive: {
          color: colors[colorPalette.content],
          underlineColor: colors[colorPalette.contentD2],
        },
      },
    },
    accordion: {
      backgroundColor: colors[colorPalette.backgroundD1],
      contentColor: colors[colorPalette.content],
      borderColor: colors[colorPalette.contentD2]
    },
    nav: {
      primary: {
        menuItem: {
          focused: {
            color: colors[colorPalette.navContentE],
            background: colors[colorPalette.navBackground],
            hover: {
              color: colors[colorPalette.navContentE],
              background: colors[colorPalette.navBackground],
            },
          },
          hover: {
            color: colors[colorPalette.navContent],
            background: colors[colorPalette.navBackground],
          },
          disabled: {
            color: colors[colorPalette.navContent],
            background: colors[colorPalette.navBackgroundD1],
          },
          color: colors[colorPalette.navContent],
          background: colors[colorPalette.navBackgroundD1],
        },
        color: colors[colorPalette.navContent],
        background: colors[colorPalette.navBackgroundD1],
        search: {
          background: colors[colorPalette.background],
        },
      },
      secondary: {
        title: {
          icon: {
            container: {
              background: colors[colorPalette.navContentE],
            },
          },
          main: {
            color: colors[colorPalette.navContentE],
          },
          sub: {
            color: colors[colorPalette.navContentE],
          },
        },
        menuItem: {
          hover: {
            color: colors[colorPalette.navContentE],
            background: colors[colorPalette.navHighlight],
          },
          disabled: {
            color: colors[colorPalette.navContent],
            background: colors[colorPalette.navBackgroundD1],
          },
          focused: {
            color: colors[colorPalette.navContentE],
            background: colors[colorPalette.navHighlight],
            hover: {
              color: colors[colorPalette.navContentE],
              background: colors[colorPalette.navHighlight],
            },
          },
          color: colors[colorPalette.navContent],
          background: colors[colorPalette.navBackground],
        },
        color: colors[colorPalette.navContent],
        background: colors[colorPalette.navBackground],
      },
    },
    carousel: {
      backgroundColor: colors[colorPalette.contentD2],
      color: colors[colorPalette.navHighlight],
    },
    checkbox: {
      container: {
        borderColor: colors[colorPalette.contentD1],
        color: colors[colorPalette.content],
        backgroundColor: colors[colorPalette.background],
      },
      selected: {
        borderColor: colors[colorPalette.action],
        color: colors[colorPalette.content],
      },
      intermediate: {
        default: {
          borderColor: colors[colorPalette.action],
          backgroundColor: colors[colorPalette.action],
        },
        disabled: {
          borderColor: colors[colorPalette.action],
          backgroundColor: colors[colorPalette.contentD1],
        }
      },
      disabled: {
        borderColor: colors[colorPalette.contentD1],
        color: colors[colorPalette.contentD1],
        backgroundColor: colors[colorPalette.backgroundD2],
      }
    }
  });

const getUserSelectedColorPalette = (key: string) => {
  const selected = localStorage.getItem(key);

  if (!isNil(selected)) {
    return JSON.parse(selected);
  }
  return {};
};

export default ({ children, isDarkMode, isStorybook, semanticTokens }: { children: JSX.Element, isDarkMode?: boolean, isStorybook?: boolean, semanticTokens?: {} }) => {
  
  let colorPalette;
  if (isStorybook) {
    colorPalette = isDarkMode ? mergeDeepRight(darkColorPalette, semanticTokens ?? getUserSelectedColorPalette(darkColorPaletteStorageKey))
      : mergeDeepRight(defaultColorPalette, semanticTokens ?? getUserSelectedColorPalette(defaultColorPaletteStorageKey));
  } else {
    const { formattedPrincipal, whiteLabelSettings } = useStore();
    if (whiteLabelSettings?.appName?.toLocaleLowerCase()?.includes('nvidia')) {
      colorPalette = nvidiaColorPalette;
    } else {
      colorPalette = (formattedPrincipal && formattedPrincipal.enableDarkMode) ? darkColorPalette : defaultColorPalette;
    }
  }
  // TODO: Remove isStorybook flag after semantic tokens applied to main Domino UI
  const updatedTheme = updateTheme(theme, colorPalette);
  return (
    <ThemeProvider theme={updatedTheme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>);
};
