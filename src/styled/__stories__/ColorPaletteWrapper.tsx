import * as React from 'react';
import styled from 'styled-components';
import { useDarkMode } from 'storybook-dark-mode';
import { isEmpty, mergeAll } from 'ramda';
import { Args } from '@storybook/react';
import { useArgs } from '@storybook/addons';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import Button from '@domino/ui/dist/components/Button/Button';
import * as colorPalette from './colorPalette';
import { ColorPaletteField } from './ColorPaletteField';
import {
  getLocalStorageItem,
  LocalStorageItemKey,
  removeLocalStorageItem,
  setLocalStorageItem
} from '../../utils/localStorageService';

const StyledButton = styled(Button)`
  margin-left: ${themeHelper('margins.tiny')};
`;

const column1Width = "120px";
const column2Width = "100px";
const SPACING = 'spacing';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: ${props => props.color};
`;

const Row = styled.div<{width?: string}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${props => props.width};
  flex-shrink: ${props => props.width ? 0 : 1};
`;

const Heading = styled.h3<{topSpacing?: string}>`
  padding-top: ${props => props.topSpacing ? props.topSpacing : 0};
  color: inherit;
`;

const SubHeading = styled.h4<{width?: string}>`
  width: ${props => props.width};
  color: inherit;
`;

const Text = styled.div<{width?: string}>`
  width: ${props => props.width};
  flex-shrink:${props => props.width ? 0 : 1};
`;

const Token = styled.div<{color?: string, border?: string}>`
  background-color: ${props => props.color};
  width: 10px;
  height: 10px;
  border: 1px solid ${props => props.border};
  border-radius: 2px;
  margin-right: 5px;
`;

const TokenContainer = styled.div`
  font-size: 12px;
`;

const Spacing = styled.div`
  height: 10px;
`;

const optionsWithData: colorPalette.ColorPaletteType = mergeAll([
  colorPalette.Blue,
  colorPalette.Navy,
  colorPalette.Red,
  colorPalette.Green,
  colorPalette.Orange,
  colorPalette.Neutral
]);

export const options = Object.keys(optionsWithData);

export const defaultColorPalette = {
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
  navBackground: 'navy500',
  navBackgroundD1: 'navy800'
};

export const darkColorPalette = {
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
  navBackground: 'navy500',
  navBackgroundD1: 'navy800'
};

type SemanticTokenProps = {
  tokenName: string,
  colorToken?: colorPalette.ColorType,
  usedFor?: string,
  textColor?: string,
};

