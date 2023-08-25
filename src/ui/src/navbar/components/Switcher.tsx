import { useAccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import { mergeWithKey, equals } from 'ramda';
import * as React from 'react';
import styled from 'styled-components';
import { Popover } from '../../components';
import { ClickablePrimaryItem, generateNavItemsAsMenuItems } from './NavItem';
import getIcon, { IconType } from './utils/getNavIcon';
import PopoverNavigation from './PopoverNavigation';
import { routes } from '../routes';
import { Flags } from '../types';
import InvisibleButton from '../../components/InvisibleButton';
import { themeHelper } from '../../styled';

export type ViewProps = {
  collapsed: boolean;
  selectedKey?: string;
  flags: Flags
  isSwitchToPopoverVisible: boolean;
  onSwitchToPopoverVisibilityChange: (isVisible: boolean) => void;
};

const AppSwitcherIcon = styled.div`
  width: 100%;
  svg {
    margin-top: 3px;
  }
  li.ant-menu-item {
    height: 32px;
    padding-left: 0;
  }
  button[ant-click-animating-without-extra-node]:after {
    border: 0 none;
    opacity: 0;
    animation:none 0 ease 0 1 normal;
  }
`;
const StyledInvisibleButton = styled(InvisibleButton)`
  && {
    color: ${themeHelper('nav.primary.color')};
    width: 100%;
    padding: 0;
  }
`;

const DEFAULT_SWITCHER_TEXT = 'Switch To';

const mergeControlCenterRoute = (key: string, left: any, right: any) => key === 'path' ? right : left;

const Component = ({
  collapsed,
  selectedKey,
  flags,
  isSwitchToPopoverVisible,
  onSwitchToPopoverVisibilityChange,
  ...rest
}: ViewProps) => {
  const accessControl = useAccessControl();
  const canUseControlCenter = accessControl.hasAccess() && (flags.showComputeInControlCenter || flags.showDSLFeatures);

  return (
    <Popover
      placement="right"
      title="Switch To"
      {...(equals(isSwitchToPopoverVisible, false) ? { visible: isSwitchToPopoverVisible } : {})}
      onVisibleChange={onSwitchToPopoverVisibilityChange}
      content={(
        <PopoverNavigation
          selectedKey={selectedKey}
          items={
            generateNavItemsAsMenuItems('primary',
              'NavItem',
              [
                ['LAB', routes.LAB],
                ['LAUNCHPAD', routes.LAUNCHPAD],
                canUseControlCenter ?
                  ['CONTROL_CENTER', flags.showComputeInControlCenter ?
                    mergeWithKey(mergeControlCenterRoute, routes.CONTROL_CENTER,
                      routes.CONTROL_CENTER.children.COMPUTE_PORTFOLIO) : routes.CONTROL_CENTER] : undefined
              ],
              Object.assign({
                collapsed: false,
                selectedKey
              }, { ...rest }),
              () => onSwitchToPopoverVisibilityChange(false)
            )
          }
        />
      )}
      trigger="click"
      overlayClassName="appSwitcherPopover"
      overlayStyle={{ zIndex: 1350 }}
    >
      <AppSwitcherIcon data-test="switcher-menu">
        <StyledInvisibleButton aria-label="switch to">
          <ClickablePrimaryItem
            collapsed={collapsed}
            icon={getIcon(IconType.Switcher)}
            tooltipLabel={DEFAULT_SWITCHER_TEXT}
            linkDataTest={`${selectedKey}-menu-item`}
          >
            {selectedKey && routes[selectedKey] ? routes[selectedKey].displayName : DEFAULT_SWITCHER_TEXT}
          </ClickablePrimaryItem>
        </StyledInvisibleButton>
      </AppSwitcherIcon>
    </Popover>
  );
}

export default Component;
