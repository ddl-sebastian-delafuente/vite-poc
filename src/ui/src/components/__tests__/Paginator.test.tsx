import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import Paginator from '../pagination/Paginator';

interface TestUser {
  id: number;
  name: string;
  address: string;
}

const data = Array.from(Array(50).keys()).map(val => ({id: val + 1, name: 'test name', address: 'test address'}));
const getPaginatorChildren = (rows: TestUser[]) =>
  <div>
    {rows.map(row =>
      <div key={row.id} className="data-item">
        <div>{row.name}</div>
        <div>{row.address}</div>
      </div>)}
  </div>

describe('Paginator', () => {
  const defaultProps = { rows: data, totalEntries: data.length };
  
  it('should show the custom summary formatter when paginationSummaryFormatter has value', () => {
    const summaryFormatterTestId = 'custom-summary-formatter';
    const paginationSummaryFormatter = jest.fn(() => (total: number, range: [number, number]) => 
      <span data-test={summaryFormatterTestId}>Custom summary formatter {range[0]}–{range[1]} out of {total}</span>
    );
    const { getByDominoTestId } = render(<Paginator {...defaultProps} paginationSummaryFormatter={paginationSummaryFormatter}>{getPaginatorChildren}</Paginator>);
    expect(getByDominoTestId(summaryFormatterTestId)).toBeTruthy();
  });

  it('should show a page selector dropdown before to content, when showPageSelector is set to true', () => {
    const { getAllByDominoTestId } = render(<Paginator {...defaultProps} showPageSelector={true}>{getPaginatorChildren}</Paginator>);
    expect(getAllByDominoTestId('PaginationDropdown')[0].parentElement?.getAttribute('class')).toContain('paginator-container');
  });

  it('should not show a page selector dropdown before to content, when showPageSelector is set to false', () => {
    const { getByDominoTestId } = render(<Paginator {...defaultProps} showPageSelector={false}>{getPaginatorChildren}</Paginator>);
    expect(getByDominoTestId('PaginationDropdown').parentElement?.getAttribute('class')).not.toContain('paginator-container');
  });

  it('should not show the pagination footer, when showFooter is set to false', () => {
    const { queryByDominoTestId } = render(<Paginator {...defaultProps} showFooter={false}>{getPaginatorChildren}</Paginator>);
    expect(queryByDominoTestId('PaginationFooter')).toBeFalsy();
  });
});
