import * as React from 'react';
import * as colors from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import styled from 'styled-components';

const MessageWrapper = styled.div`
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid ${colors.headerBlue};
  border-radius: ${themeHelper('borderRadius.standard')};
  background-color: ${colors.lightBlue};
`;

const MessageHeader = styled.span`
  color: ${colors.headerBlue};
  font-size: 18px;
  line-height: 21px;
`;

export type Props = {
  header?: string;
  children: any;
}

// Check if any children are non-null.  If so, render
const NotificationList = ({ header, children }: Props) => {
  return (!children.every((element: any) => element === null)) ? (
    <MessageWrapper>
      {header && <MessageHeader>{header}</MessageHeader>}
      {children}
    </MessageWrapper>
  ) : null;
}

export default NotificationList;
