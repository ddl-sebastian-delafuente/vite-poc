import * as React from 'react';

import { DataSourceConfigDetails } from '../../src/data/data-sources/DataSourceConfigDetails';
import {
  dataSourceDtoIndividualSnowflake,
} from '@domino/test-utils/dist/mock-usecases';
import { render, screen } from '@domino/test-utils/dist/testing-library';

describe('DataSourceConfigDetails', () => {
  it('should render a datasource that has layout defined', () => {
    render(<DataSourceConfigDetails
      config={dataSourceDtoIndividualSnowflake.config}
      dataSourceType={dataSourceDtoIndividualSnowflake.dataSourceType}
    />);

    expect(screen.queryByText('Account Name')).not.toBeNull();
  });
});
