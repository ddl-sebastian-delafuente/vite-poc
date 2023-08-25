import { BarType } from "../components/charts/BarPlot/BarPlot";

export interface Tag {
  key: string;
  value: string;
}

export enum LifecycleStage {
  ACTIVE = 'active',
  DELETED = 'deleted'
}

export interface Experiment {
  experiment_id: string;
  name: string;
  artifact_location: string;
  lifecycle_stage: LifecycleStage;
  last_update_time: number;
  creation_time: number;
  tags: Tag[];
}

export interface ExperimentList {
  experiments: Experiment[];
  next_page_token?: string;
}

export enum RunStatus {
  RUNNING = 'RUNNING',
  SCHEDULED = 'SCHEDULED',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
  KILLED = 'KILLED'
}

export interface RunInfo {
  run_id: string;
  run_name: string;
  experiment_id: string;
  user_id: string;
  status: RunStatus;
  start_time: number;
  end_time: number;
  artifact_uri: string;
  lifecycle_stage: LifecycleStage;
}

export interface Metric {
  key: string;
  value: number;
  timestamp: number;
  step: number;
}

export interface Param {
  key: string;
  value: string;
}

export interface RunData {
  metrics?: Metric[];
  params?: Param[];
  tags: Tag[];
}

export interface Run {
  info: RunInfo;
  data: RunData;
}

export interface RunsData {
  runs: Run[];
  next_page_token?: string;
}

export enum ViewType {
  ACTIVE = 'ACTIVE_ONLY',
  DELETED = 'DELETED_ONLY',
  ALL = 'ALL'
}

export interface Log {
  'timestamp': number;
  'logType': 'stdout' | 'stderr' | 'prepareoutput' | 'complete' | 'stdoutstderr';
  'log': string;
  'size': number;
}

export interface FileInfo {
  path: string;
  is_dir: boolean;
  file_size: number;
}

export interface Artifacts {
  root_uri: string;
  files: FileInfo[];
  next_page_token?: string;
  domino_root_uri: string;
}

export interface MetricHistory {
  metrics: Metric[];
  next_page_token?: string;
}

export interface MetricWithRunId {
  key: string;
  value: number;
  timestamp: number;
  step: number;
  run_id: string;
}

export interface BulkMetricHistory {
  metrics: MetricWithRunId[];
  next_page_token?: string;
}

export enum SourceType {
  NOTEBOOK = 'NOTEBOOK',
  JOB = 'JOB',
  UNKNOWN = 'UNKNOWN'
}

export type ExperimentRunData = {
  runId: string,
  run?: Run,
  children?: ExperimentRunData[],
};

export type GetExperimentRunsParams = {
  orderBy?: string,
  resetData?: boolean,
  _isFilterApplied?: boolean,
  persistPageSize?: boolean,
  isRefreshing?: boolean;
  _searchString?: string
  viewType?: ViewType
};

export type GetExperimentsParams = {
  viewType?: ViewType
};

export enum ChartType {
  ParallelCoordinatesPlot = 'Parallel Coordinates Plot',
  ScatterPlot = 'Scatter Plot',
  LinePlot = 'Line',
  BarPlot = 'Bar'
}

export enum LineXAxisType {
  STEP = 'Step',
  WALL_TIME = 'Wall Time',
  DURATION = 'Duration'
}

export enum LineYAxisType {
  LOG_SCALE = 'Log Scale',
  LINEAR = 'Linear'
}

export enum Outliers {
  INCLUDE = 'Include',
  EXCLUDE = 'Exclude'
}

export interface ChartConfig {
  chartType: ChartType;
  pcTargets: string[];
  pcParams: string[];
  scatterXAxis?: string;
  scatterYAxis?: string;
  scatterZAxis?: string;
  lineXAxis: LineXAxisType;
  lineYAxis: string[];
  lineYAxisType: LineYAxisType;
  runsCount: number;
  barXAxis?: string[];
  barType?: BarType;
}

export interface FormattedRun extends RunInfo {
  metrics: { [key: string]: number };
  params: { [key: string]: string };
  name: string;
}

export enum ModelVersionStatus {
  PENDING_REGISTRATION = 'PENDING_REGISTRATION',
  FAILED_REGISTRATION = 'FAILED_REGISTRATION',
  READY = 'READY'
}

export interface ModelVersion {
  name: string;
  version: string;
  creation_timestamp: number;
  last_updated_timestamp?: number;
  user_id?: string;
  current_stage?: string;
  description?: string;
  source?: string;
  run_id?: string;
  status?: ModelVersionStatus;
  status_message?: string;
  tags: Tag[];
  run_link?: string;
  aliases: string[];
}

export interface ModelVersionList {
  model_versions: ModelVersion[];
  next_page_token?: string;
}

export interface LoggedModels {
  artifactPath: string;
  flavors: string[];
  utcTimeCreated: number;
}

export interface ScatterPoint {
  val: number | null;
  displayVal: string | number | null;
}
