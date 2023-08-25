import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, fullClick, render, waitFor } from '@domino/test-utils/dist/testing-library';
import RemoveFilesConfirmationModal from '../../src/filebrowser/RemoveFilesConfirmationModal';
import * as Files from '@domino/api/dist/Files';
import * as Toastr from '../../src/components/toastr';

describe('<RemoveFilesConfirmationModal />', () => {

  const toastrError = jest.spyOn(Toastr, 'error');
  const removeFile = jest.spyOn(Files, 'removeFile');
  const removeFiles = jest.spyOn(Files, 'removeFiles');

  toastrError.mockImplementation(() => <span />);
  const defaultProps = {
    paths: [],
    successfulFilesRemovalEndpoint: 'http://localhost/successfulFilesRemovalEndpoint',
    ownerUsername: 'string',
    projectName: 'string',
  };

  it('should render', () => {
    expect(render(<RemoveFilesConfirmationModal {...defaultProps} />)
      .getByDominoTestId('RemoveFilesConfirmationModalButton')).toBeTruthy();
  });

  it('should render all file names if 100 provided', async () => {
    const paths = Array(100).fill(null).map((x, index) => `${index}`);
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={paths} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    const modalContentString = view.getByText(/Are you sure you want to delete/).textContent as string;
    expect([...modalContentString.matchAll(/[0-9]{1,2}/g)]).toHaveLength(100);
  });

  it('should render 100 files names and 1 in truncated view if 101 provided', async () => {
    const paths = Array(101).fill(null).map((x, index) => `${index}`);
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={paths} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    const modalContentString = view.getByText(/Are you sure you want to delete/).textContent as string;
    expect([...modalContentString.matchAll(/[0-9]{1,2}/g)]).toHaveLength(101);
    expect(modalContentString).toContain('... and 1 more?');
  });

  it('should render 1 file by itself without commas or pluralization', async () => {
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={['0']} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    expect(view.getByText('Are you sure you want to delete 0?')).toBeTruthy();
  });

  it('should two files with an "and" clause', async () => {
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={['0', '1']} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    expect(view.getByText('Are you sure you want to delete 0 and 1?')).toBeTruthy();
  });

  it('should trigger the single remove endpoint if only one file selected for removal', async () => {
    const singleRemoveSpy = jest.fn(async () => '');
    removeFile.mockImplementation(singleRemoveSpy);
    removeFiles.mockImplementation(jest.fn());
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={['0']} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(singleRemoveSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger the many remove endpoint if more than one file selected for removal', async () => {
    const manyRemoveSpy = jest.fn(async () => '');
    removeFile.mockImplementation(jest.fn());
    removeFiles.mockImplementation(manyRemoveSpy);
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={['0', '1']} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(manyRemoveSpy).toHaveBeenCalledTimes(1);
  });

  it('should not trigger any API calls if no paths selected', async () => {
    const singleRemoveSpy = jest.fn(async () => '');
    const manyRemoveSpy = jest.fn(async () => '');
    removeFile.mockImplementation(singleRemoveSpy);
    removeFiles.mockImplementation(manyRemoveSpy);
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={[]} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(manyRemoveSpy).toHaveBeenCalledTimes(0);
    expect(singleRemoveSpy).toHaveBeenCalledTimes(0);
  });

  //TODO: Promise Rejection Test needs to be fixed.
  it.skip('should close the modal if the submit succeeds', async () => {
    removeFile.mockImplementation(jest.fn(async () => ''));
    removeFiles.mockImplementation(jest.fn(async () => ''));
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={['0']} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    const removeFilesConfirmationModal = view.getByDominoTestId('RemoveFilesConfirmationModal');
    const modalStylesBefore = getComputedStyle(removeFilesConfirmationModal.querySelector('.ant-modal-wrap')!);
    expect(modalStylesBefore.display).toEqual('block');
    await userEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(removeFilesConfirmationModal.querySelector('.ant-modal-mask')).toBeFalsy());
    const modalStylesAfter = getComputedStyle(removeFilesConfirmationModal.querySelector('.ant-modal-wrap')!);
    expect(modalStylesAfter.display).toEqual('none');
  });

  //TODO: Promise Rejection Test needs to be fixed.
  it.skip('should not close the modal if the submit fails', async () => {
    removeFile.mockImplementation(() => Promise.reject('failure'));
    removeFiles.mockImplementation(jest.fn(async () => ''));
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={['0']} />);
    await userEvent.click(view.getByDominoTestId('RemoveFilesConfirmationModalButton'));
    const removeFilesConfirmationModal = view.getByDominoTestId('RemoveFilesConfirmationModal');
    const modalStylesBefore = getComputedStyle(removeFilesConfirmationModal.querySelector('.ant-modal-wrap')!);
    expect(modalStylesBefore.display).toEqual('block');
    fullClick(view.getByDominoTestId('submit-button'));
    fireEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(removeFilesConfirmationModal.querySelector('.ant-modal-mask')).toBeTruthy());
    const modalStylesAfter = getComputedStyle(removeFilesConfirmationModal.querySelector('.ant-modal-wrap')!);
    expect(modalStylesAfter.display).toEqual('block');
  });

  //TODO: Promise Rejection Test needs to be fixed.
  it.skip('should render an error notification if submit fails', async () => {
    const errorToastSpy = jest.fn();
    toastrError.mockImplementation(errorToastSpy);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeFile.mockImplementation((a: any, b: any) => Promise.reject('failure'));
    removeFiles.mockImplementation(jest.fn(async () => ''));
    const view = render(<RemoveFilesConfirmationModal {...defaultProps} paths={['0']} />);
    const removeFilesConfirmationModal = view.getByDominoTestId('RemoveFilesConfirmationModal');
    const modalStylesBefore = getComputedStyle(removeFilesConfirmationModal.querySelector('.ant-modal-wrap')!);
    expect(modalStylesBefore.display).toEqual('block');
    fullClick(view.getByDominoTestId('submit-button'));
    fireEvent.click(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(removeFilesConfirmationModal.querySelector('.ant-modal-mask')).toBeTruthy());
    expect(errorToastSpy).toHaveBeenCalledTimes(1);
  });
});
