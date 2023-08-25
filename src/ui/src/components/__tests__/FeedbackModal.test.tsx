import * as React from 'react';
import * as fetchMock from 'fetch-mock';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import FeedbackModal, { GENERAL_ERROR } from '../FeedbackModal';

const mockToastWarning = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock('./../toastr', () => ({
  // eslint-disable-next-line
  warning: (text: React.ReactNode, description: string, duration?: number) => mockToastWarning(text),
  success: (text: string) => mockToastSuccess(text),
  error: (text: string) => mockToastError(text)
}));

const mockFeedbackSubmit = (data = {}) => {
  fetchMock.restore()
    /* tslint:disable:max-line-length */
    .post(`${window.location.origin}/sendFeedback`, data);
};

const mockGetUserMedia = jest.fn(async () => {
  return new Promise<void>(resolve => {
      resolve()
  })
})

//@ts-ignore
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getDisplayMedia: mockGetUserMedia,
  },
})

describe('<FeedbackModal />', () => {
  const testId = 'feedback-modal';
  const defaultProps = { projectId: 'projectId', userEmail: 'user@dominodatalab.com' };

  it('should render', () => {
    const { getByDominoTestId } = render(<FeedbackModal {...defaultProps} />);
    expect(getByDominoTestId(testId)).toBeTruthy();
  });

  it('should check "You may reach out to me for further feedback" checkbox by default', () => {
    const { baseElement } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    expect((baseElement.querySelector('input[type="checkbox"]') as HTMLInputElement).checked).toBeTruthy();
  });

  it('should disable send button when feedback field is empty', () => {
    const { getByDominoTestId } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    expect(getByDominoTestId('feedback-modalsubmit-button').hasAttribute('disabled')).toBeTruthy();
  });

  it('should enable send button when feedback field is empty', async () => {
    const { getByDominoTestId } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    expect(getByDominoTestId('feedback-modalsubmit-button').hasAttribute('disabled')).toBeFalsy();
  });

  it('should disable send button when "You may reach out to me for further feedback" checkbox is checked and email is empty', async () => {
    const { getByDominoTestId } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    await userEvent.clear(getByDominoTestId('feedback-email'));
    expect(getByDominoTestId('feedback-modalsubmit-button').hasAttribute('disabled')).toBeTruthy();
  });

  it('should enable send button when "You may reach out to me for further feedback" checkbox is not checked and email is empty', async () => {
    const { getByDominoTestId, getByRole } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    await userEvent.click(getByRole('checkbox'));
    await userEvent.clear(getByDominoTestId('feedback-email'));
    expect(getByDominoTestId('feedback-modalsubmit-button').hasAttribute('disabled')).toBeFalsy();
  });

  it('should show success toast when feedback is submitted', async () => {
    mockFeedbackSubmit();
    const { getByDominoTestId, getByText } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    await userEvent.click(getByText('Suggestion'));
    expect(getByDominoTestId('feedback-modalsubmit-button').hasAttribute('disabled')).toBeFalsy();
    await userEvent.click(getByDominoTestId('feedback-modalsubmit-button'));
    await waitFor(() => expect(mockToastSuccess).toHaveBeenCalledWith('Feedback sent. Thank you!'));
  });

  it('should show error toast when feedback submit fails', async () => {
    mockFeedbackSubmit(500);
    const { getByDominoTestId, getByText } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    await userEvent.click(getByText('Suggestion'));
    expect(getByDominoTestId('feedback-modalsubmit-button').hasAttribute('disabled')).toBeFalsy();
    await userEvent.click(getByDominoTestId('feedback-modalsubmit-button'));
    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith(GENERAL_ERROR));
  });

  it('should display Remove screenshot button when screenshot is taken', async () => {
    mockFeedbackSubmit();
    const { getByDominoTestId, getByText } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    await userEvent.click(getByText('Create Screenshot'));
    await waitFor(() => expect(getByText('Remove screenshot')).toBeTruthy());
  });

  it('should display Create Screenshot button when Remove screenshot button is clicked', async () => {
    mockFeedbackSubmit();
    const { getByDominoTestId, getByText } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    await userEvent.click(getByText('Create Screenshot'));
    await waitFor(() => expect(getByText('Remove screenshot')).toBeTruthy());
    await userEvent.click(getByText('Remove screenshot'));
    await waitFor(() => expect(getByText('Create Screenshot')).toBeTruthy());
  });

  // Create screenshot pops browser screen capture modal which is not interactive from the test & is causing test timeout
  it.skip('should submit feedback when feedback is sent with screenshot', async () => {
    mockFeedbackSubmit();
    const { getByDominoTestId, getByText } = render(<FeedbackModal {...defaultProps} visibility={true} />);
    await userEvent.type(getByDominoTestId('feedback-textArea'), 'Excellent!');
    await userEvent.click(getByText('Create Screenshot'));
    await waitFor(() => expect(getByText('Remove screenshot')).toBeTruthy());
    await userEvent.click(getByDominoTestId('feedback-modalsubmit-button'));
    await waitFor(() => expect(mockToastSuccess).toHaveBeenCalledWith('Feedback sent. Thank you!'));
  });
  
});
