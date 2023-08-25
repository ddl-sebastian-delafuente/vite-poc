import * as React from 'react';
import { Layout, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import styled, { withTheme } from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';

const StyledSider = styled(Layout.Sider)`
  li {
    cursor: default;
  }

  .ant-menu-item, .collapsed-item, .full-item {
    :hover, &.selected {
      color: ${themeHelper('nav.primary.switcher.hover.color')};
      background-color: ${themeHelper('table.row.hover.background')} !important;
    }
  }

  .ant-menu-item-selected, .ant-menu-item-active {
    background: ${themeHelper('table.row.hover.background')};
  }
`;

export type ViewProps = {
  selectedKey?: string;
  items?: ItemType[];
  theme?: any;
};

const WIDTH = 250;

const PrimaryContainer = styled.div`
  .ant-menu-item:hover, .selected {
    cursor: pointer;
    background-color: ${themeHelper('nav.primary.switcher.hover.background')};
    color: ${themeHelper('nav.primary.switcher.hover.color')};
  }

  li.ant-menu-item {
    margin: 0;
    padding: 0;
    color: ${themeHelper('mainFontColor')};
  }

  .ant-menu-vertical .ant-menu-item:not(:last-child) {
    margin-bottom:0;
    color: ${themeHelper('mainFontColor')};
  }
  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom:0;
    color: ${themeHelper('mainFontColor')};
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color:${themeHelper('nav.primary.switcher.hover.background')};
    font-weight: ${themeHelper('nav.primary.switcher.hover.fontWeight')};
    color: ${themeHelper('nav.primary.switcher.hover.color')};
  }

  a {
    color: inherit;

    &:hover, .selected {
      cursor: pointer;
      background-color: ${themeHelper('nav.primary.switcher.hover.background')};
      color: ${themeHelper('nav.primary.switcher.hover.color')} !important;

      span {
        color: ${themeHelper('nav.primary.switcher.hover.color')} !important;
      }
    }
  }
`;

const PopoverNavigation: React.FC<ViewProps> = ({ selectedKey, items }) => {
  return (
    <PrimaryContainer>
      <StyledSider
        width={WIDTH}
        style={{ background: 'transparent', height: '100%' }}
      >
        <Menu
          selectedKeys={selectedKey ? [selectedKey] : undefined}
          mode="vertical"
          style={{ width: WIDTH, height: '100%' }}
          items={items}
        />
      </StyledSider>
    </PrimaryContainer>
  );
};

export default withTheme(PopoverNavigation);
