import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import { Avatar } from 'antd';

import {FunctionalIconProps as IconProps} from '../icons/Icon';
import SideNavUserIcon from './SideNavUserIcon';
import SideNavLoginIcon from './SideNavLoginIcon';

const DefaultAvatarContainer = styled.span`
  .ant-avatar {
    background: transparent;
    color: inherit;
  }

  .ant-avatar-string {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    svg {
      transform: scale(1.65);
    }
  }
`;

export interface UserAvatarProps extends IconProps {
  ownerName: string; 
  ownerImgUrl?: string; 
  ownerInitials?: string; 
  isAnonymous?: boolean;
  theme?: any;
}

const UserAvatar = ({ 
  ownerName, 
  ownerImgUrl, 
  ownerInitials, 
  isAnonymous, 
  testId, 
  width = 30, 
  height = 30 ,
  theme
}: UserAvatarProps) => (
  <DefaultAvatarContainer title={ownerName} data-test={testId}>
    <Avatar src={ownerImgUrl}>
      {
        isAnonymous ?
          <SideNavLoginIcon
            height={height}
            width={width}
            fill={theme.nav.primary.color}
            secondaryColor={theme.nav.primary.background}
          /> :
          <SideNavUserIcon
            ownerInitials={ownerInitials}
            height={height}
            width={width}
            fill={theme.nav.primary.color}
            secondaryColor={theme.nav.primary.background}
          />
      }
    </Avatar>
  </DefaultAvatarContainer>
);

export default withTheme(UserAvatar);
