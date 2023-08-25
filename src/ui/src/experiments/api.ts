import {
  Experiment,
  ExperimentList,
  Run,
  RunsData,
  ViewType,
  Artifacts,
  MetricHistory,
  BulkMetricHistory,
  ModelVersionList
} from './types';
import { httpRequest } from '@domino/api/dist/httpRequest';

const MLFLOW_BASE_PATH = `${window.location.origin}/api/2.0/mlflow`;

const getHeaders = () => {
  const headers = {
    accept: '*/*',
    'Content-Type': 'application/json',
  };
  return headers;
};

export const listExperiments: () => Promise<ExperimentList> = () => {
  return httpRequest('GET',
    `${MLFLOW_BASE_PATH}/experiments/list`,
    undefined,
    {},
    getHeaders(),
    null,
    true,
  );
};

export const searchExperiments: (params: { projectId: string, experiment_view_type?: ViewType}) => Promise<ExperimentList> = ({projectId, experiment_view_type}) => {
  return httpRequest('POST',
    `${MLFLOW_BASE_PATH}/experiments/search`,
    {filter: `tags.mlflow.domino.project_id = '${projectId}'`, max_results: 3000, view_type:experiment_view_type},
    {},
    getHeaders(),
    null,
    true,
  );
};

export const getExperiment: (params: { experiment_id: string }) => Promise<{ experiment: Experiment }> = ({experiment_id}) => {
  return httpRequest('GET',
    `${MLFLOW_BASE_PATH}/experiments/get`,
    undefined,
    {experiment_id},
    getHeaders(),
    null,
    true,
  );
};

export const updateExperimentName: (params: { experiment_id: string, new_name?: string }) => Promise<void> =
  ({experiment_id, new_name}) => {
    return httpRequest('POST',
      `${MLFLOW_BASE_PATH}/experiments/update`,
      {
        experiment_id,
        new_name
      },
      {},
      getHeaders(),
      null,
      true,
    );
  };

export const deleteExperiment: (params: { experiment_id: string }) => Promise<void> = ({experiment_id}) => {
  return httpRequest('POST',
    `${MLFLOW_BASE_PATH}/experiments/delete`,
    {experiment_id},
    {},
    getHeaders(),
    null,
    true,
  );
};

export const restoreExperiment: (params: { experiment_id: string }) => Promise<void> = ({experiment_id}) => {
  return httpRequest('POST',
    `${MLFLOW_BASE_PATH}/experiments/restore`,
    {experiment_id},
    {},
    getHeaders(),
    null,
    true,
  );
};

export const getRun: (params: { run_id: string }) => Promise<{ run: Run }> = ({run_id}) => {
  return httpRequest('GET',
    `${MLFLOW_BASE_PATH}/runs/get`,
    undefined,
    {run_id},
    getHeaders(),
    null,
    true,
  );
};

export const searchRuns: (params: {
  experiment_ids: string[],
  filter?: string,
  run_view_type?: ViewType,
  max_results?: number,
  order_by?: string[],
  page_token?: string
}) => Promise<RunsData> = (
  {
    experiment_ids,
    filter,
    run_view_type,
    max_results,
    order_by,
    page_token
  }
) => {
  return httpRequest('POST',
    `${MLFLOW_BASE_PATH}/runs/search`,
    {
      experiment_ids,
      filter: filter,
      run_view_type: run_view_type,
      max_results: max_results,
      order_by: order_by,
      page_token: page_token
    },
    {},
    getHeaders(),
    null,
    true,
  );
};

export const setTag: (params: { run_id: string, key: string, value: string }) => Promise<void> =
  ({run_id, key, value}) => {
    return httpRequest('POST',
      `${MLFLOW_BASE_PATH}/runs/set-tag`,
      {
        run_id,
        key: key,
        value: value
      },
      {},
      getHeaders(),
      null,
      true,
    );
  };

export const deleteTag: (params: { run_id: string, key: string }) => Promise<void> =
  ({run_id, key}) => {
    return httpRequest('POST',
      `${MLFLOW_BASE_PATH}/runs/delete-tag`,
      {
        run_id,
        key: key
      },
      {},
      getHeaders(),
      null,
      true,
    );
  };

export const updateRunName: (params: { run_id: string, name?: string }) => Promise<void> =
  ({run_id, name}) => {
    return httpRequest('POST',
      `${MLFLOW_BASE_PATH}/runs/update`,
      {
        run_id,
        run_name: name
      },
      {},
      getHeaders(),
      null,
      true,
    );
  };

export const deleteRun: (params: { run_id: string }) => Promise<void> = ({run_id}) => {
  return httpRequest('POST',
    `${MLFLOW_BASE_PATH}/runs/delete`,
    {run_id},
    {},
    getHeaders(),
    null,
    true,
  );
};

export const restoreRun: (params: { run_id: string }) => Promise<void> = ({run_id}) => {
  return httpRequest('POST',
    `${MLFLOW_BASE_PATH}/runs/restore`,
    {run_id},
    {},
    getHeaders(),
    null,
    true,
  );
};

export const listArtifacts: (params: {
  run_id: string,
  path?: string,
  page_token?: string
}) => Promise<Artifacts> = (
  {
    run_id,
    path,
    page_token
  }) => {
  return httpRequest('GET',
    `${MLFLOW_BASE_PATH}/artifacts/list`,
    undefined,
    (path && page_token) ? { run_id, path, page_token } : ((path && !page_token) ? { run_id, path } : ((!path && page_token) ? { run_id, page_token } : { run_id })) ,
    getHeaders(),
    null,
    true,
  );
};

export const getMetricHistory: (params: {
  run_id: string,
  metric_key: string
}) => Promise<MetricHistory> = (
  {
    run_id,
    metric_key
  }) => {
  return httpRequest('GET',
    `${MLFLOW_BASE_PATH}/metrics/get-history`,
    undefined,
    {run_id, metric_key},
    getHeaders(),
    null,
    true,
  );
};

export const getBulkMetricHistory: (params: {
  run_ids: string[],
  metric_key: string,
  max_results?: number
}) => Promise<BulkMetricHistory> = (
  {
    run_ids,
    metric_key,
    max_results = 25000
  }) => {
  return httpRequest('GET',
    `${window.location.origin}/ajax-api/2.0/mlflow/metrics/get-history-bulk?${run_ids.join('&')}&metric_key=${metric_key}&max_results=${max_results}`,
    undefined,
    {},
    getHeaders(),
    null,
    true,
  );
};

export const searchModelVersions: (params: {
  filter?: string,
  max_results?: number,
  order_by?: string[],
  page_token?: string
}) => Promise<ModelVersionList> = (params) => {
  return httpRequest('GET',
    `${MLFLOW_BASE_PATH}/model-versions/search`,
    undefined,
    params,
    getHeaders(),
    null,
    true,
  );
};
