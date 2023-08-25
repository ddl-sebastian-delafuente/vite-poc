import * as React from 'react';
import { UseQueryResult } from 'react-query';
import { omit } from 'ramda';
import userEvent from '@testing-library/user-event';
import { cleanup, render, waitFor, within } from '@domino/test-utils/dist/testing-library';
import type { ErrorObject } from '@domino/api/dist/httpRequest';
import type { RegisteredModelV1,
  PaginatedRegisteredModelVersionOverviewEnvelopeV1 as ModelVersionsDto,
  RegisteredModelVersionDetailsV1 as ModelVersionDto } from '../types';
import type { Run } from '@domino/ui/dist/experiments/types';
import * as hooks from '../modelRegistryHooks';
import * as experimentHooks from '../experimentsHooks';
import * as ModelApi from '../api';
import { modelVersion, mockModel, mockRegisteredModelVersion,
  mockModelVersion, mockRun, mockReviewSummary, mockModelStages, mockProjectSummary, mockUsers  } from './mockData';
import ModelCard, { CANCEL_REVIEW_SUCCESS_MESSAGE, START_REVIEW_SUCCESS_MESSAGE, SUBMIT_REVIEW_SUCCESS_MESSAGE, UPDATE_REVIEW_SUCCESS_MESSAGE} from '../details/ModelCard';

const mockToastSuccess = jest.fn();
jest.mock('@domino/ui/dist/components/toastr', () => ({
  success: (text: string) => mockToastSuccess(text),
}));
jest.mock('@domino/api/dist/Projects', () => ({
  getProjectSummary: () => mockProjectSummary
}));
jest.mock('@domino/api/dist/Users', () => ({
  listUsers: () => mockUsers
}));

jest.mock('../modelRegistryHooks');
jest.mock('../experimentsHooks');
jest.mock('../details/ModelCardVersionDetails');

