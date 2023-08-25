import * as React from 'react';
import { assoc, cond, isEmpty, isNil, T } from 'ramda';
import { ButtonProps as AntButtonProps } from 'antd/lib/button';
// eslint-disable-next-line no-restricted-imports
import { Button as AntButton } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import styled, { css } from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';
import { EXTRA_LARGE, LARGE } from '../../styled/sizes';
import { SMALL } from '../../styled/fontSizes';
import { NORMAL } from '../../styled/fontWeights';
import { UnionToMap } from '../../utils/typescriptUtils';
import ActionDropdown, { ActionDropdownProps, placementType } from '../ActionDropdown';
import classNames from 'classnames';
import tooltipRenderer, { TooltipProps } from '../renderers/TooltipRenderer';

interface CustomIconContainerProps {
  hasLabel: boolean;
}
const CustomIconContainer = styled.div<CustomIconContainerProps>`
  display: inline-flex;
  ${props => props.hasLabel ? `margin-right: ${themeHelper('margins.tiny')(props)};` : ''}
`;

export type componentType =
  'primary' | 'small' | 'secondary' | 'tertiary' | 'split' | 'btn-with-icon' | 'icon' | 'ant-icon' | 'icon-small' | 'link';
export const componentType: UnionToMap<componentType> = {
  'ant-icon': 'ant-icon',
  'btn-with-icon': 'btn-with-icon',
  'icon-small': 'icon-small',
  icon: 'icon',
  link: 'link',
  primary: 'primary',
  secondary: 'secondary',
  small: 'small',
  split: 'split',
  tertiary: 'tertiary'
}

export interface ButtonProps {
  /**
   * Override button sizing
   */
  small?: boolean;

  /**
   * Additional CSS class to apply to the component
   */
  className?: string;
  /**
   * Button variants.
   */
  btnType?: keyof typeof componentType;
  /**
   * Content to be displayed on button click. May be any component or a list for dropdown.
   */
  content?: any;
  /**
   * Button is allowed to be clicked or not.
   */
  disabled?: boolean;
  /**
   * Indicates whether this button performs some destructive operation that demands extra attention.
   */
  isDanger?: boolean;
  /**
   * Indicates whether this button is icon only.
   */
  isIconOnlyButton?: boolean;
  /**
   * Configure the icon only button size.
   */
  iconOnlyButtonSize?: number;
  /**
   * Configure the icon only button color.
   */
  iconOnlyButtonColor?: string;
  /**
   * Indicates whether this button performs some successful operation that demands extra attention.
   */
  isSuccess?: boolean;
  /**
   * A list of actions for dropdown list.
   */
  actions?: any;
  /**
   * A component to be displayed when button is clicked.
   */
  menuContent?: any;
  /**
   * Triggers the event when button is clicked.
   */
  onClick?: (e?: any) => void;
  /**
   * Triggers the event when dropdown item is selected.
   */
  onMenuClick?: (e?: any) => void;
  /**
   * data-test for split button split content
   */
  dropdownDataTest?: string;

  /**
   * Allows proper placement of custom icons in the button component. Will be overriden by the `icon` prop if provided.
   */
  customIcon?: React.ReactNode;
  /**
   * custom placement for dropdown of split button
   */
  dropdownPlacement?: placementType;
  /**
   * data-test attribute for the open modal button
   */
  testId?: string;
  children?: React.ReactNode;
}

export interface ButtonState {
  /**
   * To keep track of when button is clicked and then show appropriate content.
   */
  isClicked: boolean;
  /**
   * dropdown is visible or not
   */
  expandDropdown: boolean;
}

export type ExtendedButtonProps = ButtonProps & AntButtonProps;

type ComponentSpecType = 'primary' | 'secondary' | 'link' | 'tertiary';

interface ComponentSpec {
  small?: boolean;
  btnIcon?: any;
  Container: any;
  type: ComponentSpecType;
}

