import {
  OFF_LIMITS_PROPERTIES,
  STOPPED,
  RUNNING,
  INIT,
  NO_ERROR,
  POLLING_STOP_REASON_ENDED,
  POLLING_STOP_REASON_FAILED,
  POLLING_STOP_REASON_SUCCEEDED,
  POLLING_STOP_REASON_NOT_STOPPED,
} from './PollerConstants';

export type MutableProperties = {
  backoffIndex?: number;
  notebookCumPollThresholds?: number[];
  notebookPollIntervals?: number[];
  onUpdate?: () => Promise<any>;
  onError?: () => void;
  onStop?: () => void;
  onMaxFailedPolls?: (error?: any) => void;
  intervalInMs?: number;
  maxFailedPolls?: number;
  gracePeriodMS?: number;
  withExponentialBackoff?: boolean;
};

const ONE_MINUTE = 60000;

export type Options = {
  onUpdate?: () => Promise<any>,
  onError?: () => void;
  onMaxFailedPolls?: () => void;
  onStop?: () => void;
  intervalInMs?: number;
  maxFailedPolls?: number;
  gracePeriodMS?: number;
  withExponentialBackoff?: boolean;
  notebookCumPollThresholds?: number[];
  notebookPollIntervals?: number[];
  onTickCompleted?: () => void;
};

/**
 * @typdef Poller
 * @param {Promise} onUpdate - user supplied action to execute when poll occurs
 * @param {Function} onError - user supplied action to execute when poll fails
 * @param {Function} onMaxFailedPolls - user supplied action to execute when max failed poll number exceeded
 * @param {Function} onStop - user supplied action to execute when polling stops
 * @param {number} intervalInMs - milliseconds between each poll
 * @param {number} maxFailedPolls - total allowable failed polls before aborting
 * @param {number} gracePeriodMS - length of time that polling should continue after a stop has been issued
 * @param {boolean} withExponentialBackoff - indicates whether to poll with backoff.
 *                              For more info on backoff: https://en.wikipedia.org/wiki/Exponential_backoff
 */
export default class Poller {
  _status: string;
  _error: string | {};
  _totalFailedPolls: number;
  _backoffIndex: number;
  _notebookCumPollThresholds: number[];
  _notebookPollIntervals: number[];
  _onUpdate: () => Promise<any>;
  _onError: (error?: any) => void;
  _onStop: (pollerContext?: Poller) => void;
  _onMaxFailedPolls: (error?: any) => void;
  _intervalInMs: number;
  _maxFailedPolls: number;
  _gracePeriodMS: number;
  _withExponentialBackoff: boolean;
  _pollingId: any;
  _onTickCompleted: () => void;
  constructor({
    onUpdate = () => Promise.resolve(undefined),
    onError = () => undefined,
    onMaxFailedPolls = () => undefined,
    onStop = () => undefined,
    intervalInMs = 2000,
    maxFailedPolls = 30,
    gracePeriodMS = ONE_MINUTE,
    withExponentialBackoff = false,
    notebookCumPollThresholds = [150, 450, 570, 690],
    notebookPollIntervals = [2000, 5000, 15000, 30000],
    onTickCompleted = () => undefined
  }: Options = {}) {
    /**
     * @namespace
     * @property {string} _status - the current state of the poller
     * @property {string|Error} _error - whatever error has occurred
     * @property {number} _totalFailedPolls - the cumulative number of failed polls since re/start
     * @property {number} _backoffIndex - the level of backoff to use when using backoff polling
     * @property {number[]} notebookCumPollThresholds - the number of times to poll at a certain backoff level
     * @property {number[]} notebookPollIntervals - the interval of time per poll at each backoff level
     * @property {Promise} onUpdate - user supplied action to execute when poll occurs
     * @property {Function} _onError - user supplied action to execute when poll fails
     * @property {Function} _onMaxFailedPolls - user supplied action to execute when max failed poll number exceeded
     * @property {Function} _onStop - user supplied action to execute when polling stops
     * @property {number} _intervalInMs - milliseconds between each poll
     * @property {number} _maxFailedPolls - total allowable failed polls before aborting
     * @property {number} _gracePeriodMS - length of time that polling should continue after a stop has been issued
     * @property {boolean} _withExponentialBackoff - indicates whether to poll with backoff.
     */
    this._status = INIT;
    this._error = NO_ERROR;
    this._totalFailedPolls = 0;
    this._backoffIndex = 0;
    // The cumulative number of polling attempts that should be performed before moving
    //  on to the next tier
    this._notebookCumPollThresholds = notebookCumPollThresholds;
    this._notebookPollIntervals = notebookPollIntervals;

    this._onUpdate = onUpdate;
    this._onError = onError;
    this._onStop = onStop;
    this._onMaxFailedPolls = onMaxFailedPolls;
    this._intervalInMs = intervalInMs;
    this._maxFailedPolls = maxFailedPolls;
    this._gracePeriodMS = gracePeriodMS;
    this._withExponentialBackoff = withExponentialBackoff;
    this._onTickCompleted = onTickCompleted;
  }

