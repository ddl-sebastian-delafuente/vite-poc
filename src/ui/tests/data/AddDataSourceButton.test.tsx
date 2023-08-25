import userEvent from '@testing-library/user-event'
import * as R from 'ramda';
import * as React from 'react';

import AddDataSourceButton, { AddDataSourceButtonProps } from '../../src/data/data-sources/add-existing-data-source/AddDataSourceButton';
import * as CommonData from '../../src/data/data-sources/CommonData';
import { 
  AdminProfile,
  makeMocks,
  MakeMocksReturn
} from '@domino/test-utils/dist/mock-manager';
import { getDataSourcesByUserResponse } from '@domino/test-utils/dist/mockResponses';
import { 
  fullClick,
  render, 
  screen, 
  waitFor 
} from '@domino/test-utils/dist/testing-library';

let mocks: MakeMocksReturn;
let commonDataMock: jest.SpyInstance;

beforeAll(() => {
  mocks = makeMocks();

  mocks.loadProfile(AdminProfile);

  // Additional Mocks
  commonDataMock = jest.spyOn(CommonData, 'getDateInFormat').mockReturnValue('Jun 13th, 2019 @ 04:15:00 PM');
})

afterAll(() => {
  mocks.unmock();

  commonDataMock.mockRestore();
});

const defaultProps: AddDataSourceButtonProps = Object.freeze({
  onAddDataSource: jest.fn(),
  navigateToDetailPageOnDatasourceCreation: false,
  projectId: 'projectId',
  userId: 'userId',
});

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.track = jest.fn()

describe('AddDataSourceButton', () => {
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  it('should show the add data source modal when there are addable data sources', async () => {
    const view = render(<AddDataSourceButton {...defaultProps} />);
    await waitFor(() => expect(view.getByDominoTestId('add-datasource')).not.toBeNull());

    const addDataSourceButton = view.getByDominoTestId('add-datasource');
    await user.click(addDataSourceButton);

    await waitFor(() => expect(view.getByDominoTestId('create-new-data-source-button')).not.toBeNull());
    expect(screen.getAllByRole('table')).not.toBeNull();
  });

  it('should show the create data source modal when there are no data sources', async () => {
    const { getDataSourcesByUser } = mocks.api.datasource;
    getDataSourcesByUser.mockResolvedValue([]);
    const view = render(<AddDataSourceButton {...defaultProps} />);
    await waitFor(() => expect(view.getByDominoTestId('add-datasource')).not.toBeNull());

    const addDataSourceButton = view.getByDominoTestId('add-datasource');
    await user.click(addDataSourceButton);

    await waitFor(() => expect(screen.getByRole('dialog')).not.toBeNull());
    expect(screen.getByText('New Data Source')).not.toBeNull();
  });

  it('should show the create data source modal when there are no addable data sources', async () => {
    const { getDataSourcesByUser } = mocks.api.datasource;
    const datasources = getDataSourcesByUserResponse.map((datasource) => R.mergeDeepRight(datasource, {projectIds: ['projectId']}));
    getDataSourcesByUser.mockResolvedValue(datasources);
    const view = render(<AddDataSourceButton {...defaultProps} />);
    await waitFor(() => expect(view.getByDominoTestId('add-datasource')).not.toBeNull());

    const addDataSourceButton = view.getByDominoTestId('add-datasource');
    await user.click(addDataSourceButton);

    await waitFor(() => expect(screen.getByRole('dialog')).not.toBeNull());
    expect(screen.getByText('New Data Source')).not.toBeNull();
  });

  /**
   * Skipping need to investigate issues with jsdom 
   * TypeError: Cannot set property message of [object DOMException] which has only a getter
   */
  it.skip('should close the create data source modal on submit', async () => {
    const { getDataSourcesByUser } = mocks.api.datasource;
    const datasources = getDataSourcesByUserResponse.map((datasource) => R.mergeDeepRight(datasource, {projectIds: ['projectId']}));
    getDataSourcesByUser.mockResolvedValue(datasources);

    const props = {
      ...defaultProps,
      onAddDataSource: jest.fn(),
    }
    
    const view = render(<AddDataSourceButton {...props} />);
    await waitFor(() => expect(view.getByDominoTestId('add-datasource')).not.toBeNull());

    const addDataSourceButton = view.getByDominoTestId('add-datasource');
    await user.click(addDataSourceButton);

    await waitFor(() => expect(screen.getByRole('dialog')).not.toBeNull());
    expect(screen.getByText('New Data Source')).not.toBeNull();
    
    // Step 1 Select data source type
    const dsTypeSelect = view.getByDominoTestId('data-store-select-field');
    const selectId = dsTypeSelect.getAttribute('aria-controls');
    
    fullClick(dsTypeSelect);
    await waitFor(() => expect(view.container.querySelector(`.ant-select-dropdown-hidden > #${selectId}`)).toBeNull());

    const dsTypeSnowflakeOption = view.getByDominoTestId('data-store-SnowflakeConfig-select');
    fullClick(dsTypeSnowflakeOption);

    await waitFor(() => expect(view.getByDominoTestId('data-source-SnowflakeConfig-accountName-input')).not.toBeNull());

    // Step 2 enter config
    const accountNameInput = view.getByDominoTestId('data-source-SnowflakeConfig-accountName-input');
    const datasourceNameInput = view.getByDominoTestId('data-source-name-input');

    userEvent.type(datasourceNameInput, 'test-datasource');
    await waitFor(() => expect(datasourceNameInput.getAttribute('value')).toEqual('test-datasource'));
    
    userEvent.type(accountNameInput, 'test-account');
    await waitFor(() => expect(accountNameInput.getAttribute('value')).toEqual('test-account'));

    await waitFor(() => expect(view.getByDominoTestId('step-0-change').getAttribute('disabled')).toBeFalsy());
    const step0Next = view.getByDominoTestId('step-0-change');
    fullClick(step0Next);

    // Enter Credentials
    await waitFor(() => expect(view.getByDominoTestId('step-0-change')).not.toBeNull());
    await view.findByDominoTestId('step-1-change');
    await view.findByDominoTestId('test-credentials');

    const usernameInput = view.getByDominoTestId('username-input');
    const passwordInput = view.getByDominoTestId('password-input');

    userEvent.type(usernameInput, 'password-test');
    userEvent.type(passwordInput, 'password-test');
    
    await waitFor(() => expect(view.getByDominoTestId('test-credentials').getAttribute('disabled')).toBeFalsy());

    // Test Credentials
    const testCredentials = view.getByDominoTestId('test-credentials');
    fullClick(testCredentials);
    expect(mocks.api.datasource.checkDataSourceConnection).toHaveBeenCalledTimes(1);

    // After test success continue to next step
    const step1Next = view.getByDominoTestId('step-1-change');
    fullClick(step1Next);

    // Create Datasource
    await waitFor(() => expect(view.getByDominoTestId('step-2-change')).not.toBeNull());
    const step2Next = view.getByDominoTestId('step-2-change');
    fullClick(step2Next);
    
    await waitFor(() => expect(view.getByDominoTestId('successfully-created-success')).not.toBeNull());

    expect(mocks.api.datasource.create).toHaveBeenCalledTimes(1);
    expect(props.onAddDataSource).toHaveBeenCalledTimes(1);
  });
});
