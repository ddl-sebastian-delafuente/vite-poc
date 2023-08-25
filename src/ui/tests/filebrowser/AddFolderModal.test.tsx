import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import AddFolderModal from '../../src/filebrowser/AddFolderModal';

jest.mock('../../src/filebrowser/queryUtil');
afterAll(() => {
  jest.unmock('../../src/filebrowser/queryUtil');
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('<AddFolderModal />', () => {
  const queryUtil = () => require('../../src/filebrowser/queryUtil');
  const defaultProps = {
    createFolderEndpoint: 'createFolderEndpoint',
    csrfToken: 'csrfToken',
    dirPath: 'dirPath',
    projectName: 'projectName',
    ownerUsername: 'ownerUsername',
  };

  it('should be able to open the modal', async () => {
    const view = render(<AddFolderModal {...defaultProps} />);
    expect(view.queryByDominoTestId('AddFolderModal')).toBeFalsy();
    await userEvent.click(view.getByDominoTestId('AddFolderModalButton'));
    expect(view.getByDominoTestId('AddFolderModal')).toBeTruthy();
  });

  it('should be able to cancel out of the modal by clicking cancel', async () => {
    const view = render(<AddFolderModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('AddFolderModalButton'));
    const addFolderModal = view.getByDominoTestId('AddFolderModal');
    expect(addFolderModal).toBeTruthy();
    const modalStylesBefore = getComputedStyle(addFolderModal.querySelector('.ant-modal-wrap')!);
    expect(modalStylesBefore.display).toEqual('block');
    await userEvent.click(view.getByDominoTestId('cancel-button'));
    const modalStylesAfter = getComputedStyle(addFolderModal.querySelector('.ant-modal-wrap')!);
    expect(modalStylesAfter.display).toEqual('none');
  });

  it('should not submit the form if there is no provided folder name', async () => {
    const endpoint = jest.fn(async () => undefined);
    queryUtil().addFolderToProjectFiles.mockImplementation(endpoint);
    const view = render(<AddFolderModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('AddFolderModalButton'));
    expect(view.getByDominoTestId('AddFolderModal')).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(endpoint).toHaveBeenCalledTimes(0);
  });

  it('should submit the form if there is a provided folder name', async () => {
    const endpoint = jest.fn(async () => undefined);
    queryUtil().addFolderToProjectFiles.mockImplementation(endpoint);
    const view = render(<AddFolderModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('AddFolderModalButton'));
    expect(view.getByDominoTestId('AddFolderModal')).toBeTruthy();
    await userEvent.type(view.getByDominoTestId('folder-name-field'), 'sdf');
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(endpoint).toHaveBeenCalledTimes(1));
  });

  it('should include csrfToken, directory name, directory path in submission', async () => {
    const endpoint = jest.fn(async () => undefined);
    queryUtil().addFolderToProjectFiles.mockImplementation(endpoint);
    const view = render(<AddFolderModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('AddFolderModalButton'));
    expect(view.getByDominoTestId('AddFolderModal')).toBeTruthy();
    await userEvent.type(view.getByDominoTestId('folder-name-field'), 'sdf');
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(endpoint).toHaveBeenCalledWith('createFolderEndpoint', {
      csrfToken: 'csrfToken',
      currentFolder: 'dirPath',
      folderName: 'sdf'
    }));
  });

  it('should only allow submission if all fields are filled out', async () => {
    const endpoint = jest.fn(async () => undefined);
    queryUtil().addFolderToProjectFiles.mockImplementation(endpoint);
    const view = render(<AddFolderModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('AddFolderModalButton'));
    expect(view.getByDominoTestId('AddFolderModal')).toBeTruthy();
    view.debug(view.baseElement, 99999999);
    await userEvent.type(view.getByDominoTestId('folder-name-field'), 'sdf');
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(endpoint).toHaveBeenCalledWith('createFolderEndpoint', {
      csrfToken: 'csrfToken',
      currentFolder: 'dirPath',
      folderName: 'sdf'
    }));
  });
});
