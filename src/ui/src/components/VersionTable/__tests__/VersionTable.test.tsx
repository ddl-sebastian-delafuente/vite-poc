import * as React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';
import VersionTable, { VersionTableProps } from '../VersionTable';

describe('VersionTable', () => {
  let props: VersionTableProps;
  beforeEach(() => {
    props = {
      data: [
        {
          version: { name: 'Version 4', url: '/' },
          commitId: { name: '6ad4x3m', url: '/' },
          note: 'This version has the purpose X.',
          deployed: '-',
          author: 'Domino',
          actions: [
            {
              name: 'Open in workspace',
              cta: () => alert('DDL')
            },
            {
              name: 'Stop/Start version',
              cta: () => alert('DDL')
            },
            {
              name: 'View Logs',
              cta: () => alert('DDL')
            }
          ]
        },
        {
          version: { name: 'Version 3', url: '/' },
          commitId: { name: '6ad4x3m', url: '/' },
          note: 'This is very good model with good things in it.',
          deployed: 'Aug 2020 - present',
          author: 'Domino',
          actions: [
            {
              name: 'Open in workspace',
              cta: () => alert('DDL')
            },
            {
              name: 'Stop/Start version',
              cta: () => alert('DDL')
            },
            {
              name: 'View Logs',
              cta: () => alert('DDL')
            }
          ]
        }
      ]
    };
  });
  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<VersionTable {...props} />);
      expect(!!container).toBe(true);
    });
    it('should render Table', () => {
      const { container } = render(<VersionTable {...props} />);
      expect(container.querySelectorAll('Table').length).toEqual(1);
    });
  });
});
