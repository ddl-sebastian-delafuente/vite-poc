import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@domino/test-utils/dist/testing-library';

import Link from '../Link';

describe('Link component tests', () => {

  it('should render successfully', () => {
    render(
      <Link href="googole.com">
        Sample text for links
      </Link>
    );

    expect(screen.getByRole('link')).toBeTruthy();
  });

  it('onClick working', async () => {
    const mock = jest.fn();
    render(
      <Link href="www-wikipedia-org" onClick={mock} >
        Sample text for links
      </Link>
    );
    await userEvent.click(screen.getByRole('link'));
    expect(mock).toHaveBeenCalled();
  });

  it('check link disabled', async () => {
    const mock = jest.fn();
    const { getByTitle } = render(
      <Link type="primary" title="wikipedia" href="www-wikipedia-org" onClick={mock} disabled={true} >
        Sample text for links
      </Link>
    );
    await userEvent.click(getByTitle('wikipedia'));
    expect(mock).not.toHaveBeenCalled();
  });

  it('check link with title', () => {
    const { getByTitle } = render(
      <Link type="primary" href="www-wikipedia-org" title="wikipedia">
        Sample text for links
      </Link>
    );
    expect(getByTitle('wikipedia')).toBeTruthy();
  });

  it('check link without title', () => {
    const { queryByTitle } = render(
      <Link type="primary" href="www-wikipedia-org">
        Sample text for links
      </Link>
    );
    expect(queryByTitle('wikipedia')).toBeNull();
  });
});
