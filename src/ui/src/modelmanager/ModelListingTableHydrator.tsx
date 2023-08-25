import React, { useEffect } from 'react';
import { forEach, isNil, keys, length, reduce, splitEvery } from 'ramda';
import { createRoot } from 'react-dom/client';
import { ModelVersionSummary } from '@domino/api/dist/dmm-api-client';
import { Domino30ThemeProvider } from '../styled';
import { workbenchApi } from '../dmmApis';
import { getLastNDaysEpochTime } from '../utils/common';
import ModelAlertsBadge from './ModelAlertsBadge';
import Predictions from './Predictions';
import { AlertType } from './constants';

const noDaysPrediction = 7;
const modelVersionSummaryApiChunkSize = 40;

interface ModelVersionDetails {
  modelId: string;
  modelVersionId: string;
}

interface Props {
  modelVersionDetails: Array<ModelVersionDetails>;
}

const renderAlerts = (
  count: number | null,
  toolTipMessage: string,
  modelId: string,
  renderingNode: string,
  showTooltip = true,
  clickable = true
) => {
  const node = document.getElementById(renderingNode);
  if (node) {
    createRoot(node).render(
      <ModelAlertsBadge
        loading={false}
        count={count}
        toolTipMessage={toolTipMessage}
        modelId={modelId}
        showTooltip={showTooltip}
        clickable={clickable}
      />
    );
  }
};

const renderPredictions = (
  predictionTrafficCount: number | null,
  modelId: string,
  predictionCountPrefix: string,
  versionId: string
): void => {
  const node = document.getElementById(`${predictionCountPrefix}-${versionId}`);
  if (node) {
    createRoot(node).render(
      <Domino30ThemeProvider>
        <Predictions modelId={modelId} loading={false} predictionsCount={predictionTrafficCount} />
      </Domino30ThemeProvider>
    );
  }
};

const renderEmptyDash = (elementId: string) => {
  const node = document.getElementById(elementId);
  if (node) {
    createRoot(node).render(<>&ndash;</>);
  }
};

export const fetchModelSummary = async (modelVersionIds: Array<string>): Promise<Array<ModelVersionSummary> | null> => {
  try {
    const { startDate, endDate } = getLastNDaysEpochTime(noDaysPrediction);
    const { data } = await workbenchApi.getModelVersionSummary(modelVersionIds.join(','), startDate, endDate);
    return data;
  } catch (e) {
    return null;
  }
};

export const pushToQueue = (fn: (...args: any[]) => void) => setTimeout(fn, 0);

export const getTooltipMessage = (count: number, msg: string): string => {
  if (isNaN(count)) {
    return 'Monitoring not enabled';
  } else if (count === 0) {
    return 'All checks passed.';
  } else {
    return msg;
  }
};

export const getTooltipMessageForDriftAndQuality = (
  alertType: AlertType,
  modelSummary?: ModelVersionSummary
): string => {
  if (isNil(modelSummary)) {
    return 'Monitoring not enabled';
  }

  const { driftedVariablesCount, failedMetricsCount } = modelSummary;
  switch (alertType) {
    case AlertType.Drift:
      return getTooltipMessage(
        driftedVariablesCount as number,
        `${driftedVariablesCount} features are currently outside their target range for drift`
      );
    case AlertType.Quality:
      return getTooltipMessage(
        failedMetricsCount as number,
        `${failedMetricsCount} metrics are currently outside their target range for model quality`
      );
    default:
      return 'Invalid alert type';
  }
};

export const getModelVersionIdToSummaryMap = (
  modelSummaryResponse: Array<ModelVersionSummary>
): Record<string, ModelVersionSummary> =>
  reduce(
    (acc, summary) => {
      const { workbenchModelVersionId } = summary;
      acc[workbenchModelVersionId] = summary;
      return acc;
    },
    {},
    modelSummaryResponse
  );

export const getModelVersionIdToModelIdMap = (
  modelVersionDetails: Array<ModelVersionDetails>
): Record<string, string> => {
  return reduce(
    (accumulator: Record<string, string>, versionDetail: ModelVersionDetails) => {
      const { modelVersionId, modelId } = versionDetail;
      accumulator[modelVersionId] = modelId;
      return accumulator;
    },
    {},
    modelVersionDetails
  );
};

