import * as React from 'react';
import { btnGrey, basicLink } from '../styled/colors';
import styled from 'styled-components';

const TableActionsComponent = styled.div`
  display: flex;
  > button, > div, > span {
   margin-right: 8px;
  }
  z-index: 100;
  button[disabled], a[disabled] {
    color: ${btnGrey};
  }
  .ant-btn, .icon {
    .ant-badge-count {
      background-color: ${basicLink};
    }
    color: ${basicLink};
    border: none;
    box-shadow: none;
    background: inherit;
    &:focus, &:active, &:active, &:hover {
      color: ${basicLink};
      border: none;
      background: inherit;
    }
  }
`;

const TableActions = (props: any) => <TableActionsComponent {...props} />;

export default TableActions;
