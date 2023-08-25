import * as React from 'react';
import 'jest-styled-components';
import userEvent from '@testing-library/user-event';
import * as Files from '@domino/api/dist/Files';
import {
  DominoFilesInterfaceFileMatchesDto as FileSearchDataType
} from '@domino/api/dist/types';
import { project } from '../../utils/testUtil';
import { render, screen, act, fullClick, waitFor } from '@domino/test-utils/dist/testing-library';
import AutoCompleteWithFileSearch, { ManagedAutoComplete } from '../AutoCompleteWithFileSearch';

const FileName = { Start: 'some', Middle: 'Abc', End: 'FileName' } as const;
const projectId = project.id;
const mockFileSearchData: FileSearchDataType = {
  commitId: 'commitId',
  projectId,
  files: ['a', 'aa', 'b', 'bb', 'c', 'cc', 'x', 'xy', 'xyz', 'main.py']
};

const mockFileSearch = () => {
  const fileSearch = jest.spyOn(Files, 'fileSearch');
  fileSearch.mockImplementation(async () => Promise.resolve(mockFileSearchData));
};

describe(`AutoCompleteWithFileSearch Component`, () => {
  it(`should render with a default value`, () => {
    const defaultValue = 'main.py';
    render(<AutoCompleteWithFileSearch projectId={projectId} defaultValue={defaultValue} onFieldChange={jest.fn()} />);
    expect(screen.getByRole('combobox').getAttribute('value')).toEqual(defaultValue);
  });

  it(`should show a list of files when 'x' is typed in`, async () => {
    mockFileSearch();
    const mockOnFieldChange = jest.fn();
    render(<AutoCompleteWithFileSearch projectId={projectId} onFieldChange={mockOnFieldChange} />);
    await waitFor(() => expect(screen.getByRole('combobox')).not.toBeNull());
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'x');
    expect(mockOnFieldChange).toHaveBeenCalledWith('x', false);
    await waitFor(() => expect(screen.getAllByText('xyz')).not.toBeNull());
    expect(screen.queryByText('x')).toBeTruthy();
    expect(screen.queryByText('xy')).toBeTruthy();
    expect(screen.queryByText('xyz')).toBeTruthy();
    expect(screen.queryByText('xyzz')).toBeNull(); // file with name 'xyzz' doesn't exist
  });

  it(`should select the filtered option chosen by the user click`, async () => {
    mockFileSearch();
    const mockOnFieldChange = jest.fn();
    render(<AutoCompleteWithFileSearch projectId={projectId} onFieldChange={mockOnFieldChange} />);
    await waitFor(() => expect(screen.getByRole('combobox')).not.toBeNull());
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'x');
    expect(mockOnFieldChange).toHaveBeenCalledWith('x', false);
    await waitFor(() => expect(screen.getAllByText('xyz')).not.toBeNull());
    const xyzFile = screen.getByText('xyz');
    expect(screen.queryByText('xyzz')).toBeNull(); // file with name 'xyzz' doesn't exist
    act(() => {fullClick(xyzFile)});
    expect(input.getAttribute('value')).toEqual('xyz');
  });

  it(`should not allow the spinner to be selected`, async () => {
    render(
      <ManagedAutoComplete results={['x', 'xy', 'xyz']} loading={true} onQuery={jest.fn()} onFieldChange={jest.fn()} />
    );
    await waitFor(() => expect(screen.getByRole('combobox')).not.toBeNull());
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'x');
    await waitFor(() => expect(screen.getAllByText('spinner')).not.toBeNull());
    const [optionLoading] = screen.getAllByText('spinner');
    act(() => {fullClick(optionLoading)});
    expect(input.getAttribute('value')).toEqual('x');
  });

  /**
   * Test Cases for the bugs reported in: [DOM-34259](https://dominodatalab.atlassian.net/browse/DOM-34259)
   *
   * To understand `userEvent.type` API, please use the following resource:
   * - https://testing-library.com/docs/ecosystem-user-event/#typeelement-text-options
   */
  describe(`filename input cursor`, () => {
    it(`should NOT reset to end of the filename input when text is changed from the middle-point by adding more characters`, async () => {
      const { Start, Middle, End } = FileName;
      const partialFileName = `${Start}${End}` as const; // 'someFileName'
      render(
        <AutoCompleteWithFileSearch
          projectId={projectId}
          onFieldChange={jest.fn()}
          defaultValue={partialFileName}
        />
      );
      const fullFileName = `${Start}${Middle}${End}` as const; // 'someAbcFileName'
      const improperFileName = `${Start}A${End}bc` as const; // 'someAFileNamebc'
      await waitFor(() => expect(screen.getByRole('combobox')).not.toBeNull());
      const input = screen.getByRole('combobox');
      await userEvent.type(
        input,
        `{home}{arrowright}{arrowright}{arrowright}{arrowright}${Middle}`
      );
      const inputText = screen.getByDisplayValue(fullFileName);
      await waitFor(() => expect(inputText.getAttribute('value')).not.toEqual(improperFileName));
      await waitFor(() => expect(inputText.getAttribute('value')).toEqual(fullFileName));
    });

    it(`should NOT reset to end of the filename input when text is changed from the middle-point using 'delete' key`, async () => {
      const { Start, Middle, End } = FileName;
      const fullFileName = `${Start}${Middle}${End}` as const; // 'someAbcFileName'
      render(
        <AutoCompleteWithFileSearch
          projectId={projectId}
          onFieldChange={jest.fn()}
          defaultValue={fullFileName}
        />
      );
      const partialFileName = `${Start}${End}` as const; // 'someFileName'
      const improperFileName = `${Start}bc${End}` as const; // 'somebcFileName'
      await waitFor(() => expect(screen.getByRole('combobox')).not.toBeNull());
      const input = screen.getByRole('combobox');
      await userEvent.type(
        input,
        '{home}{arrowright}{arrowright}{arrowright}{arrowright}{delete}{delete}{delete}'
      );
      await waitFor(() => expect(screen.getByDisplayValue(partialFileName)).not.toBeNull());
      const inputText = screen.getByDisplayValue(partialFileName);
      await waitFor(() => expect(inputText.getAttribute('value')).not.toEqual(improperFileName));
      await waitFor(() => expect(inputText.getAttribute('value')).toEqual(partialFileName));
    });

    it(`should NOT reset to end of the filename input when text is changed from the middle-point using 'backspace' key`, async () => {
      const { Start, Middle, End } = FileName;
      const fullFileName = `${Start}${Middle}${End}` as const; // 'someAbcFileName'
      render(
        <AutoCompleteWithFileSearch
          projectId={projectId}
          onFieldChange={jest.fn()}
          defaultValue={fullFileName}
        />
      );
      const partialFileName = `${Middle}${End}` as const; // 'AbcFileName'
      const improperFileName = `som${Middle}FileN` as const; // 'somAbcFileN'
      const input = screen.getByRole('combobox');
      await userEvent.type(
        input,
        '{home}{arrowright}{arrowright}{arrowright}{arrowright}{backspace}{backspace}{backspace}{backspace}'
      );
      await waitFor(() => expect(screen.getByDisplayValue(partialFileName)).not.toBeNull());
      const inputText = screen.getByDisplayValue(partialFileName);
      await waitFor(() => expect(inputText.getAttribute('value')).not.toEqual(improperFileName));
      await waitFor(() => expect(inputText.getAttribute('value')).toEqual(partialFileName));
    });
  });
});
