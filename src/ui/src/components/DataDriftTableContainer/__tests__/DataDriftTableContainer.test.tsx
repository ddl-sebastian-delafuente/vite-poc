import * as React from 'react';
import { render } from '@testing-library/react';
import DataDriftTableContainer, { DataDriftTableContainerProps } from '../DataDriftTableContainer';

describe('DataDriftTable', () => {
  let props: DataDriftTableContainerProps;
  beforeEach(() => {
    props = {
      onSearch: jest.fn(),
      data: [
        {
          isFail: true,
          feature: {
            name: 'variety',
            category: 'Categorical',
            range: 100.34,
            type: 'Output'
          },
          drift: {
            withinRange: true,
            value: 0.18
          },
          range: '> 0.34',
          training: { type: 'TRAINING', value: [1, 9, 3, 6, 0, 8, 5, 10] },
          prediction: { type: 'PREDICTION', value: [1, 9, 3, 6, 2, 8, 5, 10] },
          trend: {
            threshold: {
              greaterThan: 5
            },
            trendsData: [1, 9, 3, -6, 2, -8, 5, 10]
          }
        },
        {
          feature: {
            name: 'sepal.length',
            category: 'Numerical',
            range: 89.32
          },
          drift: {
            withinRange: false,
            value: 0.13
          },
          range: '< 0.14',
          training: { type: 'TRAINING', value: [10, 5, 8, 0, 6, 3, 9, 1] },
          prediction: { type: 'PREDICTION', value: [1, 9, 3, 6, 2, 8, 5, 10] },
          trend: {
            threshold: {
              lessThan: 10
            },
            trendsData: [1, 9, 3, -6, 2, -8, 5, 10]
          }
        },
        {
          feature: {
            name: 'varipetal.widthety',
            category: 'Numerical',
            range: 82.87
          },
          drift: {
            withinRange: false,
            value: 0.02
          },
          range: '0.14 — 0.25',
          training: { type: 'TRAINING', value: [0, 4, 0, 3, 8, 4, 10, 5] },
          prediction: { type: 'PREDICTION', value: [1, 9, 3, 6, 2, 8, 5, 10] },
          trend: {
            threshold: {
              lessThan: 15,
              greaterThan: 5
            },
            trendsData: [1, 9, 3, -6, 2, -8, 5, 10]
          }
        }
      ]
    };
  });

  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<DataDriftTableContainer {...props} />);
      expect(!!container).toBe(true);
    });
    it('should render Table', () => {
      const { container } = render(<DataDriftTableContainer {...props} />);
      expect(container.querySelectorAll('[data-id="Data-Drift-Table-Container"]').length).toEqual(1);
    });
  });
});
