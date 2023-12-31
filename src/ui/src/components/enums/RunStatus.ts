// RA: Ideally this would be generated by Swagger from [[domino.common.models.RunStatus]].
// For now, keep them in sync.
export enum RunStatus {
  // Initial state
  Queued = 'Queued',

  // In the process of transitioning to Running
  Scheduled = 'Scheduled',
  Pending = 'Pending',
  Preparing = 'Preparing',
  Building = 'Building',
  Pulling = 'Pulling',

  // Actually running code
  Running = 'Running',
  Serving = 'Serving',

  // Not true statuses, but flags or signals
  StopRequested = 'StopRequested',
  StopAndDiscardRequested = 'StopAndDiscardRequested',

  // In the process of transitioning to a final state.
  Stopping = 'Stopping',
  Finishing = 'Finishing',

  // Final States
  Stopped = 'Stopped',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Error = 'Error',
  NeverStarted = 'NeverStarted'
}

// Useful state sets copied from [domino.common.models.RunStatus]]
export const NOT_STARTED_STATES = [
  RunStatus.Queued,
  RunStatus.Pending
];
export const STARTING_STATES = [
  RunStatus.Scheduled,
  RunStatus.Pending,
  RunStatus.Preparing,
  RunStatus.Building,
  RunStatus.Pulling,
];
export const RUNNING_STATES = [
  RunStatus.Running,
  RunStatus.Serving
];
export const ACTIVE_STATES = [
  ...STARTING_STATES,
  ...RUNNING_STATES
];
export const COMPLETING_STATES = [
  RunStatus.StopRequested,
  RunStatus.StopAndDiscardRequested,
  RunStatus.Stopping,
  RunStatus.Finishing
];
export const IN_PROGRESS_STATES = [
  ...STARTING_STATES,
  ...RUNNING_STATES,
  ...COMPLETING_STATES
];
export const NORMAL_COMPLETED_STATES = [
  RunStatus.Stopped,
  RunStatus.Succeeded,
  RunStatus.Failed
];
export const UNSUCCESSFUL_STATES = [
  RunStatus.Failed,
  RunStatus.NeverStarted,
  RunStatus.Error
];
export const SUCCESSFUL_STATES = [
  RunStatus.Stopped,
  RunStatus.Succeeded
];
export const COMPLETED_STATES = [
  ...UNSUCCESSFUL_STATES,
  ...SUCCESSFUL_STATES
];
export const ALL_STATES = [
  RunStatus.Queued,
  ...IN_PROGRESS_STATES,
  ...COMPLETED_STATES
];
export const STOPPABLE_STATES = [
  RunStatus.Queued,
  ...ACTIVE_STATES
];

// Some more useful state sets
export const LOADING_STATES = [
  RunStatus.Queued,
  ...STARTING_STATES
];
