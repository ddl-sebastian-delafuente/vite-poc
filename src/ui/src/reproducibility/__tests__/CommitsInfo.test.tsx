import * as React from 'react';
import 'jest-styled-components';
import { render, screen, within } from '@domino/test-utils/dist/testing-library';
import { DominoProvenanceApiProvenanceCheckpointDto as Checkpoint } from '@domino/api/dist/types';
import CommitsInfo, { CommitsInfoProps } from '../CommitsInfo';
import { mockCheckpoint, BRANCH_COMMIT_DETAILS, ProjectDetails } from './testUtil';

describe(`<CommitsInfo />`, () => {
  const defaultProps: CommitsInfoProps = {
    checkpoint: mockCheckpoint,
    isGitBasedProject: false
  };

  test(`should render`, () => {
    expect(render(<CommitsInfo {...defaultProps} />)).not.toBeNull();
  });

  test('should render files commit details and artifact details for a DFS project\
  having imported projects and imported repositories', () => {
    const { getByDominoTestId } = render(<CommitsInfo {...defaultProps} />);

    // File Details
    const filesDetails = getByDominoTestId('files');
    expect(within(filesDetails).getByText(/Files Commit/)).toBeTruthy();

    // Imported Repository Details
    BRANCH_COMMIT_DETAILS.commits.forEach(commitInfo => expect(within(filesDetails)
      .getAllByText(new RegExp(commitInfo.slice(0, 7))).length).toBeGreaterThanOrEqual(1));
    BRANCH_COMMIT_DETAILS.commitDetails.forEach(commitInfo => expect(within(filesDetails)
      .getAllByText(new RegExp(commitInfo)).length).toBeGreaterThanOrEqual(1));

    // Artifact Details
    // NOTE - ProjectDetails.projectName/projectId is being used for importedProjects.projectName/projectId
    expect(screen.getByText('artifacts')).toBeTruthy();
    expect(screen.queryByText('Artifacts Commit')).toBeFalsy();
    const artifactDetails = getByDominoTestId('artifacts');
    expect(within(artifactDetails).getAllByText(new RegExp(ProjectDetails.projectName))).toHaveLength(2);
    mockCheckpoint.importedProjects.forEach(importedProject =>
      expect(within(artifactDetails).getByText(new RegExp(importedProject.commitId.slice(0, 7)))).toBeTruthy());
  });

  test('should render code commit details and artifact details for a GBP having imported projects\
  and imported repositories', () => {
    const { getByDominoTestId } = render(<CommitsInfo {...defaultProps} isGitBasedProject={true} />);
    
    // Code Details
    const codeDetails = getByDominoTestId('code');
    const testString = `Git Repo Commit: ${BRANCH_COMMIT_DETAILS.commits[0].slice(0, 7)}`;
    expect(within(codeDetails).getByText(testString)).toBeTruthy();

    // Imported Repository Details
    BRANCH_COMMIT_DETAILS.commits.forEach(commitInfo => expect(within(codeDetails)
      .getAllByText(new RegExp(commitInfo.slice(0, 7))).length).toBeGreaterThanOrEqual(1));
    BRANCH_COMMIT_DETAILS.commitDetails.slice(2).forEach(commitInfo => expect(within(codeDetails)
      .getAllByText(new RegExp(commitInfo)).length).toBeGreaterThanOrEqual(1));

    // Artifact Details
    // NOTE - ProjectDetails.projectName/projectId is being used for importedProjects.projectName/projectId
    expect(screen.getByText('artifacts')).toBeTruthy();
    expect(screen.getByText(/Artifacts Commit/)).toBeTruthy();
    const artifactDetails = getByDominoTestId('artifacts');
    expect(within(artifactDetails).getAllByText(new RegExp(ProjectDetails.projectName))).toHaveLength(2);
    mockCheckpoint.importedProjects.forEach(importedProject =>
      expect(within(artifactDetails).getByText(new RegExp(importedProject.commitId.slice(0, 7)))).toBeTruthy());
  });

  test('should render files commit details and artifact details for a DFS project\
  having imported projects and empty imported repositories', () => {
    const checkpointWithEmptyImportedRepos = {...defaultProps.checkpoint, gitRepoCommits: []} as Checkpoint;

    const propsWithEmptyImportedReposInCheckpoint = {
      checkpoint: checkpointWithEmptyImportedRepos, isGitBasedProject: false
    } as CommitsInfoProps;
    
    const { getByDominoTestId } = render(<CommitsInfo {...propsWithEmptyImportedReposInCheckpoint} />);

    // File Details
    const filesDetails = getByDominoTestId('files');
    expect(within(filesDetails).getByText(/Files Commit/)).toBeTruthy();

    // Artifact Details
    // NOTE - ProjectDetails.projectName/projectId is being used for importedProjects.projectName/projectId
    expect(screen.getByText('artifacts')).toBeTruthy();
    expect(screen.queryByText(/Artifacts Commit/)).toBeFalsy();
    const artifactDetails = getByDominoTestId('artifacts');
    expect(within(artifactDetails).getAllByText(new RegExp(ProjectDetails.projectName))).toHaveLength(2);
    mockCheckpoint.importedProjects.forEach(importedProject =>
      expect(within(artifactDetails).getByText(new RegExp(importedProject.commitId.slice(0, 7)))).toBeTruthy());
  });

  test('should render code commit details and artifact details for a GBP having imported projects\
  and empty imported repositories', () => {
    const checkpointWithEmptyImportedRepos = {...defaultProps.checkpoint, gitRepoCommits: []};

    const propsWithEmptyImportedReposInCheckpoint = {
      checkpoint: checkpointWithEmptyImportedRepos, isGitBasedProject: true
    } as CommitsInfoProps;
    
    const { getByDominoTestId } = render(<CommitsInfo {...propsWithEmptyImportedReposInCheckpoint} />);

    // Code Details
    const codeDetails = getByDominoTestId('code');
    expect(within(codeDetails).getByText(/Git Repo Commit/)).toBeTruthy();

    // Artifact Details
    // NOTE - ProjectDetails.projectName/projectId is being used for importedProjects.projectName/projectId
    expect(screen.getByText('artifacts')).toBeTruthy();
    expect(screen.getByText(/Artifacts Commit/)).toBeTruthy();
    const artifactDetails = getByDominoTestId('artifacts');
    expect(within(artifactDetails).getAllByText(new RegExp(ProjectDetails.projectName))).toHaveLength(2);
    mockCheckpoint.importedProjects.forEach(importedProject =>
      expect(within(artifactDetails).getByText(new RegExp(importedProject.commitId.slice(0, 7)))).toBeTruthy());
  });

  test('should render files commit details and no artifact details for a DFS project\
  having empty imported projects', () => {
    const checkpointWithEmptyImportedProjects = {...defaultProps.checkpoint, importedProjects: []};

    const propsWithEmptyImportedProjectsInCheckpoint = {
      checkpoint: checkpointWithEmptyImportedProjects, isGitBasedProject: false
    } as CommitsInfoProps;

    const { getByDominoTestId } = render(<CommitsInfo {...propsWithEmptyImportedProjectsInCheckpoint} />);

    // File Details
    const filesDetails = getByDominoTestId('files');
    expect(within(filesDetails).getByText(/Files Commit/)).toBeTruthy();
    BRANCH_COMMIT_DETAILS.commits.forEach(commitInfo => expect(within(filesDetails)
      .getAllByText(new RegExp(commitInfo.slice(0, 7))).length).toBeGreaterThanOrEqual(1));
    BRANCH_COMMIT_DETAILS.commitDetails.forEach(commitInfo => expect(within(filesDetails)
      .getAllByText(new RegExp(commitInfo)).length).toBeGreaterThanOrEqual(1));

    // Artifact Details
    expect(screen.queryByText('artifacts')).toBeFalsy();
  });

  test('should render code commit details and `Artifacts Commit` with no further\
  artifact details for a GBP having empty imported projects', () => {
    const checkpointWithEmptyImportedProjects = {...defaultProps.checkpoint, importedProjects: []};

    const propsWithEmptyImportedProjectsInCheckpoint = {
      checkpoint: checkpointWithEmptyImportedProjects, isGitBasedProject: true
    } as CommitsInfoProps;

    const { getByDominoTestId } = render(<CommitsInfo {...propsWithEmptyImportedProjectsInCheckpoint} />);

    // Code Details
    const codeDets = getByDominoTestId('code');
    const testString = `Git Repo Commit: ${BRANCH_COMMIT_DETAILS.commits[0].slice(0, 7)}`;
    expect(within(codeDets).getByText(testString)).toBeTruthy();
    BRANCH_COMMIT_DETAILS.commits.forEach(commitInfo => expect(within(codeDets)
      .getAllByText(new RegExp(commitInfo.slice(0, 7))).length).toBeGreaterThanOrEqual(1));
    BRANCH_COMMIT_DETAILS.commitDetails.slice(2).forEach(commitInfo => expect(within(codeDets)
      .getAllByText(new RegExp(commitInfo)).length).toBeGreaterThanOrEqual(1));

    // Artifact Details
    expect(screen.getByText('artifacts')).toBeTruthy();
    expect(screen.getByText(/Artifacts Commit/)).toBeTruthy();
    const artifactDets = getByDominoTestId('artifacts');
    expect(within(artifactDets).getByText(new RegExp(mockCheckpoint.dfsCommit.commitId.slice(0, 7))));
  });

  test('should render files commit details and no artifact details for a DFS project\
  having empty imported projects/repos', () => {
    const checkpointWithEmptyImportedProjects = {...defaultProps.checkpoint, importedProjects: [], gitRepoCommits: []};

    const propsWithEmptyImportedProjectsInCheckpoint = {
      checkpoint: checkpointWithEmptyImportedProjects, isGitBasedProject: false
    } as CommitsInfoProps;

    const { getByDominoTestId } = render(<CommitsInfo {...propsWithEmptyImportedProjectsInCheckpoint} />);

    // File Details
    const filesDetails = getByDominoTestId('files');
    expect(within(filesDetails).getByText(/Files Commit/)).toBeTruthy();
    expect(within(filesDetails).getByText(new RegExp(mockCheckpoint.dfsCommit.commitId.slice(0, 7)))).toBeTruthy();

    // Artifact Details
    expect(screen.queryByText('artifacts')).toBeFalsy();
  });

  test('should render code commit details and `Artifacts Commit` with no further\
  artifact details for a GBP having empty imported projects/repos', () => {
    const checkpointWithEmptyImportedProjects = {...defaultProps.checkpoint, importedProjects: [], gitRepoCommits: []};

    const propsWithEmptyImportedProjectsInCheckpoint = {
      checkpoint: checkpointWithEmptyImportedProjects, isGitBasedProject: true
    } as CommitsInfoProps;

    const { getByDominoTestId } = render(<CommitsInfo {...propsWithEmptyImportedProjectsInCheckpoint} />);

    // Code Details
    const codeDetails = getByDominoTestId('code');
    expect(within(codeDetails).getByText('Git Repo Commit: --')).toBeTruthy();

    // Artifact Details
    expect(screen.getByText('artifacts')).toBeTruthy();
    expect(screen.getByText(/Artifacts Commit/)).toBeTruthy();
    const artifactDetails = getByDominoTestId('artifacts');
    expect(within(artifactDetails).getByText(new RegExp(mockCheckpoint.dfsCommit.commitId.slice(0, 7)))).toBeTruthy();
  });
});
