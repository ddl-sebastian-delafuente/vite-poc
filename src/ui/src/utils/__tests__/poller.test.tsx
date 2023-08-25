import Poller from '../Poller';
import {
  POLLING_STOP_REASON_ENDED,
  POLLING_STOP_REASON_NOT_STOPPED,
  POLLING_STOP_REASON_SUCCEEDED,
  RUNNING
} from '../PollerConstants';

const realTimeout = setTimeout;

function sleep(ms: number) {
  return new Promise(resolve => realTimeout(resolve, ms));
}

async function sleepUntil(func: () => boolean) {
  while (!func()) await sleep(50);
}

beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});
describe('Poller', function () {
  async function defaultOnUpdate() {
    return;
  }
  describe('#start()', function () {
    it('should only run after executing start', (done) => {
      let updated = false;
      async function onUpdate() {
        updated = true;
      }
      const poller = new Poller();
      poller.setMany({onUpdate});
      expect(updated).toEqual(false);
      jest.advanceTimersByTime(2000);
      expect(updated).toEqual(false);
      done();
    });
    it('should execute onUpdate callback three in 3 polling units', async () => {
      let updated = 0;
      let tickCounter = 0;
      async function onUpdate() {
        updated += 1;
      }
      const poller = new Poller({
        onUpdate,
        onTickCompleted: () => tickCounter++
      });

      expect(updated).toEqual(0);

      poller.start();

      await sleepUntil(() => tickCounter == 1);
      jest.advanceTimersByTime(2000);

      await sleepUntil(() => tickCounter == 2);
      jest.advanceTimersByTime(2000);

      await sleepUntil(() => tickCounter == 3);
      expect(updated).toEqual(3);

      poller.immediateStop();
    });
  });
  describe('#_doPoll()', function () {
    it('should execute onUpdate callback', function () {
      let updated = false;
      async function onUpdate() {
        updated = true;
      }
      const poller = new Poller({
        onUpdate,
      });
      expect(updated).toEqual(false);
      poller._doPoll();
      expect(updated).toEqual(true);
      poller.immediateStop();
    });
    it('should trigger onError callback if error', (done) => {
      let errored = false;
      async function onUpdate() {
        throw new Error('it failed');
      }
      function onError() {
        errored = true;
        expect(errored).toEqual(true);
        done();
      }
      const poller = new Poller({
        onUpdate,
        onError,
      });
      poller._doPoll();
      jest.advanceTimersByTime(6000);
    });
    it('shouldn\'t immediately trigger onStop callback if _status is "stopped"', function () {
      let stopped = false;
      function onStop() {
        stopped = true;
      }
      const poller = new Poller({
        onUpdate: defaultOnUpdate,
        onStop,
      });
      expect(stopped).toEqual(false);
      poller._setIsStopped();
      poller._doPoll();
      expect(stopped).toEqual(false);
      poller.immediateStop();
    });
    it('should immediately trigger onStop callback if _status is running and stop() is called', (done) => {
      let stopped = false;
      function onStop() {
        stopped = true;
      }
      const poller = new Poller({
        onUpdate: defaultOnUpdate,
        onStop,
        gracePeriodMS: 0,
      });
      poller.start();
      expect(poller.isRunning()).toEqual(true);
      poller.stop();
      expect(poller.isStopped()).toEqual(true);
      jest.advanceTimersByTime(10);
      expect(stopped).toEqual(true);
      done();
    });
  });
  describe('#getStoppedReason', function () {
    it('should say "backoff ended" if backoff ran out by itself', async () => {
      const pollThresholds = [2, 3];
      const pollIntervals = [2000, 5000];
      let tickCounter = 0;

      const poller = new Poller({
        withExponentialBackoff: true,
        onUpdate: defaultOnUpdate,
        gracePeriodMS: 0,
        notebookCumPollThresholds: pollThresholds,
        notebookPollIntervals: pollIntervals,
        onTickCompleted: () => tickCounter++
      });
      poller.start();

      await sleepUntil(() => tickCounter == 1);

      for (let i = 0; i < pollThresholds.length; i++) {
        const threshold = pollThresholds[i];
        const interval = pollIntervals[i];
        for (let x = 0; x <= threshold; x++) {
          const nextCounter = tickCounter + 1;
          jest.advanceTimersByTime(interval);
          await sleepUntil(() => tickCounter == nextCounter || poller.isStopped());
        }
      }

      expect(poller.getStoppedReason()).toEqual(POLLING_STOP_REASON_ENDED);
      poller.immediateStop();
    });
    it('should say "polling failed" if max number of failures occurs', (done) => {
      const error = new Error('error');
      const poller = new Poller({
        onUpdate: async function onUpdate() {
          throw error;
        },
        maxFailedPolls: 1,
        intervalInMs: 1,
        gracePeriodMS: 0,
      });
      poller.start();
      jest.advanceTimersByTime(10);
      expect(poller.getStoppedReason());
      done();
    });
    it(` should say "polling succeeded" if poller is stopped, but max number of failures not
            exceeded and polling hasn't ended by itself`, (done) => {
      const poller = new Poller({
        onUpdate: defaultOnUpdate,
        gracePeriodMS: 0,
      });
      poller.start();
      jest.advanceTimersByTime(4000);
      poller.stop();
      expect(poller._exceededTotalFailures()).toEqual(false);
      expect(poller.getStoppedReason()).toEqual(POLLING_STOP_REASON_SUCCEEDED);
      done();
    });
    it('should say "not stopped" if reason asked for but poller is running', (done) => {
      const poller = new Poller({
        onUpdate: defaultOnUpdate,
        gracePeriodMS: 0,
      });
      poller.start();
      jest.advanceTimersByTime(4000);
      expect(poller.isStopped()).toEqual(false);
      expect(poller.getStoppedReason()).toEqual(POLLING_STOP_REASON_NOT_STOPPED);
      poller.immediateStop();
      done();
    });
  });
  describe('#_status', function () {
    it('should be INIT before start()', () => {
      const poller = new Poller({
        onUpdate: defaultOnUpdate,
      });
      expect(poller.isInitialState()).toEqual(true);
    });
    it('should be RUNNING after start()', () => {
      const poller = new Poller({
        onUpdate: defaultOnUpdate,
      });
      poller.start();
      expect(poller.getStatus()).toEqual(RUNNING);
      poller.immediateStop();
    });
    it('should be STOPPED after stop()', () => {
      const poller = new Poller({
        onUpdate: defaultOnUpdate,
      });
      poller.start();
      expect(poller.getStatus()).toEqual(RUNNING);
      poller.stop();
      expect(poller.isStopped()).toEqual(true);
      poller.immediateStop();
    });
  });
});
