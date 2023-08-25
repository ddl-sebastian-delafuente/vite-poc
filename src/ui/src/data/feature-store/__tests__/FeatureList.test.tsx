import {
  DominoFeaturestoreApiFeatureViewDto as FeatureViewDto,
} from '@domino/api/dist/types';
import { featureViewDto } from '@domino/mocks/dist/mocks';
import {
  render,
  screen,
} from '@domino/test-utils/dist/testing-library';
import * as React from 'react';

import { featureViewDto2FeatureViewSearchResultDto } from '../../../proxied-api/transforms';
import { FeatureList } from '../FeatureList';

const mockFeatureViews: FeatureViewDto[] = [
  {
    ...featureViewDto,
    id: 'mock-feature-view-id-1',
    createdAtMillis: 1661994000000,
    features: [
      { name: 'f1_f1', valueType: '', tags: {} },
      { name: 'f1_f2', valueType: '', tags: {} },
      { name: 'f1_f3', valueType: '', tags: {} },
    ],
    name: 'Feature 1',
    projectsInfo: [
      { projectId: 'mock-project-id-1', projectName: 'mock-project-name-1', ownerUsername: 'mock-username-1', isOriginProject: true},
      { projectId: 'mock-project-id-2', projectName: 'mock-project-name-2', ownerUsername: 'mock-username-2', isOriginProject: false},
      { projectId: 'mock-project-id-3', projectName: 'mock-project-name-3', ownerUsername: 'mock-username-3', isOriginProject: false},
      { projectId: 'mock-project-id-4', projectName: 'mock-project-name-4', ownerUsername: 'mock-username-4', isOriginProject: false},
      { projectId: 'mock-project-id-5', projectName: 'mock-project-name-5', ownerUsername: 'mock-username-5', isOriginProject: false},
    ],
    tags: {},
    lastUpdatedMillis: 1661994000000,
  },
  {
    ...featureViewDto,
    id: 'mock-feature-view-id-2',
    createdAtMillis: 1661994000000,
    features: [
      { name: 'f2_f1', valueType: '', tags: {} },
      { name: 'f2_f2', valueType: '', tags: {} },
      { name: 'f2_f3', valueType: '', tags: {} },
      { name: 'f2_f4', valueType: '', tags: {} },
      { name: 'f2_f5', valueType: '', tags: {} },
      { name: 'f2_f6', valueType: '', tags: {} },
    ],
    name: 'Feature 2',
    projectsInfo: [
      { projectId: 'mock-project-id-1', projectName: 'mock-project-name-1', ownerUsername: 'mock-username-1', isOriginProject: true},
      { projectId: 'mock-project-id-2', projectName: 'mock-project-name-2', ownerUsername: 'mock-username-2', isOriginProject: false},
      { projectId: 'mock-project-id-3', projectName: 'mock-project-name-3', ownerUsername: 'mock-username-3', isOriginProject: false},
      { projectId: 'mock-project-id-4', projectName: 'mock-project-name-4', ownerUsername: 'mock-username-4', isOriginProject: false},
      { projectId: 'mock-project-id-5', projectName: 'mock-project-name-5', ownerUsername: 'mock-username-5', isOriginProject: false},
    ],
    tags: {},
    lastUpdatedMillis: 1661994000000,
  },
]

describe('Feature List', () => {
  it('should render out metadata for features', async () => {
    render(<FeatureList featureViews={mockFeatureViews.map(featureViewDto2FeatureViewSearchResultDto)}/>);

    expect(screen.getByText('Feature 1')).toBeTruthy();
    expect(screen.getByText('Feature 2')).toBeTruthy();
    expect(screen.getByText('f1_f3', { exact: false })).toBeTruthy();
    expect(screen.queryByText('f2_f6', { exact: false })).not.toBeTruthy();
    expect(screen.getByText('and 3 more', { exact: false })).toBeTruthy();
  });
});
