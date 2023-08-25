import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styled';
import tooltipRenderer from './renderers/TooltipRenderer';
import classNames from 'classnames';

/**
 * prop validations
 */
export interface LinkProps {
  children: any;
  href: string;
  openInNewTab?: boolean;
  download?: boolean;
  style?: object;
  disabled?: boolean;
  className?: string;
  disabledReason?: string;
  icon?: React.ReactNode;
}

const StyledLink = styled.a`
  &.disabled {
    cursor: not-allowed;
    color: ${colors.brownGrey};
  }
  &:focus {
    text-decoration: none;
  }
`;

const IconWrapper = styled.span`
  margin-right: 5px;
`;

const Link = (props: LinkProps) => {
  /**
   * default props
   */
  const {
    download = false,
    openInNewTab = true,
    disabled = false,
  } = props;

  /**
   * Compose props for a tag
   */
  const propsForA = () => {
    const allProps = {
      download: download,
      style: props.style
    };
    if (openInNewTab) {
      return R.mergeDeepLeft(allProps, {
        target: '_blank'
      });
    }
    return allProps;
  };

  const result = (
    <>
      {
        props.icon &&
          <IconWrapper>
            {props.icon}
          </IconWrapper>
      }
      {props.children}
    </>
  );

  return (
    <StyledLink
      className={classNames({disabled}, props.className)}
      href={!props.disabled ? props.href : undefined}
      {...propsForA()}
    >
      {
        disabled && props.disabledReason ?
          tooltipRenderer(props.disabledReason, <span>{result}</span>) :
          result
      }
    </StyledLink>
  );
};

export default Link;
