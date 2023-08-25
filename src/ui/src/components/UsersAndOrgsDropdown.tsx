import { CustomTagProps  } from 'rc-select/lib/BaseSelect';
// eslint-disable-next-line no-restricted-imports
import { Tag  } from 'antd';
import { flushSync } from 'react-dom';
import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { listUsers } from '@domino/api/dist/Users';
import { getProjectSummary } from '@domino/api/dist/Projects';
import { DominoCommonUserPerson as User } from '@domino/api/dist/types';
import { RefSelectProps } from '@domino/ui/dist/components/Select';
import MultiGroupSelect from './MultiSelect/MultiGroupSelect';
import WaitSpinner from '../components/WaitSpinner';

const StyledTag = styled(Tag)`
  & > div {
    display: inline-block;
  }
`

export interface Props {
  "aria-label"?: string;
  "data-test"?: string;
  disabledUsers?: {
    groupTitle: string;
    list: Array<{
      id: string;
      name: string;
    }>;
    formatter: (value: string) => string;
    tooltip: string;
  };
  defaultValues: string[];
  excludeUsers?: string[];
  isAdmin?: boolean;
  multiSelectStyle?: React.CSSProperties;

  /**
   * when set to true will filter out orgs
   */
  omitOrgs?: boolean;

  /**
   * When set to true will fillter out users
   */
  omitUsers?: boolean;
  onChangeUsers: (selectedValues: string[]) => void;
  onFetchData?: (values: string[], allUsers: User[], allOrganizations: User[],
                 usersByProject: User[], organizationsByProject: User[]) => void;
  placeholder?: string | React.ReactNode;
  projectId?: string;
}

export interface State {
  users: User[];
  organizations: User[];
  filteredUsers: User[];
  filteredOrgs: User[];
  selectedValues: string[];
  disabledUserIds: string[];
  options: InputOptionType[];
  isLoading: boolean;
}

export interface InputOptionType {
  key: string;
  groupName: string;
  groupOptions: any;
}

class UsersAndOrgsDropdown extends React.Component<Props, State> {
  static defaultProps = {
    defaultValues: [],
    isAdmin: true,
    placeholder: 'Search for a user or an organization...',
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      users: [],
      organizations: [],
      filteredUsers: [],
      filteredOrgs: [],
      selectedValues: [...props.defaultValues],
      disabledUserIds: props.disabledUsers ? R.pluck('id')(props.disabledUsers?.list) : [],
      options: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetchUsersAndOrganizations();
  }

  componentDidUpdate(prevProps: Props) {
    if (!R.equals(this.props.defaultValues, prevProps.defaultValues)) {
      const selectedValues = [...this.props.defaultValues];
      this.setState({
        selectedValues
      }, this.setSelectedUsersAndOrganizationOptions);
    }
    if (!R.equals(this.props.excludeUsers, prevProps.excludeUsers)) {
      this.fetchUsersAndOrganizations();
    }
    if (!R.equals(this.props.disabledUsers, prevProps.disabledUsers)) {
      this.setState({
        disabledUserIds: this.props.disabledUsers ? R.pluck('id')(this.props.disabledUsers?.list) : []
      });
    }
  }

  fetchUsersAndOrganizations = async () => {
    this.setState({isLoading: true});

    let allUsers: User[] = [];
    try {
      allUsers = await listUsers({});
    } catch (e) {
      console.warn('Failed to fetch list users', e);
    }

    this.setState({isLoading: false});
    const searchableUsers: User[] = R.reject<User>(
      R.propSatisfies((id: string) => R.contains(id, this.props.excludeUsers || []) ||
        R.contains(id,  this.state.disabledUserIds), 'id')
    )(allUsers);

    const {
      filteredOrganizations,
      filteredUsers,
    } = searchableUsers.reduce((memo, user) => {
      // if a user has no first & last name defined that is actually a organization
      if (!user.firstName && !user.lastName) {
        if (this.props.omitOrgs) {
          return memo;
        }

        memo.filteredOrganizations.push(user);
        return memo;
      }

      if (this.props.omitUsers) {
        return memo;
      }

      memo.filteredUsers.push(user);
      return memo;
    }, {
      filteredOrganizations: [] as User[],
      filteredUsers: [] as User[],
    });

    let filteredUsersByProject: User[] = [];
    let filteredOrganizationsByProject: User[] = [];
    if (this.props.projectId) {
      const projectSummary = await getProjectSummary({projectId: this.props.projectId});
      const projectUserIds = [...projectSummary.collaboratorIds, projectSummary.ownerId];
      filteredUsersByProject = R.filter((user: User) => projectUserIds.includes(user.id), filteredUsers);
      filteredOrganizationsByProject =
        R.filter((user: User) => projectUserIds.includes(user.id), filteredOrganizations);
    }

    flushSync(() => 
      this.setState({
        users: filteredUsers,
        organizations: filteredOrganizations
    }));
    this.setSelectedUsersAndOrganizationOptions();
    if (this.props.onFetchData) {
      this.props.onFetchData(R.map(item => R.prop('id', item), [...filteredUsers, ...filteredOrganizations]),
        filteredUsers, filteredOrganizations, filteredUsersByProject, filteredOrganizationsByProject);
    }
  }

