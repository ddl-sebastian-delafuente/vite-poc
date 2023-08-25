import { updateFeatureStoreSyncResult } from '@domino/api/dist/Featurestore';
import {
  getJob,
  restartJob,
  startJob,
} from '@domino/api/dist/Jobs';
import { DominoJobsWebStartJobRequest as StartJobRequest } from '@domino/api/dist/types'
import * as React from 'react';

export interface PublishFeatureStoreReturn {
  retryPublishJob: (jobId: string, projectid: string) => void;
  startPublishJob: (startJobRequest: StartJobRequest) => void;
}

export interface UsePublishFeatureStore {
  featureStoreId: string,
  onComplete?: (jobId: string) => void;
  onFailed?: () => void;
  onStart?: (jobId: string) => void;
}

export const usePublishFeatureStore = ({
  featureStoreId,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFailed = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onStart = () => {},
}: UsePublishFeatureStore): PublishFeatureStoreReturn => {
  const intervalId = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPollingJobStatus = React.useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, [intervalId]);

  const pollJobStatus = React.useCallback((jobId: string) => {
    intervalId.current = setInterval(async () => {
      try {
        const job = await getJob({ jobId });

        // Check if job has completed
        if (job.statuses.isCompleted) {
          stopPollingJobStatus();

          if (job.statuses.executionStatus === 'Failed') {
            try {
              await updateFeatureStoreSyncResult({
                body: {
                  featureStoreId,
                  runId: job.id,
                  syncStatus: 'Failure',
                }
              });
            } catch (e) {
              console.warn(e);
            }
            onFailed();
            return;
          }
          
          onComplete(jobId);
          return;
        }
      } catch (e) {
        console.warn(e);
        stopPollingJobStatus();
      }
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureStoreId, intervalId, onComplete, onFailed, stopPollingJobStatus]);

  const retryPublishJob = React.useCallback(async (jobId: string, projectId: string) => {
    try {
      const job = await restartJob({
        body: { jobId, projectId, shouldUseOriginalInputCommit: false },
      });
      
      pollJobStatus(job.id);
    } catch (e) {
      console.warn(e);
    }
  }, [pollJobStatus]);

  const startPublishJob = React.useCallback(async (startJobRequest: StartJobRequest) => {
    try {
      const job = await startJob({ body: startJobRequest });
      onStart(job.id);
      pollJobStatus(job.id);
    } catch (e) {
      console.warn(e);
    }
  }, [onStart, pollJobStatus]);

  React.useEffect(() => {
    // Cleanup interval after unmount
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }
  }, [intervalId]);

  return {
    retryPublishJob,
    startPublishJob,
  }
}
