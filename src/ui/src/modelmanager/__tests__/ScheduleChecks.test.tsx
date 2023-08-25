import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import ScheduleChecks from '../ScheduleChecks';

describe('ScheduleChecks', () => {
  const defaultProps = { visible: true, closeModal: jest.fn(), dmmModelId: 'id'};
  it('should render', () => {
    const { getByDominoTestId } = render(<ScheduleChecks {...defaultProps} />);
    expect(getByDominoTestId('schedule-check-container')).toBeTruthy();
    expect(getByDominoTestId('schedule-check-iframe')).toBeTruthy();
  });
});
