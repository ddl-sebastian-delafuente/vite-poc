import styled from 'styled-components';
import { Menu } from 'antd';
import { SubMenuProps } from 'antd/lib/menu/SubMenu';
import { themeHelper } from '../../../styled';

export const EXPANDED_SIDEBAR_WIDTH = 200;
export const COLLAPSED_SIDEBAR_WIDTH = 64;
export const FULL_SIDEBAR_WIDTH = 264;

const getSiderLeftOffset = (isTopLevelNav?: boolean) => isTopLevelNav ? FULL_SIDEBAR_WIDTH : EXPANDED_SIDEBAR_WIDTH;

export const SUB_SECTION_SPACING = '29px';

export type NavType = 'primary' | 'secondary';

export const Divider = styled.hr`
  display: block;
  margin: 0.5em 12px 0.5em;
  border-style: solid;
  border-width: 0.25px;
  border-color: ${themeHelper('nav.primary.color')};
`;

interface ContainerProps {
  collapsed?: boolean;
  type: NavType;
  isTopLevelNav?: boolean;
}
export const Container = styled.div<ContainerProps>`
  .ant-layout-sider {
    height: 100vh;
    width: ${({ collapsed }) => `${collapsed ? COLLAPSED_SIDEBAR_WIDTH : EXPANDED_SIDEBAR_WIDTH}px`};
    color: ${({ type }) => themeHelper(`nav.${type}.color`)};
    background: ${({ type }) => themeHelper(`nav.${type}.background`)} !important;
    transition: none;

    ul {
      background: ${({ type }) => themeHelper(`nav.${type}.background`)};
      color: ${({ type }) => themeHelper(`nav.${type}.color`)};
      border-right: none;
    }
  }

  .ant-menu.ant-menu-inline-collapsed .ant-menu-item-group-title {
    display: none;
  }

  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item, 
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item, 
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    margin: 0;
  }

  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item .ant-menu-item-icon,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item .ant-menu-item-icon,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-item-icon,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-item-icon,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item .anticon,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item .anticon,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title .anticon,
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .anticon {
    line-height: 0px;
  }

  .ant-menu-item-group-title {
    color: ${({ type }) => themeHelper(`nav.${type}.color`)};
    height: auto;
  }

  .ant-layout-sider-has-trigger {
    padding-bottom: 20px;
  }

  position: relative;
  height: 100vh;

  .ant-menu-inline li.ant-menu-item, .ant-menu-inline li.ant-menu-submenu-title {
    width: auto;
  }

  .ant-menu-inline-collapsed > .ant-menu-item {
    padding: 0 !important;
  }
  .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    padding: 0 !important;
  }

  li {
    cursor: default;
    margin: auto;
    &.ant-menu-item:active, &.ant-menu-submenu-title:active {
      background: none;
    }
    &.ant-menu-submenu.ant-menu-submenu-inline.navSubMenu .ant-menu-submenu-arrow {
      &:before, &:after {
        background: ${({ type }: { type: NavType }) => themeHelper(`nav.${type}.color`)};
        background-image: none;
      }
    }
  }

  li.ant-menu-item-selected {
    background-color: ${themeHelper('nav.secondary.menuItem.focused.background')};
    color: ${themeHelper('nav.secondary.menuItem.focused.color')};
  }

  .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
    width: 16px;
    vertical-align: middle;
  }

  /* remove the blue border in the right side */
  .ant-menu-item:after {
    border-right: 0 !important;
  }

  .ant-layout-sider-trigger {
    cursor: pointer;
    width: ${themeHelper('sizes.small')} !important;
    height: 100vh;
    position: absolute;
    text-align: center;

    .anticon {
      color: transparent;
      position: absolute;
      bottom: 50%;
      left: 0;
    }

    left: ${({ collapsed, isTopLevelNav }) =>
      `${collapsed ? COLLAPSED_SIDEBAR_WIDTH : getSiderLeftOffset(isTopLevelNav)}px`};
    background: transparent;
    z-index: 1;

    :hover {
      .anticon {
        color: black;
      }
    }
  }
`;

export const StyledSidebarContainer = styled.div`
  li a {
    color: ${({ type }: { type: NavType }) => themeHelper(`nav.${type}.menuItem.color`)};
  }

  .ant-menu-item-disabled > a {
    color: ${({ type }: { type: NavType }) => themeHelper(`nav.${type}.menuItem.disabled.color`)} !important;
  }

  .ant-menu-item-selected {
    background-color: ${({ type }: { type: NavType }) => themeHelper(`nav.${type}.menuItem.background`)} !important;
    a, &.appSwitcherClass, &hr {
      color: ${({ type }: { type: NavType }) => themeHelper(`nav.${type}.menuItem.color`)};
    }
  }

  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    color: ${({ type }: { type: NavType }) => themeHelper(`nav.${type}.menuItem.hover.color`)};
  }

  .ant-menu-item {
    padding: 0 !important;
    &.divider {
      height: 5px;
      :hover {
        color: ${({ type }: { type: NavType }) => themeHelper(`nav.${type}.menuItem.color`)};
      }
    }
  }
  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin: 0;
  }
`;

export const StyledSubMenu = styled(Menu.SubMenu)<SubMenuProps>`
  .ant-menu-sub.ant-menu-inline {
    background-color: inherit !important;
  }
  .ant-menu-item, .ant-menu-submenu-title {
    transition-property: border-color, background, padding;
    padding: 0 !important;

    .full-item {
      width: ${EXPANDED_SIDEBAR_WIDTH}px !important;
    }
  }

  .ant-menu-item .item-name {
    margin-left: 42px !important;
  }
`;
