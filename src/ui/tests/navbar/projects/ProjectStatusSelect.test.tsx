import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import * as Projects from '@domino/api/dist/Projects';
import {
  mockProject,
  mockProjectStageAndStatus,
  mockCompletedProject
} from '../../../stories/ProjectStageAndStatusSelect.stories';
import ProjectStatusSelect, { TestIds } from '../../../src/navbar/projects/stage/ProjectStatusSelect';

const wrapWithBody = <T extends { projectId: string }>(obj: T) => ({ body: obj });

let markProjectComplete: jest.SpyInstance;
let raiseBlockerToProject: jest.SpyInstance;
let markProjectActive: jest.SpyInstance;
let mocks: Array<jest.SpyInstance>;

beforeAll(() => {
  markProjectComplete = jest.spyOn(Projects, 'markProjectComplete').mockResolvedValue(mockProjectStageAndStatus);
  raiseBlockerToProject = jest.spyOn(Projects, 'raiseBlockerToProject').mockResolvedValue(mockProjectStageAndStatus);
  markProjectActive = jest.spyOn(Projects, 'markProjectActive').mockResolvedValue(mockProjectStageAndStatus);
  mocks = [markProjectComplete, raiseBlockerToProject, markProjectActive];
});
afterAll(() => {
  unmockMocks(mocks);
  jest.resetModules();
});

describe('ProjectStatusSelect', () => {
  const MESSAGE = 'This is some text';
  const CLASS_NAME = 'project-status-select';
  const defaultProps = {
    project: mockProject,
    updateProject: jest.fn(),
    updateProjectStageAndStatus: jest.fn(),
    className: CLASS_NAME
  };

  it('should render', () => {
    const { container } = render(<ProjectStatusSelect {...defaultProps} />);
    expect(container.querySelector(`.${CLASS_NAME}`)).toBeTruthy();
  });

  it('should call markProjectComplete on clicking end project', async () => {
    const { getByDominoTestId, queryByText } = render(<ProjectStatusSelect {...defaultProps} />);
    await userEvent.click(getByDominoTestId('CompleteProjectButton'));
    expect(getByDominoTestId('completedMessage')).toBeTruthy();
    await userEvent.type(getByDominoTestId('completedMessage'), MESSAGE);
    await userEvent.click(getByDominoTestId('endProjectButton'));
    await waitFor(() => expect(queryByText('Are you sure about to end this project?')).toBeTruthy());
    await userEvent.click(getByDominoTestId(`${TestIds.MODAL}submit-button`));
    expect(markProjectComplete).toHaveBeenCalledTimes(1);
    expect(markProjectComplete).toHaveBeenCalledWith(wrapWithBody({ completeReason: MESSAGE, projectId: mockProject.id }));
  });

  it('should call raiseBlockerToProject on blocking a project', async () => {
    const { getByDominoTestId } = render(<ProjectStatusSelect {...defaultProps} />);
    await userEvent.click(getByDominoTestId('ImBlockedButton'));
    expect(getByDominoTestId('blockedReason')).toBeTruthy();
    await userEvent.type(getByDominoTestId('blockedReason'), MESSAGE);
    await userEvent.click(getByDominoTestId('raiseBlockerButton'));
    expect(raiseBlockerToProject).toHaveBeenCalledTimes(1);
    expect(raiseBlockerToProject).toHaveBeenCalledWith(wrapWithBody({ blockerReason: MESSAGE, projectId: mockProject.id }));
  });

  it('should call markProjectActive on reopening a project', async () => {
    const { getByText } = render(<ProjectStatusSelect {...defaultProps} project={mockCompletedProject} />);
    await userEvent.click(getByText('Reopen Project'));
    expect(markProjectActive).toHaveBeenCalledTimes(1);
    expect(markProjectActive).toHaveBeenCalledWith(wrapWithBody({ projectId: mockCompletedProject.id }));
  });
});
