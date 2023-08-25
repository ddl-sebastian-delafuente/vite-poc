import * as React from 'react';
import styled from 'styled-components';
import { themeHelper } from '../styled/themeUtils';

const Kbd = styled.div`
  background-color: #fafbfc;
  border: 1px solid #d1d5da;
  border-bottom-color: #c6cbd1;
  border-radius: ${themeHelper('borderRadius.standard')};
  box-shadow: inset 0 -1px 0 #c6cbd1;
  color: #444d56;
  display: inline-block;
  font: 11px Courier,monospace;
  padding: 3px 5px;
  vertical-align: middle;
`;
export const KBD = ({children}: { children: React.ReactNode }) => <Kbd>{children}</Kbd>;