const getSemanticList = (isDarkMode: boolean) => [
  {
    tokenName: "content",
    colorToken: isDarkMode ? colorPalette.Neutral.neutral200 : colorPalette.Neutral.neutral900,
    usedFor: "Text and icons",
  },
  {
    tokenName: "contentD1",
    colorToken: isDarkMode ? colorPalette.Neutral.neutral400 : colorPalette.Neutral.neutral500,
    usedFor: "Secondary test, Form borders, Disabled actions",
  },
  {
    tokenName: "contentD2",
    colorToken: isDarkMode ? colorPalette.Neutral.neutral600 : colorPalette.Neutral.neutral300,
    usedFor: "Lines and Visual borders",
  },
  {
    tokenName: SPACING,
  },
  {
    tokenName: "background",
    colorToken: isDarkMode ? colorPalette.Neutral.neutral900 : colorPalette.Neutral.neutral50,
    usedFor: "Background: Components",
  },
  {
    tokenName: "backgroundD1",
    colorToken: isDarkMode ? colorPalette.Neutral.neutral800 : colorPalette.Neutral.neutral100,
    usedFor: "Background: Pages, De-emphasis",
  },
  {
    tokenName: "backgroundD2",
    colorToken: isDarkMode ? colorPalette.Neutral.neutral700 : colorPalette.Neutral.neutral200,
    usedFor: "Background: Disabled",
  },
  {
    tokenName: SPACING,
  },
  {
    tokenName: "highlight",
    colorToken: isDarkMode ? colorPalette.Navy.navy900 : colorPalette.Blue.blue50,
    usedFor: "Highlight",
  },
  {
    tokenName: SPACING,
  },
  {
    tokenName: "action",
    colorToken: colorPalette.Blue.blue700,
    usedFor: "Actions",
  },
  {
    tokenName: "actionE",
    colorToken: colorPalette.Blue.blue900,
    usedFor: "Actions - Hover, Click",
  },
  {
    tokenName: SPACING,
  },
  {
    tokenName: "danger",
    colorToken: colorPalette.Red.red500,
    usedFor: "Danger",
  },
  {
    tokenName: "dangerD",
    colorToken: colorPalette.Red.red200,
    usedFor: "Danger - background",
  },
  {
    tokenName: SPACING,
  },
  {
    tokenName: "warning",
    colorToken: colorPalette.Orange.orange500,
    usedFor: "Warning",
  },
  {
    tokenName: "warningD",
    colorToken: colorPalette.Orange.orange300,
    usedFor: "Warning - Background",
  },
  {
    tokenName: SPACING,
  },
  {
    tokenName: "success",
    colorToken: colorPalette.Green.green500,
    usedFor: "Success",
  },
  {
    tokenName: "successD",
    colorToken: colorPalette.Green.green200,
    usedFor: "Success - Background",
  },
  {
    tokenName: SPACING,
  },
  {
    tokenName: "navContent",
    colorToken: colorPalette.Navy.navy200,
    usedFor: "Nav - Text",
  },
  {
    tokenName: "navContentE",
    colorToken: colorPalette.Neutral.neutral50,
    usedFor: "Nav - Highlighted Text",
  },
  {
    tokenName: "navHighlight",
    colorToken: colorPalette.Navy.navy300,
    usedFor: "Nav - Selected",
  },
  {
    tokenName: "navBackground",
    colorToken: colorPalette.Navy.navy500,
    usedFor: "Nav - Background L2",
  },
  {
    tokenName: "navBackgroundD1",
    colorToken: colorPalette.Navy.navy800,
    usedFor: "Nav - Background L1",
  },
]

const SemanticToken = ({tokenName, colorToken, usedFor, textColor}: SemanticTokenProps) => {
  return (
    <TokenContainer>
      <Row>
        <Text width={column1Width}>{tokenName}</Text>
        <Row width={column2Width}>
          <Token color={colorToken?.color} border={textColor !== colorToken?.textColor ? 'transparent' : textColor}/>
          <Text>{colorToken?.name}</Text>
        </Row>
        <Text>{usedFor}</Text>
      </Row>
    </TokenContainer>
  );
}

export interface SemanticTokens {
  content?: string;
  contentD1?: string;
  contentD2?: string;
  background?: string;
  backgroundD1?: string;
  backgroundD2?: string;
  highlight?: string;
  action?: string;
  actionE?: string;
  danger?: string;
  dangerD?: string;
  warning?: string;
  warningD?: string;
  success?: string;
  successD?: string;
  navContent?: string;
  navContentE?: string;
  navHighlight?: string;
  navBackground?: string;
  navBackgroundD1?: string;
}

export interface ColorPaletteWrapperProps {
  semanticTokens: SemanticTokens;
  updateArgs: (newArgs: Args) => void;
  resetArgs: (argNames?: [string]) => void;
  updateSemanticTokens?: (data: {}) => void;
}

