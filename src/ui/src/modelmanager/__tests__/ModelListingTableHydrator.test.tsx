import React from 'react';
import { repeat } from 'ramda';
import { render } from '@domino/test-utils/dist/testing-library';
import { ModelVersionSummary } from '@domino/api/dist/dmm-api-client';
import * as dmmApis from '../../dmmApis';
import * as utils from '../../utils/common';
import * as tableHydratorMethods from '../ModelListingTableHydrator';
import { AlertType } from '../constants';
import { MonitoringTabBadge as MonitoringTabBadgeHydrator, ModelListingTableHydrator } from '../ModelListingTableHydrator';

describe('<ModelListingTableHydrator />', () => {
  const mdelVersionSummary: ModelVersionSummary = {
    workbenchModelVersionId: 'workbenchModelVersionId',
    driftedVariablesCount: 5,
    failedMetricsCount: 6,
    predictionTrafficCount: 100
  };

  afterAll(jest.resetModules);

  it('fetchModelSummary should return null when API fails', async () => {
    jest.spyOn(dmmApis.workbenchApi, 'getModelVersionSummary').mockImplementation(() => {
      throw new Error('Something went wrong');
    });
    const summary = await tableHydratorMethods.fetchModelSummary(['']);
    expect(summary).toBe(null);
  });

  it('fetchModelSummary should call summary API for a specified date range', async () => {
    const summaryAPImock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
    jest.spyOn(dmmApis.workbenchApi, 'getModelVersionSummary').mockImplementation(summaryAPImock);
    jest.spyOn(utils, 'getLastNDaysEpochTime').mockReturnValue({ startDate: 1, endDate: 12 });
    const summary = await tableHydratorMethods.fetchModelSummary(['']);
    expect(summary?.length).toBe(0);
    expect(summaryAPImock).toHaveBeenCalledWith('', 1, 12);
  });

  it('should test getTooltipMessageForAlert', () => {
    const msg = 'Count out of selected range';
    const count = undefined;
    // @ts-ignore
    expect(tableHydratorMethods.getTooltipMessage(count as number, msg)).toBe('Monitoring not enabled');
    expect(tableHydratorMethods.getTooltipMessage(0, msg)).toBe('All checks passed.');
    expect(tableHydratorMethods.getTooltipMessage(1, msg)).toBe(msg);
  });

  it('should test getTooltipMessage', () => {
    expect(tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.Drift, undefined)).toBe(
      'Monitoring not enabled'
    );
    const modelSummary = {
      workbenchModelVersionId: 'testVersionId',
      predictionTrafficCount: 12
    };

    expect(
      tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.Drift, {
        ...modelSummary,
        driftedVariablesCount: undefined
      })
    ).toBe('Monitoring not enabled');
    expect(
      tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.Drift, {
        ...modelSummary,
        driftedVariablesCount: 12
      })
    ).toBe('12 features are currently outside their target range for drift');
    expect(
      tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.Drift, {
        ...modelSummary,
        driftedVariablesCount: 0
      })
    ).toBe('All checks passed.');

    expect(
      tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.Quality, {
        ...modelSummary,
        failedMetricsCount: undefined
      })
    ).toBe('Monitoring not enabled');
    expect(
      tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.Quality, {
        ...modelSummary,
        failedMetricsCount: 12
      })
    ).toBe('12 metrics are currently outside their target range for model quality');
    expect(
      tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.Quality, {
        ...modelSummary,
        failedMetricsCount: 0
      })
    ).toBe('All checks passed.');

    expect(
      tableHydratorMethods.getTooltipMessageForDriftAndQuality(AlertType.DriftAndQuality, {
        ...modelSummary,
        failedMetricsCount: 0
      })
    ).toBe('Invalid alert type');
  });

  it('should test getModelVersionIdToSummaryMap', () => {
    const versionIdToModelIdMap1 = tableHydratorMethods.getModelVersionIdToSummaryMap([]);
    expect(versionIdToModelIdMap1).toEqual({});

    const summaryMock = {
      workbenchModelVersionId: '12',
      predictionTrafficCount: 12
    };
    const versionIdToModelIdMap2 = tableHydratorMethods.getModelVersionIdToSummaryMap([summaryMock]);
    expect(versionIdToModelIdMap2).toEqual({ '12': summaryMock });
  });

  it('should test getModelVersionIdToModelIdMap', () => {
    const versionIdToModelIdMap1 = tableHydratorMethods.getModelVersionIdToModelIdMap([]);
    expect(versionIdToModelIdMap1).toEqual({});

    const summaryMock = {
      modelVersionId: 'testModelVersionId',
      modelId: 'testModelId'
    };
    const versionIdToModelIdMap2 = tableHydratorMethods.getModelVersionIdToModelIdMap([summaryMock]);
    expect(versionIdToModelIdMap2).toEqual({ testModelVersionId: 'testModelId' });
  });

  it('ModelListingTableHydrator should render successfully and chunk size splitting API should be called', () => {
    jest.spyOn(tableHydratorMethods, 'hydrateModelApisTableWithMonitoringAlerts').mockImplementation(jest.fn());
    render(
      <ModelListingTableHydrator
        modelVersionDetails={repeat(1, 325).map((v, i) => ({ modelId: `modelId${i}`, modelVersionId: `modelVersionId${i}` }))}
      />);
    expect(tableHydratorMethods.hydrateModelApisTableWithMonitoringAlerts).toHaveBeenCalledTimes(9);
  });

  it('MonitoringTabBadgeHydrator should render successfully and fetchModelSummary API should be called', () => {
    jest.spyOn(tableHydratorMethods, 'fetchModelSummary').mockReturnValue(Promise.resolve([mdelVersionSummary]));
    render(<MonitoringTabBadgeHydrator modelVersionId="modelVersionId" />);
    expect(tableHydratorMethods.fetchModelSummary).toHaveBeenCalledTimes(1);
  });
});
