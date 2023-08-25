import * as React from 'react';
import styled from 'styled-components';

const StyledCode = styled.code`
  background: transparent;
  overflow: auto;
  font-size: 0.8em;
`;

export type Props = {
  onClick: (event: any) => void;
  children: any;
};

const Code = (props: Props) => <StyledCode {...props} />;
export default Code;
