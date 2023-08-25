import * as React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import { themeHelper } from '@domino/ui/dist/styled';

const StyledLayout = styled(Layout)`

  .ant-layout {
    background: none;
  }

  .ant-select, .ant-input, .ant-list, .ant-pagination-item, .ant-checkbox-wrapper, .ant-dropdown,
  .ant-table, .ant-collapse, .ant-tabs, .ant-card, .ant-select-dropdown, .ant-legacy-form-item, .ant-layout,
  .ant-radio, .ant-radio-wrapper, .ant-radio-wrapper *, .ant-radio-group, .ant-tooltip, .ant-modal,
  .ant-input-number, .ant-tag, .ant-menu, .ant-dropdown-menu-item, .ant-breadcrumb, .ant-notification  {
    font-family: ${themeHelper('fontFamily')};
  }
`;

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <StyledLayout className="layout" hasSider={true}>
    {children}
  </StyledLayout>
);
