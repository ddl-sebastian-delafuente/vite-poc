import React from 'react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import AddDataComponent, * as addData from '../AddData';
import {
  AddGroundTruth,
  createModelSchema,
  dataSourceName,
  FeatureSet,
  featureSetDropdownRender,
  FeatureSetSchemaErrorMessage,
  fetchFeatureSetVersionByIdHook,
  getColumnsByType,
  getFeatureSetSuffixIcon,
  getModelConfig,
  getVariableType,
  handleFeatureSetChange,
  handleFeatureSetVersionChange,
  hydrateFeatureSetsHook,
  hydrateFeatureSetVersionsHook,
  isFeatureSetSelectDisabled,
  isVersionSelectDisabled,
  isSchemaDefinitionValid,
  ModelType,
  removeElementsFromList
} from '../AddData';
import {
  datasets,
  featureSets,
  featureSetVersions,
  trainingSetVersion,
  trainingSetVersion2,
  trainingSetVersion3
} from '../mockData';
import {
  DatasetConfigRegistrationRequestDatasetTypeEnum,
  DatasourceType,
  FileFormat,
  ModelModelTypeEnum,
  SourceType,
  ValueType,
  VariableType
} from '@domino/api/dist/dmm-api-client';
import { projectSummary } from '@domino/test-utils/dist/mocks';

jest.mock('@domino/api/dist/Projects', () => ({
  getProjectSummary: () => projectSummary
}));
jest.mock('@domino/api/dist/Datasetrw', () => ({
  getDatasetsV2: () => datasets
}));

