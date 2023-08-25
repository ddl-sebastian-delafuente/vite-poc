import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import CompleteReview from '../details/CompleteReview';
import { mockReviewSummary } from './mockData';

const modelCurrentStage = 'Staging';
const NotesErrorMessage = 'Notes is required';
const DecisionErrorMessage = 'Decision is required';

describe('CompleteReview', () => {
  const submitReview = jest.fn()
  const defaultProps = {
    submitReview: submitReview,
    review: mockReviewSummary
  }
  it('should open modal when complete review button is clicked', async () => {
    const view = render(<CompleteReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
  });

  it('should validate and show error message at decision when clicked on submit without selecting decision', async () => {
    const view = render(<CompleteReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(view.queryByText(DecisionErrorMessage)).toBeTruthy());
  });

  it('should validate and show error message at notes when clicked on submit after selecting decision as request changes', async () => {
    const view = render(<CompleteReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('submit-review-decision-radio-group-option-request-changes')).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('submit-review-decision-radio-group-option-request-changes'));
    await userEvent.click(view.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(view.queryByText(NotesErrorMessage)).toBeTruthy());
  });

  it('should call submit review function with decision approved when user approves and submits', async () => {
    const view = render(<CompleteReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('submit-review-decision-radio-group-option-approved')).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('submit-review-decision-radio-group-option-approved'));
    await userEvent.click(view.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(submitReview).toBeCalledWith({ decision: 'Approved', notes: undefined}));
  });

  it('should call submit review function with decision requestChanges when user request changes and submits', async () => {
    const view = render(<CompleteReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('submit-review-decision-radio-group-option-request-changes')).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('submit-review-decision-radio-group-option-request-changes'));
    await userEvent.type(view.getByDominoTestId('submit-review-reason-input'), 'Requested Changes')
    await userEvent.click(view.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(submitReview).toBeCalledWith({ decision: 'RequestChanges', notes: 'Requested Changes'}));
  });

  it('should show current stage as none when there is no current stage info', async () => {
    const view = render(<CompleteReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('model-current-stage').textContent).toBe('None')
  });

  it('should show current stage when current stage is passed in props', async () => {
    const view = render(<CompleteReview {...defaultProps} modelCurrentStage={modelCurrentStage}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('model-current-stage').textContent).toBe(modelCurrentStage)
  });

  it('should show target stage info', async () => {
    const view = render(<CompleteReview {...defaultProps} modelCurrentStage={modelCurrentStage}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('model-target-stage').textContent).toBe(mockReviewSummary.targetStage)
  });

  it('should close modal when cancel button is clicked after opening the complete review popup', async () => {
    const view = render(<CompleteReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Complete review'}));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Cancel'}));
    await waitFor(() => expect(view.queryByDominoTestId('complete-review-modal')).toBeFalsy());
  });
});
