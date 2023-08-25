import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import ModelAlertsBadge, { AlertBadge } from '../ModelAlertsBadge';

describe('<AlertBadge />', () => {
  it('should return AlertDisabledIcon when count is undefined', () => {
    expect(render(<AlertBadge count={null} toolTipMessage="" showTooltip={false} />)
      .getByDominoTestId('alert-badge-disabled-icon')).toBeTruthy();
  });

  it('should return SuccessCheckIcon when count is 0', () => {
    expect(render(<AlertBadge count={0} toolTipMessage="" showTooltip={false} />)
      .getByDominoTestId('alert-success-icon')).toBeTruthy();
  });

  it('should return Badge without tooltip when count is > 0 and tooltip is disabled', () => {
    const { queryByDominoTestId, getByDominoTestId } = render(<AlertBadge count={10} toolTipMessage="" showTooltip={false} />);
    expect(queryByDominoTestId('alert-tooltip')).toBeFalsy();
    expect(getByDominoTestId('alert-badge')).toBeTruthy();
  });

  it('should return Badge with tooltip when count is > 0', async () => {
    const view = render(<AlertBadge count={10} toolTipMessage="tooltip" showTooltip={true} />);
    userEvent.hover(view.getByDominoTestId('alert-badge'));
    expect(view.getByDominoTestId('alert-badge')).toBeTruthy();
    await waitFor(() => expect(view.getByText('tooltip')).toBeTruthy());
  });
});

describe('<ModelAlertsBadge />', () => {
  const props = {
    modelId: '',
    loading: false,
    count: null,
    toolTipMessage: '',
    showTooltip: false,
    clickable: false
  };
  it('should show spinner when loading is true', () => {
    expect(render(<ModelAlertsBadge {...props} loading={true} />)
      .getByDominoTestId('model-alert-badge-spinner')).toBeTruthy();
  });

  it('should return Link when badge is clickable', () => {
    const { getByDominoTestId } = render(<ModelAlertsBadge {...props} clickable={true} />);
    expect(getByDominoTestId('model-alert-badge-link')).toBeTruthy();
    expect(getByDominoTestId('alert-badge-disabled-icon')).toBeTruthy();
  });

  it('should return badge without Link when badge is clickable', () => {
    const { getByDominoTestId, queryByDominoTestId } = render(<ModelAlertsBadge {...props} clickable={false} />);
    expect(queryByDominoTestId('model-alert-badge-link')).toBeFalsy();
    expect(getByDominoTestId('alert-badge-disabled-icon')).toBeTruthy();
  });
});
