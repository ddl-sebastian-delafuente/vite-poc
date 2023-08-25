import * as React from 'react';
import styled from 'styled-components';
import { Popover } from '../../components';
import { ClickableNavItem, generateNavItemsAsMenuItems } from './NavItem';
import PopoverNavigation from './PopoverNavigation';
import { routes } from '../routes';
import Avatar from '../../icons/UserAvatar';
import { themeHelper } from '../../styled/themeUtils';
import classNames from 'classnames';
import { DominoCommonUserPerson } from '@domino/api/dist/types';
import InvisibleButton from '@domino/ui/dist/components/InvisibleButton';

export type ViewProps = {
  username?: string;
  collapsed: boolean;
  selectedKey?: string;
  hideDownloadCLI?: boolean;
  isLoggedOutPage?: boolean;
  currentUser?: DominoCommonUserPerson;
};

export type ViewState = {
  ownerInitials: string;
  isAnonymous: boolean;
};

const Wrapper = styled.div`
  svg {
    margin-bottom: 7px;
  }

  cursor: pointer;
  color: ${themeHelper('nav.primary.color')};

  .full-item .icon-item {
    padding: 0;
  }

  &.open .full-item span {
    right: 5px;
  }

  .full-item:hover {
    background-color: none;
  }

  .ant-avatar-string {
    transform: scale(0.6) translateX(-50%) !important;
  }
`;
const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    width: 100%;
    padding: 0;
  }
  && {
    color: ${themeHelper('nav.primary.color')};
  }
`;

class Component extends React.Component<ViewProps, ViewState> {
  constructor(props: ViewProps) {
    super(props);
    this.state = {
      ownerInitials: '',
      isAnonymous: true
    };
  }
  updateBadge() {
    if (!this.props.isLoggedOutPage) {
      const { currentUser: user } = this.props;
      if (!!user && !this.state.ownerInitials) {
        const { firstName, lastName } = user;
        const ownerInitials = (firstName.substring(0, 1) + lastName.substring(0, 1)).toUpperCase();
        this.setState({ ownerInitials, isAnonymous: false });
      }
    }
  }
  componentDidUpdate() {
    this.updateBadge();
  }
  componentDidMount() {
    this.updateBadge();
  }
  render() {
    const { username, collapsed, selectedKey, hideDownloadCLI, ...rest } = this.props;
    const { ownerInitials, isAnonymous } = this.state;
    const navProps: Array<any> = [
      ['OVERVIEW', routes.LAB.children.OVERVIEW],
      ['ACCOUNT_SETTINGS', routes.LAB.children.ACCOUNT_SETTINGS],
      hideDownloadCLI ? undefined : ['DOWNLOAD_CLI', routes.LAB.children.DOWNLOAD_CLI],
      ['LOGOUT', routes.LOGOUT]
    ];
    return (
      <React.Fragment>
        {isAnonymous ?
          <Wrapper className={classNames('open', !collapsed)}>
            <ClickableNavItem
              type="primary"
              collapsed={collapsed}
              icon={<Avatar isAnonymous={isAnonymous} ownerName={'Login'}/>}
              href={routes.LOGOUT.path()}
            >
              {'Login'}
            </ClickableNavItem>
          </Wrapper>
        :
        <Popover
          key="appSwitcherKey"
          placement="rightBottom"
          title={username ? username : 'Account'}
          content={(
            <PopoverNavigation
              selectedKey={selectedKey}
              items={generateNavItemsAsMenuItems(
                'primary',
                'MenuItem',
                navProps,
                Object.assign({ collapsed: false, selectedKey }, rest)
              )}
            />
          )}
          trigger="click"
          overlayClassName="appSwitcherPopover"
          overlayStyle={{ zIndex: 1200 }}
        >
          <Wrapper className={classNames('open', !collapsed)}>
            <StyledInvisibleButton type="text" aria-label="Account Information">
              <ClickableNavItem
                type="primary"
                collapsed={collapsed}
                icon={
                  <Avatar
                    isAnonymous={isAnonymous}
                    ownerName={username ? username : 'Anonymous User'}
                    ownerInitials={ownerInitials}
                  />
                }
                tooltipLabel="Account Info"
                tooltipId="accountInfo"
              >
                {username}
              </ClickableNavItem>
            </StyledInvisibleButton>
          </Wrapper>
        </Popover>

      }
      </React.Fragment>
    );
  }
}

export default Component;