export const hydrateAlertsForModelVersion = (
  versionId: string,
  modelId: string,
  modelSummary?: ModelVersionSummary
): void => {
  const driftedFeaturesCount =
    modelSummary && isNaN(modelSummary.driftedVariablesCount as number)
      ? null
      : (modelSummary?.driftedVariablesCount as number);
  const failedMetricsCount =
    modelSummary && isNaN(modelSummary.failedMetricsCount as number)
      ? null
      : (modelSummary?.failedMetricsCount as number);
  const predictionTrafficCount = isNil(modelSummary) ? null : (modelSummary.predictionTrafficCount as number);

  pushToQueue(() =>
    renderAlerts(
      driftedFeaturesCount,
      getTooltipMessageForDriftAndQuality(AlertType.Drift, modelSummary),
      modelId,
      `${AlertType.Drift}-${versionId}`
    )
  );

  pushToQueue(() =>
    renderAlerts(
      failedMetricsCount,
      getTooltipMessageForDriftAndQuality(AlertType.Quality, modelSummary),
      modelId,
      `${AlertType.Quality}-${versionId}`
    )
  );

  pushToQueue(() => renderPredictions(predictionTrafficCount, modelId, AlertType.Predictions, versionId));
};

export const hydrateModelApisTableWithMonitoringAlerts = async (
  modelVersionIds: Array<string>,
  modelVersionIdToModelIdMap: Record<string, string>
) => {
  const modelSummaryResponse: Array<ModelVersionSummary> | null = await fetchModelSummary(modelVersionIds);

  if (isNil(modelSummaryResponse)) {
    forEach((versionId) => {
      pushToQueue(() => renderEmptyDash(`${AlertType.Drift}-${versionId}`));
      pushToQueue(() => renderEmptyDash(`${AlertType.Quality}-${versionId}`));
      pushToQueue(() => renderEmptyDash(`${AlertType.Predictions}-${versionId}`));
    }, modelVersionIds);
    return;
  }

  const versionIdToSummaryMap = getModelVersionIdToSummaryMap(modelSummaryResponse);

  forEach((versionId) => {
    const modelSummary: ModelVersionSummary | null = versionIdToSummaryMap[versionId] || null;
    const modelId = modelVersionIdToModelIdMap[versionId];
    hydrateAlertsForModelVersion(versionId, modelId, modelSummary);
  }, modelVersionIds);
};

const modelListingTableHydratorEffectHook = (modelVersionDetails: Array<ModelVersionDetails>) =>
  (async () => {
    const modelVersionIdToModelIdMap: Record<string, string> = getModelVersionIdToModelIdMap(modelVersionDetails);
    const modelVersionIds = keys(modelVersionIdToModelIdMap);
    const splittedModelVersionIds = splitEvery(modelVersionSummaryApiChunkSize, modelVersionIds);

    forEach(async (modelVersionIdsChunk: Array<string>) => {
      await hydrateModelApisTableWithMonitoringAlerts(modelVersionIdsChunk, modelVersionIdToModelIdMap);
    }, splittedModelVersionIds);
  })();

export const ModelListingTableHydrator: React.FunctionComponent<Props> = ({ modelVersionDetails }) => {
  useEffect(() => {
    (() => modelListingTableHydratorEffectHook(modelVersionDetails))();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <React.Fragment />;
};

const monitoringTabHydratorEffectHook = async (modelVersionId: string) => {
  const summary = await fetchModelSummary([modelVersionId]);
  if (!isNil(summary) && length(summary)) {
    const [{ driftedVariablesCount, failedMetricsCount }] = summary;
    const driftedVarsCount: number = isNil(driftedVariablesCount) ? 0 : driftedVariablesCount;
    const failedMetsCount: number = isNil(failedMetricsCount) ? 0 : failedMetricsCount;
    const count: number = driftedVarsCount + failedMetsCount;
    if (count) {
      renderAlerts(count, '', '', AlertType.DriftAndQuality, false, false);
    }
  }
};

export const MonitoringTabBadge: React.FunctionComponent<{ modelVersionId: string }> = ({ modelVersionId }) => {
  useEffect(() => {
    (() => monitoringTabHydratorEffectHook(modelVersionId))();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <React.Fragment />;
};

export const MonitoringTabBadgeHydrator = MonitoringTabBadge;

export default ModelListingTableHydrator;
