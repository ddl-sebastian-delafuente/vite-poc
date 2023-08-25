import * as React from 'react';
import { render } from '@testing-library/react';
import HostingInfo, { HostingInfoProps } from '../HostingInfo';
import { MemoryRouter as Router } from 'react-router';

describe('Hosting Info', () => {
  let props: HostingInfoProps;
  beforeEach(() => {
    props = {
      hostName: 'hostname',
      fileName: 'fileName',
      functionName: 'functionName',
      environmentId: 'environmentId',
      projectId: 'projectId'
    };
  });

  describe('render()', () => {
    it('should render', () => {
      const { container } = render(
        <Router>
          <HostingInfo {...props} />
        </Router>
      );
      expect(!!container).toBe(true);
    });
  });
});
