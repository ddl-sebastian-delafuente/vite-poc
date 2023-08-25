import * as React from 'react';
import 'jest-styled-components';
import { render, waitFor, configure, fireEvent } from '@testing-library/react';
import { adminInterfaceWhitelabelConfigurations } from '@domino/test-utils/dist/mocks';
import { makeMocks, MakeMocksReturn, AdminProfile } from '@domino/test-utils/dist/mock-manager';
import VolumeSizeSelector from '../VolumeSizeSelector';

const projectVolumeSizeInGiB = 4;
const recommendedVolumeSizeInGiB = 10;

const volumeSizeSelectorProps = {
	projectVolumeSizeInGiB,
	recommendedVolumeSizeInGiB
}

const appName = 'Domino';
let mocks: MakeMocksReturn;

beforeAll(() => {
  jest.resetAllMocks();
  mocks = makeMocks();
  mocks.loadProfile(AdminProfile);
  mocks.api.admin.getWhiteLabelConfigurations.mockResolvedValue({
    ...adminInterfaceWhitelabelConfigurations,
    appName
  });
});

afterAll(() => {
  mocks.unmock();
});

describe('VolumeSizeSelector', () => {
	configure({ testIdAttribute: 'data-test' });

	it('should show the units in GiB', async () => {
		const view = render(<VolumeSizeSelector {...volumeSizeSelectorProps}/>);
		await waitFor(() => expect(view.getByTestId('volume-size-projectSetting-content').textContent).toContain('GiB'));
		await waitFor(() => expect(view.getByTestId('volume-size-recommendedSetting-content').textContent).toContain('GiB'));
	});

	it('should have default value selected as projectVolumeSizeInGiB', async () => {
		const view = render(<VolumeSizeSelector {...volumeSizeSelectorProps}/>);
		await waitFor(() => expect(view.container.querySelector('.ant-radio.ant-radio-checked > input')!.getAttribute('value')).toEqual(projectVolumeSizeInGiB.toString()));
	});

  it('should call onVolumeSizeChange with the selected volume size', async () => {
		const onVolumeSizeChange = jest.fn();
		const view = render(<VolumeSizeSelector {...volumeSizeSelectorProps} onVolumeSizeChange={onVolumeSizeChange}/>);
		await waitFor(() => expect(view.container.querySelector('.ant-radio.ant-radio-checked > input')!.getAttribute('value')).toEqual(projectVolumeSizeInGiB.toString()));
    await waitFor(() => expect(onVolumeSizeChange).toHaveBeenNthCalledWith(1, projectVolumeSizeInGiB));
    const label = view.getByLabelText(`Use ${appName}’s recommended volume size of`, { exact: false });
		fireEvent.click(label);
		await waitFor(() => expect(view.container.querySelector('.ant-radio.ant-radio-checked > input')!.getAttribute('value')).toEqual(recommendedVolumeSizeInGiB.toString()));
		await waitFor(() =>expect(onVolumeSizeChange).toHaveBeenNthCalledWith(2, recommendedVolumeSizeInGiB));
	});

	it('show only the project volume size option When projectVolumeSize & recommendedVolumeSize values are same', async () => {
		const view = render(<VolumeSizeSelector projectVolumeSizeInGiB={4} recommendedVolumeSizeInGiB={4}/>);
		await waitFor(() => expect(view.getByTestId('volume-size-projectSetting-content')).toBeTruthy());
		await waitFor(() => expect(view.queryByTestId('volume-size-recommendedSetting-content')).toBeNull());
	});	

});
