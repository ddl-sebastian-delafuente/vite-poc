import * as React from 'react';
import { render } from '@testing-library/react';
import DeploymentsTable, { DeploymentsTableProps } from '../DeploymentsTable';

const date = new Date();

describe('DeploymentsTable', () => {
  let props: DeploymentsTableProps;
  beforeEach(() => {
    props = {
      data: [
        {
          deployment: { name: 'Model #21', url: '/' },
          project: { name: 'Project Asxa', url: '/' },
          predictions: 100000000000,
          drift: 0,
          quality: 0,
          hosted: { name: 'Nvidia' },
          lastModified: date
        },
        {
          deployment: { name: 'Model #25', url: '/' },
          project: { name: 'Project Asxa', url: '/' },
          predictions: 'Stopped/No deployed versions',
          drift: 0,
          quality: 1,
          hosted: { name: 'Domino', description: 'Launcher' },
          lastModified: date
        }
      ]
    };
  });
  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<DeploymentsTable {...props} />);
      expect(!!container).toBe(true);
    });
    it('should render Table', () => {
      const { container } = render(<DeploymentsTable {...props} />);
      expect(container.querySelectorAll('Table').length).toEqual(1);
    });
  });
});
