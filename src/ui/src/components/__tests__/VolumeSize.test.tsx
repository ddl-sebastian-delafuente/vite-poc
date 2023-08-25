import * as React from 'react';
import * as renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import 'jest-styled-components';
import VolumeSize, { updateButtonLabel, volumeSizeUpdateButtonTest } from '../VolumeSize';

const maxVolumeSizeInGiB = 10;
const minVolumeSizeInGiB = 4;
const defaultVolumeSizeInGiB = 8;

const mockProjectSettings = {
  defaultEnvironmentId: 'defaultEnvironmentId',
  defaultHardwareTierId: 'defaultHardwareTierId',
  sparkClusterMode: 'OnDemand',
  defaultVolumeSizeGiB: defaultVolumeSizeInGiB,
  maxVolumeSizeGiB: maxVolumeSizeInGiB,
  minVolumeSizeGiB: minVolumeSizeInGiB
};

const mockUpdateProjectSettings = jest.fn();

jest.mock('@domino/api/dist/Projects', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProjectSettings: (args: { projectId: string, ownerId: string }) =>
    Promise.resolve(mockProjectSettings),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateProjectSettings: (args: any) => {
    mockUpdateProjectSettings();
    return Promise.resolve({});
  }
}));

afterAll(() => {
  jest.unmock('@domino/api/dist/Projects');
});

describe('VolumeSize input', () => {
  xit('should match with this snapshot', (done) => {
    const component = renderer.create(<VolumeSize projectId="projectId" />);
    setTimeout(() => {
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      done();
    }, 50);
  });

  it('should show the units as GiB', async () => {
    const view = render(<VolumeSize projectId="projectId" />);
      await waitFor(() => expect(view.baseElement.querySelector('.ant-input-suffix')!.textContent).toMatch('GiB'));
  });

  it('should show the min and max allowed value in GiB', async () => {
    const view = render(<VolumeSize projectId="projectId" />);
    await waitFor(() => expect(view.baseElement.textContent).toMatch('Min Size: 4.0 GiB, Max Size: 10.0 GiB'));
  });

  it('should have the default value as `defaultVolumeSizeInGiB`', async () => {
    const { baseElement } = render(<VolumeSize projectId="projectId" />);
    await waitFor(() => expect((baseElement.querySelector('input.ant-input') as HTMLInputElement).value).toEqual(defaultVolumeSizeInGiB.toFixed(1)));
  });

  it('should not update project settings when the value is more than maxProjectSizeGiB', async () => {
    const { baseElement } = render(<VolumeSize projectId="projectId" />);
    await waitFor(() => expect(baseElement.querySelector('input.ant-input') as HTMLInputElement).toBeTruthy());
    userEvent.clear(baseElement.querySelector('input.ant-input') as HTMLInputElement);
    userEvent.type(baseElement.querySelector('input.ant-input') as HTMLInputElement, '12{enter}');
    await waitFor(() => expect((baseElement.querySelector('input.ant-input') as HTMLInputElement).value).toEqual('12'));
    expect(mockUpdateProjectSettings).toHaveBeenCalledTimes(0);
  });

  it('should not update project settings when the value is less than minProjectSizeGiB', async () => {
    const { baseElement } = render(<VolumeSize projectId="projectId" />);
    await waitFor(() => expect(baseElement.querySelector('input.ant-input') as HTMLInputElement).toBeTruthy());
    userEvent.clear(baseElement.querySelector('input.ant-input') as HTMLInputElement);
    userEvent.type(baseElement.querySelector('input.ant-input') as HTMLInputElement, '2{enter}');
    await waitFor(() => expect((baseElement.querySelector('input.ant-input') as HTMLInputElement).value).toEqual('2'));
    expect(mockUpdateProjectSettings).toHaveBeenCalledTimes(0);
  });

  it('should call the updateProjectSettings API on enter when value is valid', async () => {
    const { baseElement } = render(<VolumeSize projectId="projectId" />);
    await waitFor(() => expect(baseElement.querySelector('input.ant-input') as HTMLInputElement).toBeTruthy());
    await userEvent.type(baseElement.querySelector('input.ant-input') as HTMLInputElement, '{enter}');
    await waitFor(() => expect((baseElement.querySelector('input.ant-input') as HTMLInputElement).value).toEqual('8.0'));
    expect(mockUpdateProjectSettings).toHaveBeenCalledTimes(1);
  });

  it(`should render the ${updateButtonLabel} Button inside the 'Workspace & Jobs Volume Size' Panel`, async () => {
    const view = render(<VolumeSize projectId="projectId" />);
    await waitFor(() => expect(view.getByDominoTestId(volumeSizeUpdateButtonTest)).toBeTruthy());
  });

  it(`should call the updateProjectSettings API on clicking the '${updateButtonLabel}' Button when value is valid`, async () => {
    const view = render(<VolumeSize projectId="projectId" />);
    await waitFor(() => expect(view.getByDominoTestId(volumeSizeUpdateButtonTest)).toBeTruthy());
    await userEvent.click(view.getByDominoTestId(volumeSizeUpdateButtonTest));
    await waitFor(() => expect(mockUpdateProjectSettings).toHaveBeenCalledTimes(1));
  });
});
