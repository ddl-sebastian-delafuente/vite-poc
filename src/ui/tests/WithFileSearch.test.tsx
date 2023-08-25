import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import * as Files from '@domino/api/dist/Files';
import WithFileSearch, { OnQuery } from '../src/containers/WithFileSearch';

import { fileMatchesDto } from '@domino/test-utils/dist/mocks';

jest.mock('@domino/api/dist/Files');

afterAll(() => {
  jest.unmock('@domino/api/dist/Files');
});

describe('<WithFileSearch />', () => {
  const fakeProjectId = 'fakeProjectId';

  it('should render the children prop', () => {
    const children = jest.fn(() => null);
    render(
      <WithFileSearch projectId={fakeProjectId}>
        {children}
      </WithFileSearch>
    );

    expect(children).toHaveBeenCalledTimes(1);
  });

  it('should not be loading if not fetched', () => {
    const children = jest.fn(() => null);
    render(
      <WithFileSearch projectId={fakeProjectId}>
        {children}
      </WithFileSearch>
    );

    expect(children).toHaveBeenCalledWith([], expect.anything(), false, undefined);
    // expect(children.mock.calls[0][2]).toBe(false);
  });

    it('should be loading if fetching', async () => {
      let timer: any;
      const fileSearch = jest.spyOn(Files, 'fileSearch');
      fileSearch.mockImplementation(() => {
        return new Promise((resolve) => {
          timer = setTimeout(() => {
            resolve({ ...fileMatchesDto, files: [], commitId: 'asdf' });
          }, 1000);
        });
      });
      const children = (results: string[], onQuery: OnQuery, loading: boolean) => (
        <button onClick={() => onQuery('x')} data-test="test-btn">
          {loading ? 'loading' : 'not'}
        </button>
      );
      const view = render(
        <WithFileSearch projectId={fakeProjectId}>
          {children}
        </WithFileSearch>
      );
      await userEvent.click(view.getByDominoTestId('test-btn'));
      await waitFor(() =>  expect(view.container.textContent).toContain('loading'));
      if (timer) {
        clearTimeout(timer);
      }
    });

  // TODO fix the types on this test. Files is expected to be an array of strings
  // however, this test has it with structured data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  it.skip('should send files results to children', () => {
    const files = [
      'PATH'
    ];
    const fileSearch = jest.spyOn(Files, 'fileSearch');
    fileSearch.mockImplementationOnce(async () => ({ files, commitId: 'asdf', projectId: fakeProjectId }));
    const view = render(
      <WithFileSearch projectId={fakeProjectId} debounceTimeout={0}>
        {(results, onQuery, loading) => (
          <div>
            {JSON.stringify(results)}
            <button onClick={() => onQuery('x')} />
          </div>
        )}
      </WithFileSearch>
    );
    userEvent.click(view.getByRole('button'));
    expect(view.container.textContent).toContain(JSON.stringify(files))
  });
});
