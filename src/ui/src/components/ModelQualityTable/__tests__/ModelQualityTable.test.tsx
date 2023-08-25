import * as React from 'react';
import { render } from '@testing-library/react';
import ModelQualityTable, { ModelQualityTableProps } from '../ModelQualityTable';

describe('ModelQualityTable', () => {
  let props: ModelQualityTableProps;
  beforeEach(() => {
    props = {
      data: [
        {
          metric: 'Accuracy',
          value: 0.94,
          range: '> 0.8'
        },
        {
          metric: 'Presision',
          value: 0.93,
          range: '> 0.8'
        }
      ]
    };
  });
  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<ModelQualityTable {...props} />);
      expect(!!container).toBe(true);
    });
    it('should render Table', () => {
      const { container } = render(<ModelQualityTable {...props} />);
      expect(container.querySelectorAll('Table').length).toEqual(1);
    });
  });
});
