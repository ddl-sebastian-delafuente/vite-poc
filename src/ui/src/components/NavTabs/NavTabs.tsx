import * as React from 'react';
import { TabsProps } from 'antd/lib/tabs';
import * as R from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Tabs, TabPaneProps } from 'antd';
import Icon from '@ant-design/icons';
import styled from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';
import {
  lightishBlue,
  white
} from '../../styled/colors';
import Radio from '@domino/ui/dist/components/Radio';

const { TabPane } = Tabs;

const Badge = styled.span`
  border-radius: 8px;
  color: ${white};
  background-color: ${lightishBlue};
  font-family: ${themeHelper('fontFamily')};
  font-size: 10px;
  padding: 2px 7px;
  margin-left: 8px;
  bottom: 2px;
  position: relative;
`;

const TabSpan = styled.span`
  font-family: ${themeHelper('fontFamily')};
  padding: 0px;
`;

const DominoLineTabs = styled(Tabs)`
  &&.ant-tabs-small > .ant-tabs-nav .ant-tabs-nav-list  {
    height: 23px;
    margin-bottom: 1px;
    padding-right: 60px;
    .ant-tabs-tab {
      &:first-child {
        margin-left: 0px;
        padding-left: 0px;
      }
      &:hover {
        color: ${themeHelper('tabs.tabpane.active.color')};
        .badge {
          background: ${themeHelper('tabs.tabpane.active.underlineColor')};
        }
      }
    }
  }
  &&.ant-tabs-small > .ant-tabs-nav .ant-tabs-nav-list   {
    .ant-tabs-tab {
      padding: 0;
      margin: 0 ${themeHelper('margins.medium')} ${themeHelper('margins.tiny')};
      cursor: pointer;
      span {
        margin-right: 0px;
      }
      color: ${themeHelper('tabs.tabpane.inactive.color')};
    }
    .ant-tabs-tab-active {
      font-weight: normal;
      color: ${themeHelper('tabs.tabpane.active.color')};
    }
    .ant-tabs-ink-bar {
      background: ${themeHelper('tabs.tabpane.active.underlineColor')};
    }
    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${themeHelper('tabs.tabpane.active.color')};
    }
    .ant-tabs-tab-active:hover {
      &:after {
        background: ${themeHelper('tabs.tabpane.active.color')};
      }
    }
  }
  &&.ant-tabs-small > .ant-tabs-nav::before {
    border-bottom: 1px solid ${themeHelper('tabs.tabpane.inactive.underlineColor')};
    padding-bottom: 2px;
  }
  &&.ant-tabs-small > .ant-tabs-nav .ant-tabs-nav-list  {
    .ant-tabs-tab:first-child {
      margin-left: 0;
    }
    .ant-tabs-tab:last-child {
      margin-right: 0;
    }
  }
  &&.ant-tabs-small > .ant-tabs-nav .ant-tabs-nav-list:not(.ant-tabs-tab-active) {
    color: ${themeHelper('tabs.tabpane.inactive.color')};
  }
  &&.ant-tabs-small > .ant-tabs-nav {
    line-height: 1;
  }
  &&.ant-tabs-small > .ant-tabs-nav .ant-tabs-nav-list  .ant-tabs-tab-active:after {
    transform: translate3d(0, 10px, 0);
    height: 3px;
    border-radius: 1.35px;
    bottom: 0;
  }
  &&.ant-tabs-small > .ant-tabs-nav .ant-tabs-content {
    line-height: 1;
  }
`;
// @ts-ignore
const StyleIcon = styled(Icon)`
  font-size: 16px;
  margin-right: 8px;
  width: 18px;
  height: 18px;
  position: relative;
  top: 1px;
`;

const RadioContainer = styled.div`
  padding-bottom: 14px;
`;

export type componentType = 'primary' | 'extraAction' | 'badge' | 'secondary' | undefined;

export interface SecondaryNavProps {
  /**
   * Name of the Tabs
   */
  tabs: string[];
  /**
   * Keys to be used for Tabs
   */
  keys: string[];
  /**
   * Contents in each Tab
   */
  contents: JSX.Element[];
  /**
   * Initial active TabPane's key, if activeKey is not set.
   */
  defaultActiveKey?: string;

}

