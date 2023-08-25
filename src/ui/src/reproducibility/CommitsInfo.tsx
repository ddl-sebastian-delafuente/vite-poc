import * as React from 'react';
import * as R from 'ramda';
import {
  DominoProvenanceApiProvenanceCheckpointDto as ProvenanceCheckpoint,
  DominoProvenanceApiProvenanceGitRepoDto as GitRepositoryCheckpoint,
  DominoProvenanceApiProvenanceImportedProject as ImportedArtifactsCheckpoint,
  DominoWorkspaceApiWorkspaceInitialGitCommitDto as GitRepoCommit
} from '@domino/api/dist/types';
import { StyledLabelAndValue } from './CommonComponents';

interface Commits {
  mainGitRepoCommit?: string;
  commits?: React.ReactNode;
}

type UnionOfInputTypes = {
  id?: string;
  name?: string;
  commitId: string;
  branchName?: string;
  isMainRepo: boolean;
  repoId?: string;
  repoName?: string;
};

function getCommitsInfo<T extends UnionOfInputTypes>(gitRepoCommits: Array<T>, isGitBasedProject: boolean): Commits {
  const mainGitRepoCommit = isGitBasedProject ? R.find((rc: T) => rc.isMainRepo, gitRepoCommits) : undefined;
  const importedReposCheckpoints = isGitBasedProject ? R.filter((rc: T) =>
    !rc.isMainRepo, gitRepoCommits) : gitRepoCommits;

  const commits = !R.isEmpty(importedReposCheckpoints) ? R.map((val: T) => (
    <div key={val.commitId}>{val.repoName ?? `${val.name}/${val.branchName}`}: {R.slice(0, 7, val.commitId)}</div>
  ), importedReposCheckpoints) : undefined;

  return {mainGitRepoCommit: mainGitRepoCommit?.commitId, commits};
}

export interface CommitsInfoProps {
  checkpoint?: ProvenanceCheckpoint;
  isGitBasedProject: boolean;
  dfsCommitId?: string;
  gitRepoCommits?: Array<GitRepoCommit>;
}

const CommitsInfo: React.FC<CommitsInfoProps> = (props) => {
  const { mainGitRepoCommit, commits } = !R.isNil(props.checkpoint) ?
    getCommitsInfo<GitRepositoryCheckpoint>(props.checkpoint.gitRepoCommits, props.isGitBasedProject) :
    !R.isNil(props.gitRepoCommits) ? getCommitsInfo<GitRepoCommit>(props.gitRepoCommits, props.isGitBasedProject) :
    { mainGitRepoCommit: undefined, commits: undefined };

  const dfsCommit = props.dfsCommitId ?? (props.checkpoint?.dfsCommit.commitId || '');
  const importedArtifactsCheckpoints = !R.isNil(props.checkpoint) ? props.checkpoint.importedProjects : undefined;

  return (
    <React.Fragment>
      {props.isGitBasedProject ? (
        <>
          <StyledLabelAndValue
            label="code"
            testId="code"
            value={<>
              <div data-test="codeCommitId">
                Git Repo Commit: {!R.isNil(mainGitRepoCommit) ? R.slice(0, 7, mainGitRepoCommit) : '--'}
              </div>
              {commits}
            </>}
          />
        </>
      ) : (
        <>
          <StyledLabelAndValue
            label="files"
            testId="files"
            value={<>
              <div data-test="filesCommitId">Files Commit: {R.slice(0, 7, dfsCommit)}</div>
              {commits}
            </>}
          />
        </>
      )}
      {(props.isGitBasedProject ||
      (!R.isNil(importedArtifactsCheckpoints) && !R.isEmpty(importedArtifactsCheckpoints))) &&
        <StyledLabelAndValue
          label="artifacts"
          testId="artifacts"
          value={<>
            {props.isGitBasedProject && <div>Artifacts Commit: {R.slice(0, 7, dfsCommit)}</div>}
            {!R.isNil(importedArtifactsCheckpoints) && R.map(
              (val: ImportedArtifactsCheckpoint) =>
                <div key={val.commitId}>{val.projectName}: {R.slice(0, 7, val.commitId)}</div>,
              importedArtifactsCheckpoints)}
          </>}
        />}
    </React.Fragment>);
};

export default CommitsInfo;
