import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import { fakeProjectId as projectId } from '../runModalMockData';
import {
  DataSetConfigSelectionTabs,
} from '../../../../src/datasets/datasetconfigtabs/DataSetConfigSelectionTabs';

const match = {
  url: '',
  path: '',
  isExact: true,
  params: { ownerName: 'test_ownername', projectName: 'test_projectname' },
};
const location = {
  hash: '',
  key: '',
  pathname: '',
  search: '',
  state: {}
};
const history = {
  length: 2,
  action: 'POP',
  location,
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  block: jest.fn(),
  createHref: jest.fn(),
  listen: jest.fn()
};
export const defaultProps = {
  value: { default: true },
  projectId,
  isGitBased: false,
  configMap: {},
  datasetConfigurations: [],
  collapsed: false,
  match,
  location,
  history,
  staticContext: {}
};

test('should render', () => {
  expect(render(<DataSetConfigSelectionTabs {...defaultProps} />)
    .getByDominoTestId('data-selection-tabs')).toBeTruthy();
});
