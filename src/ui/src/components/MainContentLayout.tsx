import * as React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { themeHelper } from '../styled/themeUtils';

const StyledLayout = styled(Layout)`
  min-height: 100%;
  padding: ${themeHelper('contentMain.margin')};
  background: white;
`;

export type Props = {
  children: any;
  className?: string;
  dataTest?: string;
};

const StyledLayoutComponent = ({ children, className, dataTest }: Props) => (
  <StyledLayout className={className} data-test={dataTest}>
    {children}
  </StyledLayout>
);

export default StyledLayoutComponent;
