import * as React from 'react';
import { render } from '@testing-library/react';
import HardwareConfiguration, { HardwareLabel, HardwareProps } from '../HardwareConfiguration';

describe('Hardware Configuration', () => {
  let props: HardwareProps;
  beforeEach(() => {
    props = {
      instanceOptions: [
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ],
      hardwareOptions: [
        {
          value: 'Small',
          label: <HardwareLabel label="Small" description="1 core · 4 GiB RAM · $0.034/min" time="&lt; 1 MIN" />
        },
        {
          value: 'Large',
          label: <HardwareLabel label="Large" description="4 core · 16 GiB RAM · $0.094/min" time="&lt; 30 SEC" />
        }
      ]
    };
  });

  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<HardwareConfiguration {...props} />);
      expect(!!container).toBe(true);
    });
  });
});
