import * as React from 'react';
import { render } from '@testing-library/react';
import Hosting, { HostingProps } from '../Hosting';

describe('Hosting', () => {
  let props: HostingProps;
  beforeEach(() => {
    props = {
      hostingOptions: [
        { value: 'Domino', label: 'Domino' },
        { value: 'Snowflake', label: 'Snowflake' }
      ],
      sectionOptions: [
        { value: 'REST API', label: 'REST API' },
        { value: 'App', label: 'App' },
        { value: 'Launcher', label: 'Launcher' }
      ],
      environmentOptions: [
        { value: 'Domino Py3.6,R3', label: 'Domino Py3.6,R3' },
        { value: 'Domino Py3.6,R4', label: 'Domino Py3.6,R4' },
        { value: 'Domino Py3.6,R5', label: 'Domino Py3.6,R5' }
      ]
    };
  });

  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<Hosting {...props} />);
      expect(!!container).toBe(true);
    });
  });
});
