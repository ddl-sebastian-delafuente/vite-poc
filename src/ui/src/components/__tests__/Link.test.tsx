import * as React from 'react';
import 'jest-styled-components';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import Link from '../Link';

(global as any).window = { location: { pathname: null } };

describe('Link', () => {

  it('Link Prop Check', () => {
    render(<Link href="/testLink" className={'testLink'}>Link</Link>);
    expect(screen.getByRole('link').getAttribute('href')).toEqual('/testLink');
    expect(screen.getByText('Link')).toBeTruthy();
  });
});