export interface NavTabsProps extends TabsProps {
  /**
   * Tab variants
   */
  tabType?: componentType;
  /**
   * DropDown button to have different versions of contents
   */
  extraActionButton?: React.ReactNode;
  /**
   * Initial active TabPane's key, if activeKey is not set.
   */
  defaultActiveKey?: string;
}

export interface NavTabPaneProps extends TabPaneProps {
  /**
   * Icon to be used for Tabs
   */
  icon?: any;
  /**
   * Badges to be used for Tabs
   */
  badge?: number;
  /**
   * Name of the Tabs
   */
  title: string | React.ReactNode;
  /**
   * Keys to be used for Tabs
   */
  key: string;
  /**
   * Data test attribute for the tab header title
   */
  dataTest?: string;
  /**
   * Callback executed when active tab is changed
   */
  onChange?: (activeKey: string) => void;
}

const NavTabPane = (props: NavTabPaneProps & { children: React.ReactNode }) => {
  return (
    <React.Fragment
      {...props}
    />
  );
};

interface SecondaryNavTabStateProps {
  content: JSX.Element | string | null;
}

const createTabConfig = (tabs: string[] | JSX.Element[], keys: string[], contents: React.ReactNode[]) => {
  const data: any[] = [];
  for (let i = 0; i < keys.length; i++) {
    data.push({ key: keys[i], tab: tabs[i], content: contents[i] });
  }
  return data;
};

class SecondaryNavTab extends React.PureComponent<SecondaryNavProps, SecondaryNavTabStateProps> {
  constructor(props: SecondaryNavProps) {
    super(props);
    this.state = {
      content: R.find((tab: any) => {
        return tab[0] === props.defaultActiveKey;
      }, R.zip(props.keys, props.contents))[1]
    };
  }

  onChange = (e: any): any => {
    const props = this.props;
    this.setState({
      content: R.find((x: any) => { return x[0] === e.target.value; },
        R.zip(props.keys, props.contents))[1]
    });
  }

  render() {
    const { keys, tabs, contents, defaultActiveKey } = this.props;
    const { content } = this.state;
    const data = createTabConfig(tabs, keys, contents);
    return (
      <React.Fragment>
        <RadioContainer>
          <Radio
            defaultValue={defaultActiveKey}
            buttonStyle="solid"
            onChange={this.onChange}
            optionType="button"
            items={
              data.map(x => {
                return {
                  key: x.key,
                  value: x.key,
                  label: x.tab
                }
              })
            }
          />
        </RadioContainer>
        <div className="tab-content">
          {content}
        </div>
      </React.Fragment>);
  }
}

class NavTabs extends React.PureComponent<NavTabsProps> {
  generateTabPane = (child: JSX.Element) => {
    if (R.isNil(child) || !child.props) {
      return '';
    }
    const styledTab = <TabSpan data-test={child.props.dataTest}>{child.props.title}</TabSpan>;
    const newTabPane = R.isNil(child.props.badge) ? styledTab : (
      <span key="badge">
        {styledTab}{R.gt(child.props.badge, 0) && <Badge className="badge">{child.props.badge}</Badge>}
      </span>
    );

    const tab = child.props.icon ? (
      <span key="tabIcon" >
        <StyleIcon
          component={child.props.icon}
        />
        {newTabPane}
      </span>) : newTabPane;

    return child.key ? (
      <TabPane
        key={child.key.toString()}
        tab={tab}
      >
        {child.props.children}
      </TabPane>) : '';
  }

  render() {
    const {
      tabType = 'primary',
      defaultActiveKey,
      children,
      extraActionButton,
      ...rest
    } = this.props;
    if (tabType !== 'secondary') {
      const size = tabType === 'primary' ? 'small' : 'large';
      const tabPanes = R.map((child) => this.generateTabPane(child), children as JSX.Element[]);
      return (
        <DominoLineTabs
          animated={false}
          defaultActiveKey={defaultActiveKey}
          tabBarExtraContent={extraActionButton}
          size={size}
          tabBarGutter={12}
          {...rest}
        >
          {tabPanes}
        </DominoLineTabs>
      );
    } else {
      return (
        <SecondaryNavTab
          tabs={R.map((child: JSX.Element) => child.props.title, children)}
          keys={R.map((child: JSX.Element) => child.key ? child.key.toString() : '', children)}
          contents={R.map((child: JSX.Element) => child.props.children, children)}
          defaultActiveKey={defaultActiveKey}
        />
      );
    }
  }
}

/* @component */
export default NavTabs;

export { NavTabPane };
