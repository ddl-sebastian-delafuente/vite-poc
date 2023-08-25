import { DominoJobsWebStartJobRequest as StartJobRequest } from '@domino/api/dist/types'
import * as React from 'react';
import styled from 'styled-components';

import { GitFileSyncTable, RepositoryStatusModified } from '../../components/GitFileSyncTable';
import Modal, { DominoModalProps } from '../../components/Modal';
import { usePublishFeatureStore } from './usePublishFeatureStore';

const PUBLISH_FEATURES_TEXT_1 = `
Changes made by you to the feature code files will be published to the
centralized Domino Feature Store as 'Feature Views',
`;

const PUBLISH_FEATURES_TEXT_2 = `
These feature views and their metadata will be accessible to everyone
in your organization. However, they will be required to provide their
credentials to access the feature data.
`

const TextHeading = styled.div`
`;

interface FeatureStoreJobCommandProps {
  featureStoreId: string;
  gitRepoBranch: string,
  gitRepoPath: string,
  maxRetryCount?: number,
}

export const generateJobCommand = ({
  featureStoreId,
  gitRepoPath,
  gitRepoBranch,
  maxRetryCount = 3,
}: FeatureStoreJobCommandProps) => {
  return `python3 -m domino_data._feature_store.run -i ${featureStoreId} -p ${gitRepoPath} -b ${gitRepoBranch} -r ${maxRetryCount}`;
}

export const PublishHelpText = () => (
  <div>
    <TextHeading>What happens when you publish features?</TextHeading>
    <p>{PUBLISH_FEATURES_TEXT_1}</p>
    <p>{PUBLISH_FEATURES_TEXT_2}</p>
  </div>
);

export interface SyncAndPublishModalProps extends
  Pick<FeatureStoreJobCommandProps, 'featureStoreId' | 'gitRepoBranch' | 'gitRepoPath'>,
  Pick<StartJobRequest, 'environmentId' | 'projectId'>,
  Pick<DominoModalProps, 'visible'> {
  gitFiles?: RepositoryStatusModified,
  onClose?: () => void;
  onComplete?: () => void;
  onSync?: (commitMessage: string, selectedFiles: string[]) => void;
  workspaceId?: string;
}


export const SyncAndPublishModal = ({
  environmentId,
  featureStoreId,
  gitFiles = {},
  gitRepoBranch,
  gitRepoPath,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSync = () => {},
  projectId,
  visible
}: SyncAndPublishModalProps) => {
  const [commitMessage, setCommitMessage] = React.useState('Commit Message');
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const {
    startPublishJob
  } = usePublishFeatureStore({ featureStoreId, onComplete });

  const handleCommitMessageChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((e) => {
    setCommitMessage(e.target.value);
  }, [setCommitMessage]);

  const handleSelectedFilesChange = React.useCallback((files: string[]) => {
    setSelectedFiles(files);
  }, [setSelectedFiles]);

  const handleSyncAndPublish = React.useCallback(async () => {
    if (!commitMessage || selectedFiles.length === 0) {
      return;
    }

    try {
      onSync(commitMessage, selectedFiles);
      // Handle publishing of files
      startPublishJob({
        commandToRun: generateJobCommand({
          featureStoreId,
          gitRepoBranch,
          gitRepoPath,
        }),
        environmentId,
        environmentRevisionSpec: 'ActiveRevision',
        externalVolumeMounts: [],
        mainRepoGitRef: { type: 'head' },
        overrideHardwareTierId: 'small-k8s',
        projectId,
      });
    } catch (e) {
      console.warn(e);
    }
  }, [
    commitMessage,
    environmentId,
    featureStoreId,
    gitRepoBranch,
    gitRepoPath,
    onSync, 
    projectId,
    selectedFiles, 
    startPublishJob,
  ]);

  return (
    <Modal
      okText="Sync & Publish Features"
      onCancel={onClose}
      onOk={handleSyncAndPublish}
      title="Review & Publish Features"
      visible={visible}
    >
      <PublishHelpText/>
      <GitFileSyncTable
        changedFiles={gitFiles}
        commitMessage={commitMessage}
        onCommitMessageChange={handleCommitMessageChange}
        onSelectedFilesChange={handleSelectedFilesChange}
        selectedFiles={selectedFiles}
      />
    </Modal>
  );
}
