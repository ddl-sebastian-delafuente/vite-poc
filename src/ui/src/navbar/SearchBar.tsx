import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import { themeHelper } from '../styled';
import { LeftOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { ClickablePrimaryItem, NavItem } from './components/NavItem';
import { routes } from './routes';
import {
  COLLAPSED_SIDEBAR_WIDTH,
} from './components/utils/styled';
import getAppLogo from './components/utils/getAppLogo';
import {
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings
} from '@domino/api/dist/types';

export type ViewProps = {
  theme?: any;
  toggleCollapsed: () => void;
  whiteLabelSettings?: WhiteLabelSettings;
};

const HasShadow = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 1px 0px 4px 0px;
  z-index: 3;
  height: 100vh;
  display: inline-flex;
`;

const Back = styled(ClickablePrimaryItem)`
  .collapsed-item {
      background-color: ${themeHelper('nav.primary.search.backIcon.color')} !important;
  }

  .anticon {
    color: ${themeHelper('nav.primary.search.backIcon.fill')};
    font-weight: bold;
    width: 16px;
    position: relative;
    right: 1px;
    top: 1px;
  }

  &:hover {
    i {
      color: ${themeHelper('nav.primary.search.backIcon.fillHover')};
    }
  }
`;

const Wrapper = styled.div`
  .ant-layout-sider {
    height: 100vh;
    color: ${themeHelper('nav.primary.color')};
    background: ${themeHelper('nav.primary.search.background')} !important;
    transition: none;

    ul {
      background: ${themeHelper('nav.primary.search.background')};
      color: ${themeHelper(`nav.primary.color`)};
    }

    li.ant-menu-item {
      padding: 0 !important;
    }
  }
`;

const Component = (props: ViewProps) => {
  const fill = themeHelper('nav.primary.logoColor.dark')(props);
  const appLogo = props.whiteLabelSettings && props.whiteLabelSettings.appLogo;
  return (
    <HasShadow>
      <Wrapper>
        <Layout.Sider
          style={{ background: 'transparent' }}
          collapsed={true}
          trigger={''}
          collapsedWidth={COLLAPSED_SIDEBAR_WIDTH}
        >
          <Menu
            mode="inline"
            style={{ width: COLLAPSED_SIDEBAR_WIDTH, height: '100%' }}
            items={[{
              key: 'logo',
              disabled: true,
              style: { cursor: 'auto', marginTop: 12},
              label: (
                <NavItem
                  href={routes.LAB.path()}
                  type="primary"
                  icon={(getAppLogo(appLogo, fill))}
                  collapsed={true}
                />
              )
            }, {
              key: 'back',
              label: (
                <Back
                  collapsed={true}
                  icon={<LeftOutlined />}
                  tooltipLabel="Search"
                  onClick={props.toggleCollapsed}
                >
                  Back
                </Back>
              )
            }]}
          />
        </Layout.Sider>
      </Wrapper>
    </HasShadow>
  );
};

export default withTheme(Component);
