import styled from 'styled-components';
import {  themeHelper } from '../../../styled';

const StyledHeading = styled.div`
  font-size: ${themeHelper('fontSize.medium')};
  font-weight: ${themeHelper('fontWeights.thick')};
  line-height: 21px;
  margin: ${themeHelper('margins.small')} 0 ${themeHelper('margins.tiny')} 0;
`;

export default StyledHeading;
