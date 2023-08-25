import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import * as Users from '@domino/api/dist/Users';
import * as Organizations from '@domino/api/dist/Organizations';
import { organizationMember, organization, user } from '@domino/test-utils/dist/mocks';
import UsersAndOrgsDropdown from '../UsersAndOrgsDropdown';
import MultiGroupSelect from '../MultiSelect/MultiGroupSelect';

const mockUsers = [
  {
    ...user,
    avatarUrl: '',
    firstName: 'John',
    fullName: 'John Doe',
    id: '5e7e6a95fe3cf1077d3b6b6d',
    lastName: 'Doe',
    userName: 'JohnDoe',
  },
  {
    ...user,
    avatarUrl: '',
    firstName: 'Test',
    fullName: 'Test User',
    id: '4e7e6a95fe3cf1077d3b6b6c',
    lastName: 'User',
    userName: 'TestUser',
  },
  {
    ...user,
    avatarUrl: '',
    firstName: '',
    fullName: '',
    id: '5f35a0900406ca0988186096',
    lastName: '',
    userName: 'Jira',
  },
  {
    ...user,
    avatarUrl: '',
    firstName: '',
    fullName: '',
    id: '5f35a0900406ca0988186097',
    lastName: '',
    userName: 'Domino test Org',
  },
];

const mockOrganizations = [
  {
    ...organization,
    'id':'5f35a0900406ca0988186097',
    'name':'Jira',
    'organizationUserId':'5f35a0900406ca0988186096',
    'members':[
      {
        ...organizationMember,
        'id':'5f32cdd2217f31f5399a44ed',
      }
    ]
  },
  {
    ...organization,
    'id':'1a8a9sx700406ca098818609',
    'name':'Domino test Org',
    'organizationUserId':'5f35a0900406ca0988186097',
    'members':[
      {
        ...organizationMember,
        'id':'5f32cdd2217f31f5399a44ed',
      }
    ]
  }
];

let listUsers: jest.SpyInstance;
let getAllOrganizations: jest.SpyInstance;
let mocks: Array<jest.SpyInstance>;

beforeAll(() => {
  listUsers = jest.spyOn(Users, 'listUsers').mockResolvedValue(mockUsers);
  getAllOrganizations = jest.spyOn(Organizations, 'getAllOrganizations').mockResolvedValue(mockOrganizations);
  mocks = [listUsers, getAllOrganizations];
});
afterAll(() => unmockMocks(mocks));


describe('UsersAndOrgsDropdown', () => {
  it('should render Users And Organzations as Groups in options', async () => {
    const { getByRole, getByText } = render(<UsersAndOrgsDropdown defaultValues={[]} onChangeUsers={jest.fn()} />);
    await waitFor(() => expect(getByRole('combobox')).toBeTruthy());
    await userEvent.type(getByRole('combobox'), 'test');
    expect(getByText('Organizations')).toBeTruthy();
    expect(getByText('Users')).toBeTruthy();
  });

  it('should call onSearch Prop when searching for a User or an Org', async () => {
    const onSearchFn = jest.fn();
    const { getByRole } = render(<MultiGroupSelect onSearch={onSearchFn} selectedValues={[]} />);
    await userEvent.type(getByRole('combobox'), 'test');
    expect(onSearchFn).toBeCalled();
  });

  it('should have 0 options initially', async () => {
    const { getByRole, container } = render(<UsersAndOrgsDropdown defaultValues={[]} onChangeUsers={jest.fn()} />);
    await waitFor(() => expect(getByRole('combobox')).toBeTruthy());
    await userEvent.click(getByRole('combobox'));
    await waitFor(() => expect(container.querySelectorAll('.ant-select-dropdown-menu-item')).toHaveLength(0));
  });

  it('should filter Users and Orgs on Search', async () => {
    const { getByRole, baseElement, getByText } = render(<UsersAndOrgsDropdown defaultValues={[]} onChangeUsers={jest.fn()} />);
    await waitFor(() => expect(getByRole('combobox')).toBeTruthy());
    await userEvent.type(getByRole('combobox'), 'test');
    expect(getByText('Organizations')).toBeTruthy();
    expect(getByText('Users')).toBeTruthy();
    const groups = Array.from(baseElement.querySelectorAll('.ant-select-item-option-grouped'));
    expect(groups).toHaveLength(2);
    const [orgsGroup, usersGroup] = groups;
    expect(orgsGroup.getAttribute('data-test')).toEqual('domino-test-org-option-container');
    expect(usersGroup.getAttribute('data-test')).toEqual('test-user-option-container');
  });
});