const BORDER_WIDTH = '1px';
const SMALL_ICON_SIZE = 10;
const SMALL_ICON_BTN_SIZE = 20;
const ICON_SIZE = 14;
const ANT_ICON_SIZE = 16;
const ICON_BUTTON_SIZE = 32;
const ButtonGroup = AntButton.Group;

export type themeType = {
  type: 'primary' | 'secondary' | 'tertiary';
  isClicked: boolean;
  expandDropdown: boolean;
  small: boolean;
  isDanger: boolean;
  iconOnlyButtonSize: number;
  iconOnlyButtonColor: number;
  isSuccess: boolean;
  disabled?: boolean;
};

// renders anchor tag when href is passed as prop to Button component
const ButtonContainer = styled.div<themeType>`
  display: inline-flex;
  width: fit-content;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'normal'};

  .ant-btn-group {
    display: flex;
    pointer-events: ${({ disabled }) => disabled ? 'none' : 'all'};
    button {
      pointer-events: auto;
    }

    .ant-btn, .ant-btn-lg, .ant-btn-sm {
      border-radius: ${themeHelper('borderRadius.standard')};
    }
  }

  .ant-btn > .anticon {
    line-height: 0;
  }

  .ant-btn.ant-dropdown-trigger {
    padding: 0 8px;
    svg {
      margin: auto;
    }
  }
  .ant-btn {
    display: flex;
    padding: ${({ small }) => small ? '4px 12px' : '0px 16px'};
    align-items: center;
    text-align: center;
    line-height: normal;
    height: ${({ small }) => small ? LARGE : EXTRA_LARGE};
    border-width: ${BORDER_WIDTH};
    font-size: ${SMALL};
    font-weight: ${NORMAL};
    background: ${({ isClicked, type }) =>
    isClicked ? themeHelper(`button.${type}.active.background`) : themeHelper(`button.${type}.container.background`)};
    color: ${({ isClicked, type }) =>
    isClicked ? themeHelper(`button.${type}.active.color`) : themeHelper(`button.${type}.container.color`)} ;
    border-color: ${({ isClicked, type }) => isClicked ? themeHelper(`button.${type}.active.borderColor`)
    : themeHelper(`button.${type}.container.borderColor`)};
    .anticon {
      color: ${({ isClicked, type }) =>
    isClicked ? themeHelper(`button.${type}.active.color`) : themeHelper(`button.${type}.container.color`)};
      svg {
        width: ${ICON_SIZE}px;
        height: ${ICON_SIZE}px;
      }
    }
    &:hover {
      border-color: ${({ isClicked, type }) =>
    isClicked ? themeHelper(`button.${type}.active.borderColor`) : themeHelper(`button.${type}.hover.borderColor`)};
      background: ${({ isClicked, type }) =>
    isClicked ? themeHelper(`button.${type}.active.background`) : themeHelper(`button.${type}.hover.background`)};
      color: ${({ isClicked, type }) =>
    isClicked ? themeHelper(`button.${type}.active.color`) : themeHelper(`button.${type}.hover.color`)};
      .anticon {
        color: ${({ isClicked, type }) =>
    isClicked ? themeHelper(`button.${type}.active.color`) : themeHelper(`button.${type}.hover.color`)};
      }
    }
  }
  .ant-btn-group {
    height: ${({ small }) => small ? LARGE : EXTRA_LARGE};
    border-width: ${BORDER_WIDTH};
    font-size: ${SMALL};
    font-weight: ${NORMAL};

    .ant-dropdown-trigger {
      background: ${({ expandDropdown, type }) => !expandDropdown ? themeHelper(`button.${type}.container.background`) :
    themeHelper(`button.${type}.active.background`)};
      color: ${({ expandDropdown, type }) => !expandDropdown ? themeHelper(`button.${type}.container.color`) :
    themeHelper(`button.${type}.active.color`)};
      border-color: ${({ expandDropdown, type }) =>
    !expandDropdown ? themeHelper(`button.${type}.container.borderColor`)
      : themeHelper(`button.${type}.active.borderColor`)};
      .anticon {
        color: ${({ expandDropdown, type }) =>
    !expandDropdown ? themeHelper(`button.${type}.container.color`) : themeHelper(`button.${type}.active.color`)};
      }

    &:hover, &:hover:active, &:hover:focus {
      border-color: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.borderColor`)
    : themeHelper(`button.${type}.hover.borderColor`)};
      background: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.background`) :
    themeHelper(`button.${type}.hover.background`)};
      color: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.color`) :
    themeHelper(`button.${type}.hover.color`)};
      .anticon {
        color: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.color`) :
    themeHelper(`button.${type}.container.color`)};
      }
    }

    &:focus, &:active {
      border-color: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.borderColor`) :
    themeHelper(`button.${type}.container.borderColor`)};
      background: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.background`) :
    themeHelper(`button.${type}.container.background`)};
      color: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.color`) :
    themeHelper(`button.${type}.container.color`)};
      .anticon {
        color: ${({ expandDropdown, type }) => expandDropdown ? themeHelper(`button.${type}.active.color`) :
    themeHelper(`button.${type}.container.color`)};
      }
    }

    &[disabled] {
      background: ${({ type }) => themeHelper(`button.${type}.disabled.container.background`)};
      border-color: ${({ type }) => themeHelper(`button.${type}.disabled.container.borderColor`)};
      color: ${({ type }) => themeHelper(`button.${type}.disabled.container.color`)};
      path {
        fill: currentColor;
      }
    }
  }
  button[disabled], .ant-btn-disabled {
    background: ${({ type }) => themeHelper(`button.${type}.disabled.container.background`)};
    color: ${({ type }) => themeHelper(`button.${type}.disabled.container.color`)} ;
    border-color: ${({ type }) => themeHelper(`button.${type}.disabled.container.borderColor`)};
    opacity: 1;
    pointer-events: none;
    .anticon {
      color: ${({ type }) => themeHelper(`button.${type}.disabled.container.color`)};
    }
  }
}
`;

const DangerComponentContainer = styled(ButtonContainer)`
  .ant-btn {
    background: ${({ type }) => themeHelper(`button.danger.${type}.container.background`)};
    color: ${({ type }) => themeHelper(`button.danger.${type}.container.color`)};
    border-color: ${({ type }) => themeHelper(`button.danger.${type}.container.borderColor`)};

    &:hover, &:active, &:focus {
      border-color: ${({ type }) => themeHelper(`button.danger.${type}.active.borderColor`)};
      background: ${({ type }) => themeHelper(`button.danger.${type}.active.background`)};
      color: ${({ type }) => themeHelper(`button.danger.${type}.active.color`)};
    }
    .anticon {
      color: ${({ type }) => themeHelper(`button.danger.${type}.container.color`)};
    }
    &:hover .anticon {
      color: ${({ type }) => themeHelper(`button.danger.${type}.active.color`)};
    }
  }
