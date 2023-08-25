import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styled';
import { themeHelper } from '../styled/themeUtils';

const FilePathIndicator = styled.span`
  padding: 8px;
  background-color: ${colors.greyishBrown};
  color: #FFE292;
  border-radius: ${themeHelper('borderRadius.left')};
`;

export default (props: any) => <FilePathIndicator {...props} />;
