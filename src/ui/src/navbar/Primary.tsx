import { QuestionCircleFilled, ToolFilled } from '@ant-design/icons';
import { hasUserNotifications } from '@domino/api/dist/Users';
import {
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings,
  DominoCommonUserPerson
} from '@domino/api/dist/types';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import { useAccessControl, AccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import ExternalLink from '@domino/ui/dist/icons/ExternalLink';
import { Layout, Menu } from 'antd';
import * as React from 'react';
import * as R from 'ramda';
import { ifElse, merge, omit, toPairs } from 'ramda';
import styled, { withTheme, keyframes, CSSProperties } from 'styled-components';
import { kebabCase } from 'lodash';

import NotificationsIcon from '../icons/NotificationsIcon';
import Feedback from '../icons/Feedback';
import { mixpanel } from '../mixpanel';
import { themeHelper, colors, fontSizes } from '../styled';
import {
  ClickablePrimaryItem,
  Element,
  generateNavItemsAsMenuItems,
  NavItem
} from './components/NavItem';
import Switcher from './components/Switcher';
import {
  COLLAPSED_SIDEBAR_WIDTH,
  FULL_SIDEBAR_WIDTH,
  Container,
  StyledSidebarContainer
} from './components/utils/styled';
import UserPopover from './components/UserPopover';
import getAppLogo from './components/utils/getAppLogo';
import getIcon from './components/utils/getNavIcon';
import { Flags } from './types';
import {
  LinkTarget,
  Routes,
  getLink,
  routes,
} from './routes';
import { env } from '../components/HelpLink';
import FeedbackModal from '../components/FeedbackModal';
import useStore from '../globalStore/useStore';

export type OuterProps = {
  showToggle: boolean;
} & ViewProps;

export type ViewProps = {
  collapsed: boolean;
  selectedKeyPath: string[];
  username?: string;
  theme?: any;
  toggleCollapsed: () => void;
  toggleExpandSearch: () => void;
  flags: Flags;
  whiteLabelSettings?: WhiteLabelSettings;
  isLoggedOutPage?: boolean;
  isSwitchToPopoverVisible: boolean;
  onSwitchToPopoverVisibilityChange: (isVisible: boolean) => void;
  currentUser?: DominoCommonUserPerson;
  dmmLink?: string | undefined;
  // this flag allows storybook to turn off mixpanel
  isMixpanelOff?: boolean;
};

const RingContainer = styled.div`
  position: relative;
`

interface PriorityProps {
  priority: string
}

const Circle = styled.div<PriorityProps>`
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.priority == 'Critical' ? colors.cabaret : colors.white};
  border-radius: 50%;
  position: absolute;
  top: -3px;
  left: -3px;
`

const pulsate = keyframes`
  0% {transform: scale(0.1, 0.1); opacity: 0.0;}
  50% {opacity: 1.0;}
  100% {transform: scale(1.2, 1.2); opacity: 0.0;}
`

const Ringring = styled.div<PriorityProps>`
  border: 3px solid ${(props) => props.priority == 'Critical' ? colors.cabaret : colors.white};
  border-radius: 30px;
  width: 25px;
  height: 25px;
  position: absolute;
  top: -8px;
  left: -8px;
  animation: ${pulsate} 1s ease-out;
  animation-iteration-count: infinite;
  opacity: 0.0;
`
const VersionText = styled.div`
  margin-left: 60px;
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const VersionTextCollapsed = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  text-align: center;
`;

const LogoMenuItemStyle = { cursor: 'pointer', marginTop: 12 }

export type MenuItemProps = {
  href?: string;
  target?: LinkTarget;
  displayName: string;
  collapsed: boolean;
  icon?: JSX.Element
};

export const AdminMenuItem = ({ href, target, collapsed, displayName, ...rest }: MenuItemProps) => (
  <Menu.Item {...R.omit(['icon'], rest)} data-test={`admin-menu-item-${kebabCase(displayName)}`}>
    <ClickablePrimaryItem
      href={href}
      target={target}
      collapsed={collapsed}
      icon={<ToolFilled style={{ fontSize: fontSizes.MEDIUM }} />}
      tooltipLabel={displayName}
    >
      {displayName}
    </ClickablePrimaryItem>
  </Menu.Item>
);


export const DMMMenuItem = ({ href, target, collapsed, displayName, icon, ...rest }: MenuItemProps) => (
  <Menu.Item {...rest}>
    <ClickablePrimaryItem
      href={href}
      target={target}
      collapsed={collapsed}
      icon={icon}
      tooltipLabel={displayName}
      data-test="dmm"
    >
      <FlexLayout>
        <div>{displayName}</div>
        <ExternalLink height={10} width={10} />
      </FlexLayout>
    </ClickablePrimaryItem>
  </Menu.Item>
);

const getLaunchpadItems = (flags: Flags, accessControl: AccessControl): Element[] => {
  if (!routes.LAUNCHPAD.children) {
    throw Error('Invalid State: LAB.children cannot be empty');
  }
  return [
    ['APPS', routes.LAUNCHPAD.children.APPS],
    accessControl.hasAccess() ? ['MODELS', flags.enableModelAPIs ?
      routes.LAUNCHPAD.children.MODELS : merge(routes.LAUNCHPAD.children.MODELS, { isActive: false })] : undefined
  ];
};

const getLabItems = (flags: Flags, accessControl: AccessControl): Element[] => {
  if (!routes.LAB.children) {
    throw Error('Invalid State: LAB.children cannot be empty');
  }
  const omitKeys = ['ACCOUNT_SETTINGS', 'DOWNLOAD_CLI', 'OVERVIEW'];

  if (!flags.showTagsNavItem || !accessControl.hasAccess()) {
    omitKeys.push('TAGS');
  }

  if (!flags.showV1DataProjects) {
    omitKeys.push('DATA');
  }

  if (!flags.enableModelRegistry) {
    omitKeys.push('MODEL_REGISTRY')
  }

  const updateLabItems = ifElse(
    () => (Boolean(flags.enableModelAPIs)),
    R.identity, R.assoc('MODELS', merge(routes.LAB.children.MODELS, { isActive: false })));

  return toPairs(omit(omitKeys, updateLabItems(routes.LAB.children)) as Routes);
};

const getProjectPortfolioItems = (flags: Flags): Element[] => {
  if (!routes.CONTROL_CENTER.children) {
    throw Error('Invalid State: CONTROL_CENTER.children cannot be empty');
  }
  return [
    flags.showComputeInControlCenter ?
      [
        'COMPUTE_PORTFOLIO',
        routes.CONTROL_CENTER.children.COMPUTE_PORTFOLIO,
      ] : undefined,
    flags.showDSLFeatures ?
      [
        'PROJECTS_PORTFOLIO',
        routes.CONTROL_CENTER.children.PROJECTS_PORTFOLIO,
      ] : undefined,
    flags.showDSLFeatures ?
      [
        'ASSETS_PORTFOLIO',
        routes.CONTROL_CENTER.children.ASSETS_PORTFOLIO,
      ] : undefined
  ];
};

const getMainItems = ({
  selectedKeyPath,
  flags,
  ...rest
}: ViewProps) => {
  const [switcherSelectedKey, primarySelectedKey] = selectedKeyPath;
  const navItemProps = R.omit(['isSwitchToPopoverVisible', 'onSwitchToPopoverVisibilityChange', 'currentUser'], rest);
  const accessControl = useAccessControl();
  const getDividerMenuItem = (blockName: string) => ({
    key: `divider-${blockName}`,
    type: 'divider',
    style: {
      display: 'block',
      margin: '0.5em 12px 0.5em',
      borderStyle: 'solid',
      borderWidth: '0.25px',
      borderColor: themeHelper('nav.primary.color')(rest)
    }
  });

  switch (switcherSelectedKey) {
    case 'LAB':
      return [
        getDividerMenuItem('lab'),
        ...(generateNavItemsAsMenuItems('primary', 'MenuItem', getLabItems(flags, accessControl), {
          selectedKey: primarySelectedKey,
          ...navItemProps
        }))
      ];
    case 'LAUNCHPAD':
      return [
        getDividerMenuItem('launchpad'),
        ...(generateNavItemsAsMenuItems('primary', 'MenuItem', getLaunchpadItems(flags, accessControl), {
          selectedKey: primarySelectedKey,
          ...navItemProps
        }))
      ];
    case 'CONTROL_CENTER':
      return [
        getDividerMenuItem('control-center'),
        ...(generateNavItemsAsMenuItems('primary', 'MenuItem', getProjectPortfolioItems(flags), {
          selectedKey: primarySelectedKey,
          ...navItemProps
        }))
      ];
    default:
      return [];
  }
};

const Component = (props: OuterProps) => {
  const {
    showToggle,
    username,
    collapsed,
    toggleCollapsed,
    selectedKeyPath,
    toggleExpandSearch,
    flags,
    whiteLabelSettings,
    isLoggedOutPage,
    isSwitchToPopoverVisible,
    onSwitchToPopoverVisibilityChange,
    currentUser,
    dmmLink
  } = props;

  const fill = themeHelper('nav.primary.logoColor.light')(props);
  const logoNavSpec = routes.LAB.children ? routes.LAB.children.OVERVIEW : routes.LAB;
  const adminNavSpec = routes.ADMIN;
  const helpNavSpec = whiteLabelSettings ? {
    displayName: 'Help',
    path: () => whiteLabelSettings.helpContentUrl,
    target: LinkTarget.BLANK,
  } : routes.HELP;
  const notificationsNavSpec = routes.NOTIFICATIONS;
  const searchNavSpec = routes.SEARCH;
  const dmmNavSpec = routes.DMM;
  const isLoading = !whiteLabelSettings;
  const appLogo = whiteLabelSettings && whiteLabelSettings.appLogo;
  const isTopLevelNav = selectedKeyPath.length <= 2;

  const [showNotificationsBadge, setShowNotificationsBadge] = React.useState(false)
  const [notificationsBadgePriority, setNotificationsBadgePriority] = React.useState('')

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const { formattedFrontendConfig } = useStore();
  const isFeedbackConfigured = formattedFrontendConfig?.feedbackSendingConfigured;

  function updateShowNotificationBadge() {
    // @ts-ignore
    timerRef.current = setTimeout(updateShowNotificationBadge, 30000);

    hasUserNotifications({})
      .then(res => {
        if (res.unread !== undefined) {
          setShowNotificationsBadge(res.unread)
          setNotificationsBadgePriority(res.priority ? res.priority : '')
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  React.useEffect(() => {
    if (flags.showUserNotifications) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      updateShowNotificationBadge()
    }
    return function cleanup() {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flags.showUserNotifications])

  const dividerMenuItem = {
    key: 'divider-switcher',
    type: 'divider',
    style: {
      display: 'block',
      margin: '0.5em 12px 0.5em',
      borderStyle: 'solid',
      borderWidth: '0.25px',
      borderColor: themeHelper('nav.primary.color')(props)
    }
  };

  const items = [
    {
      key: 'logo',
      label: <NavItem
        {...getLink(logoNavSpec)}
        type="primary"
        icon={(getAppLogo(appLogo, fill, 25, isLoading))}
        collapsed={collapsed}
      ><span style={{ color: themeHelper('nav.primary.menuItem.focused.color')(props) }}>
          {whiteLabelSettings && whiteLabelSettings.appName}
        </span>
      </NavItem>,
      style: LogoMenuItemStyle
    },
    {
      key: 'search',
      label: <ClickablePrimaryItem
        collapsed={collapsed}
        icon={searchNavSpec.iconType && getIcon(searchNavSpec.iconType, { height: 16, width: 16 })}
        tooltipLabel={searchNavSpec.displayName}
        onClick={toggleExpandSearch}
      >
        {searchNavSpec.displayName}
      </ClickablePrimaryItem>,

    },
    {
      key: 'switcher',
      label: <Switcher
        selectedKey={selectedKeyPath[0]}
        collapsed={collapsed}
        flags={flags}
        isSwitchToPopoverVisible={isSwitchToPopoverVisible}
        onSwitchToPopoverVisibilityChange={onSwitchToPopoverVisibilityChange}
      />
    },
    ...getMainItems(props),
    ...(dmmLink ? [
      dividerMenuItem,
      {
        key: 'dmm',
        label: <DMMMenuItem
          {...getLink(dmmNavSpec)}
          data-deny-data-analyst={true}
          icon={getIcon(dmmNavSpec.iconType, { height: 16, width: 16 })}
          displayName={dmmNavSpec.displayName}
          collapsed={collapsed}
        />
      }
    ] : []),
    {
      key: 'bottom-menu',
      type: 'group',
      mode: 'inline',
      style: {
        position: 'absolute',
        bottom: 0,
        width: collapsed ? '64px' : '100%'
      } as CSSProperties,
      children: [
        ...((flags.enableFeedbackModal && !!isFeedbackConfigured && !!currentUser) ? [{
          key: 'feedback',
          label:
            <FeedbackModal openButtonLabel={
              <ClickablePrimaryItem
                collapsed={collapsed}
                icon={<Feedback primaryColor='currentColor'/>}
                tooltipLabel="Feedback"
              >
                Feedback
              </ClickablePrimaryItem>
            } 
            userEmail={currentUser.email}
            />
          
        }]:[]),
        ...(flags.showAdminMenu ? [{
          key: 'admin',
          label: <AdminMenuItem
            {...getLink(adminNavSpec)}
            displayName={adminNavSpec.displayName}
            collapsed={collapsed}
          />
        }] : []),
        ...(flags.showUserNotifications ? [
          {
            key: 'notifications',
            label: <ClickablePrimaryItem
              {...getLink(notificationsNavSpec)}
              collapsed={collapsed}
              icon={<>
                {
                  showNotificationsBadge &&
                  <RingContainer>
                    <Ringring priority={notificationsBadgePriority}></Ringring>
                    <Circle priority={notificationsBadgePriority}></Circle>
                  </RingContainer>
                }
                <NotificationsIcon />
              </>}
              tooltipLabel={notificationsNavSpec.displayName}
            >
              {notificationsNavSpec.displayName}
            </ClickablePrimaryItem>
          }] : []),
        {
          key: 'help',
          label: <ClickablePrimaryItem
            {...getLink(helpNavSpec)}
            collapsed={collapsed}
            icon={<QuestionCircleFilled />}
            tooltipLabel={helpNavSpec.displayName}
          >
            {helpNavSpec.displayName}
          </ClickablePrimaryItem>
        },
        {
          key: 'userpopover',
          label: <UserPopover
            username={username}
            hideDownloadCLI={(!R.isNil(whiteLabelSettings))
              && whiteLabelSettings!.hideDownloadDominoCli}
            collapsed={collapsed}
            isLoggedOutPage={isLoggedOutPage}
            currentUser={currentUser}
          />
        },
        ...(((!R.isNil(whiteLabelSettings) && R.equals(whiteLabelSettings!.appName, 'Domino')) || R.isNil(whiteLabelSettings)) ?
          !props.collapsed ? [{
            key: 'version',
            label: <VersionText>Domino version {env.REACT_APP_DEPLOYMENT_VERSION}</VersionText>,
          }] :
            [
              {
                key: 'version',
                label: <VersionTextCollapsed>v{env.REACT_APP_DEPLOYMENT_VERSION}</VersionTextCollapsed>,
              }
            ] :
          [])
      ]
    }
  ];

  return (
    <StyledSidebarContainer type="primary" collapsed={collapsed}>
      <Container type="primary" collapsed={collapsed} isTopLevelNav={isTopLevelNav}>
        <Layout.Sider
          style={{ background: 'transparent' }}
          collapsible={true}
          onCollapse={toggleCollapsed}
          collapsed={collapsed}
          trigger={showToggle ? '' : null}
          collapsedWidth={COLLAPSED_SIDEBAR_WIDTH}
          width={FULL_SIDEBAR_WIDTH}
        >
          <Menu
            mode="inline"
            style={{ width: collapsed ? COLLAPSED_SIDEBAR_WIDTH : FULL_SIDEBAR_WIDTH }}
            items={items}
          />
        </Layout.Sider>
      </Container>
    </StyledSidebarContainer>
  );
};

const PrimaryContainer = (props: OuterProps) => {

  React.useEffect(() => {
    const { isMixpanelOff, whiteLabelSettings } = props;
    if (!isMixpanelOff) {
      mixpanel.init();
      mixpanel.trackLink(`[href=${routes.LAB.path()}]`, 'Click Primary Navigation', { link: 'Logo' });
      mixpanel.trackLink(`[href=${!R.isNil(whiteLabelSettings) && whiteLabelSettings.helpContentUrl}]`,
        'Click Primary Navigation', { link: 'Help' });
      mixpanel.trackLink(`[href=${routes.ADMIN.path()}]`, 'Click Primary Navigation', { link: 'Admin' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Component
      {...props}
    />
  );
};

export default withTheme(PrimaryContainer);
