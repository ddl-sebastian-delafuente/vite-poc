import * as React from 'react';
import axios from 'axios';
import MockAdapter from "axios-mock-adapter";
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import ImportArtifactsFromProjectForm from '../../ImportArtifactsFromProjectView/ImportArtifactsFromProjectForm';

const mock = new MockAdapter(axios);
const onCloseFn = jest.fn();
const handleSubmitFn = jest.fn();
const csrfToken = '269e87855342c87a59d5bece845f09da4d882765-1682676442565-1861fe1a46a5f6147147624e';
const data = [
  {
    projectId: "63eb1477fe89093adaf2e42b",
    ownerUsername: "integration-test",
    projectName: "Copy-Quick-start"
  }
]

describe('< ImportArtifactsFromProjectForm />', () => {
  const defaultProps = {
    onClose: onCloseFn,
    handleSubmit: handleSubmitFn,
    csrfToken: csrfToken
  }
  it('should render import project modal form', async () => {
    const view = render(
      <ImportArtifactsFromProjectForm
        {...defaultProps}
      />
    );
    await waitFor(() => expect(view.baseElement.querySelector('.ant-legacy-form')).toBeTruthy());
  });

  it('should call handleSubmitFn when importing project with empty directory name', async () => {
    mock.onGet("/searchForImportableProjects?query=integration-test/Copy-Quick-start").reply(200, data);
    const view = render(
      <ImportArtifactsFromProjectForm
        {...defaultProps}
      />
    );
    await expect(view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]')).toBeTruthy();
    await userEvent.type(view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]') as HTMLInputElement, 'integration-test/Copy-Quick-start');
    await waitFor(() => expect((view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]') as HTMLInputElement).value).toEqual('integration-test/Copy-Quick-start'));
    await waitFor(() => expect(view.getByDominoTestId('import-project-option')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('import-project-option'));
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(handleSubmitFn.mock.calls[0][0].dependencyName).toEqual('integration-test/Copy-Quick-start');
  });

  it('should call handleSubmitFn when importing project with directory name', async () => {
    mock.onGet("/searchForImportableProjects?query=integration-test/Copy-Quick-start").reply(200, data);
    const view = render(
      <ImportArtifactsFromProjectForm
        {...defaultProps}
      />
    );
    await expect(view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]')).toBeTruthy();
    await userEvent.type(view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]') as HTMLInputElement, 'integration-test/Copy-Quick-start');
    await waitFor(() => expect((view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]') as HTMLInputElement).value).toEqual('integration-test/Copy-Quick-start'));
    await waitFor(() => expect(view.getByDominoTestId('import-project-option')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('import-project-option'));
    expect(view.getByDominoTestId('directoryName-field')).toBeTruthy();
    await userEvent.type(view.getByDominoTestId('directoryName-field') as HTMLElement, 'test1');
    await waitFor(() => expect((view.getByDominoTestId('directoryName-field') as HTMLInputElement).value).toEqual('test1'));
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(handleSubmitFn.mock.calls[0][0].directoryName).toEqual('test1');
  });

  it('should call handleSubmitFn when importing project and typed some value in the directory name and cleared it', async () => {
    mock.onGet("/searchForImportableProjects?query=integration-test/Copy-Quick-start").reply(200, data);
    const view = render(
      <ImportArtifactsFromProjectForm
        {...defaultProps}
      />
    );
    await expect(view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]')).toBeTruthy();
    await userEvent.type(view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]') as HTMLInputElement, 'integration-test/Copy-Quick-start');
    await waitFor(() => expect((view.baseElement.querySelector('[class="ant-input ant-select-selection-search-input"]') as HTMLInputElement).value).toEqual('integration-test/Copy-Quick-start'));
    await waitFor(() => expect(view.getByDominoTestId('import-project-option')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('import-project-option'));
    expect(view.getByDominoTestId('directoryName-field')).toBeTruthy();
    await userEvent.type(view.getByDominoTestId('directoryName-field') as HTMLElement, 'test1');
    await userEvent.clear(view.getByDominoTestId('directoryName-field') as HTMLElement);
    await userEvent.click(view.getByDominoTestId('submit-button'));
    expect(handleSubmitFn.mock.calls[0][0].dependencyName).toEqual('integration-test/Copy-Quick-start');
    expect(handleSubmitFn.mock.calls[0][0].directoryName).toEqual(undefined);
  });
})
