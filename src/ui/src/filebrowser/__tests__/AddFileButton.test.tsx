import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import AddFileButton from '../AddFileButton';

describe('<AddFileButton />', () => {
  it('should have a tooltip', async () => {
    const view = render(
      <AddFileButton
        createFileEndpoint={'test'}
      />
    );
    userEvent.hover(screen.getByRole('link'));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
  });
});
