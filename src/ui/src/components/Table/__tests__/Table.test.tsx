import * as React from 'react';
import * as R from 'ramda';
import 'jest-styled-components';
import userEvent from '@testing-library/user-event';
import { configure, render, waitFor, within, RenderResult, fireEvent } from '@domino/test-utils/dist/testing-library';
import Table, { ColumnConfiguration, DEFAULT_PAGE_SIZE, numberSorter } from '../Table';

export const columns: ColumnConfiguration<any>[] = [
  { title: 'Name', key: 'name', dataIndex: 'name', sorter: (a: any, b: any): number => a.name.localeCompare(b.name) },
  { title: 'Address', key: 'address', render: () => <a>In a galaxy far far away...</a> }
];

export const data = [
  {
    key: 0,
    name: 'Darth Vader'
  },
  {
    key: 1,
    name: 'Obi-Wan Kenobi'
  },
  {
    key: 2,
    name: 'Han Solo'
  },
  {
    key: 3,
    name: 'Yoda'
  },
  {
    key: 4,
    name: 'Luke Skywalker'
  },
  {
    key: 5,
    name: 'R2-D2'
  },
  {
    key: 6,
    name: 'Chewbacca'
  },
  {
    key: 7,
    name: 'Leia Organa'
  },
  {
    key: 8,
    name: 'Boba Fett'
  },
  {
    key: 9,
    name: 'Darth Maul'
  },
  {
    key: 10,
    name: 'Palpatine'
  },
  {
    key: 11,
    name: 'C-3PO'
  },
  {
    key: 12,
    name: 'Qui-Gon Jinn'
  },
  {
    key: 13,
    name: 'Lando Calrissian'
  },
  {
    key: 14,
    name: 'Mace Windu'
  },
  {
    key: 15,
    name: 'Padmé Amidala'
  },
  {
    key: 16,
    name: 'Admiral Ackbar'
  },
  {
    key: 17,
    name: 'Jabba the Hutt'
  },
  {
    key: 18,
    name: 'General Grievous'
  },
  {
    key: 19,
    name: 'Grand Moff Tarkin'
  },
  {
    key: 20,
    name: 'Count Dooku'
  },
  {
    key: 21,
    name: 'Jango Fett'
  },
  {
    key: 22,
    name: 'Kylo Ren'
  },
  {
    key: 23,
    name: 'BB-8'
  },
  {
    key: 24,
    name: 'Generals',
    isDir: true
  },
  {
    key: 25,
    name: 'Admirals',
    isDir: true
  }
];

const getTableRows = <T extends RenderResult>(view: T): Array<HTMLTableRowElement> =>
  Array.from(view.baseElement.querySelectorAll('table tbody tr.ant-table-row'));

const getMockData = (length: number) => Array.from({ length }, (_, key) => ({ key, name: `${key}` }));