  /**
   * Updates the polling interval for this poller
   * @name updatePollInterval
   * @function
   * @memberof Poller
   * @param {number} newInterval - the new polling interval
   */
  updatePollInterval(newInterval: number): void {
    this.immediateStop();
    this.setMany({
      intervalInMs: newInterval,
    });
    this.restart();
  }

  getPollInterval(): number {
    return this._intervalInMs;
  }

  resetStatus(): void {
    this._status = INIT;
  }

  /**
   * @name getCumulativePollingThresholds
   * @memberof Poller
   * @function
   * @return {number[]} - gets the current state of the total polls used per level of backoff polling
   */
  getCumulativePollingThresholds(): number[] {
    return this._notebookCumPollThresholds;
  }

  /**
   * @name resetCumPollThresholds
   * @memberof Poller
   * @function
   * Resets the state of the total polls used during backoff polling. This array is mutated throughout Poller's
   * lifetime
   */
  resetCumPollThresholds() {
    this._notebookCumPollThresholds = [150, 450, 570, 690];
  }

  pollingWithBackoff(): boolean {
    return this._withExponentialBackoff;
  }

  getMaxBackoffIndex(): number {
    return this._notebookPollIntervals.length - 1;
  }

  resetBackoffIndex() {
    this._backoffIndex = 0;
  }

  incrementBackoffIndex() {
    this._backoffIndex += 1;
  }

  /**
   * @name getBackoffIndex
   * @memberof Poller
   * @function
   * @return {number} - gets the current level of backoff polling. This level maps directly to
   * the data structures (arrays) used to determine the polling frequency and duration per poll at this level.
   * See `notebookCumPollThresholds` and `notebookPollIntervals`
   */
  getBackoffIndex() {
    return this._backoffIndex;
  }

  /**
   * @name setMany
   * @memberof Poller
   * @function
   * @param {object} opts - values that map directly to properties on this class
   * Allows user to set properties enmasse after instantiation
   */
  setMany(opts: MutableProperties) {
    Object.keys(opts).forEach(prop => {
      if (OFF_LIMITS_PROPERTIES.indexOf(prop) === -1) {
        this[`_${prop}`] = opts[prop];
      }
    });
  }

  getStatus() {
    return this._status;
  }

  isInitialState() {
    return this._status === INIT;
  }

  _setIsRunning() {
    this._status = RUNNING;
  }

  /**
   * @name getStoppedReason
   * @function
   * @memberOf Poller
   * @returns {string} - the reason that the poller is stopped (if stopped)
   */
  getStoppedReason() {
    if (this.isStopped()) {
      if (this._backoffEnded()) {
        // can't poll anymore
        return POLLING_STOP_REASON_ENDED;
      }

      if (this._exceededTotalFailures()) {
        return POLLING_STOP_REASON_FAILED;
      }

      return POLLING_STOP_REASON_SUCCEEDED;
    }
    return POLLING_STOP_REASON_NOT_STOPPED;
  }

  _setIsStopped() {
    this._status = STOPPED;
  }

  isRunning() {
    return this._status === RUNNING;
  }

  isStopped() {
    return this._status === STOPPED;
  }

  start() {
    if (!this.isStopped()) {
      this._setIsRunning();
      this._doPoll();
    }
  }

  restart() {
    if (this.isStopped()) {
      this._resetTotalFailedPolls();
      this._resetErrorState();
      this.resetCumPollThresholds();
      this.resetBackoffIndex();
      this.resetStatus();

      this.start();
    }
  }

  _getGracePeriod() {
    return this._gracePeriodMS;
  }

