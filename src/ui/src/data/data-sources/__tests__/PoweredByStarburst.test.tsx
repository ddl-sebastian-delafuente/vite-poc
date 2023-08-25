import { dataSourceDtoMySQL, dataSourceDtoS3Tabular } from '@domino/mocks/dist/mock-usecases';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import * as React from 'react';

import { PoweredByStarburst } from '../PoweredByStarburst';

describe('Powered by Starburst', () => {
  it('should render powered by text if datasource has starburst engine type', async () => {
    render(<PoweredByStarburst datasource={dataSourceDtoS3Tabular}/>);

    await waitFor(() => expect(screen.getByText('Powered by Starburst.' ,{ exact: false })).toBeTruthy())
  });
  
  it('should not render powered by text if datasource has starburst engine type', async () => {
    render(<PoweredByStarburst datasource={dataSourceDtoMySQL}/>);
    await waitFor(() => expect(screen.queryByText('Powered by Starburst.' ,{ exact: false })).toBeFalsy());
  });
})
