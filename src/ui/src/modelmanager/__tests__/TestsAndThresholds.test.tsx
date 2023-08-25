import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import TestsAndThresholds from '../TestsAndThresholds';

describe('TestsAndThresholds', () => {
  const defaultProps = { visible: true, closeModal: jest.fn(), dmmModelId: 'id', workbenchModelId: 'id', workbenchModelVersionId: 'id'};
  it('should render', () => {
    expect(render(<TestsAndThresholds {...defaultProps} />)
      .getByDominoTestId('tests-and-threshold-iframe')).toBeTruthy();
  });
});
