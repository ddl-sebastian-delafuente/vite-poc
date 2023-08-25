import * as React from 'react';
import { equals } from 'ramda';
import PaginationFooter, { SummaryFormatter } from './PaginationFooter';
import { PageSizeDropdown, PAGE_SIZES } from './PageSizeDropdown';

export interface PaginatorDefaultProps {
  pageSizeOptions?: number[];
  showFooter?: boolean;
  showPageSelector?: boolean;
  showCustomPageSelector?: boolean;
  defaultPageNumber?: number;
  simplePaginationFooter?: boolean;
}

export interface PaginatorProps<T> extends PaginatorDefaultProps {
  rows: T[];
  defaultPageSize?: number;
  pageSize?: number;
  pageNumber?: number;
  totalEntries: number;
  children: (pagedRows: T[], pageRange: [number, number], context: Paginator<T>) =>
    JSX.Element;
  paginationSummaryFormatter?: SummaryFormatter;
  isControlled?: boolean;
  onChange?: (state: PaginatorState) => void;
}

export interface PaginatorState {
  pageNumber: number;
  pageSize: number;
}

class Paginator<T> extends React.PureComponent<PaginatorProps<T>, PaginatorState> {
  public static defaultProps: PaginatorDefaultProps = {
    defaultPageNumber: 1,
    pageSizeOptions: PAGE_SIZES,
    showFooter: true,
    showPageSelector: true,
    showCustomPageSelector: true,
    simplePaginationFooter: false,
  };

  constructor(props: PaginatorProps<T>) {
    super(props);
    if (props.isControlled) {
      if (props.pageSize === undefined || props.pageNumber === undefined) {
        console.error(`define pageSize and pageNumber as props if isControlled is true`);
      }
    }
    this.state = {
      pageSize: props.pageSize || props.defaultPageSize || props.pageSizeOptions![0],
      pageNumber: props.pageNumber || props.defaultPageNumber!,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps: PaginatorProps<T>) {
    if (!equals(newProps.rows, this.props.rows)) {
      this.setState({ pageNumber: 1 });
    }
  }

  onStateChangeCallback = () => {
    const {
      onChange,
    } = this.props;
    if (onChange) {
      onChange(this.state);
    }
  }

  updatePageNumber = (pageNumber: number) => this.setState({ pageNumber }, this.onStateChangeCallback);

  updateTotalViewEntries = (pageSize: number) => () => this.setState({ pageSize }, this.onStateChangeCallback);

  getState = () => {
    const {
      isControlled,
      pageSize,
      pageNumber,
    } = this.props;

    if (isControlled) {
      return {
        pageSize: pageSize!,
        pageNumber: pageNumber!,
      };
    }
    return this.state;
  }

  render() {
    const {
      pageSize,
      pageNumber,
    } = this.getState();
    const {
      simplePaginationFooter,
      pageSizeOptions,
      showFooter,
      showPageSelector,
      showCustomPageSelector,
      totalEntries,
      paginationSummaryFormatter,
      children,
      rows,
    } = this.props;

    const pageSelectorDropdown = (
      <PageSizeDropdown
        onPageSizeChange={this.updateTotalViewEntries}
        pageSizeOptions={pageSizeOptions}
        pageSize={pageSize}
      />
    );
    const lowerBound = (pageNumber - 1) * pageSize;
    const range: [number, number] = [lowerBound, Math.min(lowerBound + pageSize, totalEntries)];
    return (
      <div className="paginator-container">
        {showPageSelector && pageSelectorDropdown}
        {children(rows.slice(range[0], range[1]), range, this)}
        {showFooter && (
          <PaginationFooter
            simple={simplePaginationFooter!}
            onChange={this.updatePageNumber}
            summaryFormatter={paginationSummaryFormatter}
            totalEntries={totalEntries}
            pageSize={pageSize}
            pageNumber={pageNumber}
            pageSelector={showCustomPageSelector ? pageSelectorDropdown : null}
          />
        )}
      </div>
    );
  }

}

export default Paginator;
