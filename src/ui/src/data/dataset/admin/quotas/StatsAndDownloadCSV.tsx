import * as React from 'react';
import styled from 'styled-components';

import { normalizeBytes } from '../../../../utils/prettyBytes';
import { BigValue } from '../../../BigValue';

const Wrapper = styled.div`
  align-items: center;
  display: flex;

  & > *:not(:last-child) {
    margin-right: 23px;
  }
`;
export interface StatsAndDownloadCSVProps {
  storageUsage?: number;
}

export const StatsAndDownloadCSV = ({
  storageUsage,
}: StatsAndDownloadCSVProps) => {
  const size = normalizeBytes(storageUsage);
  
  return (
    <Wrapper>
      <BigValue
        {...size}
        label="Total Storage Used"
      />
    </Wrapper>
  );
}
