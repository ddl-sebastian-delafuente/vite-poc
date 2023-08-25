import * as React from 'react';
import { propEq, join, pipe, append, prepend, ifElse, always, prop, is, map, omit, cond, T } from 'ramda';
import styled from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';
import { Link } from 'react-router-dom';
import {
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings
} from '@domino/api/dist/types';
import { NavType } from './utils/styled';
import { getLink, LinkTarget, Route } from '../routes';
import { Tooltip } from 'antd';
import { isNucleusApp } from '../../core/environment';

const getStyleForNavType = (subSelector: string) =>
// @ts-ignore
  (props: any) => themeHelper(pipe(prop('type'), prepend('nav.'), append(subSelector), join(''))(props))(props);

const doIfType = (type: string) =>
  (action: (props: any) => any) => ifElse(pipe(propEq('type', type)), action, always(''));

const doIfSelected = (action: (props: any) => any, defaultValue:
  (props: any) => any = () => 'inherit') => ifElse(prop('selected'), action, defaultValue);

interface StyledContainerProps extends ViewProps {
  collapsed?: boolean;
}
const StyledContainer = styled.div<StyledContainerProps>`
  width: ${({ collapsed }) => collapsed ? 'auto' : '100%'};
  height: ${themeHelper('nav.menuItem.height')};

  i {
    margin: auto !important;
  }
  a, a:hover, a:active, a:focus {
    width: 100%;
    cursor: inherit;
    color: inherit;
    text-decoration: none;
  }
`;

const Icon = styled.span`
  && {
    display: inline-flex;
  }
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  svg {
    overflow: visible;
  }
`;

interface FullItemProps {
  selected?: boolean;
}
const FullItem = styled.div<FullItemProps>`
  display: flex;
  align-items: center;
  border-radius: inherit;
  height: ${themeHelper('nav.menuItem.height')};
  width: 100%;
  padding: 0 ${themeHelper('margins.large')};

  .icon-item {
    margin-right: 12px;
  }
  .item-name {
    line-height: normal;
  }
`;

const CollapsedItem = styled.div<ViewProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  height: ${themeHelper('nav.menuItem.height')};
  width: ${themeHelper('nav.menuItem.collapsed.width')};
  ${doIfType('primary')(doIfSelected(always(`
    width: 100%;
    border-radius: 0px;
  `)))}
`;

const SubMenuTitle = styled.div`
  font-weight: ${themeHelper('fontWeights.medium')};
  font-size: ${themeHelper('fontSizes.tiny')};
  line-height: 14px;
  letter-spacing: 1px;
`;

export interface ViewPropsBase {
  href?: string;
  children?: React.ReactNode;
  icon?: JSX.Element;
  target?: LinkTarget;
  tooltipLabel?: string;
  collapsed?: boolean;
  selected?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  linkDataTest?: string;
  tooltipId?: string;
}

export type ViewProps = ViewPropsBase & { type: NavType };

export const CollapseElement: React.FC<ViewProps> = ({ type, icon, selected = false }) => (
  <CollapsedItem type={type} className={`collapsed-item ${selected ? 'selected' : ''}`} selected={selected} >
    <Icon>{icon}</Icon>
  </CollapsedItem>
);

const FullElement: React.FC<ViewProps> = ({
  icon, selected = false, children
}) => (
  <FullItem
    className={`full-item ${selected ? 'selected' : ''}`}
    selected={selected}
  >
    {icon &&
      <Icon className="icon-item">
        {icon}
      </Icon>
    }
    <div className="item-name">
      {children}
    </div>
  </FullItem>
);

const Element: React.FC<ViewProps> = (props) =>
  props.collapsed ? <CollapseElement {...props} /> : <FullElement {...props} />;

const CollapsedDiv = styled.div`
  width: 100%;
  box-sizing: border-box;
  position: relative !important;
