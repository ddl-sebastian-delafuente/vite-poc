import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import * as ProjectManagement from '@domino/api/dist/ProjectManagement';
import {
  mockProject,
  stagesData,
  mockBlockedProject,
  mockCompletedProject,
  mockActiveStageAndStatus
} from '../../../stories/ProjectStageAndStatusSelect.stories';
import ProjectStageAndStatusSelect from '../../../src/navbar/projects/stage/ProjectStageAndStatusSelect';
import ProjectStatusSelect, { TestIds } from '../../../src/navbar/projects/stage/ProjectStatusSelect';

let getStagesForProject: jest.SpyInstance;
let mocks: Array<jest.SpyInstance>;

beforeAll(() => {
  getStagesForProject = jest.spyOn(ProjectManagement, 'getStagesForProject').mockResolvedValue(stagesData);
  mocks = [getStagesForProject];
});
afterAll(() => {
  unmockMocks(mocks);
  jest.resetModules();
});

describe('ProjectStageAndStatusSelect', () => {
  const defaultProps = { project: mockProject, updateProject: jest.fn() };
  it('open popover on menu click', async () => {
    const { getByDominoTestId, container } = render(<ProjectStageAndStatusSelect {...defaultProps} projectStageAndStatus={mockActiveStageAndStatus} />);
    expect(container.querySelector('.ant-popover-open')).toBeFalsy();
    expect(getByDominoTestId('stageTitle').getAttribute('class')).toEqual('sub-title');
    await userEvent.click(getByDominoTestId('stageTitle'));
    expect(container.querySelector('.ant-popover-open')).toBeTruthy();
  });

  it('active project click on block button', async () => {
    const { getByDominoTestId } = render(<ProjectStatusSelect {...defaultProps} />);
    await userEvent.click(getByDominoTestId('ImBlockedButton'));
    expect(getByDominoTestId('blockedReason')).toBeTruthy();
    expect(getByDominoTestId('blockedReason').getAttribute('id')).toEqual('blockedReason');
  });

  it('active project click on complete button', async () => {
    const { getByDominoTestId } = render(<ProjectStatusSelect {...defaultProps} />);
    await userEvent.click(getByDominoTestId('CompleteProjectButton'));
    expect(getByDominoTestId('completedMessage')).toBeTruthy();
    expect(getByDominoTestId('completedMessage').getAttribute('id')).toEqual('completedMessage');
  });

  it('blocked project to have disabled complete button', () => {
    const { getByDominoTestId } = render(<ProjectStatusSelect {...defaultProps} project={mockBlockedProject} />);
    expect(getByDominoTestId('CompleteProjectButton').hasAttribute('disabled')).toBeTruthy();
  });

  it('project which is NOT completed, to have radio buttons', () => {
    const { getByDominoTestId } = render(<ProjectStatusSelect {...defaultProps} />);
    expect(getByDominoTestId(TestIds.RADIO_SELECT)).toBeTruthy();
  });

  it('completed project to not have any radio buttons', () => {
    const { queryByDominoTestId } = render(<ProjectStatusSelect {...defaultProps} project={mockCompletedProject} />);
    expect(queryByDominoTestId(TestIds.RADIO_SELECT)).toBeFalsy();
  });
});