export const ColorPaletteWrapper = (props: ColorPaletteWrapperProps) => {
  const {
    content,
    contentD1,
    contentD2,
    background,
    backgroundD1,
    backgroundD2,
    highlight,
    action,
    actionE,
    danger,
    dangerD,
    warning,
    warningD,
    success,
    successD,
    navContent,
    navContentE,
    navHighlight,
    navBackground,
    navBackgroundD1
  } = props.semanticTokens;
  const isDarkMode = useDarkMode();
  const didMount = React.useRef(false);
  const [semanticList, setSemanticList] = React.useState<SemanticTokens>();

  const getSemanticListFromStorage = () => {
    const data = isDarkMode ?
      getLocalStorageItem(LocalStorageItemKey.DarkColorPalette) :
      getLocalStorageItem(LocalStorageItemKey.DefaultColorPalette);
    return data ? JSON.parse(data) : {};
  };

  const updateSemanticListInLocalStorage = (semanticList: SemanticTokens) => {
    if (isDarkMode) {
      isEmpty(semanticList) ?
        removeLocalStorageItem(LocalStorageItemKey.DarkColorPalette) :
        setLocalStorageItem(LocalStorageItemKey.DarkColorPalette, JSON.stringify(semanticList))
    } else {
      isEmpty(semanticList) ?
        removeLocalStorageItem(LocalStorageItemKey.DefaultColorPalette) :
        setLocalStorageItem(LocalStorageItemKey.DefaultColorPalette, JSON.stringify(semanticList))
    }
  };

  const updateSemanticToken = (key: string, value?: string) => {
    const data = getSemanticListFromStorage();
    data[key] = value;
    updateSemanticListInLocalStorage(data);
    setSemanticList(data);
    if(props.updateSemanticTokens){
      props.updateSemanticTokens(data);
    }
  };

  const resetColors = () => {
    removeLocalStorageItem(LocalStorageItemKey.DarkColorPalette);
    removeLocalStorageItem(LocalStorageItemKey.DefaultColorPalette);
    setSemanticList({});
    isDarkMode ? props.updateArgs(darkColorPalette) : props.resetArgs();
  };

  React.useEffect(() => {
    const data = getSemanticListFromStorage();
    setSemanticList(data);
    isDarkMode ? props.updateArgs(darkColorPalette) : props.resetArgs();
    props.updateArgs(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('content', content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('contentD1', contentD1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentD1]);

  React.useEffect(() => {
    if (didMount.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      updateSemanticToken('contentD2', contentD2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentD2]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('background', background);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [background]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('backgroundD1', backgroundD1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundD1]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('backgroundD2', backgroundD2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundD2]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('highlight', highlight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('action', action);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('actionE', actionE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionE]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('danger', danger);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [danger]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('dangerD', dangerD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dangerD]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('warning', warning);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warning]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('warningD', warningD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningD]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('success', success);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('successD', successD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successD]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('navContent', navContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navContent]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('navContentE', navContentE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navContentE]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('navHighlight', navHighlight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navHighlight]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('navBackground', navBackground);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navBackground]);

  React.useEffect(() => {
    if (didMount.current) {
      updateSemanticToken('navBackgroundD1', navBackgroundD1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navBackgroundD1]);

  React.useEffect(() => {
    didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textColor = isDarkMode ? colorPalette.lightText : colorPalette.darkText;
  return (
    <Container color={textColor}>
      <Heading>Color Tokens</Heading>
      <Row>
        <ColorPaletteField paletteName="Neutral"/>
        <ColorPaletteField paletteName="Blue"/>
        <ColorPaletteField paletteName="Red"/>
        <ColorPaletteField paletteName="Green"/>
        <ColorPaletteField paletteName="Orange"/>
        <ColorPaletteField paletteName="Navy"/>
      </Row>
      <Heading topSpacing="20px">
        Semantic Tokens
        <StyledButton onClick={resetColors}>Reset Colors</StyledButton>
      </Heading>
      <Row>
        <SubHeading width={column1Width}>Token Name</SubHeading>
        <SubHeading width={column2Width}>Color Token</SubHeading>
        <SubHeading>Used for</SubHeading>
      </Row>
      {
        getSemanticList(isDarkMode).map((item, index) => {
          if (item.tokenName === SPACING) {
            return <Spacing key={index}/>;
          }
          const tokenName = semanticList ? semanticList[item.tokenName] : props[item.tokenName];
          const tokenFromProps = optionsWithData[tokenName];
          return (
            <SemanticToken
              key={item.tokenName}
              tokenName={item.tokenName}
              colorToken={tokenFromProps || item.colorToken}
              usedFor={item.usedFor}
              textColor={textColor}
            />);
        })
      }
    </Container>
  );
};

export const Template = (args: any, props: any) => {
  const [, updateArgs, resetArgs] = useArgs();
  return (
    <ColorPaletteWrapper
      semanticTokens={args}
      updateArgs={props.viewMode == 'docs' ? () => null : updateArgs}
      resetArgs={props.viewMode == 'docs' ? () => null : resetArgs}
      updateSemanticTokens={props.updateSemanticTokens}
    />
  );
}
