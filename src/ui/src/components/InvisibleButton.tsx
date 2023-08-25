import * as React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'antd';

export const NeutralInteractionStyle = `
  &:hover, &:focus, &:visited, &:active {
    outline: none;
    background: transparent;
  }
`;

const StyledButton = styled<any>(Button)`
  &.ant-btn[disabled] {
    transition: all .3s;
    g, path, circle, ellipse {
      transition: all .3s;
      fill: rgba(0, 0, 0, 0.25);
    }

    color: rgba(0, 0, 0, 0.25);
  }

  &.ant-btn {
    display: inline-flex;
    &:hover, &:focus, &:visited, &:active {
      ${NeutralInteractionStyle}
    }
    .ant-badge {
      ${NeutralInteractionStyle}
    }
  }

  &.ant-btn, &.ant-btn[disabled] {
    padding: ${props => props.padding ? props.padding : '5px'};
    width: auto;
    height: auto;
    box-shadow: none;
    border: none;
    background: transparent;

    &:hover {
      background: inherit;
    }
  }

  .ant-btn-group &.ant-btn[disabled]{
    background:transparent ;
    color: rgba(0,0,0,0.25) ;
    span{
      font-size: 14px;
    }
  }
`;

const InvisibleButton = ({
  children,
  ...rest
}: any) => (
  <StyledButton {...rest}>
    {children}
  </StyledButton>
);

export default InvisibleButton;