`;

// Generate data-test attribute value for nav bar item
const generateDataTest = (props: ViewProps) => {
  let key = 'Home';
  if (is(String, props.children)) {
    key = props.linkDataTest ? props.linkDataTest : (props.children || '').toString().replace(/ /g, '_');
  }

  return `nav_${key}`;
};

export const NavItem: React.FC<ViewProps> = props => {
  const { onClick, href } = props;
  let { target } = props;

  // Because play template doesn't support react router links.
  if (isNucleusApp() && target === LinkTarget.NONE) {
    target = LinkTarget.SELF;
  }
  const linkProps = target !== LinkTarget.NONE ? { target, href } : {};
  linkProps['data-test'] = generateDataTest(props);

  const item = (
    <StyledContainer {...omit(['target', 'href'], props)}>
      {
        cond([
          [() => !!href && target === LinkTarget.NONE, () => (
            <Link onClick={onClick} to={href || ''} {...linkProps}>
              <Element {...props} />
            </Link>
          )],
          [() => !!href, () => (
            <a onClick={onClick} {...linkProps}>
              <Element {...props} />
            </a>
          )],
          [T, () => <Element onClick={onClick} {...props} />]
        ])()
      }
    </StyledContainer>
  );
  return (
    props.tooltipLabel && props.collapsed ? (
      <Tooltip
        placement="right"
        title={props.tooltipLabel}
        arrowPointAtCenter={true}
        overlayStyle={{zIndex: 1300}}
        id={props.tooltipId}
      >
        <CollapsedDiv aria-describedby={props.tooltipId}>
          {item}
        </CollapsedDiv>
      </Tooltip>
    ) : item
  );
};

export type HelperViewProps = ViewPropsBase & { type?: NavType };
interface ClickableNavItemProps {
  opacity?: number;
}
export const ClickableNavItem = styled(NavItem)<ClickableNavItemProps>`
  a {
    transition-property: border-color, background, padding;
  }
  .collapsed-item, .full-item {
    :hover {
      cursor: pointer;
      background-color: ${doIfSelected(
        getStyleForNavType('.menuItem.focused.hover.background'),
        getStyleForNavType('.menuItem.hover.background')
      )};
      color: ${doIfSelected(
        getStyleForNavType('.menuItem.focused.hover.color'),
        getStyleForNavType('.menuItem.hover.color')
      )};
      span {
        color: ${doIfSelected(
          getStyleForNavType('.menuItem.focused.hover.color'),
          getStyleForNavType('.menuItem.hover.color')
        )};
      }
    }
    background-color: ${doIfSelected(getStyleForNavType('.menuItem.focused.background'))};
    color: ${doIfSelected(getStyleForNavType('.menuItem.focused.color'), getStyleForNavType('.menuItem.color'))};
    border-radius: 5px 0 0 5px;
    position: relative;
    opacity: ${({ opacity }) => opacity ? opacity : 1};
    span {
      color: ${doIfSelected(getStyleForNavType('.menuItem.focused.color'))};
    }

    ${doIfType('secondary')(always(`
      width: auto;
      height: auto;
      padding: 6px 8px;
      margin: 0 4px;
      border-radius: 4px;
    `))}

    ${doIfType('primary')(always('width: auto;'))}
  }
` as any;

interface MenuItemsProps {
  key?: number | string;
  children?: React.ReactNode;
}
const MenuItems: React.FC<MenuItemsProps> = props => <div key={props.key}>{props.children}</div>;

export const MenuItemsWrap = styled(MenuItems)`
  & > div {
    margin-bottom: 4px;
  }
  & > div:last-child {
    margin-bottom: 0;
  }
` as any;

export const ClickablePrimaryItem: React.FC<HelperViewProps> = props =>
  <ClickableNavItem type="primary" {...props} />;

export interface HelperProps {
  theme?: any;
  collapsed: boolean;
  selectedKey?: string;
  linkParams?: string[];
  whiteLabelSettings?: WhiteLabelSettings;
  isLoggedOutPage?: boolean;
  dmmLink?: string | undefined;
}

export type Element = undefined | [string, Route] | [string, Route, React.ReactNode] |
  [string, Route, undefined, boolean];
type FilteredElement = [string, Route] | [string, Route, React.ReactNode] | [string, Route, undefined, boolean];
export type ItemDOMType = 'MenuItem' | 'NavItem' | 'MenuItemWithSubNav';
const featureDisabledToolTipLabel = 'This feature is disabled for you. Click to know more';

export const generateNavItemsAsMenuItems = (
  type: NavType, itemDOMType: ItemDOMType, routes: Element[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { collapsed, selectedKey, linkParams = [], ...rest }: HelperProps, onClick?: () => void
) => map(([routeKey, route, customElement]) => {
  if (customElement) { return { key: routeKey, label: customElement } }

  const displayItem = (
    <ClickableNavItem
      key={routeKey}
      type={type}
      collapsed={collapsed}
      selected={selectedKey === routeKey}
      {...getLink(route, ...linkParams)}
      tooltipLabel={(route.isActive !== undefined && !route.isActive)
        ? featureDisabledToolTipLabel : route.displayName}
      onClick={onClick}
      data-test={routeKey}
      opacity={(route.isActive !== undefined && !route.isActive) ? 0.4 : undefined}
      linkDataTest={route.dataTest}
      {...(route.dataDenyDataAnalyst ? { 'data-deny-data-analyst': true } : {})}
    >
      {route.displayName}
    </ClickableNavItem>
  );
  return { key: routeKey, label: displayItem };
})(routes.filter(x => !!x) as FilteredElement[]);

export const generateGroupNavItems = (
  key: string,
  title: React.ReactNode,
  type: NavType,
  itemDOMType: ItemDOMType,
  routes: Element[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { collapsed, selectedKey, linkParams = [], ...rest }: HelperProps) => {

  const menuItems = map(([routeKey, route, customElement]) => {
    if (customElement) { return { key: routeKey, label: customElement } }
    const displayItem = (
      <ClickableNavItem
        key={routeKey}
        type={type}
        collapsed={collapsed}
        selected={selectedKey === routeKey}
        {...getLink(route, ...linkParams)}
        tooltipLabel={(route.isActive !== undefined && !route.isActive)
          ? featureDisabledToolTipLabel : route.displayName}
        data-test={routeKey}
        opacity={(route.isActive !== undefined && !route.isActive) ? 0.4 : undefined}
      >
        {route.displayName}
      </ClickableNavItem>
    );
    return { key: routeKey, label: displayItem };
  })(routes.filter(x => !!x) as FilteredElement[]);

  return {
    key,
    label: !collapsed ? <SubMenuTitle >{title}</SubMenuTitle> : null,
    type: 'group',
    children: menuItems
  }
};
