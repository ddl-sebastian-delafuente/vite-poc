import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { fullClick, render, waitFor } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import * as Files from '@domino/api/dist/Files';
import { fileDeletePropsDto } from '@domino/test-utils/dist/mocks';
import Button from '../../src/components/Button/Button';
import FullDeleteModal from '../../src/filebrowser/FullDeleteModal';

let fullDelete: jest.SpyInstance;
let mocks: Array<jest.SpyInstance>;

beforeAll(() => {
  jest.mock('@domino/api/dist/Files');
  fullDelete = jest.spyOn(Files, 'fullDelete').mockResolvedValue(fileDeletePropsDto);
  mocks = [fullDelete]
});
afterAll(() => {
  unmockMocks(mocks);
  jest.unmock('@domino/api/dist/Files');
  jest.resetModules();
});

describe('<FullDeleteModal />', () => {
  const defaultProps = {
    projectName: 'projectName',
    projectOwnerName: 'projectOwnername',
    commitId: 'commitId',
    filePath: 'filePath',
    projectId: 'projectId',
    OpenModalButton: Button,
  };

  it('should not allow modal submission if there is no delete reason provided', async () => {
    const view = render(<FullDeleteModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('full-delete-modal'));
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(fullDelete).toHaveBeenCalledTimes(0);
  });

  it('should allow modal submission if there is a delete reason provided', async () => {
    const view = render(<FullDeleteModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('full-delete-modal'));
    await userEvent.type(view.getByDominoTestId('full-delete-message-field'), 'blah');
    fullClick(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(fullDelete).toHaveBeenCalledTimes(1));
  });

  it('should call api endpoint with delete reason', async () => {
    const view = render(<FullDeleteModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('full-delete-modal'));
    await userEvent.type(view.getByDominoTestId('full-delete-message-field'), 'blah');
    fullClick(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(fullDelete).toHaveBeenCalledWith({
      body: {
        commitId: 'commitId',
        deleteReason: 'blah',
        filePath: 'filePath',
        projectId: 'projectId'
      }
    }));
  });
});
