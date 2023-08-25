import * as React from 'react';
import styled from 'styled-components';
import NoDataFoundIcon from '../../icons/NoDataFoundIcon';
import { pinkishGrey } from '../../styled/colors';

interface EmptyMsgProps {
  /**
   * The message to display
   */
  message: string | JSX.Element;
  /**
   * Additional CSS class(es) to add
   */
  className?: string;

  icon?: JSX.Element;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40%;
`;

const StyledSpan = styled.span`
  margin-top: 20px;
`;

const EmptyMessage = (props: EmptyMsgProps) => (
  <StyledDiv className={props.className} data-test="empty-message">
    {props.icon ? props.icon : <NoDataFoundIcon primaryColor={pinkishGrey} />}
    <StyledSpan>{props.message}</StyledSpan>
  </StyledDiv>
);

/* @component */
export default EmptyMessage;

export { EmptyMsgProps };
