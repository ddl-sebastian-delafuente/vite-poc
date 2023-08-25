import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import AddFolderModal from '../AddFolderModal';

describe('<AddFolderModal />', () => {
  it('should have a tooltip', async () => {
    const view = render(
      <AddFolderModal
        createFolderEndpoint={'test'}
        csrfToken={'test'}
        dirPath={'test'}
        projectName={'test'}
        ownerUsername={'test'}
      />
    );
    userEvent.hover(screen.getByRole('button'));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
  });
});
