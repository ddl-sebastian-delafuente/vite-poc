import * as React from 'react';
import * as R from "ramda";
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import * as Projects from '@domino/api/dist/Projects';
import * as ProjectManagement from '@domino/api/dist/ProjectManagement';
import ProjectStageSelect from '../../../src/navbar/projects/stage/ProjectStageSelect';
import { mockProject, stagesData, mockProjectStageAndStatus } from '../../../stories/ProjectStageAndStatusSelect.stories';

let getStagesForProject: jest.SpyInstance;
let getCurrentProjectStageAndStatus: jest.SpyInstance;
let moveProjectToStage: jest.SpyInstance;
let mocks: Array<jest.SpyInstance>;

beforeAll(() => {
  getStagesForProject = jest.spyOn(ProjectManagement, 'getStagesForProject').mockResolvedValue(stagesData);
  getCurrentProjectStageAndStatus = jest.spyOn(Projects, 'getCurrentProjectStageAndStatus').mockResolvedValue(mockProjectStageAndStatus);
  moveProjectToStage = jest.spyOn(ProjectManagement, 'moveProjectToStage').mockImplementation(jest.fn());
  mocks = [getStagesForProject, getCurrentProjectStageAndStatus, moveProjectToStage];
});
afterAll(() => {
  unmockMocks(mocks);
  jest.resetModules();
})

describe('ProjectStageSelect', () => {
  const CLASS_NAME = 'project-stage-select';
  const defaultProps = {
    project: mockProject,
    updateProject: jest.fn(),
    updateProjectStageAndStatus: jest.fn(),
    areStagesStale: false,
    setAreStagesStale: jest.fn(),
    className: CLASS_NAME
  };
  
  it('should render', () => {
    const { getByDominoTestId } = render(<ProjectStageSelect {...defaultProps} />);
    expect(getByDominoTestId('stagePopover').getAttribute('class')).toContain(CLASS_NAME);
  });

  it('should fetch project stages if stages changes', () => {
    render(<ProjectStageSelect {...defaultProps} />)
      .rerender(<ProjectStageSelect {...defaultProps} project={{ ...mockProject, stageId: 'newStageId' }} />);
    expect(getStagesForProject).toHaveBeenCalledTimes(1);
  });

  it('should fetch project stages on click stage select', async () => {
    const view = render(<ProjectStageSelect {...R.omit(['setAreStagesStale', 'areStagesStale'], defaultProps)} />);
    await waitFor(() => expect(view.queryByText('Loading stages...')).toBeFalsy());
    await userEvent.type(view.getByRole('combobox'), '1');
    expect(getStagesForProject).toHaveBeenCalledTimes(1);
  });
});
