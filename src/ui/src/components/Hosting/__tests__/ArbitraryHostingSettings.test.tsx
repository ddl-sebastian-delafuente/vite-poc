import * as React from 'react';
import { render } from '@testing-library/react';
import ArbitraryHostingSettings from '../ArbitraryHostingSettings';

describe('Arbitrary Hosting Settings', () => {
  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<ArbitraryHostingSettings hostUrl="hostUrl"/>);
      expect(!!container).toBe(true);
    });
  });
});
