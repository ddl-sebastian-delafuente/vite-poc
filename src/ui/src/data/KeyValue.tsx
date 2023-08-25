import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../styled/themeUtils';

const ListWrapper = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: ${themeHelper('margins.small')};
  }
`

const Name = styled.span`
  font-weight: 600;
  padding-right: 0.25em;

  &:after {
    content: ':'
  }
`;

const Value = styled.span``;

type Value = string | number;

interface KeyValueProps {
  name: string;
  value: Value;
}

interface KeyValueListProps {
  list: KeyValueProps[] | { [key: string]: Value };
}


export const KeyValue = ({ name, value }: KeyValueProps) => (
  <span>
    <Name>{name}</Name>
    <Value>{value}</Value>
  </span>
);

export const KeyValueList = (props: KeyValueListProps) => {
  const list = React.useMemo(() => {

    const ary = Array.isArray(props.list) ? 
      props.list : Object.keys(props.list).map(name => ({
        name,
        value: props.list[name],
      }));

    return (
      <>
        {ary.map((kv) => <KeyValue {...kv} key={kv.name} />)}
      </>
    )
  }, [props]);

  return (
    <ListWrapper>{list}</ListWrapper>
  )
}
