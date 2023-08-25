import * as React from 'react';
import { insert } from 'ramda';
import styled from 'styled-components';
import { AutoComplete, Input } from 'antd';
import type { BaseSelectRef } from 'rc-select/lib/BaseSelect';
import WithFileSearch, { Results, OnQuery } from '../containers/WithFileSearch';
import InlineWaitSpinner from './InlineWaitSpinner';

const StyledAutoComplete = styled(AutoComplete)`
  .ant-select-selection-placeholder {
    height: 100%;
    display: flex;
    align-items: center;
  }
`;

export type OnChangeHandler = (data: any, isSelect?: boolean) => void;

const handleOnFileSearch = (
    onFieldChange: OnChangeHandler, onQuery: OnQuery
  ) => (query: string): void => {
    onFieldChange(query);
    onQuery(query);
};

export type SharedProps = {
  onFieldChange: OnChangeHandler;
  testId?: string;
  container?: () => HTMLElement | null | undefined;
  defaultValue?: string;
  placeholder?: string;
  inputComponent?: React.ReactElement<{}>;
  customStyleProperties?: React.CSSProperties;
  className?: string;
  id?: string;
};

export type OuterProps = SharedProps & { projectId: string };

type ViewProps = {
  results: Results;
  onQuery: OnQuery;
  loading: boolean;
} & SharedProps;

type ManagedState = {
  value: any;
};

export class ManagedAutoComplete extends React.PureComponent<ViewProps, ManagedState> {
  ref: React.RefObject<BaseSelectRef>;

  constructor(props: ViewProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      value: props.defaultValue,
    };
  }

  componentDidMount() {
    if (this.ref && this.ref.current) {
      this.ref.current.focus();
    }
  }

  componentDidUpdate(prevProps: ViewProps) {
    if (prevProps.results !== this.props.results && this.ref.current) {
      this.ref.current.focus();
    }

    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: this.props.defaultValue });
    }
  }

  getPopupContainer = () => {
    const { container } = this.props;
    if (container) {
      return container() || document.body;
    }
    return document.body;
  }

  onFieldChange = (isSelect: boolean) => (value: any) => {
    this.setState({ value }, () => {
      this.props.onFieldChange(value, isSelect);
    });
  }

  render() {
    const {
      loading,
      results,
      onQuery,
      placeholder,
      inputComponent,
      testId,
      className,
      customStyleProperties,
      ...rest
    } = this.props;
    const { value } = this.state;
    const autoCompleteChildren = results.map(
      (result: string) =>
        <AutoComplete.Option key={result}>{result}</AutoComplete.Option>
    );
    const dataSource = loading ?
      insert(
        0,
        (
          <AutoComplete.Option key="spinner" disabled={true} style={{ color: 'unset' }}>
            <InlineWaitSpinner />
          </AutoComplete.Option>
        ),
        autoCompleteChildren
      ) :
      autoCompleteChildren;

    return (
      <StyledAutoComplete
        ref={this.ref}
        data-test={testId}
        getPopupContainer={this.getPopupContainer}
        onSelect={this.onFieldChange(true)}
        onChange={handleOnFileSearch(this.onFieldChange(false), onQuery)}
        value={value}
        dropdownStyle={{ zIndex: 2100 }}
        placeholder={placeholder}
        dataSource={dataSource}
        style={customStyleProperties}
        className={className}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
        {...rest}
      >
        {inputComponent ? inputComponent : <Input />}
      </StyledAutoComplete>
    );
  }
}

const WithApi: React.FC<OuterProps> = ({ projectId, ...rest }) => (
  <WithFileSearch projectId={projectId}>
    {(results: Results, onQuery: OnQuery, loading: boolean) => (
      <ManagedAutoComplete results={results} onQuery={onQuery} loading={loading} {...rest} />
    )}
  </WithFileSearch>
);

export default WithApi;
