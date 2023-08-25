import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import { ModelModelTypeEnum, ModelResponseModelTypeEnum } from '@domino/api/dist/dmm-api-client';
import { modelResponse, projectSummary } from '@domino/test-utils/dist/mocks';
import * as addData from '../AddData';
import * as monitoring from '../ModelMonitoring';
import {
  configureMonitoringOptions,
  ModelMonitoring,
  VersionsDropdown,
  handleVersionChange,
  getConfigureMonitoringOptions,
  handleConfigureDataChange,
  ConfigureMonitoringDropdown,
  getDefaultModelVersion,
  configureDataAndVersionEffectHook,
  getBadgeUpdateDependencies,
  getConfigureDataDependencies,
  MonitoringDriftAndQuality
} from '../ModelMonitoring';
import {
  datasets,
  dmmModel,
  modelVersionDetail1,
  modelVersionDetail2,
  scheduleCheck,
  trainingSetVersion
} from '../mockData';

jest.mock('@domino/api/dist/Projects', () => ({
  getProjectSummary: () => projectSummary
}));
jest.mock('@domino/api/dist/Datasetrw', () => ({
  getDatasetsV2: () => datasets
}));

afterAll(() => {
  jest.unmock('@domino/api/dist/Projects');
  jest.unmock('@domino/api/dist/Datasetrw');
  jest.resetModules();
});

