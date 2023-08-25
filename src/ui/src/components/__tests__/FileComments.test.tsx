import * as React from 'react';
import { FileCommentsWithFlagProvider as FileComments } from '../FileComments';
import * as Files from '@domino/api/dist/Files';
import {
  DominoFilesInterfaceCommentThread as FilesCommentThread,
} from '@domino/api/dist/types';
import { render, waitFor, fireEvent } from '@domino/test-utils/dist/testing-library';
import { fileCommentThread } from '@domino/test-utils/dist/mocks';

describe('<FileComments />', () => {
  const getFileCommentThread = jest.spyOn(Files, 'getFileCommentThread');
  const defaultProps = {
    fileName: 'fileName',
    projectId: 'projectId',
    commitId: 'commitId',
  };
  const emptyCommentThread = {
    ...fileCommentThread,
    id: 'emptyCommentThread',
    comments: [],
  };

  it('should render', () => {
    const { getByDominoTestId } = render(<FileComments {...defaultProps} />);
    expect(getByDominoTestId('add-comment-input')).toBeTruthy();
    expect(getByDominoTestId('add-comment-submit-button')).toBeTruthy();
  });

  it(`should render with parent element's width`, async () => {
    const view = render(<FileComments {...defaultProps} />);
    await waitFor(() => expect(view.queryByDominoTestId('add-comment-input')).toBeTruthy());
    const commentInputElement = view.getByDominoTestId('add-comment-input');
    expect(commentInputElement.getAttribute('class')).toContain('input');
    fireEvent.focus(commentInputElement);
    const commentInputContainer = commentInputElement.parentElement!.querySelector('div')!;
    expect(commentInputContainer.getAttribute('class')).not.toContain('input');
    const commentInputContainerWidth = commentInputContainer.clientWidth;
    const commentInputElementWidth = commentInputElement.clientWidth;
    expect(commentInputElementWidth).toEqual(commentInputContainerWidth);
  });

  it('should get file comment threads on start up', () => {
    const spy = jest.fn(async () => emptyCommentThread);
    getFileCommentThread.mockImplementation(spy);

    render(<FileComments {...defaultProps} />);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show spinner while fetching comments', async() => {
    const spy = () => new Promise<FilesCommentThread>((resolve) => {
      setTimeout(() => {
        resolve(emptyCommentThread);
      }, 200);
    });
    getFileCommentThread.mockImplementation(spy);
    const { getByDominoTestId } = render(<FileComments {...defaultProps} />);
    expect(getByDominoTestId('wait-spinner')).toBeTruthy();
  });

  it('should not show spinner if successfully fetched comments', async() => {
    const spy = async () => emptyCommentThread;
    getFileCommentThread.mockImplementation(spy);
    const { queryByDominoTestId } = render(<FileComments {...defaultProps} />);
    await waitFor(() => expect(queryByDominoTestId('wait-spinner')).toBeFalsy());
  });

  it('should not show spinner if failed to fetch comments', async() => {
    const spy = async () => {
      throw new Error('failed fetch');
    };
    getFileCommentThread.mockImplementation(spy);
    const { queryByDominoTestId } = render(<FileComments {...defaultProps} />);
    await waitFor(() => expect(queryByDominoTestId('wait-spinner')).toBeFalsy());
  });
});
