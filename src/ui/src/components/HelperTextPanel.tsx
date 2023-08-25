import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../styled/themeUtils';

const HelperTextPanelContainer = styled.div`
  font-size: ${themeHelper('fontSizes.small', '13px')};
  color: ${themeHelper('mainFontColor')};
  border-radius: ${themeHelper('borderRadius.standard')};
  margin: ${themeHelper('margins.small', '11px')} 0px;
  border-image: initial;

  a {
    color: ${themeHelper('link.basic.color')};
  }

  svg {
    flex-shrink: 0;
  }
`;

const HelperTextPanel
  = ({ children, className, 'data-test': testId }: { children: React.ReactNode; className?: string; 'data-test'?: string }) => (
  <HelperTextPanelContainer className={className}>
    <div data-test={testId}>
      {children}
    </div>
  </HelperTextPanelContainer>
);

export default HelperTextPanel;
