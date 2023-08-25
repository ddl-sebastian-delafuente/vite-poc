import * as React from 'react';
import moment from 'moment';
import {
  render,
  screen,
  within,
  fullClick
} from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import RevisionControl, { TestIds } from '../../src/filebrowser/RevisionControl';

describe('<RevisionControl />', () => {
  const timestamp1 = new Date('Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)').getTime();
  const timestamp2 = new Date('Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)').getTime();
  const rev2 = {
    sha: 'sha2',
    timestamp: timestamp1,
    url: 'rev2url',
    message: 'here is message 2',
    author: { username: 'author2' },
    runId: 'runid2',
    runNumberStr: 'Run #6',
    runLink: '#'
  };

  const rev1 = {
    sha: 'sha1',
    timestamp: timestamp2,
    url: 'rev1url',
    message: 'here is message 1',
    author: { username: 'author1' },
    runId: 'runid1',
    runNumberStr: 'Run #6',
    runLink: '#'
  };

  const defaultProps = {
    runLink: 'runLink',
    revision: rev1,
    revisions: [rev1],
    showBranchPicker: false
  };

  it('should render', () => {
    const { getByDominoTestId } = render(<RevisionControl {...defaultProps} />);
    const revisionControlSelector = screen.getByRole('combobox');
    expect(revisionControlSelector.getAttribute('id')).toEqual(TestIds.RevisionControl);
    expect(getByDominoTestId(TestIds.RevisionControlDropdown)).toBeTruthy();
  });

  it('should render with details of revision from prop', () => {
    render(<RevisionControl {...defaultProps} />); // `defaultProps` contains the revision as `rev1`
    expect(screen.getByText('COMMIT')).toBeTruthy();
    expect(screen.getByText(rev1.author.username)).toBeTruthy();
    expect(screen.getByText('committed')).toBeTruthy();
    expect(screen.getByText(rev1.sha)).toBeTruthy();
    expect(screen.getByText(`"${rev1.message}"`)).toBeTruthy();
    const expectedTimestamp = moment(timestamp1).format('MMMM D, YYYY @ hh:mm a');
    expect(screen.getByText(`on ${expectedTimestamp}`)).toBeTruthy();
  });

  it('should render dropdown option(s) when clicked on revision control dropdown', async () => {
    render(<RevisionControl {...defaultProps} revisions={[rev1, rev2]} />);
    const revisionControlSelector = screen.getByRole('combobox');
    await userEvent.click(revisionControlSelector);
    const options = screen.getByRole('listbox');
    expect(options.children.length).toEqual(2);
    expect(within(options).getByText(rev1.sha)).toBeTruthy();
    expect(within(options).getByText(rev2.sha)).toBeTruthy();
  });

  it('should render dropdown option(s) based on search input typed by the user', async () => {
    render(<RevisionControl {...defaultProps} revisions={[rev1, rev2]} />);
    const revisionControlSelector = screen.getByRole('combobox');
    await userEvent.click(revisionControlSelector);
    await userEvent.type(revisionControlSelector, rev1.sha);
    const options = screen.getByRole('listbox');
    expect(options.children.length).toEqual(1);
    expect(within(options).getByText(rev1.sha)).toBeTruthy();
    await userEvent.clear(revisionControlSelector);
    await userEvent.type(revisionControlSelector, rev2.sha);
    expect(options.children.length).toEqual(1);
    expect(within(options).getByText(rev2.sha)).toBeTruthy();
  });

  it('should trigger the `window.open` callback when clicked ', async () => {
    const originalWindowOpen = window.open;
    window.open = jest.fn(); // Avoids `Error: Not implemented: window.open`
    const mockOnChange = jest.fn();
    render(<RevisionControl {...defaultProps} revisions={[rev1, rev2]} onChange={mockOnChange} />);
    const revisionControlSelector = screen.getByRole('combobox');
    const revisionControlSelectedInput = revisionControlSelector.parentElement!.nextElementSibling as HTMLElement;
    expect(within(revisionControlSelectedInput).queryByText(rev2.sha)).not.toBeTruthy();
    expect(within(revisionControlSelectedInput).getByText(rev1.sha)).toBeTruthy();
    await userEvent.click(revisionControlSelector);
    fullClick(screen.getByText(rev2.author.username)); // click on option with any content in `rev2`
    expect(mockOnChange).toHaveBeenCalledWith(rev2);
    window.open = originalWindowOpen;
  });
});
