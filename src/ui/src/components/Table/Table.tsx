/**
 * Domino component library
 * Table
 *
 * NOTE: when using this component, do not specify a width for every single
 * column or risk breaking column resizing:
 * https://ant.design/components/table/#components-table-demo-fixed-header
 */
import * as React from 'react';
import * as R from 'ramda';
import { allPass, contains, curry, filter, is, isEmpty, isNil, keys, map, omit } from 'ramda';
import styled from 'styled-components';
import classNames from 'classnames';
import { kebabCase } from 'lodash';
import {
  ColumnType as ColumnProps,
  TablePaginationConfig as PaginationConfig,
  TableProps as AntTableProps,
} from 'antd/lib/table';
// eslint-disable-next-line no-restricted-imports
import { Table as AntdTable } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import { SorterResult, SortOrder } from 'antd/lib/table/interface';
import * as colors from '../../styled/colors';
import { linkBlue } from '../../styled/colors';
import PluggableTypeaheadInput from '../PluggableTypeaheadInput';
import ActionDropdown from '../ActionDropdown';
import PaginatorStyle from '../pagination/PaginatorStyle';
import { escapeRegExp, regexMatch } from '../../utils/regex';
import ColumnFilterDropdown, { ColumnFilterDropdownProps } from './ColumnFilterDropdown';
import NestedColumnFilterDropdown from './NestedColumnFilterDropdown';
import { themeHelper } from '../../styled/themeUtils';
import withResizableColumn from './withResizableColumn';
import { getDataAtPath, numberSorter, stringSorter } from './utils';
import { SearchOutlined } from '@ant-design/icons';
import { numberComparer, stringComparer } from '../../utils/dataManipulation/utils';

const TableTitleContainer = styled.div`
  color: ${themeHelper('mainFontColor')};
  font-size: 18px;
  font-weight: 500;
`;

const ResizeHandle = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${props => props.width}px;
  cursor: col-resize;
  user-select: none;
  height: 100%;
`;

export const TextContainer = styled.span`
  font-family: ${themeHelper('fontFamily')};
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const UtilityContainer = styled.div`
  margin-right: 2px;
  display: flex;
  align-items: center;

  .ant-select-selection.ant-select-selection--single {
    border: 0;
  }

  > div {
    &:first-of-type {
      margin-left: 0;
    }

    &:last-of-type {
      flex-grow: 1;
    }
  }
`;

const UtilityGroup = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

const PAGE_SIZES = [50, 100, 200];

