import * as React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Tabs } from 'antd';
import { TabPaneProps, TabsProps } from 'antd/lib/tabs';

export const TabPane = (props: TabPaneProps) => <Tabs.TabPane {...props} />;

const DominoTabs = styled(Tabs)`
 .ant-tabs-nav-container {
    height: 45px; /* this forces the tabs to have this height. solves a css bug in quick action form */
 }

 .ant-tabs-nav {
  font-weight: normal;

  .ant-tabs-tab {
    padding: 12px 0px;
  }

  .ant-tabs-tab-active {
    font-weight: normal;
    color: ${props =>
      props.theme.tabs && props.theme.tabs.tabpane ?
      props.theme.tabs.tabpane.active.color :
      'inherit'
    };
  }

  .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
    background: ${props =>
      props.theme.tabs && props.theme.tabs.tabpane ?
      props.theme.tabs.tabpane.active.underlineColor :
      'inherit'
    };
  }

 }
`;

const DominoTabsComponent = (props: TabsProps) => <DominoTabs {...props} />;

export default DominoTabsComponent;