  setSelectedUsersAndOrganizationOptions = () => {
    const selectedUsers = R.filter((user: User) =>
      R.indexOf(user.id, this.props.defaultValues) >= 0
    )(this.state.users);
    const selectedOrganizations = R.filter((org: User) =>
      org.id ? R.indexOf(org.id, this.props.defaultValues) >= 0 : false
    )(this.state.organizations);
    this.setState({
      filteredUsers: selectedUsers,
      filteredOrgs: selectedOrganizations,
      isLoading: false
    });
  }

  filterOrganizations = (org: User, query: string): boolean => {
    if (!R.isNil(org.userName)) {
      return R.toLower(org.userName).indexOf(query) !== -1;
    }
    return false;
  }

  filterUsers = (user: User, query: string): boolean => {
    return R.toLower(user.fullName).indexOf(query) !== -1 || R.toLower(user.userName).indexOf(query) !== -1;
  }

  onSearchUsersAndOrganizations = async (query: string) => {
    const searchQuery = R.toLower(query);
    const filteredUsers = R.filter((user: User) => this.filterUsers(user, searchQuery),
      this.state.users);
    if (!R.isNil(this.state.organizations)) {
      const filteredOrgs = R.filter((org: User) => this.filterOrganizations(org, searchQuery),
        this.state.organizations);
      this.setState({
        filteredUsers: filteredUsers,
        filteredOrgs: filteredOrgs
      });
    } else {
      this.setState({
        filteredUsers: filteredUsers
      });
    }
  }

  onSearch = async (query: string) => {
    if (!R.isEmpty(query)) {
      this.onSearchUsersAndOrganizations(query);
      return;
    }

    this.resetFilter();
  }

  onChange = (value: string[]) => {
    const shouldHide = this.state.selectedValues.length < value.length;
    this.setState({
      selectedValues: [...value]
    });
    this.props.onChangeUsers(this.props.disabledUsers ?
      R.filter(item => !R.contains(item,  this.state.disabledUserIds), value) : value);

    if (shouldHide) {
      if (this.selectRef.current) {
        const elem: any = this.selectRef.current;
        elem.blur();
      }
    }
  }

  renderOptions = (groupTitle: string, displayKey: string, dataSource: any) => {
    return {
      key: groupTitle,
      groupName: groupTitle,
      groupOptions: dataSource.map((data: any) => {
        return (
          {
            key: data.id,
            value: data.id,
            label: data[displayKey]
          }
        );
      })
    };
  }

  renderDisabledOptions = () => {
    if (!this.props.disabledUsers) {
      return null;
    }

    const {groupTitle, list, formatter, tooltip} = this.props.disabledUsers;

    return {
      key: groupTitle,
      groupName: groupTitle,
      groupOptions: list.map(({id, name}) => (
        {
          key: id,
          value: id,
          label: formatter(name),
          disabled: true,
          tooltip: tooltip,
        }
      )),
    };
  }

  resetFilter = () => {
    this.setState({
      filteredOrgs: [],
      filteredUsers: []
    });
  }

  findGroupOptions = () => {
    const disabledUsers = this.renderDisabledOptions();
    const orgOptions = this.renderOptions('Organizations', 'userName', this.state.filteredOrgs || []);
    const userOptions = this.renderOptions('Users', 'userName', this.state.filteredUsers || []);

    const groupOptions = disabledUsers ? [disabledUsers] : [];

    if (!this.props.omitOrgs && orgOptions.groupOptions.length > 0) {
      groupOptions.push(orgOptions);
    }

    if (!this.props.omitUsers && userOptions.groupOptions.length > 0) {
      groupOptions.push(userOptions);
    }

    return groupOptions;
  }

  findLabel = (id: string) => {
    const { users, organizations } = this.state;

    // Search against disabled users
    if (this.props.disabledUsers) {
      const { formatter, list } = this.props.disabledUsers;

      const disabledUser = list.find((obj) => obj.id === id);
      if (disabledUser) {
        return formatter(disabledUser.name);
      }
    }

    const org = organizations.find((obj) => obj.id === id);
    if (org) {
      return org.userName;
    }

    const user = users.find((obj) => obj.id === id);
    if (user) {
      return user.userName;
    }

    return id;
  }

  tagRender = ({
    closable,
    onClose,
    value,
    ...rest
  }: CustomTagProps) => {
    const preventMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      e.stopPropagation();
    }

    const label = ['string', 'number'].includes(typeof rest.label) ? this.findLabel(value) : rest.label;

    return (
      <StyledTag
        onMouseDown={preventMouseDown}
        closable={closable}
        onClose={onClose}
      >
       {label}
      </StyledTag>
    )
  }

  private selectRef = React.createRef<RefSelectProps>();

  render() {
    const ariaLabel = this.props['aria-label'];
    const dataTest = this.props['data-test'] || 'users-and-orgs-dropdown';
    const options = this.findGroupOptions();

    return this.state.isLoading ?
      <WaitSpinner margin="0"/> : (
      <MultiGroupSelect
        aria-label={ariaLabel}
        closeAfterDeselect
        closeAfterSelect
        data-test={dataTest}
        defaultValue={[...this.state.disabledUserIds, ...this.props.defaultValues]}
        getPopupContainer={() => document.body}
        onBlur={this.resetFilter}
        onSearch={this.onSearch}
        onSelectionChange={this.onChange}
        options={options}
        placeholder={this.props.placeholder}
        ref={this.selectRef}
        selectedValues={[...this.state.disabledUserIds, ...this.state.selectedValues]}
        style={this.props.multiSelectStyle}
        tagRender={this.tagRender}
      />
    );
  }
}

export default UsersAndOrgsDropdown;