`;

const SuccessComponentContainer = styled(ButtonContainer)`
  .ant-btn {
    background: ${({ type }) => themeHelper(`button.success.${type}.container.background`)};
    color: ${({ type }) => themeHelper(`button.success.${type}.container.color`)};
    border-color: ${({ type }) => themeHelper(`button.success.${type}.container.borderColor`)};

    &:hover, &:active, &:focus {
      border-color: ${({ type }) => themeHelper(`button.success.${type}.active.borderColor`)};
      background: ${({ type }) => themeHelper(`button.success.${type}.active.background`)};
      color: ${({ type }) => themeHelper(`button.success.${type}.active.color`)};
    }
    .anticon {
      color: ${({ type }) => themeHelper(`button.success.${type}.container.color`)};
    }
    &:hover .anticon {
      color: ${({ type }) => themeHelper(`button.success.${type}.active.color`)};
    }
  }
`;

const accessibleIconButtonContainer = css<themeType>`
  .ant-btn {
    justify-content: center;
    padding: 0;
    width: ${props => props.iconOnlyButtonSize}px;
    height: ${props => props.iconOnlyButtonSize}px;
    border-color: ${props => props.iconOnlyButtonColor};
    
    .anticon svg {
      width: ${ANT_ICON_SIZE}px;
      height: ${ANT_ICON_SIZE}px;
    }
  }
  .ant-btn:hover {
    border-color: ${props => props.iconOnlyButtonColor};
  }