interface ContainerProps {
  // onRow?: (row: any, index: number) => any;
  isRowClickable?: boolean;
  isScroll?: boolean;
  filterPlaceHolderWidth?: number | string;
}
const Container = styled.div<ContainerProps>`
  th.ant-table-cell {
    text-transform: uppercase;
    font-size: ${themeHelper('fontSizes.tiny')};
    padding-top: 3px;
    height: 21px;
  }

  .ant-table-row:hover {
    cursor: ${({ isRowClickable }) => isRowClickable ? 'pointer' : 'default'};
    background-color: ${themeHelper('table.row.hover.background')};
  }

  .ant-pagination.ant-table-pagination {
    ${PaginatorStyle};
    margin: 0;
    margin-top: 35px;
    float: right;
  }

  .ant-table-title {
    color: ${themeHelper('label.basic.color')};
  }

  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    overflow: auto;
  }

  .ant-table-thead {
    border: 1px solid ${themeHelper('table.border')};
    border-bottom: 0;
    margin-bottom: 0 !important;
  }

  .ant-table-content {
    border: 1px solid ${themeHelper('table.border')};
  }

  table, .ant-table-fixed {
    border-radius: ${themeHelper('borderRadius.standard')};
    overflow: auto;

    border-top-width: ${({ isScroll }) => isScroll ? 'none' : '1px'};

    tr, td {
      padding: ${themeHelper('margins.tiny')} 12px;
      transition: 0.5s linear background-color;
    }

    tr:last-child {
      td {
        border-bottom: 0 !important;
      }
    }
  }

  .ant-table-fixed-column {
    table {
      overflow: auto !important;
    }
  }

  .ant-checkbox-wrapper {
		color: ${themeHelper('checkbox.container.color')};
	}
	.ant-checkbox-inner {
		border: 1px solid ${themeHelper('checkbox.container.borderColor')};
		background-color: ${themeHelper('checkbox.container.backgroundColor')};
	}
	.ant-checkbox-wrapper:hover .ant-checkbox-inner,
	.ant-checkbox:hover .ant-checkbox-inner,
	.ant-checkbox-input:focus + .ant-checkbox-inner {
		border-color: ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-checkbox-checked::after {
		border: 1px solid ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-checkbox-checked .ant-checkbox-inner {
		background-color: ${themeHelper('checkbox.selected.borderColor')};
		border-color: ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-checkbox-indeterminate .ant-checkbox-inner {
		border-color: ${themeHelper('checkbox.intermediate.default.borderColor')};
	}
	.ant-checkbox-indeterminate .ant-checkbox-inner::after {
		background-color: ${themeHelper('checkbox.intermediate.default.backgroundColor')};
	}
	.ant-checkbox-disabled + span {
		color: ${themeHelper('checkbox.disabled.color')};
	}
	.ant-checkbox-disabled .ant-checkbox-inner {
		background-color: ${themeHelper('checkbox.disabled.backgroundColor')};
    	border-color: ${themeHelper('checkbox.disabled.color')} !important;
	}
	.ant-checkbox-indeterminate.ant-checkbox-disabled .ant-checkbox-inner::after {
		background-color: ${themeHelper('checkbox.intermediate.disabled.backgroundColor')};
	}
	.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
		border-color: ${themeHelper('checkbox.disabled.color')};
  }

  .ant-table-content {
    color: ${themeHelper('label.basic.color')};
    background: white;
    border-top-left-radius: ${({ isScroll }) => isScroll ? 0 : '2px'};
    border-top-right-radius: ${({ isScroll }) => isScroll ? 0 : '2px'};
  }

  .ant-table-thead {
    color: ${themeHelper('label.basic.color')};
    background: white;
    font-weight: normal;

    th, tr {
      font-weight: 500;
      color: ${themeHelper('label.basic.color')};
      background: white;
      text-align: left;
      letter-spacing: 0;
    }

    th {
      padding: 8px 12px;
      position: relative;

      .ant-table-column-sorters {
        justify-content: flex-start;

        .ant-table-column-title, .ant-table-column-sorter {
          flex: 0 1 auto;
        }
      }
    }

    th[style*="right"] {
      .ant-table-column-sorters {
        justify-content: flex-end;
      }
    }

    th:not(:last-child):hover {
      border-right-color: ${themeHelper('table.border')}
    }

    th.ant-table-column-sort {
      background: ${colors.accordionHeaderGrey};
    }
  }

  .ant-table-thead > tr:not(:last-child) > th[colspan] {
    border-bottom: 1px solid ${colors.antgrey4};
  }

  .ant-table-thead:hover {
    th:not(:last-child) {
      border-right-color: ${themeHelper('table.border')}
    }
  }

  table {
    min-width: 100%;

    th {
      word-break: keep-all !important;
    }
    td {
      div, span, a {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        div {
          overflow: visible;
        }
      }

      a {
        display: block;
      }
      max-width: 50px;
      position: static;

      .ant-dropdown-trigger {
        justify-content: flex-end;
      }
    }
  }

  tr.striped {
    background-color: ${colors.aliceBlue};
  }

  tr.selected {
    box-shadow: inset 3px 0 0 ${colors.azul};
    td {
      background-color: ${colors.lightishBlueO1};
    }
  }

  tr.highlight {
    background: ${colors.lightishBlueO1};
  }

  .table-actions-wrapper {
    background-color: transparent;
    z-index: 100;
    .table-search-wrapper {
      width: ${({ filterPlaceHolderWidth }) => filterPlaceHolderWidth ? filterPlaceHolderWidth : 170}px;
      .ant-input-affix-wrapper {
        box-shadow: 0 0 0 1px ${colors.btnGrey};
        border-radius: ${themeHelper('borderRadius.standard')};
      }
      .ant-input {
        padding: 2px 5px;
      }
    }
  }

  .ant-table-thead > tr > th.col-sorted.ant-table-column-sort, .ant-table-tbody > tr > td.col-sorted.ant-table-column-sort {
    background-color: ${colors.aliceBlueLighter};
  }
`;

interface ResizableTitleProps extends React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement> {
  resizable: boolean;
  resizeHandlerWidth: number;
  children: React.ReactNode;
}

const ResizableTitle = (props: ResizableTitleProps) => {
  const { resizable, resizeHandlerWidth, ...restProps } = props;
  let { children } = props;

  if (resizable) {
    if (!children) {
      children = [<ResizeHandle key={'resize-handle'} className="resize-handle" width={resizeHandlerWidth} />];
    } else if (typeof children === 'object') {
      // @ts-ignore
      children = [...children, <ResizeHandle key={'resize-handle'} className="resize-handle" width={resizeHandlerWidth} />];
    } else if (Array.isArray(children)) {
      children.push(<ResizeHandle key={'resize-handle'} className="resize-handle" width={resizeHandlerWidth} />);
    }
  }
  // @ts-ignore
  // eslint-disable-next-line
  return <th {...restProps} children={children}/>;
};

interface UtilityEltProps {
  CustomUtilityBarJustifyContent?: string;
}
const Utility = styled.div<UtilityEltProps>`
  display: flex;
  justify-content: ${({ CustomUtilityBarJustifyContent }) => CustomUtilityBarJustifyContent || 'space-between'};
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const ClearFilters = styled.div`
  color: ${linkBlue};
  cursor: pointer;