describe('Table component tests', () => {
  afterAll(jest.resetModules);

  enum TestId { TABLE = 'table', COLUMN_DROPDOWN = 'table-column-filter-dropdown', ROW_SEARCH = 'table-search-input' }
  const defaultProps = { columns, dataSource: data, 'data-test': TestId.TABLE };
  const sorterClass = 'ant-table-column-sorter';
  configure({ testIdAttribute: 'data-menu-id' });

  it('should render successfully', () => {
    expect(render(<Table {...defaultProps} />).getByDominoTestId(TestId.TABLE)).toBeTruthy();
  });

  it('test column filter', () => {
    const onColumnFilterChangeMock = jest.fn();
    const view = render(<Table {...defaultProps} onColumnFilterChange={onColumnFilterChangeMock} hideRowSelection={true} />);
    expect(view.baseElement.querySelectorAll('table thead th').length).toEqual(2);
    fireEvent.click(view.getByDominoTestId(TestId.COLUMN_DROPDOWN));
    fireEvent.click(view.getByTestId(/name/).querySelector('input')!);
    expect(onColumnFilterChangeMock).toHaveBeenCalled();
    expect(view.baseElement.querySelectorAll('table thead th').length).toEqual(1);
  });

  it('test sorting with provided sorter function', async () => {
    const sortedData = R.sortBy(R.prop('name'), data);
    const lastSortedName = R.propOr(null, 'name')(R.last(sortedData));
    const firstSortedName = R.propOr(null, 'name')(sortedData[0]);

    const view = render(<Table {...defaultProps} hideRowSelection={true} />);

    const [nameTableHeader, addressTableHeader] = Array.from(view.baseElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
    const nameSorter = nameTableHeader.querySelectorAll(`.${sorterClass}-inner`);
    const addressSorter = addressTableHeader.querySelectorAll(`.${sorterClass}-inner`);
    expect(nameSorter.length).toEqual(1);
    expect(addressSorter.length).toEqual(0);

    const ascSort = view.baseElement.querySelector(`.${sorterClass}-up svg`) as SVGElement;
    const descSort = view.baseElement.querySelector(`.${sorterClass}-down svg`) as SVGElement;

    // Sort in ascending order
    await userEvent.click(ascSort);
    const [firstRowAsc] = getTableRows(view);
    expect(firstRowAsc.textContent).toContain(firstSortedName);

    // Sort in descending order
    await userEvent.click(descSort);
    const [firstRowDesc] = getTableRows(view);
    expect(firstRowDesc.textContent).toContain(lastSortedName);
  });

  it('test default sorting', async () => {
    const localColumns: ColumnConfiguration<any>[] = [{ ...columns[0], sorter: true }];
    const localData = [{ key: 0, name: 'A' }, { key: 1, name: 'B' }];

    const view = render(<Table columns={localColumns} dataSource={localData} hideRowSelection={true} />);

    const [nameTableHeader] = Array.from(view.baseElement.querySelectorAll('thead th')) as HTMLTableCellElement[];
    const nameSorter = nameTableHeader.querySelectorAll(`.${sorterClass}-inner`);
    expect(nameSorter.length).toEqual(1);

    const ascSort = view.baseElement.querySelector(`.${sorterClass}-up svg`) as SVGElement;
    const descSort = view.baseElement.querySelector(`.${sorterClass}-down svg`) as SVGElement;

    // Sort in ascending order
    await userEvent.click(ascSort);
    const [firstRowAsc] = getTableRows(view);
    expect(firstRowAsc.textContent).toContain('A');

    // Sort in descending order
    await userEvent.click(descSort);
    const [firstRowDesc] = getTableRows(view);
    expect(firstRowDesc.textContent).toContain('B');
  });

  it('test sorting by timestamp', async () => {
    const sorter = numberSorter(['startTime', 'timestamp']);
    const localColumns: ColumnConfiguration<any>[] = [
      { title: 'Name', key: 'name', dataIndex: 'name' },
      { title: 'Started on', key: 'startTime', sorter, render: () => 'Fri Jun 14 2019 13:01' }
    ];
    const localData = [
      { key: 0, name: 'A', startTime: { timestamp: 1560497490280 } },
      { key: 1, name: 'B', startTime: { timestamp: 1560497563098 } }
    ];

    const view = render(<Table columns={localColumns} dataSource={localData} hideRowSelection={true} />);

    const startedOnTableHeader = R.last(Array.from(view.baseElement.querySelectorAll('thead th'))) as HTMLTableCellElement;
    const startedOnSorter = startedOnTableHeader.querySelectorAll(`.${sorterClass}-inner`);
    expect(startedOnSorter.length).toEqual(1);

    const ascSort = view.baseElement.querySelector(`.${sorterClass}-up svg`) as SVGElement;
    const descSort = view.baseElement.querySelector(`.${sorterClass}-down svg`) as SVGElement;

    // Sort in ascending order
    await userEvent.click(ascSort);
    const [firstRowAsc] = getTableRows(view);
    expect(firstRowAsc.textContent).toContain('A');

    // Sort in descending order
    await userEvent.click(descSort);
    const [firstRowDesc] = getTableRows(view);
    expect(firstRowDesc.textContent).toContain('B');
  });

  it('test search', async () => {
    const view = render(<Table {...defaultProps} />);
    userEvent.type(view.getByDominoTestId(TestId.ROW_SEARCH), 'darth');
    await waitFor(() => expect(getTableRows(view).length).toEqual(2));
  });

  it('test clicking on a row', async () => {
    const onRowClickMock = jest.fn();
    const view = render(<Table {...defaultProps} isRowClickable={true} onRowClick={onRowClickMock} />);
    const [, secondRow] = getTableRows(view);
    expect(secondRow.getAttribute('class')).not.toContain('selected');
    await userEvent.click(secondRow);
    expect(onRowClickMock).toHaveBeenCalled();
    expect(secondRow.getAttribute('class')).toContain('selected');
  });

  it('test pagination', async () => {
    const mockData = getMockData(DEFAULT_PAGE_SIZE * 2.5); // Generate 3 pages of rows
    const view = render(<Table {...defaultProps} dataSource={mockData} />);
    const [pageOneButton, , pageThreeButton] = Array.from(view.baseElement.querySelectorAll('.ant-pagination-item')) as HTMLLIElement[];
    expect(pageOneButton.getAttribute('class')).toContain('active');
    expect(pageThreeButton.getAttribute('class')).not.toContain('active');
    await userEvent.click(pageThreeButton);
    expect(pageOneButton.getAttribute('class')).not.toContain('active');
    expect(pageThreeButton.getAttribute('class')).toContain('active');
    const tableRows = getTableRows(view);
    expect(tableRows.length).toEqual(mockData.length % DEFAULT_PAGE_SIZE);
    expect(tableRows.length).toEqual(25);
  });

  it('test page size selector', () => {
    const mockData = getMockData(DEFAULT_PAGE_SIZE * 1.5); // Generate 2 pages of rows
    const view = render(<Table {...defaultProps} dataSource={mockData} />);
    fireEvent.click(view.getByText(/entries/));
    fireEvent.click(view.getByText(/100 entries/));
    const tableRows = getTableRows(view);
    expect(tableRows.length).toEqual(mockData.length);
  });

  it('test row selection', async () => {
    const onRowSelectMock = jest.fn();
    const view = render(<Table {...defaultProps} onRowSelect={onRowSelectMock} />);
    await userEvent.click(view.baseElement.querySelector('.table-row-2 input[type="checkbox"]')!);
    expect(onRowSelectMock).toHaveBeenCalled();
  });

  it('should not allow resizing a fixed width column', () => {
    const localColumns: ColumnConfiguration<any>[]  = [
      { title: 'Name', key: 'name', dataIndex: 'name', sorter: false },
      { title: 'Started on', key: 'startTime', resizable: false, sorter: false, render: () => 'Fri Jun 14 2019 13:01' }
    ];
    const localData = [
      { key: 0, name: 'A', startTime: { timestamp: 1560497490280 } },
      { key: 1, name: 'B', startTime: { timestamp: 1560497563098 } }
    ];

    const { getByText } = render(<Table columns={localColumns} dataSource={localData} />);
    expect(getByText('Name').querySelector('.resize-handle')).toBeTruthy();
    expect(getByText('Started on').querySelector('.resize-handle')).toBeFalsy();
  });

  it('should show defaultPageSize in page size options even if defaultPageSize not in [50, 100, 200]', async () => {
    const localColumns: ColumnConfiguration<any>[]  = [
      { title: 'Name', key: 'name', dataIndex: 'name' },
      { title: 'Started on', key: 'startTime', resizable: false, render: () => 'Fri Jun 14 2019 13:01' }
    ];
    const localData = [
      { key: 0, name: 'A', startTime: { timestamp: 1560497490280 } },
      { key: 1, name: 'B', startTime: { timestamp: 1560497563098 } }
    ];

    const view = render(<Table columns={localColumns} dataSource={localData} showPagination={true} defaultPageSize={1} />);
    await userEvent.click(view.getByText(/entries/));
    const pageEntries = within(view.getByRole('menu'));
    R.forEach(entry => expect(pageEntries.getByTestId(new RegExp(`${entry}$`))).toBeTruthy(), ['1', '50', '100', '200']);
  });

  it('should hide the columns supplied in `columnsToHideByDefault` on table load', () => {
    const view = render(<Table {...defaultProps} hideRowSelection={true} columnsToHideByDefault={[columns[1].key as string]} />);
    expect(view.baseElement.querySelectorAll('thead th').length).toEqual(columns.length - 1);
    expect(view.getByText(columns[0].title as string)).toBeTruthy();
    expect(view.queryByText(columns[1].title as string)).toBeFalsy();
  });

  it('should not render a checkbox on each row for selection when `hideRowSelection` is set to true', () => {
    const view = render(<Table {...defaultProps} hideRowSelection={true} />);
    const colHeadersRow = Array.from(view.baseElement.querySelectorAll('thead th'));
    expect(colHeadersRow.length).toEqual(columns.length);
    expect(colHeadersRow[0].textContent).toEqual(columns[0].title);
    expect(view.baseElement.querySelectorAll('input[type="checkbox"]').length).toEqual(0);
  });

  it('should not show the columns given to `alwaysShowColumns` in column filter dropdown', async () => {
    const view = render(<Table {...defaultProps} alwaysShowColumns={[columns[0].key as string]} />);
    await userEvent.click(view.getByDominoTestId(TestId.COLUMN_DROPDOWN));
    const colFilterMenu = view.getByRole('menu');
    expect(colFilterMenu.textContent).not.toContain(columns[0].title);
    expect(colFilterMenu.textContent).toContain(columns[1].title);
  });

  it('should not render column filter dropdown when `hideColumnFilter` is set to true', () => {
    expect(render(<Table {...defaultProps} hideColumnFilter={true} />)
      .queryByDominoTestId(TestId.COLUMN_DROPDOWN)).toBeFalsy();
  });

  it('should not render search box when `showSearch` is set to false', () => {
    expect(render(<Table {...defaultProps} showSearch={false} />)
      .queryByDominoTestId(TestId.ROW_SEARCH)).toBeFalsy();
  });

  it('should render odd rows with class name `striped` when `isStriped` is set to true', () => {
    const isEven = (num: number) => Boolean(num % 2 === 0);
    const view = render(<Table {...defaultProps} showSearch={false} isStriped={true} />);
    const tableRows = Array.from(view.baseElement.querySelectorAll('tbody tr.ant-table-row'));
    const evenRows = tableRows.filter((_, idx) => isEven(idx));
    evenRows.forEach(row => expect(row.getAttribute('class')).not.toContain('striped'));
    const oddRows = tableRows.filter((_, idx) => !isEven(idx));
    oddRows.forEach(row => expect(row.getAttribute('class')).toContain('striped'));
  });

  it('test pagination after filtering on Search', async () => {
    let numberOfPages: NodeListOf<Element>;
    let tableRows: Array<HTMLTableRowElement>;

    const view = render(<Table {...defaultProps} defaultPageSize={5} />);
    numberOfPages = view.baseElement.querySelectorAll('.ant-pagination-item');
    tableRows = getTableRows(view);
    expect(numberOfPages.length).toEqual(6);
    expect(tableRows.length).toEqual(5);

    await userEvent.type(view.getByDominoTestId(TestId.ROW_SEARCH), 'darth');
    await waitFor(() => {
      numberOfPages = view.baseElement.querySelectorAll('.ant-pagination-item');
      tableRows = getTableRows(view);
      expect(numberOfPages.length).toEqual(1)
      expect(tableRows.length).toEqual(2)
    });
  });

  it('should support regex characters in search', async () => {
    const dataWithRegexCharacters = [
      { key: 0, name: 'Darth* Vader' },
      { key: 1, name: 'Obi-Wan$ Kenobi' }
    ];

    const view = render(<Table {...defaultProps} dataSource={dataWithRegexCharacters} />);
    await userEvent.type(view.getByDominoTestId(TestId.ROW_SEARCH), '*');
    await waitFor(() => expect(getTableRows(view).length).toEqual(1));
  });
});
