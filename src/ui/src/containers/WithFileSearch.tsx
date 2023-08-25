import * as React from 'react';
import { DominoFilesInterfaceFileMatchesDto as FileMatches } from '@domino/api/dist/types';
import { fileSearch } from '@domino/api/dist/Files';
import { debounceInput } from '../utils/sharedComponentUtil';

export type OnQuery = (query: string) => void;

export type FilePath = string;

export type Results = FilePath[];

export type DefaultProps = {
  debounceTimeout?: number;
};

export type Props = {
  projectId: string;
  children: (
    results: Results, onQuery: OnQuery, loading: boolean, error?: any
  ) => JSX.Element | JSX.Element[] | null;
}& DefaultProps;

export type State = {
  results: Results;
  loading: boolean;
  error?: any;
};

/**
 * Provides to children a way to triggering a search
 * Provides to children result of search
 */
class WithFileSearch extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    debounceTimeout: 200,
  };

  state = {
    error: undefined,
    loading: false,
    results: [],
  };

  debounceInputQuery = debounceInput((query: string) => {
      const { projectId } = this.props;
      fileSearch({ body: { value: query }, maxResults: 200, projectId })
      .then(({ files }: FileMatches) => {
        this.setState({
          results: files,
          loading: false,
        });
      })
      .catch((error: any) => {
        console.error(error);
        this.setState({ error, loading: false });
      });
  }, this.props.debounceTimeout)

  onQuery: OnQuery = (query: string) => {
    if (query.length > 0) {
      this.setState({ loading: true });
      this.debounceInputQuery(query);
    }
  };

  render() {
    const { children } = this.props;
    const { error, results, loading } = this.state;
    return children(results, this.onQuery, loading, error);
  }
}

export default WithFileSearch;
