import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Collapse as AntCollapse, CollapseProps } from 'antd';
import styled from 'styled-components';
import { themeHelper } from '../../styled';

const StyledCollapse = styled(AntCollapse)`
  &.ant-collapse, &.ant-collapse .ant-collapse-item {
    border-color: ${themeHelper('accordion.borderColor')};
  }
  &.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    align-items: center;
    padding: 7px ${themeHelper('margins.small')};
    border-radius: 2px 2px 0 0;
    background: ${themeHelper('accordion.backgroundColor')};
    color: ${themeHelper('accordion.contentColor')};
    border-color: ${themeHelper('accordion.borderColor')};
  }
  &.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
    margin-right: ${themeHelper('margins.tiny')};
  }
  .ant-collapse-content {
    border-top-color: ${themeHelper('accordion.borderColor')};
  }
`;

const Collapse = (props: CollapseProps) => <StyledCollapse {...props} />;
Collapse.Panel = AntCollapse.Panel;

export default Collapse;
