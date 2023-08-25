import * as React from 'react';
import styled from 'styled-components';

import { useAccessControl } from '@domino/ui/dist/core/AccessControlProvider';

export interface DataAnalystConditionalCSSProps {
  children: React.ReactNode;
}

const DataAnalystWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  [data-deny-data-analyst="true"] {
    display: none !important;
  }
`
/**
 * Used with AccessControlProvider this component provides conditional CSS.
 * this conditional CSS is used to add addtional rules if a user is a 
 * data analyst. These CSS rules hide DOM elements from the user.
 */
export const DataAnalystConditionalCSS = ({ children }: DataAnalystConditionalCSSProps) => {
  const { hasAccess } = useAccessControl();

  if (!hasAccess()) {
    return <DataAnalystWrapper>{children}</DataAnalystWrapper>;
  }

  return <>{children}</>;
}
