import * as React from 'react';
import styled from 'styled-components';
import { themeHelper } from '../../styled';
import EmptyArrowButton, { Direction } from '../EmptyArrowButton';
import classNames from 'classnames';
import * as R from 'ramda';
import tooltipRenderer from '../renderers/TooltipRenderer';

const truncationStyle = `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export type LinkType = 'primary' | 'delete' | 'show-more' | 'forward-link' | 'backward-link' |
  'icon-link' | 'icon-link-end';

export type ShowMoreDirections = 'down' | 'up';

export interface LinkProps<T> {
  /**
   * Additional CSS class to apply to the component
   */
  className?: string;
  /**
   * Component to be used as link
   */
  children?: any;
  /**
   * URL for link
   */
  href?: string;
  /**
   * whether the link is active or disabled
   */
  disabled?: boolean;
  /**
   * Type of link:
   * one of 'primary' | 'delete' | 'show-more' | 'forward-link' | 'backward-link' | 'icon-link' | 'icon-link-end'
   */
  type?: LinkType;
  /**
   * icon to be used for link
   */
  icon?: any;
  /**
   * Whether the link is a download link or not
   */
  download?: boolean;
  /**
   * Whether the link should open in a new tab or should use the current one
   */
  openInNewTab?: boolean;
  /**
   * direction of arrow to be shown for show-more link.
   * Default value is set to a downward facing arrow.
   */
  direction?: ShowMoreDirections;
  /**
   * onClick handler for link
   */
  onClick?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /**
   * whether the link is clicked or not
   */
  isClicked?: boolean;
  /**
   * data-test to be used for testing purpose
   */
  dataTest?: string;
  /**
   * Reason for the link to be disabled. Shown as tooltip on hover.
   */
  disabledReason?: string;
  /**
   * Renders link with an underline
   */
  isUnderlined?: boolean;

  /**
   * Whether or not to render the link with bold text
   */
  isBold?: boolean;

  /**
   * Whether or not to truncate the link's text when its width becomes larger than this size.
   */
  shouldTruncateAt?: string;

  /**
   * Shows the title for the link
   */
  title?: string;
}

export interface LinkState<T> {
  isClicked: boolean;
}

export interface LinkSpec {
  /**
   * icon to be displayed when link is not clicked
   */
  icon?: any;
  /**
   * icon to be displayed when link is clicked
   */
  activeIcon?: any;
  /**
   * position of icon w.r.t. the link
   */
  iconPos?: 'start' | 'end';
}

export type StyledLinkProps = {
  isUnderlined?: boolean;
  isBold: boolean;
  shouldTruncateAt?: string;
};
const StyledLink = styled.a<StyledLinkProps>`
  ${props => props.shouldTruncateAt ? `max-width: ${props.shouldTruncateAt}; > span { ${truncationStyle} }` : ''}
  display: inline-flex;
  font-weight: ${props => props.isBold ? 'bold' : 'normal'};
  font-size: ${themeHelper('fontSizes.small')};
  font-family: inherit;
  line-height: ${themeHelper('fontSizes.small')};
  color: ${props => props.type === 'delete' ? themeHelper('link.delete.color') : themeHelper('link.basic.color')};

  ${props => props.isUnderlined ? 'text-decoration: underline;' : ''}

  &.link {
    background: transparent;
  }

  &:hover {
    color: ${props => props.type === 'delete' ? themeHelper('link.delete.color') :
    themeHelper('link.basic.color')};
    text-decoration: underline;
  }

  &.disabled {
    cursor: not-allowed;
    text-decoration: none;
    color: ${props => props.type === 'delete' ? themeHelper('link.delete.disabledColor') :
    themeHelper('link.basic.disabledColor')};
  }

  &.icon-start {
    .icon-span {
      margin-right: 8px;
    }
  }

  &.icon-end {
    .icon-span {
      margin-left: 8px;
    }
  }
  `;

class Link<T> extends React.PureComponent<LinkProps<T>, LinkState<T>>  {
  constructor(props: LinkProps<T>) {
    super(props);

    this.state = {
      isClicked: !!props.isClicked
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: LinkProps<T>) {
    if (!R.equals(this.props.isClicked, nextProps.isClicked)) {
      this.setState({
        isClicked: !!nextProps.isClicked
      });
    }
  }

  onClick = (e: any) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      isClicked: !this.state.isClicked
    });
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  getLinkSpec = (disabled: boolean, type: LinkType, linkIcon: any, direction: ShowMoreDirections): LinkSpec => {
    switch (type) {
      case 'show-more':
        return {
          icon: <EmptyArrowButton direction={direction === 'down' ? Direction.Down : Direction.Up} />,
          activeIcon: <EmptyArrowButton direction={direction === 'down' ? Direction.Up : Direction.Down} />,
          iconPos: 'end'
        };
      case 'forward-link':
        return {
          icon: <EmptyArrowButton direction={Direction.Right} />,
          activeIcon: <EmptyArrowButton direction={Direction.Right} />,
          iconPos: 'end'
        };
      case 'backward-link':
        return {
          icon: <EmptyArrowButton direction={Direction.Left} />,
          activeIcon: <EmptyArrowButton direction={Direction.Left} />,
          iconPos: 'start'
        };
      case 'icon-link':
        return {
          // @ts-ignore
          icon: linkIcon === null ? null : linkIcon,
          // @ts-ignore
          activeIcon: linkIcon === null ? null : linkIcon,
          iconPos: 'start'
        };
      case 'icon-link-end':
        return {
          // @ts-ignore
          icon: linkIcon === null ? null : linkIcon,
          // @ts-ignore
          activeIcon: linkIcon === null ? null : linkIcon,
          iconPos: 'end'
        };
      default:
        return {
          icon: null,
          activeIcon: null,
          iconPos: undefined
        };
    }
  }

  anchorProps = (download: boolean, dataTest?: string) => {
    const allProps = download ? {
      download
    } : {};

    if (dataTest) {
      allProps['data-test'] = dataTest;
    }

    if (this.props.openInNewTab) {
      return R.mergeDeepLeft(allProps, {
        target: '_blank'
      });
    }
    return allProps;
  }

  render() {
    const {
      type = 'primary',
      icon = null,
      disabled = false,
      download = false,
      direction = 'down',
      isBold = false,
      shouldTruncateAt,
      title,
      dataTest
    } = this.props;

    const linkSpec = this.getLinkSpec(disabled, type, icon, direction);
    const hasLeftIcon = linkSpec.icon && linkSpec.iconPos === 'start';
    const hasRightIcon = linkSpec.icon && linkSpec.iconPos === 'end';

    const leftIcon = <span className="icon-span">{this.state.isClicked ? linkSpec.activeIcon : linkSpec.icon}</span>;
    const rightIcon = <span className="icon-span">{this.state.isClicked ? linkSpec.activeIcon : linkSpec.icon}</span>;
    const LinkContainer = shouldTruncateAt ? 'span' : React.Fragment;

    const link = (
      <LinkContainer>
        {
          hasLeftIcon && leftIcon
        }
        {this.props.children}
        {
          hasRightIcon && rightIcon
        }
      </LinkContainer>
    );

    return (
      <StyledLink
        title={title}
        shouldTruncateAt={shouldTruncateAt}
        isBold={isBold}
        type={type}
        href={disabled ? undefined : this.props.href}
        onClick={this.onClick}
        isUnderlined={this.props.isUnderlined}
        className={classNames('link', this.props.className, {
          disabled,
          [`icon-${linkSpec.iconPos}`]: hasLeftIcon || hasRightIcon
        })}
        {...this.anchorProps(download, dataTest)}
      >
        {
          disabled && this.props.disabledReason ?
            tooltipRenderer(this.props.disabledReason, <span>{link}</span>) :
            link
        }
      </StyledLink>
    );
  }
}

export default Link;
