import * as React from 'react';
import styled, { css, withTheme } from 'styled-components';
import Icon, { InfoCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { themeHelper } from '../../styled/themeUtils';
import { lightishBlue } from '../../styled/colors';
import HelperTextPanel from '../HelperTextPanel';
import Link from '../Link';
import { CustomIconComponentProps } from '@ant-design/compatible/lib/icon';
import { ThemeType } from '../../utils';

export const getIconSize = themeHelper('sizes.SMALL');

interface InfoBoxContainerProps {
  fullWidth: boolean;
}
const InfoBoxContainer = styled(HelperTextPanel)<InfoBoxContainerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  border-width: 1px;
  border-style: solid;
  border-left-width: 4px;
  border-color: ${lightishBlue};
  border-radius: ${themeHelper('borderRadius.standard')};
  padding: ${themeHelper('margins.tiny')} ${themeHelper('margins.small')};
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  .info-box-icon svg {
    fill: ${lightishBlue};
  }

  > div {
    display: flex;
    align-items: center;
  }
`;

const PrimaryActionContainer = styled.div`
  display: inline-flex;
  margin-left: ${themeHelper('margins.small')};
`;

const IconContainer = styled.div`
  display: inline-flex;
  margin-right: 12px;
`;

const InfoMessageContainer = styled.div`
  min-width: 180px;
`;

export const commonCSS = css`
  path {
    color: ${lightishBlue};
  }
`;
export const StyledInfoCircleFilled = styled(InfoCircleFilled)`${commonCSS}`;
export const StyledInfoCircleOutlined = styled(InfoCircleOutlined)`${commonCSS}`;

export type InfoBoxProps = {
  'data-test'?: string;
  PrimaryAction?: React.ReactNode;
  alternativeIcon?: boolean;
  children?: any;
  className?: string;
  fullWidth?: boolean;
  icon?: any;
  iconSize?: string | number;
  link?: string;
  linkText?: string;
  theme?: {};
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  PrimaryAction,
  alternativeIcon,
  children,
  className,
  fullWidth = false,
  icon,
  iconSize,
  link,
  linkText,
  ...rest
}) => (
  <InfoBoxContainer data-test={rest['data-test']} className={className} fullWidth={fullWidth}>
    <IconContainer>
      {alternativeIcon ? (
        <Icon
        component={InfoCircleOutlined as React.ForwardRefExoticComponent<CustomIconComponentProps>}
        style={{ fontSize: iconSize ?? getIconSize(rest) }}
        className="info-box-icon"
      />
      ) : icon ? (
        icon
      ) : (
        <Icon
          component={InfoCircleFilled as React.ForwardRefExoticComponent<CustomIconComponentProps>}
          style={{ fontSize: iconSize ?? getIconSize(rest) }}
          className="info-box-icon"
        />
      )}
    </IconContainer>
    <InfoMessageContainer>
      {children}
      {link && (
        <Link href={link} openInNewTab={true}>
          {linkText}
        </Link>
      )}
    </InfoMessageContainer>
    {!!PrimaryAction && <PrimaryActionContainer>{PrimaryAction}</PrimaryActionContainer>}
  </InfoBoxContainer>
);

const InfoBoxWithTheme: ThemeType<InfoBoxProps> = withTheme(InfoBox);
export default InfoBoxWithTheme;
