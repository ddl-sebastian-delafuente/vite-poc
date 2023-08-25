import * as React from 'react';
import { map, equals } from 'ramda';
import { render, waitFor, within } from '@domino/test-utils/dist/testing-library';
import ReviewersInfo from '../details/ReviewersInfo';
import { mockReviewSummary, mockModel } from './mockData';
import { ReviewDecisions } from './../api';


describe('Reviewers Info', () => {
  const defaultProps = {
    reviewSummary: mockReviewSummary,
    model: mockModel,
    loadingReviewSummary: false,
    currentUserName: 'integration-test'
  }
  it('should show waitspinner in review summary card when data is loading for model version', () => {
    const view = render(<ReviewersInfo {...defaultProps} loadingReviewSummary={true}/>);
    const reviewSummary = view.getByDominoTestId('reviewers-summary');
    expect(reviewSummary.querySelector('[data-test="wait-spinner"]')).toBeTruthy();
  });

  it('should show empty state when there are no reviewers for a model version', async () => {
    const view = render(<ReviewersInfo {...defaultProps} reviewSummary={undefined}/>);
    await waitFor(() => expect(view.getByDominoTestId('reviewers-empty-state')).toBeTruthy());
  });

  it('should show empty state when the review is not active', async () => {
    const view = render(<ReviewersInfo {...defaultProps} reviewSummary={{...mockReviewSummary, status: 'Approved'}}/>);
    await waitFor(() => expect(view.getByDominoTestId('reviewers-empty-state')).toBeTruthy());
  });

  it('should show reviewers when there are reviewers for a model version', async () => {
    const view = render(<ReviewersInfo {...defaultProps} />);
    await waitFor(() =>  expect(view.getAllByDominoTestId('reviewer-info')).toBeTruthy());
    expect(view.getAllByDominoTestId('reviewer-info').length).toEqual(mockReviewSummary.reviewerResponses.length);
  });

  it('should show reviewer name when there are reviewers for a model version', async () => {
    const reviewerNames = mockReviewSummary.reviewerResponses.map(({reviewer}) => equals(reviewer.username, defaultProps.currentUserName) ? 'You' : reviewer.username).join(',');
    const view = render(<ReviewersInfo {...defaultProps} />);
    await waitFor(() =>  expect(view.getAllByDominoTestId('reviewer-info')).toBeTruthy());
    const testReviewerNames = map( element => element.querySelector('[data-test="reviewer-name"]')?.textContent, view.getAllByDominoTestId('reviewer-info'));
    expect(testReviewerNames.join(',')).toMatch(reviewerNames);
  });

  it('should show green check mark when one of the reviewer approves the review', async () => {
    const reviewerItems = {id: '6451200c6de24f0a2f67ed8b', username: 'reviewer-name', firstName: 'First', lastName: 'Last'}
    const view = render(<ReviewersInfo {...defaultProps} reviewSummary={{...mockReviewSummary, reviewerResponses: [{reviewer: reviewerItems, decision: ReviewDecisions.APPROVED}]}}/>);
    await waitFor(() =>  expect(view.getAllByDominoTestId('reviewer-info')).toBeTruthy());
    const reviewersInfo = within(view.getByDominoTestId('reviewer-info')).getByRole('img');
    expect(reviewersInfo.getAttribute('class')?.includes('anticon-check-circle')).toBeTruthy();
  });

  it('should show red cross mark when one of the reviewer request some changes for a review', async () => {
    const reviewerItems = {id: '6451200c6de24f0a2f67ed8b', username: 'reviewer-name', firstName: 'First', lastName: 'Last'}
    const view = render(<ReviewersInfo {...defaultProps} reviewSummary={{...mockReviewSummary, reviewerResponses: [{reviewer: reviewerItems, decision: ReviewDecisions.REQUESTED}]}}/>);
    await waitFor(() =>  expect(view.getAllByDominoTestId('reviewer-info')).toBeTruthy());
    const reviewersInfo = within(view.getByDominoTestId('reviewer-info')).getByRole('img');
    expect(reviewersInfo.getAttribute('class')?.includes('anticon-close-circle')).toBeTruthy();
  });
});
