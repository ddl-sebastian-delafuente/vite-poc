import * as React from 'react';
import styled from 'styled-components';

import RouteLink from '../components/Link/RouteLink';

const UserListWrapper = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const UserListItem = styled.li`
  display: inline-block;
  margin-right: 0.25em;
`;

export interface UserListProps {
  users?: string[]
}

export const UserList = ({
  users = []
}: UserListProps) => {
  return (
    <UserListWrapper>
      {users.map((user) => (
        <UserListItem key={user}>
          <RouteLink to={`/u/${user}`}>{user}</RouteLink>
        </UserListItem>
      ))}
    </UserListWrapper>
  )
};
