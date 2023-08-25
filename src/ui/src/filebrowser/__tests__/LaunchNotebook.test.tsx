import * as React from 'react';
import 'jest-styled-components';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import LaunchNotebook from '../LaunchNotebook';

jest.mock('axios');
afterAll(() => jest.unmock('axios'));

describe('Launch Notebook', () => {
  it('should show credential propagation modal when API returns redirectPath in response', async () => {
    const mockSubmitUrl = '/submitUrl';
    require('axios').post.mockImplementation((url: string) => {
      if (url === mockSubmitUrl) {
        return Promise.reject({
          response: {
            data: {
              redirectPath: 'redirectPath'
            }
          }
        });
      }
      return Promise.resolve({});
    });

    const view = render(<div>
        <LaunchNotebook
          csrfToken="csrfToken"
          commitId="commitId"
          filePath="filePath"
          btnLabel="Launch Notebook"
          submitUrl={mockSubmitUrl}
          reloginDataStorageKey="reloginDataStorageKey"
          ownerUsername="ownerUsername"
          projectName="projectName"
          showButton={true}
          projectId="projectId"
        />
      </div>);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(view.getByDominoTestId('acquireAuthorizationModal')).toBeTruthy());
  });
});