`;

const StyledColumnFilterDropdown = styled<ColumnFilterDropdownProps & any>(ColumnFilterDropdown)`
   z-index: 100;
`;

const StyledNestedColumnFilterDropdown = styled(NestedColumnFilterDropdown)`
   z-index: 100;
 `;

const ParentContainerSpan = styled.span`
position: relative;
.ant-table-row-indent + .ant-table-row-expand-icon {
  margin-top: 0;
}
`;

const LimitedSpan = styled.span`
  max-width: 50%;
`;

// used to describe clickable row
const HiddenElement = styled.div`
  display: none;
`;

type RenderedRow = {} | null | undefined;

function getRenderer<T>(row: ColumnConfiguration<T>, noDataIcon?: React.ReactNode): (text: string, record: T, index: number) => RenderedRow {
  function makeLongTextVisible(node: React.ReactNode): React.ReactNode {
    return (
      <div>
        {node}
      </div>
    );
  }

  return (text: string, record: T, index: number) => {
    if (isNil(text)) {
      return noDataIcon ? noDataIcon : '--';
    }
    if (is(Function, row.render)) {
      return makeLongTextVisible(row.render!(text, record, index) as React.ReactNode);
    }

    return makeLongTextVisible(text);
  };
}

interface ColumnFilterConfig {
  label: string;
  value: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ColumnConfiguration<T = {}> = ColumnProps<T> & {
  filterConfig?: Array<ColumnFilterConfig>;
  hideFilter?: boolean;
  timestamp?: boolean;
  /**
   * Whether this column is resizable. Default: true
   */
  resizable?: boolean;
  sorterDataIndex?: string | string[];
  resizeHandlerWidth?: number;
  children?: any;
}

export enum ColumnWidth {
  PrimaryText = 350,    // e.g, an object's name
  SecondaryText = 150,  // e.g., an object's owner
  Status = 150,         // an object's status, e.g., job
  Timestamp = 250,      // timestamp
  ElapsedTime = 125,    // period of time that has elapsed
  Count = 100,          // count of objects
  PrimaryAction = 75,   // primay row actions, i.e., top-level buttons (max 2 buttons)
  SecondaryAction = 50,  // secondary row actions, i.e., the 3-dots button (ActionDropdown)
  Icon = 20, // for any small columns eg id, actions, status
}

interface TableProps<T> extends AntTableProps<T> {
  CustomUtilityBar?: (new() => React.Component) | React.FC;
  CustomUtilityBarJustifyContent?: string;
  extraUtilities?: (context: any) => JSX.Element;
  disableAlwaysShowColumnsInFilterDropdown?: boolean;
  tableActionsWrapperClassName?: string;
  /**
   * Table name that will be assigned to an aria-label
   */
  tableName?: string;
  /**
   * Columns configuration
   */
  columns: ColumnConfiguration<T>[];
  /**
   * The CSS class name for the table container
   */
  className?: string;
  /**
   * The default number of rows to show per page
   */
  defaultPageSize?: number | null;
  /**
   * The placeholder text to display in the search box
   */
  filterPlaceHolder?: string;
  /**
   * Width of the filter placeholder
   */
  filterPlaceHolderWidth?: number;
  /**
   * Indicates whether the table data is controlled externally
   */
  isControlled?: boolean;
  /**
   * Event handler for table state change, i.e., page size, filters etc.
   */
  onChange?: (state: TableState<any>) => void;
  /**
   * Controls whether the table is paginated
   */
  showPagination?: boolean;
  /**
   * Controls whether the page size dropdown is displayed
   */
  showPageSizeSelector?: boolean;
  /**
   * Controls whether the search box is displayed.
   */
  showSearch?: boolean;
  /**
   * The page to display
   */
  pageNumber?: number;
  /**
   * The options to show in the page size selector if enabled
   */
  pageSizeSelectorOptions?: number[];
  /**
   * The total number of rows in the table
   */
  totalEntries?: number;
  /**
   * Data to populate in the table
   */
  dataSource?: T[];
  /**
   * Custom function to filter table based on search text
   */
  onFilter?: (record: T, searchText: string) => boolean;
  /**
   * A function that returns the text to search in a row
   */
  filterSelector?: (record: T) => string | null | undefined;
  /**
   * Custom toolbar
   */
  leftSideUtilities?: JSX.Element;
  /**
   * The message to display when there is no data in the table
   */
  emptyMessage?: React.ReactNode;
  /**
   * Controls whether the filtering of columns is controlled externally
   */
  remoteFilter?: boolean;
  /**
   * Default selected row id
   */
  defaultSelectedRowId?: string;
  /**
   * Event handler when a table row is clicked
   */
  onRowClick?: (rowData: any) => void;
  /**
   * Event handler when a table row is selected
   */
  onRowSelect?: (selectedKeys: string[], selectedItems: T[]) => void;
  /**
   * Returns whether a particular row should be highlighted
   */
  isRowHighlight?: (row: any) => boolean;
  /**
   * Indicates if the table data is being loaded
   */
  loading?: boolean;
  /**
   * Controls whether the table supports row selection
   */
  hideRowSelection?: boolean;
  /**
   * The list of columns to hide by default
   */
  columnsToHideByDefault?: string[];
  /**
   * The list of columns to always display
   */
  alwaysShowColumns?: string[];
  /**
   * Event handler when the column filter selection changes
   */
  onColumnFilterChange?: (columnKeys: string[], unSelectedColumnKeys?: string[]) => any;
  /**
   * Event handler when the page size is updated
   */
  onChangePageSize?: (pageSize: number) => any;
  /**
   * The ids for the selected columns
   */
  filteredColumnKeys?: string[] | null;
  /**
   * Controls whether the table has resizable columns (enabled by default)
   */
  resizable?: boolean;
  /**
   * Controls whether rows are clickable. Note: click is not the same as select.
   * Click action is generally used when a table row has some associated details to be shown,
   * especially in a side pane.
   */
  isRowClickable?: boolean;
  /**
   * If set, the column filter is hidden
   */
  hideColumnFilter?: boolean;
  /**
   * If set, odd rows of table should be highlighted
   */
  isStriped?: boolean;
  /**
   * If set, sorted column should be highlighted
   */
  highlightSortedColumn?: boolean;
  /**
   * Optional `className` for the `ColumnFilterDropdown` component's wrapper `div`
   */
  dropdownWrapperClassName?: string;
  /**
   * Optional unique identifier for integration and system testing
   */
  'data-test'?: string;
  /**
   * If set, displays the selected columns count
   */
  showSelectedColumnsCount?: boolean;
  /**
   * If set, it'll reset the `pageNumber` to 1
   */
  resetPagination?: boolean;
  /**
   * Provided columns will show unselected in the column filter dropdown
   */
  unSelectedColumnKeys?: Array<string>;
  /**
   * Callback to reset the `resetPagination` prop to `false` in the parent component
   */
  setResetPagination?: (canResetPagination: boolean) => void;

  /**
   * Set the resize handler width
   */
  resizeHandlerWidth?: number;
  /**
   * Set the empty cell data
   */
  noDataIcon?: React.ReactNode;
  useNestedColumnDropdown?: boolean;
}

interface TableState<T> {
  sortDirection?: 'asc' | 'desc';
  sortKey: string | number | undefined;
  filterQuery: string;
  pageSize: number;
  pageNumber: number;
  filteredData: T[];
  columnFilters: any;
  filteredColumns: ColumnProps<T>[];
  selectedRowId?: string;
}

export const DEFAULT_PAGE_SIZE: number = PAGE_SIZES[0] || 50;

class Table<T> extends React.PureComponent<TableProps<T>, TableState<T>> {

  public static defaultProps: Partial<TableProps<any>> = {
    tableName: '',
    dataSource: [],
    showPagination: true,
    showPageSizeSelector: true,
    showSearch: true,
    defaultPageSize: PAGE_SIZES[0],
    pageSizeSelectorOptions: PAGE_SIZES,
    isControlled: false,
    onChange: (state: TableState<any>) => { return state; },
    onRowClick: () => { return; },
    onRowSelect: () => { return; },
    loading: false,
    alwaysShowColumns: [],
    columnsToHideByDefault: [],
    resizable: true,
    isRowClickable: false,
    isStriped: false,
    highlightSortedColumn: false,
    resizeHandlerWidth: 5,
  };

  tableContainer: React.RefObject<HTMLSpanElement>;

  constructor(props: TableProps<T>) {
    super(props);

    this.tableContainer = React.createRef();

    this.state = {
      sortKey: '',
      filterQuery: '',
      pageNumber: props.pageNumber || 1,
      pageSize: this.getTablePageSize(),
      filteredData: props.dataSource || [],
      columnFilters: {},
      filteredColumns: props.columns,
      selectedRowId: props.defaultSelectedRowId,
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({
      filteredColumns: this.getFilteredColumns(this.props)
    });
  }

  componentDidUpdate(prevProps: TableProps<any>) {
    const stateUpdate: Partial<TableState<T>> = {};
    // Need to do this because dynamically-rendered columns (such as dominoStats:foo for Jobs)
    // get appended to the props after the component's initial construction
    if (this.props.columns !== prevProps.columns) {
      stateUpdate.filteredColumns = this.getFilteredColumns(this.props);
    }
    if (this.props.dataSource && prevProps.dataSource !== this.props.dataSource) {
      stateUpdate.filteredData = this.getFilteredData(this.props.dataSource, this.state.filterQuery);
    }
    if (this.props.defaultSelectedRowId !== prevProps.defaultSelectedRowId) {
      stateUpdate.selectedRowId = this.props.defaultSelectedRowId;
    }
    if (this.props.resetPagination) {
      stateUpdate.pageNumber = 1;
      if (this.props.setResetPagination) {
        this.props.setResetPagination(false);
      }
    }
    if (!R.isEmpty(stateUpdate)) {
      this.setState(stateUpdate as TableState<T>);
    }
  }

  // This will be all column keys should it not exist in Preferences
  getFilteredColumns = (props: TableProps<T>): ColumnConfiguration<T>[] => {
    const columnFilter = R.defaultTo(
      R.reject(
        c => R.contains(c, props.columnsToHideByDefault!),
        R.map(R.propOr('',  'key'), props.columns)
      )
    );

    const filteredColumnKeys = columnFilter(props.filteredColumnKeys);

    const { unSelectedColumnKeys } = props;
    if (unSelectedColumnKeys) {
      if (this.props.useNestedColumnDropdown) {
        return R.reduce((acc: ColumnConfiguration[], col: ColumnConfiguration) => {
          if (R.contains(col.key, unSelectedColumnKeys)) {
            return acc;
          } else if (col.children && col.children.length > 0) {
            const filteredChildren = col.children.filter((column: ColumnConfiguration) => !R.contains(column.key, unSelectedColumnKeys));
            return filteredChildren.length > 0 ? acc.concat([{
              ...col,
              children: filteredChildren
            }]) : acc;
          } else {
            return acc.concat([col]);
          }
        }, [], this.props.columns);
      }
      return R.filter((column) => !R.contains(
        column.key, unSelectedColumnKeys
      ), props.columns);
    } else {
      return R.filter(
        (column) => !column.key || R.contains(column.key,
            R.uniq([...filteredColumnKeys as string[], ...props.alwaysShowColumns as string[]]))
        , props.columns);
    }
  }

  getFilteredColumnKeys = (columnKeys: string[], unSelectedColumnKeys?: string[]) => {
    const columnKeysToShow = [...columnKeys, ...this.props.alwaysShowColumns as string[]];
    if (unSelectedColumnKeys) {
      if (this.props.useNestedColumnDropdown) {
        return R.reduce((acc: ColumnConfiguration[], col: ColumnConfiguration) => {
          if (R.contains(col.key, unSelectedColumnKeys)) {
            return acc;
          } else if (col.children && col.children.length > 0 && !R.contains(col.key, columnKeys)) {
            const filteredChildren = col.children.filter((column: ColumnConfiguration) => R.contains(column.key, columnKeys));
            return filteredChildren.length > 0 ? acc.concat([{
              ...col,
              children: filteredChildren
            }]) : acc;
          } else {
            return acc.concat([col]);
          }
        }, [], this.props.columns);
      }
      return R.filter((column) => !R.contains(
        column.key, unSelectedColumnKeys
      ), this.props.columns);
    } else {
      return R.filter((column) => R.contains(
        column.key, columnKeysToShow), this.props.columns);
    }
  };

  onColumnFilterChange = (columnKeys: string[], unSelectedColumnKeys?: string[]) => {
    const filteredColumns = this.getFilteredColumnKeys(columnKeys, unSelectedColumnKeys);

    this.setState({
      filteredColumns
    });
    if (!R.isNil(this.props.onColumnFilterChange)) {
      this.props.onColumnFilterChange(columnKeys, unSelectedColumnKeys);
    }
  }

  // Get unique identifier for the row
  setRowKey = (rowData: any) => rowData.id || R.join('', R.values(rowData));

  getRowClassName = (record: any, index: number): string => {
    const { isRowHighlight, isStriped, rowClassName, ...rest } = this.props;
    const dataTest = rest['data-test'];
    return classNames({
      highlight: isRowHighlight && isRowHighlight(record),
      selected: R.and(
        !!this.props.isRowClickable,
        this.setRowKey(record) === this.state.selectedRowId),
      striped: isStriped && ((index % 2) !== 0),
      enabled: typeof rowClassName === 'function' ?
        rowClassName(record, index, 0) === 'enabled' || false : rowClassName,
      disabled: typeof rowClassName === 'function' ?
        rowClassName(record, index, 0) === 'disabled' || false : rowClassName,
      ...(dataTest ? { [kebabCase(`${dataTest}-row`)]: true, [kebabCase(`${dataTest}-row-${index}`)]: true } : {})
    });
  }

  onSearch = (record: any, query: string): boolean => {
    if (this.props.onFilter) {
      return this.props.onFilter(record, query);
    }

    const cleanedQuery = R.toLower(query);
    // Search in all the records with lower case text
    const allData = R.map(v => {
      try {
        return R.toLower(v);
      } catch (e) {
        return '';
      }
    }, R.values(record));
    return R.any(colVal => regexMatch(colVal, cleanedQuery, false), allData);
  }

  onChange = (state: TableState<any>) => {
    this.props.onChange!(state);
    if (this.props.onChangePageSize) {
      this.props.onChangePageSize(state.pageSize);
    }
  }

  getTablePageSize = (): number => {
    return R.defaultTo(DEFAULT_PAGE_SIZE, this.props.defaultPageSize);
  }

  onRow = (record: T) => ({
    onClick: () => this.onRowClick(record),
    role: typeof this.onRowClick === 'function' ? 'button' : undefined,
    'aria-label': this.getAriaLabel(record),
    'aria-describedby': this.props.isRowClickable ? 'clickable-row' : undefined,
    'tabIndex': this.props.isRowClickable ? 0 : undefined
  });

  getAriaLabel = (rowData: any) => rowData.ariaLabel;

  // Click doesn't mean selecting the checkbox
  onRowClick = (rowData: any) => {
    this.setState({
      selectedRowId: this.setRowKey(rowData)
    });
    this.props.onRowClick!(rowData);
  }

  // Select means clicking on the checkbox
  onRowSelect = () => {
    if (this.props.rowSelection) {
      return this.props.rowSelection;
    }

    return {
      onChange: this.props.onRowSelect,
      getCheckboxProps: (rowData: any) => ({
        // This is similar to getting the unique key of that row
        name: this.setRowKey(rowData)
      })
    };
  }

  getTotalEntries = () => {
    return this.props.totalEntries || R.length(this.state.filteredData || []);
  }

  getSearchPlaceHolder = () => {
    return this.props.filterPlaceHolder || 'Filter table entries';
  }

  // If true, the column does not appear in the column filter dropdown
  isShowAlwaysColumn = (alwaysShowColumns?: string[]) => (col: any) => {
    return R.isNil(col) || R.indexOf(col.key, alwaysShowColumns || []) >= 0;
  }

  getDropdownColumns = (cols: ColumnConfiguration<T>[]) => {
    const { disableAlwaysShowColumnsInFilterDropdown } = this.props;
    return disableAlwaysShowColumnsInFilterDropdown ?
    R.map(column => {
      return column.key && !R.isNil(column.title) &&
        { key: column.key as string, label: column.title as string, ...(this.props.useNestedColumnDropdown && column.children && {children: column.children})};
    }, cols)
    : R.reject(this.isShowAlwaysColumn(this.props.alwaysShowColumns), R.map(column => {
      return column.key && !R.isNil(column.title) &&
        { key: column.key as string, label: column.title as string, ...(this.props.useNestedColumnDropdown && column.children && {children: column.children})};
    }, cols));
  }

  getState = () =>
    this.props.isControlled ?
      { filteredData: this.props.dataSource, ...this.props } :
      this.state

  onPaginationChange = (pageNumber: number, pageSize: number) => {
    const { onChange } = this.props;
    this.setState({ pageNumber, pageSize }, () => onChange!(this.state));
  }

  onChangePageSize = (pageSize: number) => {
    const {
      showPagination
    } = this.props;
    if (!showPagination) { return; }
    this.setState({ pageSize, pageNumber: 1 }, () => this.onChange!(this.state));
  }

  defaultFilter: (record: T, query: string) => boolean = (record, query) => {
    const { filterSelector } = this.props;
    if (filterSelector) {
      return regexMatch(filterSelector(record) || '', query);
    }
    return true;
  }

  getSanitizedSearchString = (searchText: string) => {
    return escapeRegExp(searchText);
  }

  getFilteredData = (dataSource: T[], searchText: string) => {
    const {
      showSearch,
      filterSelector,
      isControlled
    } = this.props;
    if (!dataSource || !showSearch) {
      return dataSource;
    }
    const sanitized = this.getSanitizedSearchString(searchText);
    const filteredData = (this.onSearch || filterSelector) && !isControlled ?
      dataSource.filter(record => {
        return filterSelector ? this.defaultFilter(record, searchText) : this.onSearch!(record, sanitized);
      }) :
      dataSource;
    return filteredData;
  }

  onFilterData = (searchText: string) => {
    const {
      dataSource,
      showSearch
    } = this.props;

    if (!dataSource || !showSearch) { return; }

    const sanitized = this.getSanitizedSearchString(searchText);
    const filteredData = this.getFilteredData(dataSource, searchText);
    this.setState({ filterQuery: sanitized, filteredData, pageNumber: 1}, () => this.onChange!(this.state));
  }

  // Table should not show pagination if the number of rows is less than the default page size
  shouldShowPagination() {
    return !!this.props.showPagination;
  }

  getPaginationConfig = () => {
    const {
      pagination
    } = this.props;
    const {
      pageSize,
      pageNumber,
    } = this.state;
    return this.shouldShowPagination() ?
      {
        total: this.getTotalEntries(),
        pagination: { position: 'bottomRight' },
        showTotal: this.renderShowTotal,
        pageSize,
        current: pageNumber,
        onChange: this.onPaginationChange,
        showSizeChanger: false,
        ...(pagination || {})
      } : false;
  }

  renderShowTotal = (total: number, range: [number, number]) => `Showing ${range[0]} - ${range[1]} out of ${total}`;

  getSorter(col: ColumnConfiguration<T>) {
    const { sorter } = col;
    if ((R.isNil(sorter) || sorter === true) && (col.dataIndex || col.sorterDataIndex)) {
      return (a: any, b: any) => {
        const dataIndex = col.sorterDataIndex || col.dataIndex;
        if (dataIndex) {
          const dataA = getDataAtPath(dataIndex, a, undefined);
          const dataB = getDataAtPath(dataIndex, b, undefined);
          if (typeof dataA === 'number' && typeof dataB === 'number') {
            return numberComparer((x: number) => x)(dataA, dataB);
          } else {
            return stringComparer((x: string) => x)(dataA, dataB);
          }
        } else {
          return;
        }
      }
    }
    return sorter;
  }

  updateColumnFilters = (columnKey: any, selectedFilters: Array<string>) => {
    this.setState((prevState) => {
      if (!isEmpty(selectedFilters)) {
        return { columnFilters: {...prevState.columnFilters, [columnKey]: selectedFilters }};
      } else {
        return { columnFilters: omit([columnKey], prevState.columnFilters)};
      }
    }, () => {
      this.setColumnFilteredData();
    });
  }

  setColumnFilteredData = () => {
    const {
      dataSource,
      remoteFilter
    } = this.props;

    if (remoteFilter) {
      this.onChange!(this.state);
      return;
    }

    if (!dataSource) { return; }

    const filterCondition = curry((colKey: any, row: any) => contains(row[colKey], this.state.columnFilters[colKey]));
    const filteredData = filter(
      allPass(
        map(colKey => filterCondition(colKey), keys(this.state.columnFilters))
      )
    )(dataSource);

    this.setState({ filteredData }, () => this.onChange!(this.state));
  }

  clearAllColumnFilters = () => {
    this.setState({
      columnFilters: {},
      filteredData: (this.props.dataSource || [])
    }, () => this.onChange!(this.state));
  }

  updateTotalViewEntries = (size: number) => () => {
    this.onChangePageSize(size);
  }

  getContainerElement = (trigger: { parentNode: any; }) => trigger.parentNode;

  getSortOrder = (order?: SortOrder) => R.cond([
    [R.equals('descend'), () => 'desc'],
    [R.equals('ascend'), () => 'asc'],
    [R.T, () => undefined]
  ])(order);

  handleTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<T>) => {
    const sortDirection = this.getSortOrder(sorter.order);
    const sortKey = sorter.columnKey;

    if (!R.equals(sortKey, this.state.sortKey) || !R.equals(sortDirection, this.state.sortDirection)) {
      this.setState({
        sortDirection,
        sortKey
      }, () => this.onChange!({
        ...this.state,
        sortKey: (sorter.columnKey || sorter.field) as string,
      }));
    }
  }

  render() {
    const {
      showPagination,
      showSearch,
      defaultPageSize,
      title,
      filterPlaceHolder,
      tableActionsWrapperClassName,
      extraUtilities,
      onRow,
      className,
      showPageSizeSelector,
      leftSideUtilities,
      CustomUtilityBar,
      CustomUtilityBarJustifyContent,
      hideColumnFilter,
      pageSizeSelectorOptions,
      dropdownWrapperClassName,
      showSelectedColumnsCount,
      alwaysShowColumns,
      disableAlwaysShowColumnsInFilterDropdown,
      unSelectedColumnKeys,
      scroll,
      noDataIcon,
      ...rest
    } = omit(['onChange', 'columns'], this.props);
    const {
      pageSize,
      filteredData,
    } = this.state;
    const locale = {
      triggerDesc: 'Sort descending',
      triggerAsc: 'Sort ascending',
      cancelSort: 'Cancel sorting',
      emptyText: this.props.emptyMessage || 'No data found'
    };
    const pageSizeOptions = defaultPageSize ?
      new Set(pageSizeSelectorOptions).add(defaultPageSize) : new Set(pageSizeSelectorOptions);
    const sortedPageSizes = Array.from(pageSizeOptions).sort((a, b) => Number(a) - Number(b));
    const PaginationDropdown = this.shouldShowPagination() && showPageSizeSelector ? (
        <UtilityGroup>
          <ActionDropdown
            width="90px"
            label={`${pageSize} entries`}
            showCaret={true}
            menuItems={sortedPageSizes.map((size: number) => ({
              key: size.toString(),
              content: (
                <div key={`${size}`} onClick={this.updateTotalViewEntries(size)}>
                  {size} entries
                </div>
              ),
            }))}
          />
        </UtilityGroup>
      ) : undefined;

    const SearchInput = showSearch ? (
      <UtilityGroup>
        <PluggableTypeaheadInput
          dataTest="table-search-input"
          bordered={false}
          showSearchIcon={true}
          searchBoxIcon={<SearchOutlined style={{ fontSize: '18px' }} />}
          iconPosition="prefix"
          placeholder={this.getSearchPlaceHolder()}
          onChange={this.onFilterData}
        />
      </UtilityGroup>
    ) : undefined;

    const ClearColumnFilters = !isEmpty(this.state.columnFilters) &&
      <ClearFilters onClick={this.clearAllColumnFilters}>Clear Filters</ClearFilters>;

    // Only display option to filter column where hideFilter !== true
    const filterableColumns = R.reject(({hideFilter}: ColumnConfiguration<T>) => !!hideFilter, this.props.columns);
    const columns = this.state.filteredColumns.map((col: ColumnConfiguration<T>) => ({
      ...col,
      onHeaderCell: (column: ColumnConfiguration<T>) => ({
        resizable: this.props.resizable && column.resizable !== false,
        resizeHandlerWidth:  this.props.resizeHandlerWidth,
      }),
      sorter: this.props.isControlled ? col.sorter !== false : this.getSorter(col),
      render: getRenderer(col, noDataIcon),
      ...(this.props.highlightSortedColumn && R.equals(this.state.sortKey, col.key) && this.state.sortDirection
        && {className: 'col-sorted'})
    }) as ColumnProps<T>);
    const components = {
      ...this.props.components,
      header: {
        cell: ResizableTitle,
      },
    };

    const ColumnFilterDropdownCom = this.props.useNestedColumnDropdown ? StyledNestedColumnFilterDropdown :
      StyledColumnFilterDropdown;

    return (
      <ParentContainerSpan ref={this.tableContainer}>

        <Container
          className={className}
          isRowClickable={this.props.isRowClickable}
          filterPlaceHolderWidth={filterPlaceHolder}
          isScroll={!!this.props.scroll}
        >
          <HiddenElement id='clickable-row' tabIndex={-1}>Click row for details</HiddenElement>
          <TableTitleContainer>
            {title && title(filteredData!)}
          </TableTitleContainer>
          <Utility CustomUtilityBarJustifyContent={CustomUtilityBarJustifyContent}>
            {!CustomUtilityBar && <UtilityGroup>
              {leftSideUtilities}
            </UtilityGroup>}
            {!CustomUtilityBar && !leftSideUtilities && <div/>}
            {CustomUtilityBar && <CustomUtilityBar/>}
            {(showPagination || showSearch || extraUtilities || !hideColumnFilter) &&
            <UtilityContainer className={classNames('table-actions-wrapper', tableActionsWrapperClassName)}>
              {extraUtilities && (
                <UtilityGroup>
                  {extraUtilities(this)}
                </UtilityGroup>
              )}
              <LimitedSpan>{ClearColumnFilters}</LimitedSpan>
              {PaginationDropdown}
              {SearchInput}
              {!hideColumnFilter && (
                <ColumnFilterDropdownCom
                  getPopupContainer={this.getContainerElement}
                  className="col-filter"
                  onChange={this.onColumnFilterChange}
                  columns={this.getDropdownColumns(filterableColumns)}
                  selectedColumns={this.getDropdownColumns(this.state.filteredColumns)}
                  dropdownWrapperClassName={dropdownWrapperClassName}
                  dataTest={`${rest['data-test'] || rest.tableName || 'table'}-column-filter-dropdown`}
                  showSelectedColumnsCount={showSelectedColumnsCount}
                  alwaysShowColumns={alwaysShowColumns}
                  disableAlwaysShowColumnsInFilterDropdown={disableAlwaysShowColumnsInFilterDropdown}
                  unSelectedColumnKeys={unSelectedColumnKeys}
                />
              )}
            </UtilityContainer>}
          </Utility>
          <AntdTable
            {...rest}
            aria-label={this.props.tableName ? this.props.tableName : undefined}
            onRow={onRow || this.onRow}
            dataSource={filteredData}
            pagination={this.getPaginationConfig()}
            locale={locale}
            rowClassName={this.getRowClassName}
            rowSelection={this.props.hideRowSelection ? undefined : this.onRowSelect()}
            components={components}
            columns={columns}
            onChange={this.handleTableChange}
            scroll={!isEmpty(filteredData) ? scroll ? scroll : { x: 'max-content' } : undefined}
          />
        </Container>
      </ParentContainerSpan>
    );
  }
}

export {
  PaginationConfig,
  SpinProps,
  PAGE_SIZES,
  ColumnFilterConfig,
  ColumnConfiguration,
  TableProps,
  TableState,
  ColumnProps,
  stringSorter,
  numberSorter
};

/* @component */
export default withResizableColumn(Table);