afterAll(() => {
  jest.unmock('../modelRegistryHooks');
  jest.unmock('../experimentsHooks');
  jest.unmock('@domino/ui/dist/components/toastr');
  jest.unmock('@domino/api/dist/Projects');
  jest.unmock('@domino/api/dist/Users');
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
const mockedHooks = jest.mocked(hooks);
const mockExpHooks = jest.mocked(experimentHooks);

mockedHooks.useGetRegisteredModelByName.mockImplementation(() => {
  return {
    data: mockModel,
    isError: false,
    isLoading: false
  } as UseQueryResult<RegisteredModelV1, ErrorObject>
});

mockedHooks.useGetRegisteredModelVersions.mockImplementation(() => {
  return {
    data: mockRegisteredModelVersion,
    isLoading: false,
    isError: false,
  } as UseQueryResult<ModelVersionsDto, ErrorObject>
});

mockedHooks.useGetRegisteredModelVersion.mockImplementation(() => {
  return {
    data: mockModelVersion,
    isLoading: false,
    isError: false,
  } as UseQueryResult<ModelVersionDto, ErrorObject>
});

mockExpHooks.useGetRun.mockImplementation(() => {
  return {
    data: mockRun,
    isLoading: false,
    isError: false,
  } as UseQueryResult<Run, ErrorObject>
});

describe('ModelCard', () => {

  const defaultProps = {
    modelName: 'first model',
    currentUserName: 'integration-test'
  }

  it('should show stage info as none when there is no stage info', async () => {
    const mockData = { ...modelVersion, reviewSummary: {...mockReviewSummary, status: 'Approved' }}
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(omit(['currentStage'], mockData) as ModelApi.ModelVersion);
    const view = render(<ModelCard modelName={'first model'} currentUserName={'practitioner432'} />);
    await waitFor(() => expect(view.getByDominoTestId('stage-info').textContent).toBe('None'));
  });

  it('should show stage info from props when it is provides', async () => {
    const mockData = { ...modelVersion, reviewSummary: {...mockReviewSummary, status: 'Approved' }, currentStage: 'Staging'}
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(mockData);
    const view = render(<ModelCard modelName={'first model'} currentUserName={'practitioner432'} />);
    await waitFor(() => expect(view.getByDominoTestId('stage-info').textContent).toBe('Staging'));
  });

  it('should show start review button when there is no review summary for model', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(omit(['reviewSummary'], modelVersion));
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByText('Start review')).toBeTruthy());
  });

  it('should not show start review button when the loggedin user is not the owner of model', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue({ ...modelVersion });
    const view = render(<ModelCard {...defaultProps} currentUserName="test-user"/>);
    await waitFor(() => expect(view.queryByText('Start review')).toBeFalsy());
  });

  it('should not show start review button when there is review summary for model', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue({ ...modelVersion });
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByText('Start review')).toBeFalsy());
  });

  it('should show complete review button for an open status model that has review summary', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByText('Complete review')).toBeTruthy());
  });

  it('should not show complete review button for an open status model that has review summary', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue({...modelVersion, reviewSummary: {...mockReviewSummary, status: 'Approved'}});
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByText('Complete review')).toBeFalsy());
  });

  it('should show the edit review button for a model version that has an open review summary when the logged in user is the model owner', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal-button')).toBeTruthy());
  });

  it('should not show the edit review button for a model version that has an open review summary when the logged in user is not the model owner', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    const view = render(<ModelCard {...defaultProps} currentUserName="test-user"/>);
    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal-button')).toBeFalsy());
  });

  it('should not show the edit review button for a model version that does not have a review summary', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(omit(['reviewSummary'], modelVersion));
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal-button')).toBeFalsy());
  });

  it('should not show the edit review button for a model version that has review summary that is not open', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue({...modelVersion, reviewSummary: {...mockReviewSummary, status: 'Approved'}});
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal-button')).toBeFalsy());
  });

  it('should show the stage selector for a model version that does not have a review summary when the logged in user is the model owner', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(omit(['reviewSummary'], modelVersion));
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByDominoTestId('transition-stage-selector')).toBeTruthy());
  });

  it('should show the stage selector for a model version that has a review summary that is not open when the logged in user is the model owner', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue({...modelVersion, reviewSummary: {...mockReviewSummary, status: 'Approved'}});
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByDominoTestId('transition-stage-selector')).toBeTruthy());
  });

  it('should not show the stage selector for a model version that has an open review summary when the logged in user is the model owner', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByDominoTestId('transition-stage-selector')).toBeFalsy());
  });

  it('should not show the stage selector for a model version that does not have a review summary when the logged in user is not the model owner', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    const view = render(<ModelCard {...defaultProps} currentUserName="test-user"/>);
    await waitFor(() => expect(view.queryByDominoTestId('transition-stage-selector')).toBeFalsy());
  });

  it('should show transitioning to label for an open status model after review started', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue({ ...modelVersion, reviewSummary: mockReviewSummary });
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.getByText('transitioning to')).toBeTruthy());
  });

  it('should not show transitioning to label when model status is approved', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue({...modelVersion, reviewSummary: {...mockReviewSummary, status: 'Open'}});
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByText('transitioning to')).toBeFalsy());
  });

  it('should show success toast when start review is submitted successfully', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(omit(['reviewSummary'], modelVersion));
    jest.spyOn(ModelApi, 'getModelStages').mockResolvedValue(mockModelStages);
    jest.spyOn(ModelApi, 'startReview').mockResolvedValue();
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByText('Start review')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    const nextStage = view.getByDominoTestId('next-stage');
    await userEvent.click(within(nextStage).getByRole('combobox'));
    await userEvent.click(view.getByText('staging', {selector: 'div.ant-select-item-option-content'}));
    const reviewersField = view.getByDominoTestId('start-review-reviewers-select-field');
    await userEvent.click(within(reviewersField).getByRole('combobox'));
    await userEvent.click(view.getByText('integration-test', {selector: 'div.ant-select-item-option-content'}));
    await userEvent.click(view.getByRole('button', { name: 'Start Review'}));
    await waitFor(() => expect(mockToastSuccess).toBeCalledWith(START_REVIEW_SUCCESS_MESSAGE));
  });

  it('should show success toast when a review is edited successfully', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    jest.spyOn(ModelApi, 'getModelStages').mockResolvedValue(mockModelStages);
    jest.spyOn(ModelApi, 'editReview').mockResolvedValue();
    const view = render(<ModelCard {...defaultProps} />);

    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal-button')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('edit-review-modal-button'));
    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal')).toBeTruthy());
    const editReviewersField = view.getByDominoTestId('edit-review-reviewers-select-field');
    await userEvent.click(within(editReviewersField).getByRole('combobox'));
    await userEvent.click(view.getByText('integration-test2', {selector: 'div.ant-select-item-option-content'}));
    await userEvent.click(view.getByRole('button', { name: 'Save & Send'}));
    await waitFor(() => expect(mockToastSuccess).toBeCalledWith(UPDATE_REVIEW_SUCCESS_MESSAGE));
  });

  it('should show success toast when a review is canceled successfully', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    jest.spyOn(ModelApi, 'getModelStages').mockResolvedValue(mockModelStages);
    jest.spyOn(ModelApi, 'cancelReview').mockResolvedValue();
    const view = render(<ModelCard {...defaultProps} />);

    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal-button')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('edit-review-modal-button'));
    await waitFor(() => expect(view.queryByDominoTestId('edit-review-modal')).toBeTruthy());

    await waitFor(() => expect(view.queryByDominoTestId('cancel-review-modal-button')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('cancel-review-modal-button'));
    await waitFor(() => expect(view.queryByDominoTestId('cancel-review-modal')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Delete Review Request'}));
    await waitFor(() => expect(mockToastSuccess).toBeCalledWith(CANCEL_REVIEW_SUCCESS_MESSAGE));
  });

  it('should show success toast when complete review is submitted successfully', async () => {
    jest.spyOn(ModelApi, 'getRegisteredModelVersions').mockResolvedValue(modelVersion);
    jest.spyOn(ModelApi, 'submitReview').mockResolvedValue();
    const view = render(<ModelCard {...defaultProps} />);
    await waitFor(() => expect(view.queryByText('Complete review')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Complete review' }));
    await waitFor(() => expect(view.getByDominoTestId('complete-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('submit-review-decision-radio-group-option-approved')).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('submit-review-decision-radio-group-option-approved'));
    await userEvent.click(view.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(mockToastSuccess).toBeCalledWith(SUBMIT_REVIEW_SUCCESS_MESSAGE));
  });
});