`;

const borderOnHover = css`
  .ant-btn:not(:hover):not(:active):not(:focus) {
    border-color: transparent;
  }
`;

const noBoxShadow = css`
  .ant-btn {
    box-shadow: none;
  }
`;

const DangerAccessibleIconButtonContainer = styled(DangerComponentContainer)`
  ${accessibleIconButtonContainer}
`;

const DangerAccessibleIconButtonContainerWithoutBorder = styled(DangerComponentContainer)`
  ${accessibleIconButtonContainer}
  ${borderOnHover}
`;

const DefaultAccessibleIconButtonContainer = styled(ButtonContainer)`
  ${accessibleIconButtonContainer}
`;

const DefaultAccessibleIconButtonContainerWithoutBorder = styled(ButtonContainer)`
  ${accessibleIconButtonContainer}
  ${borderOnHover}
`;

const iconBtnStyle = () => `
  .ant-btn {
    padding: 0;
    justify-content: center;
  }
`;

const DangerIconButton = styled(DangerComponentContainer)`
  ${iconBtnStyle}

  .ant-btn {
    width: ${ICON_BUTTON_SIZE}px;
  }
`;

const DangerAntIconButton = styled(DangerIconButton)`
  .ant-btn .anticon svg {
    width: ${ANT_ICON_SIZE}px;
    height: ${ANT_ICON_SIZE}px;
  }
`;

const SuccessIconButton = styled(SuccessComponentContainer)`
  ${iconBtnStyle}

  .ant-btn {
    width: ${ICON_BUTTON_SIZE}px;
  }
`;

const SuccessAntIconButton = styled(SuccessIconButton)`
  .ant-btn .anticon svg {
    width: ${ANT_ICON_SIZE}px;
    height: ${ANT_ICON_SIZE}px;
  }
`;

const ButtonWithIcon = styled(ButtonContainer)`
  .ant-btn {
    span {
      margin-left: 8px;
      line-height: 16px;
    }
  }
`;

const SplitButton = styled(ButtonContainer)`
  .ant-btn {
    span {
      margin-top: -1px;
    }
    i {
      margin-top: 1px;
    }
  }

  .ant-btn-group:not(:hover) {
    .ant-btn:first-child {
      &:after {
        content: "";
        position: absolute;
        right: 0;
        z-index: 100;
        top: 7px;
        width: 1px;
        height: 16px;
        background: ${themeHelper('button.splitButton.splitBorder.color')};
      }
    }
    button[disabled].ant-btn:first-child {
      &:after {
        background: ${({ type }) => themeHelper(`button.${type}.disabled.container.color`)};
      }
    }
  }
`;

const IconButton = styled(ButtonContainer)`
  ${iconBtnStyle}

  .ant-btn {
    align-items: center;
    width: ${ICON_BUTTON_SIZE}px;
    height: ${ICON_BUTTON_SIZE}px;
  }
`;

const AntIconButton = styled(IconButton)`
  .ant-btn .anticon svg {
    width: ${ANT_ICON_SIZE}px;
    height: ${ANT_ICON_SIZE}px;
  }
