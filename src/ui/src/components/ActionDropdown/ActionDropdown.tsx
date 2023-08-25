import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Dropdown } from 'antd';
import { Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';
import { ExtendedButtonProps } from '../Button/Button';
import { themeHelper } from '../../styled/themeUtils';
import InvisibleButton from '../InvisibleButton';

export type placementType =
  'bottomLeft' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter' | 'bottomRight' | undefined;

interface CaretContainerProps {
  showMargin?: boolean;
}
const CaretContainer = styled.div<CaretContainerProps>`
  ${props => props.showMargin ? `margin-left: ${themeHelper('margins.tiny')(props)};` : ''};
`;

interface LabelProps {
  hasIcon: boolean;
  fontSize?: string;
}
const LabelContainer = styled.div<LabelProps>`
  display: inline-block;
  font-size: ${({ fontSize }) => fontSize};
  ${props => props.hasIcon ? `margin-left: ${themeHelper('margins.tiny')(props)};` : ''}
`;

const StyledDownOutlined = styled(DownOutlined)`
  &&&.anticon svg {
    width: auto;
    height: auto;
  }
`;

const defaultCaretIcon = <StyledDownOutlined style={{fontSize: '10px'}}/>;

// This stops the click event that opens the dropdown from triggering event handlers on
// containing elements i.e. in the datasets/Overview table
const stopEventPropagation = (event: React.MouseEvent<any>) => event.stopPropagation();

export interface ActionDropdownProps {
  /**
   * should the dropdown click prevent the onclick event. default value is set true.
   */
  preventClickPropagation?: boolean;

  buttonProps?: ExtendedButtonProps;
  /**
   * triggered whenever the visibility of dropdown changes.
   */
  onVisibleChange?: (visibility: boolean) => any;
  /**
   * used to set the current dropdown's state, whether it should expand or collapse.
   */
  expandDropdown?: boolean;
  /**
   * used for adding a DOM identifier for running integration tests
   */
  dataTest?: string;
  /**
   * icon in place of default caret icon
   */
  caretIcon?: any;
  /**
   * icon to be displayed on the dropdown
   */
  icon?: any;
  /**
   * class for dropdown
   */
  className?: string;
  label?: any;
  /**
   * should show the default caret icon
   */
  showCaret?: boolean;
  /**
   * items or actions to be displayed on dropdown expansion
   */
  menuItems: MenuItemsPropType[];
  /**
   * action to be taken on click on any menu item
   */
  onMenuClick?: any;
  width?: string;
  fontSize?: string;
  dropdownStyle?: {};
  menuStyle?: any;
  closeOnClick?: boolean; // Closes the dropdown on click of menuitem
  /**
   * whether dropdown is active for user actions or not
   */
  disabled?: boolean;
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  /**
   * dropdown placement w.r.t dropdown trigger button
   */
  placement?: placementType;

  /**
   * a component to render a custom dropdown toggle button
   */

  CustomTrigger?: React.FunctionComponent<{
    onClick?: () => void;
    'data-test'?: string;
  }>;

  menuTestKey?: string;
  destroyPopupOnHide?: boolean;
}

export interface ActionDropdownState {
  /**
   * state variable to keep track of whether the dropdown is expanded or collapsed
   */
  expandDropdown?: boolean;
}

export interface MenuItemsPropType {
  disabled?: boolean;
  key: string | number;
  content: any;
  dataTest?: string;
}

export class ActionDropdown extends React.PureComponent<ActionDropdownProps, ActionDropdownState> {

  /**
   * default props
   */
  public static defaultProps = {
    preventClickPropagation: true,
    width: '100%',
    fontSize: '14px',
    dropdownStyle: {},
    onMenuClick: () => { return; },
    closeOnClick: true,
    disabled: false,
    caretIcon: defaultCaretIcon,
  };

  /**
   * Initial state
   */
  constructor(props: any) {
    super(props);
    this.state = {
      expandDropdown: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: ActionDropdownProps) {
    if (!R.equals(this.props.expandDropdown, nextProps.expandDropdown) && nextProps.expandDropdown !== undefined) {
      this.setState({
        expandDropdown: nextProps.expandDropdown
      });
    }
  }

  setDropdownVisibility = (visibility: boolean) => {
    this.setState({
      expandDropdown: visibility,
    }, () => {
      if (this.props.onVisibleChange) {
        this.props.onVisibleChange(visibility);
      }
    });
  }

  onMenuClick = (item: MenuInfo) => {
    if (this.props.closeOnClick) {
      this.setDropdownVisibility(false);
    }
    this.props.onMenuClick(item);
  }

  getMenu = () => {
    const { menuStyle, menuItems, menuTestKey } = this.props;
    return (
      <Menu
        onClick={this.onMenuClick}
        style={menuStyle}
        data-test={menuTestKey}
        items={menuItems.map((menuItem: MenuItemsPropType) => ({
          disabled: menuItem.disabled,
          key: menuItem.key,
          'data-test': menuItem.dataTest,
          label: menuItem.content
        }))}
      />
    );
  }

  render() {
    const {
      CustomTrigger = InvisibleButton,
      buttonProps = {},
      caretIcon,
      className,
      dataTest,
      disabled,
      dropdownStyle,
      fontSize,
      getPopupContainer = (trigger: { parentNode: any; }) => trigger.parentNode,
      icon,
      label,
      preventClickPropagation,
      showCaret,
      width,
      destroyPopupOnHide
    } = this.props;

    return (
      <Dropdown
        placement={this.props.placement || 'bottomLeft'}
        getPopupContainer={getPopupContainer}
        className={className}
        overlay={this.getMenu()}
        trigger={['click']}
        visible={this.state.expandDropdown}
        onVisibleChange={this.setDropdownVisibility}
        disabled={disabled}
        destroyPopupOnHide={destroyPopupOnHide}
      >
        <CustomTrigger
          // @ts-ignore
          onClick={preventClickPropagation && stopEventPropagation}
          {...buttonProps}
          style={{ width: width, ...dropdownStyle }}
          data-test={dataTest}
          disabled={disabled}
        >
          {icon}
          {label && (
            <LabelContainer
              fontSize={fontSize}
              hasIcon={!!icon}
            >
              {label}
            </LabelContainer>
          )}
          {showCaret && (
            <CaretContainer showMargin={!!label || !!icon}>
              {caretIcon}
            </CaretContainer>
          )}
        </CustomTrigger>
      </Dropdown>
    );
  }
}

export default ActionDropdown;
