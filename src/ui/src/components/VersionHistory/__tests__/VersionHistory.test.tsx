import * as React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';
import VersionHistory, { VersionHistoryProps } from '../VersionHistory';

const now = new Date();

describe('VersionHistory', () => {
  let props: VersionHistoryProps;
  beforeEach(() => {
    props = {
      data: [
        {
          versionNumber: 1,
          author: 'Domino',
          exported: now.getUTCDate(),
          status: 'preparing',
          exportTarget: 'exportTarget',
          exportVersionId: 'exportVersionId',
          modelId: 'modelId',
          modelVersionId: 'modelVersionId',
          snowflakeExportJobId: 'exportJobId',
        }
      ],
      ownerName: 'ownerName',
      projectName: 'projectName'
    };
  });
  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<VersionHistory {...props} />);
      expect(!!container).toBe(true);
    });
    it('should render Table', () => {
      const { container } = render(<VersionHistory {...props} />);
      expect(container.querySelectorAll('Table').length).toEqual(1);
    });
  });
});
