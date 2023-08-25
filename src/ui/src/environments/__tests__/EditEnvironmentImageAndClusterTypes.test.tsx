import * as React from 'react';
import { MemoryRouter as Router } from 'react-router';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import BaseImageSelector from '../BaseImageSelector';

const mockDefaultEnvironment = {"id":"5ef9bdb8cc4d392746c7e39d","archived":false,"name":"Default","visibility":"Global","supportedClusters":[],"latestRevision":{"id":"5ef9bdb8cc4d392746c7e39e","number":1,"status":"Succeeded","url":"/environments/revisions/5ef9bdb8cc4d392746c7e39e",isRestricted: false, "availableTools":[{"id":"jupyter","name":"jupyter","title":"Jupyter (Python, R, Julia)","iconUrl":"/assets/images/workspace-logos/Jupyter.svg","start":["/var/opt/workspaces/jupyter/start"],"proxyConfig":{"internalPath":"/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}","port":8888,"rewrite":false},"supportedFileExtensions":[".ipynb"]},{"id":"rstudio","name":"rstudio","title":"RStudio","start":["/var/opt/workspaces/rstudio/start"],"proxyConfig":{"internalPath":"/","port":8888,"rewrite":true}}]},"selectedRevision":{"id":"5ef9bdb8cc4d392746c7e39e","number":1,"status":"Succeeded","url":"/environments/revisions/5ef9bdb8cc4d392746c7e39e","availableTools":[{"id":"jupyter","name":"jupyter","title":"Jupyter (Python, R, Julia)","iconUrl":"/assets/images/workspace-logos/Jupyter.svg","start":["/var/opt/workspaces/jupyter/start"],"proxyConfig":{"internalPath":"/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}","port":8888,"rewrite":false},"supportedFileExtensions":[".ipynb"]},{"id":"rstudio","name":"rstudio","title":"RStudio","start":["/var/opt/workspaces/rstudio/start"],"proxyConfig":{"internalPath":"/","port":8888,"rewrite":true}}]}};
const mockCurrentUserEnvironments = [{"id":"5ef9bdb8cc4d392746c7e39d","archived":false,"name":"Default","visibility":"Global","supportedClusters":[],"latestRevision":{"id":"5ef9bdb8cc4d392746c7e39e","number":1,"status":"Succeeded","url":"/environments/revisions/5ef9bdb8cc4d392746c7e39e",isRestricted: false, "availableTools":[{"id":"jupyter","name":"jupyter","title":"Jupyter (Python, R, Julia)","iconUrl":"/assets/images/workspace-logos/Jupyter.svg","start":["/var/opt/workspaces/jupyter/start"],"proxyConfig":{"internalPath":"/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}","port":8888,"rewrite":false},"supportedFileExtensions":[".ipynb"]},{"id":"rstudio","name":"rstudio","title":"RStudio","start":["/var/opt/workspaces/rstudio/start"],"proxyConfig":{"internalPath":"/","port":8888,"rewrite":true}}]},"selectedRevision":{"id":"5ef9bdb8cc4d392746c7e39e","number":1,"status":"Succeeded","url":"/environments/revisions/5ef9bdb8cc4d392746c7e39e","availableTools":[{"id":"jupyter","name":"jupyter","title":"Jupyter (Python, R, Julia)","iconUrl":"/assets/images/workspace-logos/Jupyter.svg","start":["/var/opt/workspaces/jupyter/start"],"proxyConfig":{"internalPath":"/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}","port":8888,"rewrite":false},"supportedFileExtensions":[".ipynb"]},{"id":"rstudio","name":"rstudio","title":"RStudio","start":["/var/opt/workspaces/rstudio/start"],"proxyConfig":{"internalPath":"/","port":8888,"rewrite":true}}]}},{"id":"5f0fe957906e6c437bb252be","archived":false,"name":"Test Environment","visibility":"Private","owner":{"id":"5ef9fc71e815dafe77f22e62","username":"integration-test","environmentOwnerType":"Individual"},"supportedClusters":[],"latestRevision":{"id":"5f0fee63906e6c437bb252d2","number":2,"status":"Succeeded","url":"/environments/revisions/5f0fee63906e6c437bb252d2","availableTools":[{"id":"jupyter","name":"jupyter","title":"Jupyter (Python, R, Julia)","iconUrl":"/assets/images/workspace-logos/Jupyter.svg","start":["/var/opt/workspaces/jupyter/start"],"proxyConfig":{"internalPath":"/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}","port":8888,"rewrite":false},"supportedFileExtensions":[".ipynb"]},{"id":"rstudio","name":"rstudio","title":"RStudio","start":["/var/opt/workspaces/rstudio/start"],"proxyConfig":{"internalPath":"/","port":8888,"rewrite":true}}]},"selectedRevision":{"id":"5f0fee63906e6c437bb252d2","number":2,"status":"Succeeded","url":"/environments/revisions/5f0fee63906e6c437bb252d2","availableTools":[{"id":"jupyter","name":"jupyter","title":"Jupyter (Python, R, Julia)","iconUrl":"/assets/images/workspace-logos/Jupyter.svg","start":["/var/opt/workspaces/jupyter/start"],"proxyConfig":{"internalPath":"/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}","port":8888,"rewrite":false},"supportedFileExtensions":[".ipynb"]},{"id":"rstudio","name":"rstudio","title":"RStudio","start":["/var/opt/workspaces/rstudio/start"],"proxyConfig":{"internalPath":"/","port":8888,"rewrite":true}}]}},{"id":"5f0fe97a906e6c437bb252c5","archived":false,"name":"Second test environment ","visibility":"Private","owner":{"id":"5ef9fc71e815dafe77f22e62","username":"integration-test","environmentOwnerType":"Individual"},"supportedClusters":[],"latestRevision":{"id":"5f0fe97a906e6c437bb252c7","number":1,"status":"Succeeded","url":"/environments/revisions/5f0fe97a906e6c437bb252c7","availableTools":[]},"selectedRevision":{"id":"5f0fe97a906e6c437bb252c7","number":1,"status":"Succeeded","url":"/environments/revisions/5f0fe97a906e6c437bb252c7","availableTools":[]}}];

jest.mock('@domino/api/dist/Environments', () => ({
  getDefaultEnvironment: () =>
    Promise.resolve(mockDefaultEnvironment),
  getCurrentUserEnvironments: () =>
    Promise.resolve(mockCurrentUserEnvironments)
}));

afterAll(() => {
  jest.unmock('@domino/api/dist/Environments');
});

describe('BaseImageSelector component', () => {
  it('should not show edited environment for selection of base image selection dropdown', async () => {
    const editEnvironmentId = '5f0fe957906e6c437bb252be';
    render(
      <Router>
        <BaseImageSelector
          baseEnvironmentRevisionId="5ef9bdb8cc4d392746c7e39e"
          environmentId={editEnvironmentId}
          imageType="Environment"
          isDefaultEnvironment={false}
          latestDefaultEnvironmentImage="quay.io/domino/run-dev:20200305-1100"
          missingValueErrorMessages={[]}
          isEditMode={true}
          disabled={false}
          isClusterImage={false}
        />
      </Router>
    );
      await waitFor(() => expect(screen.getByRole('combobox')).toBeTruthy());
      await userEvent.click(screen.getByRole('combobox'));
      await waitFor(() => expect(screen.queryByText('5ef9bdb8cc4d392746c7e39e')).not.toBeNull());
      await waitFor(() => expect(screen.queryByText(editEnvironmentId)).toBeNull());
  });
});
