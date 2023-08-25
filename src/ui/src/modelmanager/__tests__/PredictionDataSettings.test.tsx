import React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import PredictionDataSettings, * as settings from '../PredictionDataSettings';
import { predictionDataSettingsEffectHook } from '../PredictionDataSettings';
import * as projects from '@domino/api/dist/Projects';
import { getModelPredictionDatasetLink } from '../../core/routes';
import { datasetRwDto, projectSummary } from '@domino/test-utils/dist/mocks';

const predictionDataSettingsProps = {
  projectId: 'projectId',
  modelVersionId: 'modelVersionId',
  modelName: 'modelName',
  versionNumber: 1
};

describe('PredictionDataSettings tests', () => {
  it('should render with wait-spinner', () => {
    jest.spyOn(settings, 'usePredictionDataSettings').mockReturnValue({ isLoading: true, link: '' });
    const { getByDominoTestId, queryByText } = render(<PredictionDataSettings {...predictionDataSettingsProps} />);
    expect(getByDominoTestId('wait-spinner')).toBeTruthy();
    expect(queryByText('Prediction Data')).toBeFalsy();
  });

  it('should render `Prediction Data`, ModelDataText & HelpLink, and not render wait-spinner', () => {
    jest.spyOn(settings, 'usePredictionDataSettings').mockReturnValue({ isLoading: false, link: '' });
    const view = render(<PredictionDataSettings {...predictionDataSettingsProps} />);
    expect(view.getByText('Prediction Data')).toBeTruthy();
    expect(view.getByDominoTestId('recorded-model-data-text')).toBeTruthy();
    expect(view.getByDominoTestId('help_link')).toBeTruthy();
    expect(view.queryByDominoTestId('wait-spinner')).toBeFalsy();
  });

  it('should test predictionDataSettingsEffectHook ', async () => {
    const setLoading = jest.fn();
    const setLink = jest.fn();

    jest
      .spyOn(projects, 'getProjectSummary')
      .mockReturnValue(Promise.resolve({ ...projectSummary, name: 'projectName', ownerUsername: 'userName' }));
    jest
      .spyOn(settings, 'getProjectPredictionDataset')
      .mockReturnValue(Promise.resolve({ ...datasetRwDto, id: 'datasetId', name: 'datasetName' }));
    await predictionDataSettingsEffectHook('projectId', 'modelVersionId', setLoading, setLink);

    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setLink).toHaveBeenCalledTimes(1);
    expect(setLink).toHaveBeenCalledWith(
      getModelPredictionDatasetLink('userName', 'projectName', 'datasetId', 'datasetName', 'modelVersionId')
    );
  });
});
