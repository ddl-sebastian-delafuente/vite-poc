import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import FileBrowserTable from '../FileBrowserTable';

describe('<FileBrowserTable />', () => {
  const testId = 'file-browser-table';
  const defaultProps = { path: '', columns: [], 'data-test': testId };

  it('should render', () => {
    const { getByDominoTestId } = render(<FileBrowserTable {...defaultProps} />);
    expect(getByDominoTestId(testId)).toBeTruthy();
  });

  it('should be able to render custom stuff in bread crumbs', () => {
    const customText = 'garbage';
    const { getByText } = render(<FileBrowserTable {...defaultProps} CustomBreadCrumbs={() => <div>{customText}</div>} />);
    expect(getByText(customText)).toBeTruthy();
  });

  it('should not show go up directory row if at depth 0 of file tree', () => {
    const { queryByDominoTestId } = render(<FileBrowserTable {...defaultProps} />);
    expect(queryByDominoTestId('go-up-button')).toBeFalsy();
  });

  it('should show go up directory row if at depth > 0 of file tree and can go up', () => {
    const { queryAllByDominoTestId } = render(<FileBrowserTable {...defaultProps} path="d1" onGoUpDirectory={async () => undefined} />);
    expect(queryAllByDominoTestId('go-up-button')).toHaveLength(1);
  });

  it('should not show checkboxes on the rows by default', () => {
    const { container } = render(<FileBrowserTable {...defaultProps} dataSource={[{ name: 'cat.txt', size: 1 }]} />);
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
  });

  it('should show checkboxes on the rows if enabled with flag', () => {
    const { container } = render(<FileBrowserTable {...defaultProps} hideRowSelection={false} dataSource={[{ name: 'cat.txt', size: 1 }]} />);
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(2);
  });
});
