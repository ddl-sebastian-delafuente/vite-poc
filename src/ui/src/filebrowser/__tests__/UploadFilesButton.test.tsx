import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import UploadFilesButton from '../UploadFilesButton';

describe('<UploadFilesButton />', () => {
  it('should have a tooltip', async () => {
    const view = render(
      <UploadFilesButton
        showDropZone={() => {}}
      />
    );
    userEvent.hover(screen.getByRole('button'));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
  });
});
