import { DominoDatasourceApiDataSourceDto as DataSourceDto } from '@domino/api/dist/types';
import * as React from 'react'
import styled from 'styled-components';

import { EngineType } from './CommonData';

export interface PoweredByStarburstProps {
  datasource?: DataSourceDto,
}

const PoweredByText = styled.span`
  font-style: italic;
  padding-right: 0.333em;
`;

export const PoweredByStarburst = ({ datasource }: PoweredByStarburstProps) => {
  if (datasource?.engineInfo?.engineType !== EngineType.Starburst) {
    return null;
  }

  return (
    <div>
      <PoweredByText>Powered by Starburst.</PoweredByText> 
    </div>
  );
}