afterAll(() => {
  jest.unmock('@domino/api/dist/Projects');
  jest.unmock('@domino/api/dist/Datasetrw');
});
describe('<AddData/>', () => {
  it('should test removeElementsFromList', () => {
    expect(removeElementsFromList(['a', 'b', 'c', 'd', 'e', 'f'], ['b', 'e', 'f', 'h'])).toEqual(['a', 'c', 'd']);
  });

  it('should test createModelSchema', () => {
    expect(createModelSchema(trainingSetVersion)).toEqual([
      {
        name: 'feature1',
        valueType: ValueType.Categorical,
        variableType: VariableType.Feature
      },
      {
        name: 'output2',
        valueType: ValueType.Categorical,
        variableType: VariableType.Feature
      },
      {
        name: 'output1',
        valueType: ValueType.Numerical,
        variableType: VariableType.Prediction
      },
      {
        name: 'feature3',
        valueType: ValueType.Numerical,
        variableType: VariableType.Feature
      }
    ]);
  });

  it('should test isSchemaDefinitionValid', () => {
    expect(isSchemaDefinitionValid(null, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Classification)).toEqual(false);
    expect(isSchemaDefinitionValid(null, '', ModelModelTypeEnum.Classification)).toEqual(false);
    expect(isSchemaDefinitionValid(null, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Classification)).toEqual(false);
    expect(isSchemaDefinitionValid(trainingSetVersion, '', ModelModelTypeEnum.Classification)).toEqual(false);
    expect(
      isSchemaDefinitionValid(trainingSetVersion, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Classification)
    ).toEqual(false);
    expect(
      isSchemaDefinitionValid(trainingSetVersion2, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Classification)
    ).toEqual(false);
    expect(
      isSchemaDefinitionValid(trainingSetVersion3, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Classification)
    ).toEqual(true);
    expect(isSchemaDefinitionValid(null, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Regression)).toEqual(false);
    expect(isSchemaDefinitionValid(null, '', ModelModelTypeEnum.Regression)).toEqual(false);
    expect(isSchemaDefinitionValid(null, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Regression)).toEqual(false);
    expect(isSchemaDefinitionValid(trainingSetVersion, '', ModelModelTypeEnum.Regression)).toEqual(false);
    expect(
      isSchemaDefinitionValid(trainingSetVersion, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Regression)
    ).toEqual(true);
    expect(
      isSchemaDefinitionValid(trainingSetVersion2, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Regression)
    ).toEqual(false);
    expect(
      isSchemaDefinitionValid(trainingSetVersion3, '60dc016f3626bc13d3c7fec0', ModelModelTypeEnum.Regression)
    ).toEqual(false);
  });

  it('should test hydrateFeatureSetsHook', async () => {
    const mockSetIsOptionsLoading = jest.fn();
    const mockSetFeatureSets = jest.fn();
    const mockSetSelectedFeatureSetId = jest.fn();
    const mockSetFeatureSetVersionId = jest.fn();
    jest.spyOn(addData, 'fetchSavedFeatureSetDetails').mockReturnValue(
      Promise.resolve({
        featureSetId: '',
        featureSetVersionId: ''
      })
    );
    jest.spyOn(addData, 'getAllFeatureSets').mockReturnValue(Promise.resolve([]));

    await hydrateFeatureSetsHook(
      mockSetIsOptionsLoading,
      mockSetFeatureSets,
      mockSetSelectedFeatureSetId,
      mockSetFeatureSetVersionId,
      '60dc016f3626bc13d3c7fec0',
      '60dc016f3626bc13d3c7fec0'
    );
    expect(mockSetIsOptionsLoading).toHaveBeenCalledTimes(2);
    expect(mockSetSelectedFeatureSetId).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedFeatureSetId).toHaveBeenCalledWith('');
    expect(mockSetFeatureSetVersionId).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSetVersionId).toHaveBeenCalledWith('');
    expect(mockSetFeatureSets).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSets).toHaveBeenCalledWith([]);

    jest.clearAllMocks();

    await hydrateFeatureSetsHook(
      mockSetIsOptionsLoading,
      mockSetFeatureSets,
      mockSetSelectedFeatureSetId,
      mockSetFeatureSetVersionId,
      '60dc016f3626bc13d3c7fec0',
      undefined
    );

    expect(mockSetIsOptionsLoading).toHaveBeenCalledTimes(2);
    expect(mockSetFeatureSets).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSets).toHaveBeenCalledWith([]);

    jest.restoreAllMocks();
  });

  it('should test hydrateFeatureSetVersionsHook', async () => {
    jest.spyOn(addData, 'getAllFeatureSetVersions').mockReturnValue(Promise.resolve(featureSetVersions));
    const mockSetIsOptionsLoading = jest.fn();
    const mockSetFeatureSetVersions = jest.fn();
    await hydrateFeatureSetVersionsHook(
      mockSetIsOptionsLoading,
      mockSetFeatureSetVersions,
      '60dc016f3626bc13d3c7fec0',
      'value1',
      featureSets
    );

    expect(mockSetIsOptionsLoading).toHaveBeenCalledTimes(2);
    expect(mockSetFeatureSetVersions).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSetVersions).toHaveBeenCalledWith(featureSetVersions);

    jest.restoreAllMocks();
  });

  it('should test fetchFeatureSetVersionByIdHook', async () => {
    jest.spyOn(addData, 'getFeatureSetVersionById').mockReturnValue(Promise.resolve(trainingSetVersion));
    const mockSetFeatureSetVersion = jest.fn();

    await fetchFeatureSetVersionByIdHook(mockSetFeatureSetVersion, 'value1', 'value1', featureSets, featureSetVersions);

    expect(mockSetFeatureSetVersion).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSetVersion).toHaveBeenCalledWith(trainingSetVersion);

    jest.restoreAllMocks();
  });

  it('should test featureSetDropdownRender', () => {
    const { getByDominoTestId } = render(featureSetDropdownRender(<div />));
    expect(getByDominoTestId('feature-set-dropdown')).toBeTruthy();
    expect(getByDominoTestId('feature-set-divider')).toBeTruthy();
    expect(getByDominoTestId('feature-set-helper-text')).toBeTruthy();
  });

  it('should test handleFeatureSetChange', () => {
    const mockSetFeatureSetVersion = jest.fn();
    const mockSetFeatureSetId = jest.fn();
    const mockSetFeatureSetVersionId = jest.fn();
    handleFeatureSetChange('value1', mockSetFeatureSetId, mockSetFeatureSetVersionId, mockSetFeatureSetVersion);

    expect(mockSetFeatureSetVersion).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSetId).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSetId).toHaveBeenCalledWith('value1');
    expect(mockSetFeatureSetVersion).toHaveBeenCalledWith(null);
    expect(mockSetFeatureSetVersionId).toHaveBeenCalledWith('');
  });

  it('should test handleFeatureSetVersionChange', () => {
    const mockSetFeatureSetVersion = jest.fn();
    const mockSetFeatureSetVersionId = jest.fn();

    handleFeatureSetVersionChange('value1', mockSetFeatureSetVersionId, mockSetFeatureSetVersion);

    expect(mockSetFeatureSetVersion).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSetVersionId).toHaveBeenCalledTimes(1);
    expect(mockSetFeatureSetVersionId).toHaveBeenCalledWith('value1');
    expect(mockSetFeatureSetVersion).toHaveBeenCalledWith(null);
  });

  it('should test getFeatureSetSuffixIcon', () => {
    expect(render(getFeatureSetSuffixIcon(true)!).getByDominoTestId('feature-set-suffix-icon')).toBeTruthy();
    expect(getFeatureSetSuffixIcon(false)).toEqual(undefined);
  });

  it('should test isFeatureSetSelectDisabled', () => {
    expect(isFeatureSetSelectDisabled(true, '60dc016f3626bc13d3c7fec0')).toEqual(true);
    expect(isFeatureSetSelectDisabled(false, '')).toEqual(false);
    expect(isFeatureSetSelectDisabled(false, '60dc016f3626bc13d3c7fec0')).toEqual(true);
  });

  it('should test isVersionSelectDisabled', () => {
    expect(isVersionSelectDisabled('true', true)).toEqual(true);
    expect(isVersionSelectDisabled('', false)).toEqual(true);
    expect(isVersionSelectDisabled('false', false)).toEqual(false);
  });

  it('should test FeatureSet', () => {
    const props = {
      isOptionsLoading: true,
      setSelectedFeatureSetId: jest.fn(),
      featureSets: [],
      setFeatureSetVersionId: jest.fn(),
      featureSetVersions: [],
      setFeatureSetVersion: jest.fn(),
      dmmModelId: '60dc016f3626bc13d3c7fec0',
      selectedFeatureSetId: '',
      featureSetVersionId: '',
      isExport: false
    };

    const { getByDominoTestId, getAllByDominoTestId } = render(<FeatureSet {...props} />);
    expect(getByDominoTestId('feature-set-select')).toBeTruthy();
    expect(getByDominoTestId('feature-set-version-select')).toBeTruthy();
    expect(getAllByDominoTestId('feature-set-header').length).toEqual(2);
    expect(getByDominoTestId('feature-set-text')).toBeTruthy();
  });

  it('should test AddGroundTruth', () => {
    const { getByDominoTestId } = render(<AddGroundTruth dmmModelId="60dc016f3626bc13d3c7fec0" appName="Domino" />);
    expect(getByDominoTestId('ingest-data-header')).toBeTruthy();
    expect(getByDominoTestId('ingest-data-text')).toBeTruthy();
    expect(getByDominoTestId('modal-link')).toBeTruthy();
  });

  it('should test FeatureSetSchemaErrorMessage', () => {
    const { getByDominoTestId } = render(<FeatureSetSchemaErrorMessage />);
    expect(getByDominoTestId('feature-set-schema-error-message')).toBeTruthy();
    expect(getByDominoTestId('error-help-link')).toBeTruthy();
  });

  it('should test ModelType', () => {
    const { getByDominoTestId } = render(<ModelType setModelType={jest.fn()} disabled={false} value={ModelModelTypeEnum.Classification} isExport={false} />);
    expect(getByDominoTestId('model-type-header')).toBeTruthy();
    expect(getByDominoTestId('model-type')).toBeTruthy();
  });

  it('should test AddData (with DMM model)', async () => {
    const props = {
      visible: true,
      closeModal: jest.fn(),
      dmmModelId: '60dc016f3626bc13d3c7fec0',
      modelName: 'name',
      workbenchModelVersionId: '60dc016f3626bc13d3c7fec0',
      workbenchModelId: '60dc016f3626bc13d3c7fec1',
      description: 'desc',
      versionNumber: 2,
      author: 'author',
      projectId: '60dc016f3626bc13d3c7fec4',
      modelType: ModelModelTypeEnum.Classification
    };

    jest.spyOn(addData, 'useFeatureSet').mockReturnValue({
      featureSets: [],
      setFeatureSets: jest.fn(),
      selectedFeatureSetId: 'selectedFeatureSetId',
      setSelectedFeatureSetId: jest.fn(),
      featureSetVersions: [],
      setFeatureSetVersions: jest.fn(),
      featureSetVersionId: '',
      setFeatureSetVersionId: jest.fn(),
      isOptionsLoading: false,
      setIsOptionsLoading: jest.fn(),
      featureSetVersion: trainingSetVersion,
      setFeatureSetVersion: jest.fn(),
      modelType: ModelModelTypeEnum.Classification,
      setModelType: jest.fn()
    });

    const view = render(<AddDataComponent {...props} />);

    expect(view.getByDominoTestId('model-type')).toBeTruthy();
    await waitFor(() => expect(view.queryByText('Prediction Data')).toBeTruthy());
    expect(view.getByDominoTestId('feature-set-input')).toBeTruthy();
    expect(view.queryByDominoTestId('feature-set-schema-error-message')).toBeFalsy();
    expect(view.getByText('Ground Truth Data')).toBeTruthy();

    jest.restoreAllMocks();
  });

  it('should test AddData (without DMM model)', async () => {
    const props = {
      visible: true,
      closeModal: jest.fn(),
      dmmModelId: undefined,
      modelName: 'name',
      workbenchModelVersionId: '60dc016f3626bc13d3c7fec0',
      workbenchModelId: '60dc016f3626bc13d3c7fec1',
      description: 'desc',
      versionNumber: 2,
      author: 'author',
      projectId: '60dc016f3626bc13d3c7fec4',
      modelType: ModelModelTypeEnum.Classification,
      isExport: false
    };

    jest.spyOn(addData, 'isSchemaDefinitionValid').mockReturnValue(false);
    jest.spyOn(addData, 'useFeatureSet').mockReturnValue({
      featureSets: [],
      setFeatureSets: jest.fn(),
      selectedFeatureSetId: 'selectedFeatureSetId',
      setSelectedFeatureSetId: jest.fn(),
      featureSetVersions: [],
      setFeatureSetVersions: jest.fn(),
      featureSetVersionId: '',
      setFeatureSetVersionId: jest.fn(),
      isOptionsLoading: false,
      setIsOptionsLoading: jest.fn(),
      featureSetVersion: trainingSetVersion,
      setFeatureSetVersion: jest.fn(),
      modelType: ModelModelTypeEnum.Classification,
      setModelType: jest.fn()
    });

    const view = render(<AddDataComponent {...props} />);

    expect(view.getByDominoTestId('model-type')).toBeTruthy();
    await waitFor(() => expect(view.queryByText('Prediction Data')).toBeTruthy());
    expect(view.getByDominoTestId('feature-set-input')).toBeTruthy();
    expect(view.queryByDominoTestId('feature-set-schema-error-message')).toBeFalsy();
    expect(view.queryByText('Ground Truth Data')).toBeFalsy();

    jest.restoreAllMocks();
  });

  it('should test getVariableType', () => {
    expect(getVariableType('a', 'a')).toEqual(VariableType.Prediction);
    expect(getVariableType('a', undefined)).toEqual(VariableType.Feature);
  });

  it('should test getColumnsByType', () => {
    expect(getColumnsByType(trainingSetVersion)).toEqual({
      predictionColumn: 'output1',
      categoricalColumns: ['feature1', 'output2'],
      numericalColumns: ['output1', 'feature3']
    });
  });

  it('should test getModelConfig', () => {
    expect(
      getModelConfig(
        trainingSetVersion,
        'modelName',
        'featureSetId',
        'featureSetVersionId',
        2,
        ModelModelTypeEnum.Classification,
        'description',
        'author',
        'workbenchModelVersionId',
        'workbenchModelId'
      )
    ).toEqual({
      variables: createModelSchema(trainingSetVersion),
      datasetDetails: {
        name: `${trainingSetVersion.trainingSetName}-${trainingSetVersion.number}`,
        datasetType: DatasetConfigRegistrationRequestDatasetTypeEnum.File,
        datasetConfig: {
          path: `${trainingSetVersion.path}`,
          fileFormat: FileFormat.Parquet
        },
        datasourceName: dataSourceName,
        datasourceType: DatasourceType.Nfs,
        featureSetId: 'featureSetId',
        featureSetVersionId: 'featureSetVersionId'
      },
      modelMetadata: {
        name: 'modelName',
        modelType: ModelModelTypeEnum.Classification,
        version: `2`,
        description: 'description',
        author: 'author',
        sourceType: SourceType.DominoWorkbench,
        sourceDetails: {
          workbenchModelId: 'workbenchModelId',
          workbenchModelVersionId: 'workbenchModelVersionId'
        }
      }
    });
  });
});
