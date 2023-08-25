export const _15_MIN = 15 * 60 * 1000;
export const _20_MIN = 20 * 60 * 1000;
export const _30_MIN = 30 * 60 * 1000;

export const STOPPED = 'stopped';
export const RUNNING = 'running';
export const INIT = 'initialState';
export const POLLING_STOP_REASON_ENDED = 'ended';
export const POLLING_STOP_REASON_FAILED = 'failed';
export const POLLING_STOP_REASON_SUCCEEDED = 'succeeded';
export const POLLING_STOP_REASON_NOT_STOPPED = 'notstopped';

const TOTAL_FAILED_POLLS = 'totalFailedPolls';
const POLL_STATUS = 'status';
const ERROR_STATUS = 'error';

export const OFF_LIMITS_PROPERTIES = [
  TOTAL_FAILED_POLLS,
  POLL_STATUS,
  ERROR_STATUS,
];

export const NO_ERROR = {};
