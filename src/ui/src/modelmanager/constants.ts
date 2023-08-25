export const createModelMonitoringRoute = (modelId: string) => {
  return `/models/${modelId}/monitoring`;
};

export enum AlertType {
  Drift = 'modelDriftAlerts',
  Quality = 'modelQualityAlerts',
  DriftAndQuality = 'driftAndQuality',
  Predictions = 'predictions'
}

export enum EmptyStateTypes {
  NOT_MONITORED = 'Monitoring is not enabled',
  FINISH_CONFIGURING_MONITORING = 'Finish configuring monitoring',
  WAITING_FOR_SCHEDULE_CHECK_RESULTS = 'Waiting for results',
  WAITING_FOR_DATA_INGESTION = 'Waiting for data'
}
