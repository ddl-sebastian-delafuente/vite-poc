import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import DangerButton from '../DangerButton';
import { WithState } from '../DominoLogoOnSubmitButton';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';

const mockProfile: MockProfile = {
  admin: {
    getWhiteLabelConfigurations: {},
  }
};

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(mockProfile);
});

afterAll(() => {
  mocks.unmock();
});

describe('<DominoLogoOnSubmitButton /> WithState', () => {
  const defaultProps = {
    CustomSubmitButton: DangerButton,
    onClick: async () => undefined
  };

  it('should allow the custom button to render', () => {
    const view = render(
      <WithState {...defaultProps} data-test="custom-submit-btn"/>
    );
    expect(view.getAllByDominoTestId('custom-submit-btn')).toHaveLength(1);
  });

  it('should render without custom button', () => {
    const view = render(
      <WithState {...defaultProps} CustomSubmitButton={undefined} data-test="no-custom-submit-btn"/>
    );
    expect(view.getAllByDominoTestId('no-custom-submit-btn')).toHaveLength(1);
  });

  it('should show a spinner after on click', async () => {
    const view = render(
      <WithState
        {...defaultProps}
        onClick={() => new Promise((resolve) => {
          setTimeout(resolve, 200);
        })}
        data-test="custom-submit-btn"
      />
    );
    await userEvent.click(view.getByDominoTestId('custom-submit-btn'));
    expect(view.getByDominoTestId('spinning-logo')).toBeTruthy();

  });

  it('should be disabled after on click', async () => {
    const view = render(
      <WithState
        {...defaultProps}
        onClick={() => new Promise((resolve) => {
          setTimeout(resolve, 200);
        })}
        data-test="custom-submit-btn"
      />
    );

    await userEvent.click(view.getByDominoTestId('custom-submit-btn'));
    await waitFor(() => expect(view.getByDominoTestId('custom-submit-btn').hasAttribute('disabled')).toBeTruthy());
  });

  it('should reenable button on success', async () => {
    const view = render(
      <WithState
        {...defaultProps}
        onClick={() => new Promise((resolve) => {
          setTimeout(resolve, 50);
        })}
        data-test="custom-submit-btn"
      />
    );

    await userEvent.click(view.getByDominoTestId('custom-submit-btn'));
    await waitFor(() => expect(view.getByDominoTestId('custom-submit-btn').hasAttribute('disabled')).toBeFalsy());
  });

  it('should reenable button on failure', async () => {
    const view = render(
      <WithState
        {...defaultProps}
        onClick={() => new Promise((resolve, reject) => {
          setTimeout(() => reject('rejection'), 50);
        })}
        data-test="custom-submit-btn"
      />
    );
    await userEvent.click(view.getByDominoTestId('custom-submit-btn'));
    await waitFor(() => expect(view.getByDominoTestId('custom-submit-btn').hasAttribute('disabled')).toBeFalsy());
  });

  it('should trigger onFailure callback on failure if exists', async () => {
    const onFailureSpy = jest.fn();
    const view = render(
      <WithState
        {...defaultProps}
        onClick={() => Promise.reject('rejection')}
        onFailure={onFailureSpy}
        data-test="custom-submit-btn"
      />
    );
    await userEvent.click(view.getByDominoTestId('custom-submit-btn'));
    await waitFor(() => expect(onFailureSpy).toHaveBeenCalledTimes(1));
  });

  it('should trigger onSuccess callback on success if exists', async () => {
    const onSuccessSpy = jest.fn();
    const view = render(
      <WithState
        {...defaultProps}
        onClick={async () => 'success'}
        onSuccess={onSuccessSpy}
        data-test="custom-submit-btn"
      />
    );
    await userEvent.click(view.getByDominoTestId('custom-submit-btn'));
    await waitFor(() =>  expect(onSuccessSpy).toHaveBeenCalledTimes(1));
  });
});
