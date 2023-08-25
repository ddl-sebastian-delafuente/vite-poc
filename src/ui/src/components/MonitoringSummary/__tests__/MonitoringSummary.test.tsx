import * as React from 'react';
import { render } from '@testing-library/react';
import MonitoringSummary, { MonitoringProjectProps } from '../MonitoringSummary';

describe('MonitoringSummary', () => {
  let props: MonitoringProjectProps;
  beforeEach(() => {
    props = {
      data: {
        isEnabled: true,
        modelQuality: [
          {
            count: undefined
          },
          {
            count: undefined
          },
          {
            count: undefined
          },
          {
            count: 0
          },
          {
            count: 0
          },
          {
            count: 0
          },
          {
            count: 1
          }
        ],
        dataDrift: [
          {
            count: undefined
          },
          {
            count: undefined
          },
          {
            count: undefined
          },
          {
            count: 0
          },
          {
            count: 0
          },
          {
            count: 0
          },
          {
            count: 4
          }
        ],
      }
    };
  });

  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<MonitoringSummary {...props} />);
      expect(!!container).toBe(true);
    });
  });
});
