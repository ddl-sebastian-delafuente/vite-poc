import * as React from 'react';
import { omit } from 'ramda';
import styled from 'styled-components';
import * as colors from '../../styled/colors';
import { SearchProps } from 'antd/lib/input';
import Input from '../TextInput/Input';

const FIELD_WIDTH = 300;

const SearchContainer = styled(Input.Search)`
  .ant-btn-primary {
    border: 1px solid ${colors.pinkishGrey};
    color: ${colors.mineShaftColor};
    background: ${colors.white};
    padding: ${({ size }) => size == 'small' ? '4px' : '8px' };
    box-shadow: none;
  }
  &.ant-input-search-with-button .ant-input-group .ant-input:hover {
    z-index: 1;
  }
  &.ant-input-search .ant-input:focus + span .ant-btn-primary {
    border-color: ${colors.lightDodgerBlue};
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    outline: 0;
    z-index: 1;
    border-right-width: 1px;
  }
  button:not(:disabled):hover {
    background: transparent;
  }
`;

const Search: React.FC<SearchProps & { size?: 'small' | 'default' }> = (props) =>
  <SearchContainer style={{width: FIELD_WIDTH}} {...omit(['enterButton'], props)} enterButton/>;

export default Search;
