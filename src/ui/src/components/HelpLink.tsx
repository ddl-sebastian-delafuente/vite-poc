import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { QuestionCircleFilled } from '@ant-design/icons';

import withStore, { StoreProps } from '@domino/ui/dist/globalStore/withStore';
import { HELP_PREFIX } from '../core/supportUtil';
import ExternalLink from '../icons/ExternalLink';
import { lightishBlue, white } from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import { colors } from '../styled';
import Button, { ExtendedButtonProps } from './Button/Button';
import Link, { LinkType } from './Link/Link';
import { isValidRootUrl } from './util';

const PRIMARY = "primary";

interface IconProps {
  iconAfter: boolean;
}
const QuestionIcon = styled(QuestionCircleFilled) <IconProps>`
  color: ${lightishBlue};
  margin-left: ${({ iconAfter }) => iconAfter ? themeHelper('margins.tiny', '5px') : 0};
  margin-right: ${({ iconAfter }) => !iconAfter ? themeHelper('margins.tiny', '5px') : 0};
`;

const ExternalIcon = styled(ExternalLink) <IconProps>`
  color: ${white};
  margin-left: ${({ iconAfter }) => iconAfter ? themeHelper('margins.tiny', '0') : 0};
  margin-right: ${({ iconAfter }) => !iconAfter ? themeHelper('margins.tiny', '0') : 0};
`;

interface TextContainerProps {
  fontSize?: string;
}
const TextContainer = styled.span<TextContainerProps>`
  font-size: ${props => props.fontSize ? props.fontSize : themeHelper('fontSize.small')};
`;

export interface HelpLinkProps extends Pick<ExtendedButtonProps, 'btnType'>, StoreProps {
  text?: string | React.ReactNode;
  type?: LinkType;
  language?: string;
  version?: string;
  articlePath?: string;
  iconAfter?: boolean;
  anchorText?: string;
  showIcon?: boolean;
  className?: string;
  basePath?: string;
  fontSize?: string;
  dataTest?: string;
  displayDocsRootAsLinkText?: boolean;
}

interface SettingsWindow extends Window {
  __env?: {
    REACT_APP_DOC_VERSION: string,
    REACT_APP_DOC_LANGUAGE: string
  };
}
// https://github.com/microsoft/TypeScript/issues/33128#issuecomment-527572596
const win = window as SettingsWindow & typeof globalThis;

const withDefaults = R.merge({
  REACT_APP_DOC_VERSION: 'latest',
  REACT_APP_DOC_LANGUAGE: 'en'
});

export const env = withDefaults(R.pathOr(process.env, ['__env'])(win));

const HelpLink = ({
  anchorText = '',
  articlePath = '',
  basePath,
  btnType,
  className,
  dataTest = 'help_link',
  fontSize,
  iconAfter = false,
  language = env.REACT_APP_DOC_LANGUAGE,
  showIcon = true,
  text = '',
  type,
  principal,
  version = env.REACT_APP_DOC_VERSION,
  displayDocsRootAsLinkText = false
}: HelpLinkProps) => {
  const { docsRoot } = (principal || {});

  const docsPrefix = (!R.isNil(docsRoot) && !R.isEmpty(docsRoot) && isValidRootUrl(docsRoot)) ?
    `${docsRoot}/` : basePath;
  const docsVersion = (!R.isNil(docsRoot) && !R.isEmpty(docsRoot) && isValidRootUrl(docsRoot)) ?
    'latest' : version;
  return (
    <Link
      dataTest={dataTest}
      href={`${docsPrefix || HELP_PREFIX}${language}/${docsVersion}/${articlePath}${anchorText}`}
      openInNewTab={true}
      className={className}
    >
      {type == PRIMARY ?
        (showIcon ?
          (iconAfter ?
            <Button btnType={btnType} type={type}>
              {text}
              <ExternalIcon iconAfter={iconAfter} />
            </Button> :
            <Button btnType={btnType} type={type}>
              <ExternalIcon iconAfter={iconAfter} />
              {text}
            </Button>)
          :
          <Button btnType={btnType} type={type}>{text}</Button>
        ) : (showIcon ?
          (iconAfter ?
            <span>
              {text}
              <QuestionIcon iconAfter={iconAfter} />
            </span> :
            <span>
              <QuestionIcon iconAfter={iconAfter} />
              {text}
            </span>)
          :
          <TextContainer fontSize={fontSize}>{displayDocsRootAsLinkText ? (docsPrefix || HELP_PREFIX) : text}</TextContainer>)
      }
    </Link>
  );
};

export const DashedTitleHelpLink = styled(HelpLink).attrs<HelpLinkProps>({})`
  color: ${colors.semiBlack};
  font-size: ${themeHelper('fontSizes.large')};
  cursor: pointer;
  display: inline;
  margin-bottom: 0;
  margin-right: ${themeHelper('margins.tiny')};
  position: relative;
  text-decoration: none;
  border-bottom: 1px dashed ${colors.dustyGray};

  &:hover, &:active, &:focus {
    color: ${colors.semiBlack};
    text-decoration: none;
  }
`;

export default withStore(HelpLink);
