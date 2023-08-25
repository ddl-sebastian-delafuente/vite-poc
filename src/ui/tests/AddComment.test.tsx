import * as React from 'react';
import 'jest-styled-components';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import  { WithRouterAndReduxContainer } from './util/testUtil';
import AddComment from '../src/components/AddComment';

describe('Add comment', () => {
  const submitCommentFn = jest.fn();
  it('should call function on add comment button click', async () => {
    const view = render(
      <WithRouterAndReduxContainer>
        <AddComment submitComment={submitCommentFn} />
      </WithRouterAndReduxContainer> 
    );
    await userEvent.type(view.getByDominoTestId('add-comment-input'), 'comment');
    await userEvent.click(view.getByDominoTestId('add-comment-submit-button'))
    expect(submitCommentFn).toBeCalled();
  });
  it('should render comment name while in text renderer', async () => {
    const view = render(
      <WithRouterAndReduxContainer>
        <AddComment submitComment={submitCommentFn} />
      </WithRouterAndReduxContainer> 
    );
    await userEvent.type(view.getByDominoTestId('add-comment-input'), 'Add Comment');
    expect(view.getByDominoTestId('preview-text').textContent).toEqual('Add Comment');
  });
});
