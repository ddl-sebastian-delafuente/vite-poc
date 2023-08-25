import React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import {
  DominoModelmanagerApiModelVersionReproduceInWorkspaceDetails as ModelVersionReproduceInWorkspaceDetails,
} from '@domino/api/dist/types';
import { ModelDetailsViewToolbar } from '../ModelDetailsViewToolbar';
import * as tools from '../ModelDetailsViewToolbar';
import { modelVersionReproduceInWorkspaceDetails } from '@domino/test-utils/dist/mocks';
import testMocks from './testUtil';
import * as ModelManager from '@domino/api/dist/ModelManager';

const props = {
  onConfirm: jest.fn(),
  publishVersionFormUrl: 'string',
  canPublishModel: true,
  canArchiveModel: true,
  isWorkspaceReproducibilityEnabled: true,
  isAsyncModel: false,
  modelId: 'id'
};

const reproduceDetails: ModelVersionReproduceInWorkspaceDetails = {
  ...modelVersionReproduceInWorkspaceDetails,
  modelId: 'string',
  modelVersionId: 'string',
  // commitId: 'string',
  projectName: 'string',
  projectOwnerName: 'string',
  projectId: 'string',
  isGitBasedProject: true,
  envRevisionNumber: 1,
  envId: 'string',
  envName: 'string',
  requestedUserId: 'string',
  versionNumber: 1,
  status: 'running'
};

beforeEach(() => {
  jest.spyOn(ModelManager, 'getModelReproductionDetails').mockResolvedValue([]);
  testMocks.getQuotaMock();
  testMocks.getCheckpointForCommitsMock();
});
afterAll(() => {
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('ModelDetailsViewToolbar test cases', () => {
  it('should render successfully', () => {
    const view = render(<ModelDetailsViewToolbar {...props} />);
    expect(view.getByDominoTestId('archive-model-button')).toBeTruthy();
    expect(view.getByDominoTestId('publish-model-success-button')).toBeTruthy();
    expect(view.getByDominoTestId('modal-toolbar-open-in-workspace')).toBeTruthy();
  });

  it('should NOT render `New Version` (success) button when canPublishModel is false', () => {
    const view = render(<ModelDetailsViewToolbar {...props} canPublishModel={false} />);
    expect(view.getByDominoTestId('archive-model-button')).toBeTruthy();
    expect(view.queryByDominoTestId('publish-model-success-button')).toBeFalsy();
    expect(view.getByDominoTestId('modal-toolbar-open-in-workspace')).toBeTruthy();
  });

  it('should NOT render Archive Model Button when canArchiveModel is false', () => {
    const view = render(<ModelDetailsViewToolbar {...props} canArchiveModel={false} />);
    expect(view.queryByDominoTestId('archive-model-button')).toBeFalsy();
    expect(view.getByDominoTestId('publish-model-success-button')).toBeTruthy();
    expect(view.getByDominoTestId('modal-toolbar-open-in-workspace')).toBeTruthy();
  });

  it(`should NOT render Archive Model Button and toolbar workspace reproducibility button
  when canArchiveModel is false and isWorkspaceReproducibilityEnabled is false`, () => {
    const view = render(<ModelDetailsViewToolbar {...props} canArchiveModel={false} isWorkspaceReproducibilityEnabled={false} />);
    expect(view.queryByDominoTestId('archive-model-button')).toBeFalsy();
    expect(view.getByDominoTestId('publish-model-success-button')).toBeTruthy();
    expect(view.queryByDominoTestId('modal-toolbar-open-in-workspace')).toBeFalsy();
  });

  it('should display dropdown if more than one running version', () => {
    jest
      .spyOn(tools, 'useReproducibility')
      .mockReturnValue({ isLoading: false, reproduceInWorkspaceButtonsProps: [reproduceDetails, reproduceDetails] });
    expect(render(<ModelDetailsViewToolbar {...props} />).getByDominoTestId('toolbar-ws-reproduce-dropdown')).toBeTruthy();
  });

  it('should display single button if more than one running version', () => {
    jest
      .spyOn(tools, 'useReproducibility')
      .mockReturnValue({ isLoading: false, reproduceInWorkspaceButtonsProps: [reproduceDetails] });
    expect((render(<ModelDetailsViewToolbar {...props} />)
      .getByDominoTestId('modal-toolbar-open-in-workspace') as HTMLButtonElement).disabled).toBeTruthy();
  });
});