describe('ModelMonitoring', () => {
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

  const monitoringBaseState = {
    activeConfigureMonitoringOption: configureMonitoringOptions.data,
    setActiveConfigureMonitoringOption: jest.fn(),
    isIframeLoading: false,
    setIsIframeLoading: jest.fn(),
    selectedVersion: {
      ...modelVersionDetail1,
      id: '60dc31603626bc13d3c7feef',
    },
    setSelectedVersion: jest.fn(),
    monitoredModelId: '60dc31603626bc13d3c7feef',
    setMonitoredModelId: jest.fn(),
    isPredictionDataAdded: false,
    setIsPredictionDataAdded: jest.fn(),
    modelType: ModelResponseModelTypeEnum.Classification,
    setModelType: jest.fn(),
    isLoading: true,
    hasDriftOrQualityCheck: true,
    scheduleCheckPaused: false,
    setScheduleCheckPaused: jest.fn(),
    scheduleCheckCronExpression: "* * * * *",
    setScheduleCheckCronExpression: jest.fn(),
    scheduleCheckTimezone: "UTC",
    setScheduleCheckTimezone: jest.fn(),
  };

  const modelMonitoringProps = {
    modelName: 'modelName',
    modelVersionsDetail: [modelVersionDetail1, modelVersionDetail2],
    modelId: '60dc31603626bc13d3c7feeg',
    activeModelVersionId: '60dc31603626bc13d3c7feeh',
    projectId: '160feeg60dc33626bc13d3c7'
  };

  const versionDropdownProps = {
    modelVersionsDetail: [modelVersionDetail1, modelVersionDetail2],
    selectedVersion: modelVersionDetail1,
    setModelVersion: jest.fn()
  };

  const addDataProps = {
    setActiveMenu: jest.fn(),
    isPredictionDataAdded: true
  };

  it('Should test ModelMonitoring when fetching DMM details show Loading', () => {
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(monitoringBaseState);
    const { getByDominoTestId, queryByDominoTestId } = render(<ModelMonitoring {...modelMonitoringProps} />);
    expect(getByDominoTestId('monitoring-actions-container')).toBeTruthy();
    expect(getByDominoTestId('add-data-modal')).toBeTruthy();
    expect(queryByDominoTestId('tests-and-thresholds-modal')).toBeFalsy();
    expect(queryByDominoTestId('schedule-checks-modal')).toBeFalsy();
    expect(queryByDominoTestId('alert-recipients-modal')).toBeFalsy();
    expect(queryByDominoTestId('drift-and-quality-container')).toBeFalsy();
    expect(queryByDominoTestId('not-monitored-state')).toBeFalsy();
  });

  it('Should test ModelMonitoring (without DMM model)', () => {
    const monitoringState = { ...monitoringBaseState, monitoredModelId: undefined, isLoading: false };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(monitoringState);
    const { getByDominoTestId, queryByDominoTestId } = render(<ModelMonitoring {...modelMonitoringProps} />);
    expect(getByDominoTestId('monitoring-actions-container')).toBeTruthy();
    expect(getByDominoTestId('not-monitored-state')).toBeTruthy();
    expect(getByDominoTestId('add-data-modal')).toBeTruthy();
    expect(queryByDominoTestId('tests-and-thresholds-modal')).toBeFalsy();
    expect(queryByDominoTestId('schedule-checks-modal')).toBeFalsy();
    expect(queryByDominoTestId('alert-recipients-modal')).toBeFalsy();
    expect(queryByDominoTestId('drift-and-quality-container')).toBeFalsy();
  });

  it('Should test ModelMonitoring (with DMM model and without prediction data)', () => {
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue({ ...monitoringBaseState, isLoading: false });
    const { getByDominoTestId, queryByDominoTestId } = render(<ModelMonitoring {...modelMonitoringProps} />);
    expect(getByDominoTestId('monitoring-actions-container')).toBeTruthy();
    expect(getByDominoTestId('add-data-modal')).toBeTruthy();
    expect(getByDominoTestId('drift-and-quality-container')).toBeTruthy();
    expect(queryByDominoTestId('tests-and-thresholds-modal')).toBeFalsy();
    expect(queryByDominoTestId('schedule-checks-modal')).toBeFalsy();
    expect(queryByDominoTestId('alert-recipients-modal')).toBeFalsy();
    expect(queryByDominoTestId('not-monitored-state')).toBeFalsy();
  });

  it('Should test ModelMonitoring (with DMM model and without both drift and quality checks)', () => {
    const monitoringMock = { ...monitoringBaseState, isLoading: false, hasDriftOrQualityCheck: false };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(monitoringMock);
    const { getByDominoTestId, queryByDominoTestId } = render(<ModelMonitoring {...modelMonitoringProps} />);
    expect(getByDominoTestId('monitoring-actions-container')).toBeTruthy();
    expect(getByDominoTestId('add-data-modal')).toBeTruthy();
    expect(getByDominoTestId('not-monitored-state')).toBeTruthy();
    expect(queryByDominoTestId('tests-and-thresholds-modal')).toBeFalsy();
    expect(queryByDominoTestId('schedule-checks-modal')).toBeFalsy();
    expect(queryByDominoTestId('alert-recipients-modal')).toBeFalsy();
    expect(queryByDominoTestId('drift-and-quality-container')).toBeFalsy();
  });

  it('Should test ModelMonitoring (without running versions)', () => {
    const monitoringMock = { ...monitoringBaseState, isPredictionDataAdded: true, isLoading: false, selectedVersion: undefined };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(monitoringMock);
    const { getByDominoTestId, queryByDominoTestId } = render(
      <ModelMonitoring
        {...modelMonitoringProps}
        modelVersionsDetail={[
          { ...modelVersionDetail1, modelVersionStatus: '' },
          { ...modelVersionDetail2, modelVersionStatus: '' }
        ]}
      />
    );
    expect(getByDominoTestId('not-monitored-state')).toBeTruthy();
    expect(queryByDominoTestId('versions-dropdown')).toBeFalsy();
    expect(queryByDominoTestId('add-data-modal')).toBeFalsy();
    expect(queryByDominoTestId('tests-and-thresholds-modal')).toBeFalsy();
    expect(queryByDominoTestId('schedule-checks-modal')).toBeFalsy();
    expect(queryByDominoTestId('alert-recipients-modal')).toBeFalsy();
    expect(queryByDominoTestId('drift-and-quality-container')).toBeFalsy();
  });

  it('Should test ModelMonitoring (with single running version)', () => {
    const monitoringMock = { ...monitoringBaseState, isPredictionDataAdded: true, isLoading: false };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(monitoringMock);
    const { getByDominoTestId, queryByDominoTestId } = render(
      <ModelMonitoring
        {...modelMonitoringProps}
        modelVersionsDetail={[
          { ...modelVersionDetail1, modelVersionStatus: 'Running' },
          { ...modelVersionDetail2, modelVersionStatus: '' }
        ]}
      />
    );
    expect(queryByDominoTestId('versions-dropdown')).toBeFalsy();
    expect(getByDominoTestId('add-data-modal')).toBeTruthy();
    expect(getByDominoTestId('configure-monitoring-dropdown-button')).toBeTruthy();
  });

  it('Should test ModelMonitoring (with multiple running versions)', () => {
    const monitoringMock = { ...monitoringBaseState, isPredictionDataAdded: true };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(monitoringMock);
    const { getByDominoTestId } = render(
      <ModelMonitoring
        {...modelMonitoringProps}
        modelVersionsDetail={[
          { ...modelVersionDetail1, modelVersionStatus: 'Running' },
          { ...modelVersionDetail2, modelVersionStatus: 'Running' }
        ]}
      />
    );
    expect(getByDominoTestId('versions-dropdown')).toBeTruthy();
    expect(getByDominoTestId('add-data-modal')).toBeTruthy();
    expect(getByDominoTestId('configure-monitoring-dropdown-button')).toBeTruthy();
  });

  it('Should test ModelMonitoring (with DMM model and with prediction data)', async () => {
    const monitoringMock = { ...monitoringBaseState, isLoading: false, isPredictionDataAdded: true };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(monitoringMock);

    const { getByDominoTestId, queryByDominoTestId, rerender } = render(<ModelMonitoring {...modelMonitoringProps} />);
    expect(getByDominoTestId('monitoring-actions-container')).toBeTruthy();
    expect(getByDominoTestId('add-data-modal')).toBeTruthy();
    expect(getByDominoTestId('tests-and-thresholds-modal')).toBeTruthy();
    expect(getByDominoTestId('drift-and-quality-container')).toBeTruthy();
    expect(queryByDominoTestId('alert-recipients-modal')).toBeFalsy();
    expect(queryByDominoTestId('not-monitored-state')).toBeFalsy();

    const scheduleMonitoringMock = { ...monitoringMock, activeConfigureMonitoringOption: configureMonitoringOptions.schedule };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(scheduleMonitoringMock);
    rerender(<ModelMonitoring {...modelMonitoringProps} />);
    expect(getByDominoTestId('schedule-checks-modal')).toBeTruthy();
    expect(getByDominoTestId('schedule-check-container')).toBeTruthy();

    const notificationMonitoringMock = { ...monitoringMock, activeConfigureMonitoringOption: configureMonitoringOptions.notification };
    jest.spyOn(monitoring, 'useMonitoring').mockReturnValue(notificationMonitoringMock);
    rerender(<ModelMonitoring {...modelMonitoringProps} />);
    expect(getByDominoTestId('alert-recipients-modal')).toBeTruthy();
    expect(getByDominoTestId('alert-recipients-notification')).toBeTruthy();
  });

  it('should test VersionsDropdown', () => {
    const { getByDominoTestId } = render(<VersionsDropdown {...versionDropdownProps} />);
    expect(getByDominoTestId('versions-dropdown')).toBeTruthy();
    expect(getByDominoTestId('versions-dropdown-select')).toBeTruthy();
  });

  it('should test handleVersionChange', () => {
    const mockSetModelVersion = jest.fn();

    handleVersionChange('id', [modelVersionDetail1, modelVersionDetail2], mockSetModelVersion);
    expect(mockSetModelVersion).toHaveBeenCalledTimes(1);
    expect(mockSetModelVersion).toHaveBeenCalledWith(modelVersionDetail1);
  });

  it('should test getConfigureMonitoringOptions', () => {
    expect(getConfigureMonitoringOptions(false)).toEqual([
      {
        label: configureMonitoringOptions.data,
        disabled: false
      },
      {
        label: configureMonitoringOptions.testsAndThresholds,
        disabled: true
      },
      {
        label: configureMonitoringOptions.notification,
        disabled: true
      },
      {
        label: configureMonitoringOptions.schedule,
        disabled: true
      }
    ]);
    expect(getConfigureMonitoringOptions(true)).toEqual([
      {
        label: configureMonitoringOptions.data,
        disabled: false
      },
      {
        label: configureMonitoringOptions.testsAndThresholds,
        disabled: false
      },
      {
        label: configureMonitoringOptions.notification,
        disabled: false
      },
      {
        label: configureMonitoringOptions.schedule,
        disabled: false
      }
    ]);
  });

  it('should test handleConfigureDataChange', () => {
    const mockHandleConfigureDataChange = jest.fn();
    handleConfigureDataChange('key', mockHandleConfigureDataChange);
    expect(mockHandleConfigureDataChange).toHaveBeenCalledTimes(1);
    expect(mockHandleConfigureDataChange).toHaveBeenCalledWith('key');
  });

  it('should test ConfigureMonitoringDropdown', () => {
    expect(render(<ConfigureMonitoringDropdown {...addDataProps} />)
      .getByDominoTestId('configure-monitoring-dropdown-button')).toBeTruthy();
  });

  it('should test getDefaultModelVersion', () => {
    expect(getDefaultModelVersion(modelMonitoringProps.modelVersionsDetail, modelVersionDetail2.id)).toEqual(
      modelVersionDetail2
    );
    expect(getDefaultModelVersion(modelMonitoringProps.modelVersionsDetail, null)).toEqual(modelVersionDetail1);
    expect(getDefaultModelVersion([], modelVersionDetail2.id)).toEqual(undefined);
  });

  it('should test configureDataAndVersionEffectHook', async () => {
    const mockSetMonitoredModelId = jest.fn();
    const mockSetIsPredictionDataAdded = jest.fn();
    const mockSetMonitoredModelType = jest.fn();
    const mockSetLoading = jest.fn();
    const mockHasCheck = jest.fn();
    const mockSetIframeLoading = jest.fn();
    const mockSetScheduleCheckPaused = jest.fn();
    const mockSetScheduleCheckCronExpression = jest.fn();
    const mockSetScheduleCheckTimezone = jest.fn();
    jest.spyOn(monitoring, 'getMonitoredModel').mockReturnValue(Promise.resolve({...modelResponse, ...dmmModel}));
    jest.spyOn(monitoring, 'doesPredictionDataExist').mockReturnValue(Promise.resolve(false));
    jest.spyOn(monitoring, 'doesDriftOrQualityCheckExist').mockReturnValue(Promise.resolve(false));
    jest.spyOn(monitoring, 'getScheduleCheckData').mockReturnValue(Promise.resolve({...scheduleCheck, "isPaused": true, cronExpression: '* * * * *', timezone: 'UTC'}));

    await configureDataAndVersionEffectHook(
      '6140bb60113cb0792a1b9778',
      '6140bb60113cb0792a1b9779',
      mockSetMonitoredModelId,
      mockSetIsPredictionDataAdded,
      mockSetMonitoredModelType,
      mockSetLoading,
      mockHasCheck,
      mockSetIframeLoading,
      mockSetScheduleCheckPaused,
      mockSetScheduleCheckCronExpression,
      mockSetScheduleCheckTimezone
    );
    expect(mockSetMonitoredModelId).toHaveBeenCalledTimes(1);
    expect(mockSetIsPredictionDataAdded).toHaveBeenCalledTimes(1);
    expect(mockSetMonitoredModelId).toHaveBeenCalledWith(dmmModel.id);
    expect(mockSetMonitoredModelType).toHaveBeenCalledTimes(1);
    expect(mockSetMonitoredModelType).toHaveBeenCalledWith(dmmModel.modelType);
    expect(mockSetIsPredictionDataAdded).toHaveBeenCalledWith(false);
    expect(mockHasCheck).toHaveBeenCalledWith(false);
    expect(mockSetIframeLoading).toHaveBeenCalledWith(false);
    expect(mockSetScheduleCheckPaused).toHaveBeenCalledWith(true);

    jest.clearAllMocks();

    jest.spyOn(monitoring, 'getMonitoredModel').mockReturnValue(Promise.resolve(null));
    jest.spyOn(monitoring, 'doesPredictionDataExist').mockReturnValue(Promise.resolve(false));
    jest.spyOn(monitoring, 'doesDriftOrQualityCheckExist').mockReturnValue(Promise.resolve(true));
    jest.spyOn(monitoring, 'getScheduleCheckData').mockReturnValue(Promise.resolve(false));

    await configureDataAndVersionEffectHook(
      '6140bb60113cb0792a1b9778',
      '6140bb60113cb0792a1b9779',
      mockSetMonitoredModelId,
      mockSetIsPredictionDataAdded,
      mockSetMonitoredModelType,
      mockSetLoading,
      mockHasCheck,
      mockSetIframeLoading,
      mockSetScheduleCheckPaused,
      mockSetScheduleCheckCronExpression,
      mockSetScheduleCheckTimezone
    );
    expect(mockSetMonitoredModelId).toHaveBeenCalledTimes(1);
    expect(mockSetMonitoredModelType).toHaveBeenCalledTimes(1);
    expect(mockSetMonitoredModelType).toHaveBeenCalledWith(undefined);
    expect(mockSetIsPredictionDataAdded).toHaveBeenCalledTimes(1);
    expect(mockSetMonitoredModelId).toHaveBeenCalledWith(undefined);
    expect(mockSetIsPredictionDataAdded).toHaveBeenCalledWith(false);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockHasCheck).toHaveBeenCalledWith(false);
    expect(mockSetIframeLoading).toHaveBeenCalledWith(false);
    expect(mockSetScheduleCheckPaused).toHaveBeenCalledWith(false);
  });

  it('tests MonitoringDriftAndQuality', () => {
    const monitoringDriftAndQualityProps = {
      isLoading: false,
      setIsIframeLoading: jest.fn(),
      monitoredModelId: 'monitoredModelId',
      hasDriftOrQualityCheck: false,
      scheduleCheckPaused: false,
      cronExpression: '* * * * *',
      timezone: 'UTC',
      isExport: false
    };

    const {
      queryByDominoTestId, getByDominoTestId, rerender
    } = render(<MonitoringDriftAndQuality {...monitoringDriftAndQualityProps} isLoading={true} monitoredModelId=""/>);
    expect(queryByDominoTestId('drift-and-quality-container')).toBeFalsy();
    expect(queryByDominoTestId('not-monitored-state')).toBeFalsy();

    rerender(<MonitoringDriftAndQuality {...monitoringDriftAndQualityProps} scheduleCheckPaused={true}/>);
    expect(queryByDominoTestId('drift-and-quality-container')).toBeFalsy();
    expect(getByDominoTestId('not-monitored-state')).toBeTruthy();

    rerender(<MonitoringDriftAndQuality {...monitoringDriftAndQualityProps} hasDriftOrQualityCheck={true}/>);
    expect(getByDominoTestId('drift-and-quality-container')).toBeTruthy();
    expect(queryByDominoTestId('not-monitored-state')).toBeFalsy();
  });

  it('should test getBadgeUpdateDependencies', () => {
    expect(getBadgeUpdateDependencies('versionId')).toEqual(['versionId']);
  });

  it('should test getConfigureDataDependencies', () => {
    expect(getConfigureDataDependencies('versionId', 'add data')).toEqual(['versionId', 'add data']);
  });
});