`;

const SmallIconButton = styled(ButtonContainer)`
  ${iconBtnStyle}

  .ant-btn-group .ant-btn.ant-btn-icon-only {
    justify-content: center;
    align-items: center;
    padding: 0 4px;
    border-radius: ${themeHelper('borderRadius.standard')};
  }
  .ant-btn {
    height: ${SMALL_ICON_BTN_SIZE}px;
    width: ${SMALL_ICON_BTN_SIZE}px;

    .anticon svg {
      width: ${SMALL_ICON_SIZE}px;
      height: ${SMALL_ICON_SIZE}px;
    }
  }
`;

const BtnActionDropdown = styled(ActionDropdown) <ActionDropdownProps>`
  .btn-actions {
    left: 0px;
  }
`;

const LinkButton = styled(ButtonContainer)`
  ${borderOnHover}
`;

const TertiaryButton = styled(ButtonContainer)`
  ${noBoxShadow}
`;

const getComponentSpec = (type: componentType, btnIcon: any, isDanger: boolean, isSuccess: boolean, isIconOnlyButton: boolean): ComponentSpec => {
  if (isIconOnlyButton) {
    if (type === 'primary' || type === 'secondary' || type === 'tertiary') {
      return {
        small: false,
        type,
        Container: isDanger ? DangerAccessibleIconButtonContainer : DefaultAccessibleIconButtonContainer,
      };
    }

    return {
      small: false,
      type: 'link',
      Container: isDanger ? DangerAccessibleIconButtonContainerWithoutBorder : DefaultAccessibleIconButtonContainerWithoutBorder,
    }
  }
  switch (type) {
    case 'primary':
      return {
        small: false,
        type: 'primary',
        Container: isDanger ? DangerComponentContainer : isSuccess ? SuccessComponentContainer : ButtonContainer
      };
    case 'secondary':
      return {
        small: false,
        type: 'secondary',
        // @ts-ignore
        btnIcon: isEmpty(btnIcon) || isNil(btnIcon) ? null : btnIcon,
        Container: isDanger ? DangerComponentContainer : isSuccess ? SuccessComponentContainer : ButtonContainer
      };
    case 'tertiary':
      return {
        small: false,
        type: 'tertiary',
        // @ts-ignore
        btnIcon: isEmpty(btnIcon) || isNil(btnIcon) ? null : btnIcon,
        Container: isDanger ? DangerComponentContainer : TertiaryButton
      };
    case 'split':
      return {
        small: false,
        type: 'primary',
        btnIcon: <CaretDownOutlined />,
        Container: SplitButton
      };
    case 'btn-with-icon':
      return {
        small: false,
        type: 'primary',
        // @ts-ignore
        btnIcon: isEmpty(btnIcon) || isNil(btnIcon) ? null : btnIcon,
        Container: ButtonWithIcon
      };
    case 'icon':
      return {
        small: false,
        type: 'secondary',
        // @ts-ignore
        btnIcon: isEmpty(btnIcon) || isNil(btnIcon) ? null : btnIcon,
        Container: isDanger ? DangerIconButton : isSuccess ? SuccessIconButton : IconButton
      };
    case 'ant-icon':
      return {
        small: false,
        type: 'secondary',
        btnIcon,
        Container: isDanger ? DangerAntIconButton : isSuccess ? SuccessAntIconButton : AntIconButton
      };
    case 'small':
      return {
        small: true,
        type: 'primary',
        Container: ButtonContainer
      };
    case 'icon-small':
      return {
        small: true,
        type: 'secondary',
        Container: SmallIconButton
      };
    case 'link':
      return {
        small: false,
        type: 'link',
        Container: LinkButton
      };
    default:
      return {
        small: false,
        type: 'primary',
        Container: ButtonContainer
      };
  }
};
class Button extends React.PureComponent<ExtendedButtonProps & TooltipProps, ButtonState> {
  constructor(props: ExtendedButtonProps) {
    super(props as ExtendedButtonProps);
    this.state = {
      expandDropdown: false,
      isClicked: false,
    };
  }

  onMenuClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      expandDropdown: false,
    });
    if (this.props.onMenuClick) {
      this.props.onMenuClick(e);
    }
  }

  // eslint-disable-next-line
  onMouseDown = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      isClicked: !this.state.isClicked
    });
  }

  onMouseUp = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
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

  getActions = (actions: any, dataTest?: string, dropdownPlacement?: string) => {
    return (
      <BtnActionDropdown
        placement={(dropdownPlacement || 'bottomCenter') as placementType}
        className="btn-actions"
        menuItems={actions}
        icon={<CaretDownOutlined />}
        getPopupContainer={(trigger: { parentNode: any; }) => trigger.parentNode}
        disabled={this.props.disabled}
        onMenuClick={this.onMenuClick}
        onVisibleChange={(visibility: boolean) => this.setState({ isClicked: false, expandDropdown: visibility })}
        expandDropdown={this.state.expandDropdown}
        dataTest={dataTest}
      />);
  }

  getMenuContent = (icon: any, rest: any, disabled?: boolean, dataTest?: string) => {
    return (
      <AntButton
        // @ts-ignore
        icon={icon}
        disabled={disabled}
        data-test={dataTest}
        {...rest}
      />);
  }

  render() {
    const {
      btnType = 'primary',
      icon = null,
      children,
      disabled = false,
      menuContent = null,
      actions = null,
      isDanger = false,
      isIconOnlyButton = false,
      iconOnlyButtonSize = ICON_BUTTON_SIZE,
      iconOnlyButtonColor,
      isSuccess = false,
      dropdownDataTest,
      className,
      customIcon,
      // eslint-disable-next-line
      onClick,
      testId,
      tooltipContent,
      placement,
      mouseEnterDelay,
      mouseLeaveDelay,
      ...rest
    } = this.props;

    const { Container, type, small, btnIcon } = getComponentSpec(btnType, icon, isDanger, isSuccess, isIconOnlyButton);

    const content = menuContent && this.getMenuContent(icon || btnIcon, rest, disabled, dropdownDataTest)
      || actions && this.getActions(actions, dropdownDataTest, this.props.dropdownPlacement) || null;

    const iconComponent = btnType === 'split' ? null : icon || btnIcon;

    const otherProps = testId ? assoc('data-test', testId, rest) : rest;

    return (
      <>
        {
          tooltipRenderer(
            tooltipContent,
            <Container
              disabled={disabled}
              type={type}
              isClicked={this.state.isClicked}
              expandDropdown={this.state.expandDropdown}
              className={classNames('button', className)}
              small={!isNil(this.props.small) ? this.props.small : small}
              iconOnlyButtonSize={iconOnlyButtonSize}
              iconOnlyButtonColor={iconOnlyButtonColor}
            >
              <ButtonGroup>
                <AntButton
                  aria-label={
                    cond([
                      [() => typeof this.props['aria-label'] === 'string', () => this.props['aria-label']],
                      [() => !isEmpty(tooltipContent), () => tooltipContent],
                      [() => typeof children === 'string', () => children],
                      [T, () => undefined]
                    ])()
                  }
                  // isIconOnlyButton uses the ant 4 icons
                  // TODO The legacy code needs to be refactored
                  // @ts-ignore
                  icon={isIconOnlyButton ? icon : icon || iconComponent}
                  // @ts-ignore
                  disabled={disabled}
                  onMouseDown={this.onMouseDown}
                  onMouseUp={this.onMouseUp}
                  className={classNames('domino-button', className)}
                  {...otherProps}
                >
                  {customIcon && !iconComponent && (
                    <CustomIconContainer hasLabel={!!children}>{customIcon}</CustomIconContainer>
                  )}
                  {isIconOnlyButton ? null : children}
                </AntButton>
                {
                  btnType === 'split' && content
                }
              </ButtonGroup>
              {this.state.isClicked && menuContent}
            </Container>,
            placement,
            mouseEnterDelay,
            mouseLeaveDelay)
        }
      </>
    );
  }
}

export default Button;
