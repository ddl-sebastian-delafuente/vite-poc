import {
  createDownloadArchive,
  getDownloadTaskStatus,
} from '@domino/api/dist/Datasetrw';
import * as React from 'react';

import { 
  error as raiseErrorToast,
  success,
} from '../components/toastr';

interface FileTaskDownloaderReturn {
  isProcessing: boolean;
  triggerDownload: (snapshotId: string, manifest: string[]) => void;
}

export const useFileTaskDownloader = (): FileTaskDownloaderReturn => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const intervalId = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const beginDownload = React.useCallback(async (snapshotId: string, taskKey: string) => {
    const anchor = document.createElement('a');
    anchor.href = `/v4/datasetrw/snapshot/${snapshotId}/download-local/${taskKey}`;
    anchor.download = `${taskKey}.tar`;
    anchor.click();
    setIsProcessing(false);
  }, [setIsProcessing]);

  const stopPolling = React.useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, [intervalId]);

  const pollDownloadStatus = React.useCallback(async (snapshotId: string, taskId: string) => {
    intervalId.current = setInterval(async () => {
      const response = await getDownloadTaskStatus({ snapshotId, taskId });
      
      // Failed to create downloadable file 
      // stop polling
      if (response.taskStatus === 'Failed') {
        stopPolling();
        raiseErrorToast('Failed to create downloadable archive');
        setIsProcessing(false);
        return;
      }

      if (response.taskStatus !== 'Succeeded') {
        return;
      }

      stopPolling();
      beginDownload(snapshotId, response.taskKey);
    }, 5000);

  }, [beginDownload, setIsProcessing, stopPolling]);

  const triggerDownload = React.useCallback(async (snapshotId: string, manifest: string[]) => {
    setIsProcessing(true);
    try {
      // fire off download task
      const response = await createDownloadArchive({ 
        snapshotId,
        body: {
          relativePaths: manifest,
        }
      });

      // if task is already completed 
      if (response.taskStatus === 'Succeeded') {
        beginDownload(snapshotId, response.taskKey);
      }

      success('Your download will begin shortly, it may take a few seconds. For large downloads, it could take several minutes.'),
      // After we get the values trigger the polling
      pollDownloadStatus(snapshotId, response.taskId);
    } catch (e) {
      // error handling when unable to start a download task;
    }
  }, [beginDownload, pollDownloadStatus, setIsProcessing]);

  React.useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }
  }, [intervalId])

  return {
    isProcessing,
    triggerDownload,
  }
}
