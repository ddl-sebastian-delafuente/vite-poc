import React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import Predictions, { TestIds } from '../Predictions';

describe('<Predictions />', () => {
  const defaultProps = { modelId: '', loading: true, predictionsCount: 1 };
  it('should show spinner when loading is true', () => {
    expect(render(<Predictions {...defaultProps} />).getByDominoTestId(TestIds.SPINNER)).toBeTruthy();
  });
  it('should show prediction text when not loading', () => {
    expect(render(<Predictions {...defaultProps} loading={false} />).getByDominoTestId(TestIds.TEXT)).toBeTruthy();
  });
});
