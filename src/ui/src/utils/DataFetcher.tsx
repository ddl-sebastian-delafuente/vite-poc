import * as React from 'react';
import * as R from 'ramda';

export type CombinedProps<FetcherState, ChildState> = FetcherState & DataFetcherProps<FetcherState, ChildState>;
export type LifecycleDataFetcher<FetcherState, ChildState> =
  (props: CombinedProps<FetcherState, ChildState>) => Promise<any>;
export type AnytimeDataFetcher = (props?: any) => Promise<any>;
export type DelegatedDataFetcher = (props?: any) => void;

export type RenderPropChild<ChildState> =
  (childState: ChildState, loading: boolean, fetchData: DelegatedDataFetcher, error?: any) => React.ReactNode;

export interface DataFetcherProps<FetcherState, ChildState> {
  children: RenderPropChild<ChildState>;
  initialChildState: ChildState;
  dataGetter?: (data: any) => ChildState;
  fetchData?: LifecycleDataFetcher<FetcherState, ChildState>;
  delegatedDataFetcher?: AnytimeDataFetcher;
  shouldFetchData?: (props: CombinedProps<FetcherState, ChildState>) => boolean;
  defaultLoading?: boolean;
}

export interface DataFetcherState<T> {
  childState: T;
  loading: boolean;
  error?: any;
}

/**
 * This is a HoC that manages hitting API endpoints for react components on component did mount and
 * on componentWillReceiveProps and only if shouldFetchData returns true. By default it returns true
 * if no shouldFetchData prop is provided.
 *
 * example usage:
 * interface FetcherState {
 *  onlyGreyCats: boolean;
 *  fetchNumber: number;
 * }
 * type TotalCats = number;
 * const TotalCatsDataFetcher: new() => DataFetcher<FetcherState, TotalCats> = DataFetcher as any;
 *
 * class TotalCatsComponent extends React.PureComponent<{}, { fetchNumber: number; }> {
 *  state = {
 *    fetchNumber: 0,
 *  };
 *
 *  fetchNumberInc = () => {
 *    this.setState({ fetchNumber: this.state.fetchNumber + 1 });
 *  }
 *
 *  fetcher({ onlyGreyCats }) {
 *   return fetch(`/totalcats/${onlyGreyCats}`).then((data: any) => data.json());
 *  }
 *
 *  render() {
 *    return (
 *      <TotalCatsDataFetcher
 *        onlyGreyCats={false}
 *        fetchNumber={this.state.fetchNumber}
 *        initialChildState={0}
 *        fetchData={this.fetcher}
 *        shouldFetchData={({ fetchNumber }:FetcherState) => fetchNumber < 10}
 *      >
 *      {(totalCats: TotalCats, loading: boolean) => (
 *        <div>
 *          <button onClick={this.fetchNumberInc}>
 *            Fetch More
 *          </button>
 *           { loading ? 'loading' :
 *              total cats = {totalCats}
 *            }
 *       </div>
 *      }}
 *      </TotalCatsDataFetcher>
 *    );
 *  }
 * }
 *
 *
 */
class DataFetcher<FetcherState, ChildState> extends
  React.PureComponent<CombinedProps<FetcherState, ChildState>, DataFetcherState<ChildState>> {

  public static defaultProps = {
    shouldFetchData: () => true,
    dataGetter: (data: any) => data,
  };

  constructor(props: FetcherState & DataFetcherProps<FetcherState, ChildState>) {
    super(props);
    this.state = {
      childState: props.initialChildState,
      loading: R.defaultTo(true)(props.defaultLoading),
      error: undefined,
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchData(this.props as CombinedProps<FetcherState, ChildState>);
  }

  UNSAFE_componentWillReceiveProps(newProps: CombinedProps<FetcherState, ChildState>) {
    this.fetchData(newProps);
  }

  delegatedFetchData: DelegatedDataFetcher = props => {
    const { delegatedDataFetcher } = this.props;
    if (delegatedDataFetcher) {
      this.setState({ loading: true });
      delegatedDataFetcher(props)
      .then(this.props.dataGetter)
      .then(data => this.setState({ error: undefined, childState: data, loading: false }))
      .catch(error => {
        console.error(error);
        this.setState({ error, loading: false });
      });
    }
  }

  fetchData = (props: CombinedProps<FetcherState, ChildState>) => {
    const { fetchData } = this.props;
    if (fetchData) {
      if (this.props.shouldFetchData!(props) ||
        (Array.isArray(this.state.childState) && this.state.childState.length === 0)) {
        this.setState({ loading: true });
        fetchData(props)
        .then(this.props.dataGetter)
        .then(data => this.setState({ error: undefined, childState: data, loading: false }))
        .catch(error => {
          console.error(error);
          this.setState({ loading: false, error });
        });
      }
    }
  }

  render() {
    const {
      childState,
      loading,
      error,
    } = this.state;
    const {
      children,
    } = this.props;
    return (children as RenderPropChild<ChildState>)(childState, loading, this.delegatedFetchData, error);
  }
}

export default DataFetcher;
