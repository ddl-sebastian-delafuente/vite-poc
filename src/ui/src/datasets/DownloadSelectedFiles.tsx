import { getFileMetadata } from '@domino/api/dist/Datasetrw';
import {
  DominoDatasetrwApiDatasetRwFileDetailsRowDto as SnapshotFileDto,
} from '@domino/api/dist/types';
import * as React from 'react';

import Button from '../components/Button/Button';
import { generateDownloadUri } from '../data/dataset/file.utils';
import { initialDatasetRw } from '../proxied-api/initializers';
import { useRemoteData } from '../utils/useRemoteData';
import { useFileTaskDownloader } from './useFiletaskDownloader';

const TEXT_PARTIAL_DOWNLOAD = 'Download Selected Items';
const TEXT_SNAPSHOT_DOWNLOAD = 'Download Snapshot';

export interface DownloadSelectedFilesProps {
  allItems?: boolean;
  disabled?: boolean;
  manifest: SnapshotFileDto[];
  snapshotId: string;
}

export const DownloadSelectedFiles = ({
  allItems = false,
  disabled,
  manifest = [],
  snapshotId,
}: DownloadSelectedFilesProps) => {
  const { triggerDownload, isProcessing } = useFileTaskDownloader();
  const { 
    data: singleFileMetadata
  } = useRemoteData({
    canFetch: manifest.length === 1 && !manifest[0].name.isDirectory && Boolean(manifest[0].name?.fileName),
    fetcher: () => getFileMetadata({ snapshotId, path: manifest[0].name?.fileName || '' }),
    initialValue: initialDatasetRw,
  })
  const buttonText = allItems ? TEXT_SNAPSHOT_DOWNLOAD : TEXT_PARTIAL_DOWNLOAD;

  const resolvedManifest = React.useMemo(() => {
    return manifest.map((file) => file?.name.fileName).filter(Boolean) as string[];
  }, [manifest])

  const handleTriggerDownload = React.useCallback(async () => {
    if (manifest.length === 1 && singleFileMetadata.uri && !manifest[0].name.isDirectory) {
      const { href } = generateDownloadUri(singleFileMetadata.uri);
      window.open(href, '_blank');
      return;
    }

    triggerDownload(snapshotId, resolvedManifest);
  }, [manifest, resolvedManifest, singleFileMetadata, snapshotId, triggerDownload]);

  return (
    <Button disabled={disabled || isProcessing} onClick={handleTriggerDownload}>{buttonText}</Button>
  )
}
