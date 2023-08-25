import * as React from 'react';
import * as R from 'ramda';
import { DominoCommonUserPerson as User, Organization } from '@domino/api/dist/types';
import { listUsers } from '@domino/api/dist/Users';
import Link from '../../components/Link/Link';
import { error } from '../../components/toastr';
import { userBase } from '../../core/routes';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  && {
    display: inline;
  }
`;

export interface Props {
  userIds: string[];
  allOrganizations: Organization[];
}

export interface State {
  users: User[];
  organizations: Organization[];
}

class UsersView extends React.Component<Props, State> {
  state: State = {
    users: [],
    organizations: []
  };

  componentDidMount() {
    this.getUsersList();
    this.getOrganizationsList();
  }

  getOrganizationsList = () => {
    const organizations = R.filter<Organization>(
      organization => R.contains<string>(organization.organizationUserId)(this.props.userIds)
    )(this.props.allOrganizations);
    this.setState({organizations});
  }

  getUsersList = async () => {
    if (!R.isEmpty(this.props.userIds)) {
      try {
        const users = await listUsers({userId: this.props.userIds});
        const filteredUsers = R.filter(
          (user: User) =>
            R.findIndex(R.propEq('organizationUserId', user.id))(this.props.allOrganizations) < 0
        )(users);
        this.setState({users: filteredUsers});
      } catch (e) {
        console.warn(e);
        error('Failed to get Users');
      }
    }
  }

  render() {
    const { users, organizations } = this.state;
    return R.isEmpty(users) && R.isEmpty(organizations) ? '--' :
      R.intersperse(
        ', ',
        R.concat(
          R.map<User, React.ReactNode>(
            (user: User) =>
              <StyledLink key={user.id} href={userBase(user.userName)}>{user.userName}</StyledLink>
          )(users),
          R.map<Organization, React.ReactNode>(
            (organization: Organization) =>
              <StyledLink key={organization.id} href={userBase(organization.name)}>{organization.name}</StyledLink>
          )(organizations)
        )
      );
  }
}

export default UsersView;
