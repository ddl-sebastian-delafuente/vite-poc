import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor, within } from '@domino/test-utils/dist/testing-library';
import * as Projects from '@domino/api/dist/Projects';
import { DominoProjectsApiProjectGoal as ProjectGoal } from '@domino/api/dist/types';
import LinkGoal from '../src/goals/LinkGoal';
import Goal from '../src/icons/Goal';

const goals: ProjectGoal[] = [{
  id: '5d4163cb673e94000667b4fe',
  title: 'hey_check_me_out_a_goal',
  description: 'description',
  currentStage: {
    id: '5d4163cb673e94000667b4fd',
    stage: 'Ideation',
    createdAt: 1564566475855,
    isArchived: false,
    stageCreationSource: 'Domino'
  },
  linkedEntities : [],
  isComplete: true,
  isDeleted: false,
  projectId: 'projectId',
  createdAt: 1558046250831,
  createdBy: '5cdb250ad3fac50006b9c95a'
}, {
  id: '5cdb250ad3fac50006b9c97b',
  title: 'hey_check_me_out_a_goal_too',
  description: 'description',
  currentStage: {
    id: '5d4163cb673e94000667b4fd',
    stage: 'Ideation',
    createdAt: 1564566475855,
    isArchived: false,
    stageCreationSource: 'Domino'
  },
  linkedEntities : [],
  isComplete: true,
  isDeleted: false,
  projectId: 'projectId',
  createdAt: 1558046250831,
  createdBy: '5cdb250ad3fac50006b9c95a'
}, {
  id: '5cdb250ad3fac50006b9c95b',
  title: 'i_am_not_found',
  description: 'description',
  currentStage: {
    id: '5d4163cb673e94000667b4fd',
    stage: 'Ideation',
    createdAt: 1564566475855,
    isArchived: false,
    stageCreationSource: 'Domino'
  },
  linkedEntities : [],
  isComplete: true,
  isDeleted: false,
  projectId: 'projectId',
  createdAt: 1558046250831,
  createdBy: '5cdb250ad3fac50006b9c95a'
}];

describe('LinkGoal', () => {
  const getProjectGoals = jest.spyOn(Projects, 'getProjectGoals');
  getProjectGoals.mockImplementation(async () => goals);

  it('should show goals on input change', async () => {
    const view = render(
      <LinkGoal
        selectedIds={['workspaceId1']}
        buttonIcon={(
          <Goal
            height={22}
            width={22}
          />
        )}
        projectId={'projectId'}
        onSubmit={jest.fn()}
      />
    );
    fireEvent.click(view.getByDominoTestId('linkgoal-modal'));
    await userEvent.type(screen.getByRole('combobox'), 'hey_check_me_out_a_goal');
    await waitFor(() => expect(view.baseElement.querySelector('.ant-select-dropdown-empty')).toBeFalsy());
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('should have the goalId as its values', async () => {
    const view = render(
      <LinkGoal
        selectedIds={['workspaceId1']}
        buttonIcon={(
          <Goal
            height={22}
            width={22}
          />
        )}
        projectId={'projectId'}
        onSubmit={jest.fn()}
      />
    );
    fireEvent.click(view.getByDominoTestId('linkgoal-modal'));
    await userEvent.type(screen.getByRole('combobox'), 'hey_check_me_out_a_goal');
    await waitFor(() => expect(view.baseElement.querySelector('.ant-select-dropdown-empty')).toBeFalsy());
    expect(within(screen.getByRole('listbox')).getAllByRole('option')[0].textContent).toContain(goals[0].id);
    expect(within(screen.getByRole('listbox')).getAllByRole('option')[1].textContent).toContain(goals[1].id);
  });

});
