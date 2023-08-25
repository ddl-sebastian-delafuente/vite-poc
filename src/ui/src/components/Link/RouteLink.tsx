import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { themeHelper } from '../../styled/themeUtils';

export default styled(Link)`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${themeHelper('link.basic.color')};
  
  &:hover {
    color: ${themeHelper('link.basic.color')};
    text-decoration: underline;
  }
`;
