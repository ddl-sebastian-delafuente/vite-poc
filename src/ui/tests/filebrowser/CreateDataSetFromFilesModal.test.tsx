import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import CreateDataSetFromFilesModal from '../../src/filebrowser/CreateDataSetFromFilesModal';
import { adminInterfaceWhitelabelConfigurations } from '@domino/test-utils/dist/mocks';
import { AdminProfile, makeMocks, MakeMocksReturn } from '@domino/test-utils/dist/mock-manager';

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(AdminProfile);
  mocks.api.admin.getWhiteLabelConfigurations.mockResolvedValue({
    ...adminInterfaceWhitelabelConfigurations,
    appName: 'Domino'
  });

  jest.mock('../../src/filebrowser/queryUtil');
});

afterAll(() => {
  mocks.unmock();
  jest.unmock('../../src/filebrowser/queryUtil');
  jest.resetModules();
});

/**
 * ToDo: Fix failing (skipped) tests.
 */
describe('<CreateDataSetFromFilesModal />', () => {
  const queryUtil = () => require('../../src/filebrowser/queryUtil').createDatasetFromFiles;
  const defaultProps = {
    selectedFilePaths: ['path1'],
    inputField: {
      componentClass: 'input',
    },
    username: 'username',
    submitUrl: 'submitUrl',
    csrfToken: 'csrfToken',
    submitLabel: 'Create',
  };

  it('should not allow submission if the data set name is not provided', async () => {
    const spy = jest.fn(async () => undefined);
    queryUtil().mockImplementation(spy);
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    userEvent.clear(view.getByDominoTestId('dataset-name-field'));
    expect(view.getByText(/invalid data set name/i)).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(0));
  });

  it.skip('should submit if name field correct', async () => {
    const spy = jest.fn(async () => undefined);
    queryUtil().mockImplementation(spy);
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    userEvent.type(view.getByDominoTestId('dataset-name-field'), 'some-dataset-name');
    expect(view.queryByText(/invalid data set name/i)).toBeFalsy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should not show help block if no name provided for dataset', async () => {
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    userEvent.clear(view.getByDominoTestId('dataset-name-field'));
    await waitFor(() => expect(view.queryByDominoTestId('dataset-name-help-block')).toBeFalsy());
  });

  it('should not show help block to start', () => {
    expect(render(<CreateDataSetFromFilesModal {...defaultProps} />)
      .queryByDominoTestId('dataset-name-help-block')).toBeFalsy();
  });

  it('should show help block if user provides name different from default', async () => {
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    const datasetNameField = view.getByDominoTestId('dataset-name-field');
    userEvent.clear(datasetNameField);
    userEvent.type(datasetNameField, 'differentthan');
    await waitFor(() => expect(view.getByDominoTestId('dataset-name-help-block')).toBeTruthy());
  });

  it.skip('should set import dataset checkbox to true by default', async () => {
    const spy = jest.fn(async () => undefined);
    queryUtil().mockImplementation(spy);
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    const datasetNameField = view.getByDominoTestId('dataset-name-field');
    userEvent.clear(datasetNameField);
    userEvent.type(datasetNameField, 'differentthan');
    expect(view.queryByText(/invalid data set name/i)).toBeFalsy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(spy).toHaveBeenCalledWith('submitUrl', {
      importDataSet: true,
      name: 'differentthan',
      paths: ['path1'],
      removeFilesFromParent: true,
      'working-folder-env-var-name': 'DOMINO_USERNAME_DIFFERENTTHAN_WORKING_DIR'
    }));
  });

  it.skip('should set removeFilesFromParent to true by default', async () => {
    const spy = jest.fn(async () => undefined);
    queryUtil().mockImplementation(spy);
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    const datasetNameField = view.getByDominoTestId('dataset-name-field');
    userEvent.clear(datasetNameField);
    userEvent.type(datasetNameField, 'differentthan');
    expect(view.queryByText(/invalid data set name/i)).toBeFalsy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(spy).toHaveBeenCalledWith('submitUrl', {
      importDataSet: true,
      name: 'differentthan',
      paths: ['path1'],
      removeFilesFromParent: true,
      'working-folder-env-var-name': 'DOMINO_USERNAME_DIFFERENTTHAN_WORKING_DIR'
    }));
  });

  it.skip('should reflect changes to import dataset checkbox in submission', async () => {
    const spy = jest.fn(async () => undefined);
    queryUtil().mockImplementation(spy);
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    const datasetNameField = view.getByDominoTestId('dataset-name-field');
    userEvent.clear(datasetNameField);
    userEvent.type(datasetNameField, 'differentthan');
    const importDatasetCheckbox = view.getByDominoTestId('import-dataset-checkbox')
      .querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(importDatasetCheckbox.checked).toBeTruthy();
    await userEvent.click(importDatasetCheckbox);
    expect(importDatasetCheckbox.checked).toBeFalsy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(spy).toHaveBeenCalledWith('submitUrl', {
      importDataSet: false,
      name: 'differentthan',
      paths: ['path1'],
      removeFilesFromParent: true,
      'working-folder-env-var-name': 'DOMINO_USERNAME_DIFFERENTTHAN_WORKING_DIR'
    }));
  });

  it.skip('should reflect changes to remove files from parent checkbox in submission', async () => {
    const spy = jest.fn(async () => undefined);
    queryUtil().mockImplementation(spy);
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    const datasetNameField = view.getByDominoTestId('dataset-name-field');
    userEvent.clear(datasetNameField);
    userEvent.type(datasetNameField, 'differentthan');
    const removeFilesFromParentCheckbox = view.getByDominoTestId('remove-files-from-parent-checkbox')
      .querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(removeFilesFromParentCheckbox.checked).toBeTruthy();
    await userEvent.click(removeFilesFromParentCheckbox);
    expect(removeFilesFromParentCheckbox.checked).toBeFalsy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(spy).toHaveBeenCalledWith('submitUrl', {
      importDataSet: true,
      name: 'differentthan',
      paths: ['path1'],
      removeFilesFromParent: false,
      'working-folder-env-var-name': 'DOMINO_USERNAME_DIFFERENTTHAN_WORKING_DIR'
    }));
  });

  it('should not submit if no file paths provided', async () => {
    const spy = jest.fn(async () => undefined);
    queryUtil().mockImplementation(spy);
    const view = render(<CreateDataSetFromFilesModal {...defaultProps} selectedFilePaths={[]} />);
    await userEvent.click(view.getByDominoTestId('CreateDataSetFromFilesModalButton'));
    userEvent.type(view.getByDominoTestId('dataset-name-field'), 'differentthan');
    expect(view.queryByText(/invalid data set name/i)).toBeFalsy();
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(0));
  });
});
