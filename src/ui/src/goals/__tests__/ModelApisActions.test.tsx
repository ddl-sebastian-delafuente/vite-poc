import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import ModelApisActions from '../ModelApisActions';
import { LinkGoalWrapProps } from '../LinkGoalWrap';

const props: LinkGoalWrapProps = {
  modelId: 'modelId',
  modelVersionId: 'modelVersion',
  modelVersion: 1,
  projectId: 'projectId'
};

describe('ModelApisActions tests', () => {
  it('test should render successfully', async () => {
    const view = render(<ModelApisActions {...{ canPublishModel: true, ...props }} />);
    expect(view.baseElement.querySelectorAll('.ant-dropdown-trigger').length).toEqual(1);
    await userEvent.click(screen.getByRole('button'));
    expect(view.baseElement.querySelectorAll('.ant-dropdown-menu-item').length).toEqual(2);

    view.rerender(<ModelApisActions {...{ canPublishModel: false, ...props }} />);
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(view.baseElement.querySelectorAll('.ant-dropdown-menu-item').length).toEqual(1);
  });
});
