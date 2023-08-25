import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import { MoreOutlined } from '@ant-design/icons';
import ActionDropdown from '../ActionDropdown';
import InvisibleButton from '../../InvisibleButton';
import { fontSizes } from '@domino/ui/dist/styled';

const StyledInvisibleButton = styled(InvisibleButton)`
  .ant-btn {
    padding: 0;
  }
`;

type ActionSettingProps = {
  name: string;
  disabled?: boolean;
  enabledTooltip?: string;
  disabledTooltip?: string;
}

type ItemLevelActionsButtonWrapperProps = {
  actions: ActionSettingProps[];
}

export const defaultActions = {
  actions: [
    {
      name: 'Action 1',
      disabled: false,
      enabledTooltip: 'Action 1 is enabled',
      disabledTooltip: 'Action 1 is disabled',
    },
    {
      name: 'Action 2',
      disabled: true,
      enabledTooltip: 'Action 2 is enabled',
      disabledTooltip: 'Action 2 is disabled',
    },
  ]
};

export const ItemLevelActionsButtonWrapper: React.FC<ItemLevelActionsButtonWrapperProps> = (
  {
    actions = [],
  }
) => {
  const menuItems = useMemo(() => actions.map(({name, disabled, disabledTooltip, enabledTooltip}) => ({
      key: name,
      content: (
        <Tooltip title={disabled ? disabledTooltip : enabledTooltip}>
          <span>
            <StyledInvisibleButton disabled={disabled}>{name}</StyledInvisibleButton>
          </span>
        </Tooltip>
      ),
    })), [actions]);
  return (
    <ActionDropdown
      menuItems={menuItems}
      icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />}
    />
  );
};
