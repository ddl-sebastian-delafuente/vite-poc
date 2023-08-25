import * as React from 'react';
import {
  contains,
  map
} from 'ramda';
import { Menu } from 'antd';
import { Popover } from '../../components';
import {
  ClickableNavItem,
  generateNavItemsAsMenuItems
} from '../components/NavItem';
import getIcon from '../components/utils/getNavIcon';
import {
  StyledSubMenu
} from '../components/utils/styled';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project
} from '@domino/api/dist/types';
import PopoverNavigation from '../components/PopoverNavigation';
import { getLink, Route, routes } from '../routes';
import { Flags } from '../types';

export type ViewProps = {
  collapsed?: boolean;
  selectedKey?: string;
  project: Project;
  flags: Flags
};

// @ts-ignore
const PROJECTS_PUBLISH = routes.LAB.children.PROJECTS.children.PUBLISH;
const PROJECTS_PUBLISH_CHILDREN = PROJECTS_PUBLISH.children || {};

const getPublishItems = (project: Project, flags: Flags): [string, Route][] =>
  [
    contains('BrowseReadFiles', project.allowedOperations) ?
      ['PUBLISHER', PROJECTS_PUBLISH_CHILDREN.PUBLISHER] : undefined,
    contains('BrowseReadFiles', project.allowedOperations) ?
      ['MODELS_API', PROJECTS_PUBLISH_CHILDREN.MODELS_API] : undefined,
    contains('RunLauncher', project.allowedOperations) ?
      ['LAUNCHERS', PROJECTS_PUBLISH_CHILDREN.LAUNCHERS] : undefined,
    contains('BrowseReadFiles', project.allowedOperations) && flags.showEndpointSpend ?
      ['API_ENDPOINT', PROJECTS_PUBLISH_CHILDREN.API_ENDPOINT] : undefined // Obsolete
  ].filter(x => !!x) as [string, Route][];

const PublishPopover = (props: ViewProps) => {
  const { project, flags, selectedKey } = props;
  return (
    <Popover
      placement="right"
      title="Publish"
      content={(
        <PopoverNavigation
          selectedKey={selectedKey}
          items={generateNavItemsAsMenuItems(
            'secondary',
            'NavItem',
            getPublishItems(project, flags),
            { selectedKey, collapsed: false, linkParams: [project.owner.userName, project.name] }
          )}
        />
      )}
      trigger="click"
      overlayClassName="appSwitcherPopover"
      overlayStyle={{ zIndex: 1200 }}
    >
      <ClickableNavItem
        type="secondary"
        collapsed={true}
        tooltipLabel="Publish"
        icon={PROJECTS_PUBLISH.iconType && getIcon(PROJECTS_PUBLISH.iconType)}
      />
    </Popover>
  );
};

const Component = (props: ViewProps) => {
  const { flags, collapsed, selectedKey, project, ...rest } = props;

  return (
    collapsed ?
      <PublishPopover flags={flags} project={project} selectedKey={selectedKey} {...rest} /> :
      (
        <StyledSubMenu
          title={
            <ClickableNavItem
              type="secondary"
              collapsed={collapsed}
              icon={PROJECTS_PUBLISH.iconType && getIcon(PROJECTS_PUBLISH.iconType)}
            >
              {PROJECTS_PUBLISH.displayName}
            </ClickableNavItem>
          }
          className="navSubMenu"
          {...rest}
        >
          {
            map(([routeKey, route]) => (
              <Menu.Item key={routeKey}>
                <ClickableNavItem
                  type="secondary"
                  collapsed={collapsed}
                  selected={selectedKey === routeKey}
                  {...getLink(route, project.owner.userName, project.name)}
                  tooltipLabel={route.displayName}
                >
                  {route.displayName}
                </ClickableNavItem>
              </Menu.Item>
            ), getPublishItems(project, flags))
          }
        </StyledSubMenu>
      )
  );
};

export default Component;
