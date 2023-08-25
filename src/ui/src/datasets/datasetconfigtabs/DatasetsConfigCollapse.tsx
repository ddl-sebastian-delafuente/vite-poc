import * as React from 'react';
import styled from 'styled-components';
import Accordion from '../../components/Accordion/Accordion';

export type Props = {
  collapsed?: boolean;
  children: JSX.Element
};

const StyledAccordion = styled(Accordion)`
  .ant-collapse-header {
    display: table-cell;
    vertical-align: middle;
    text-align: left;
  }
  .ant-collapse-header>i {
    margin-top: 2px;
  }
`;
const DatasetsConfigCollapse = ({ collapsed = true, children }: Props) => (
  <StyledAccordion panelKey="datasets" title="Data">
    {children}
  </StyledAccordion>
);

export default DatasetsConfigCollapse;