  /**
   * @name _backoffEnded
   * @memberof Poller
   * @function
   * @return {boolean} - whether or not backoff polling has ended on its own
   */
  _backoffEnded() {
    return this.pollingWithBackoff() && this.getBackoffIndex() >= this.getMaxBackoffIndex() &&
      this._notebookCumPollThresholds[this.getMaxBackoffIndex()] === 0;
  }

  /**
   * Indicates whether Poller should stop polling
   * If polling with backoff, can only stop polling if not stopped and have completed backoff schedule
   * Otherwise, can only stop polling if not stopped and have exceeded max number of failures
   *
   * @function
   * @name _shouldStop
   * @memberof Poller
   * @return {boolean}
   */
  _shouldStop() {
    if (!this.isStopped()) {
      if (this.pollingWithBackoff()) {
        return this._backoffEnded();
      }
      return this._exceededTotalFailures();
    }
    return false;
  }

  immediateStop() {
    if (!this.isStopped()) {
      this.stopTimer();
      this._setIsStopped();
      this._onStop(this);
    }
  }

  executeOnMaxFailedPolls() {
    this._onMaxFailedPolls(this._error);
  }

  _resetErrorState() {
    this._error = NO_ERROR;
  }

  /**
   * Public stop method
   * defers to private stop method
   * @method
   * @name stop
   * @memberof Poller
   */
  stop() {
    this._setIsStopped();
    this._stop();
  }

  stopTimer() {
    clearTimeout(this._pollingId);
    this._pollingId = null;
  }

  /**
   * Private stop method
   * handles waiting to stop, executing onStop callback
   * stopping polling, grace period details, and executing
   * the max failures callback
   *
   * @method
   * @name _stop
   * @memberof Poller
   */
  _stop() {
    setTimeout(() => {
      this.stopTimer();
      this._onStop(this);
    }, this._getGracePeriod());
  }

  _resetTotalFailedPolls() {
    this._totalFailedPolls = 0;
  }

  /**
   * Manages polling lifecycle. Executes onUpdate, onError callbacks and
   * stops polling if necessary
   *
   * @function
   * @name _doPoll
   * @memberof Poller
   */
  async _doPoll() {
    if (!this.isStopped()) {
      if (this._shouldStop()) {
        this.stop();
      } else {
        await this._onUpdate().catch(err => {
          this._handleError(err);

          if (this._shouldStop()) {
            this.stop();
          }
        });
      }

      this._startNextPoll();

      this._onTickCompleted();
    }
  }

  _startNextPoll() {
    if (this.pollingWithBackoff()) {
      this.handleBackoff(() => {
        this._pollingId = setTimeout(() => this._doPoll(), this.getBackoffPollingInterval());
      });
    } else {
      this._pollingId = setTimeout(() => this._doPoll(), this._intervalInMs);
    }
  }

  getBackoffPollingInterval() {
    return this._notebookPollIntervals[this.getBackoffIndex()];
  }

  handleBackoff(callback: () => void) {
    const index = this.getBackoffIndex();

    if (this._notebookCumPollThresholds[index]) {
      this._notebookCumPollThresholds[index] -= 1;
    } else {
      this.incrementBackoffIndex();
    }

    if (this._shouldStop()) {
      this.stop();
    } else {
      callback();
    }

  }

  _handleError(err: any) {
    this._error = err;
    this._onError(err);
    this._totalFailedPolls += 1;

    if (this._shouldExecuteOnMaxFailedPolls()) {
      this.executeOnMaxFailedPolls();
      this.immediateStop();
    }
  }

  _notPollingWithBackoff() {
    return !this.pollingWithBackoff();
  }

  /**
   * Indicates whether polling has just failed the max number of times
   *
   * @function
   * @name _haveReachMaxFailedPolls
   * @memberof Poller
   * @return {Boolean}
   */
  _haveReachMaxFailedPolls() {
    return this._maxFailedPolls === (this._totalFailedPolls - 1);
  }

  /**
   * Indicates whether the poller should execute the onMaxFailedPolls callback supplied by the user
   *
   * @function
   * @name _shouldExecuteOnMaxFailedPolls
   * @memberof Poller
   * @return {Boolean}
   */
  _shouldExecuteOnMaxFailedPolls() {
    return this._notPollingWithBackoff() && this._haveReachMaxFailedPolls();
  }

  _exceededTotalFailures = () => {
    return this._maxFailedPolls < this._totalFailedPolls;
  }
}
