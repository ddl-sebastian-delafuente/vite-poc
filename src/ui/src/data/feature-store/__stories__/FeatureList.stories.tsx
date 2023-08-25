import {
  DominoFeaturestoreApiFeatureViewDto as FeatureViewDto,
} from '@domino/api/dist/types';
import {
  generateFeatureViews
} from '@domino/mocks/dist/generators/Featurestore';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';

import { featureViewDto2FeatureViewSearchResultDto } from '../../../proxied-api/transforms';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import {
  FeatureList as FeatureListComponent,
  FeatureListProps,
} from '../FeatureList';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store'),
  component: FeatureListComponent,
  argTypes: {
    projectId: { controls: false }
  },
  args: {
    featureViews: generateFeatureViews(10),
    projectMode: false,
    searchTerm: '',
  }
};

interface TemplateProps extends Omit<FeatureListProps, 'featureViews'> {
  featureViews: FeatureViewDto[];
  projectMode: boolean,
}

const Template = ({
  featureViews,
  projectMode,
  ...args
}: TemplateProps) => {
  React.useEffect(() => {
    fetchMock
      .restore()
      .get('glob:/v4/gateway/projects*', [
        {
          id: '632ba1c5fbd03c16b545e581',
          name: 'quick-start',
          ownerId: '632ba1c4fbd03c16b545e57f',
          ownerName: 'integration-test',
          description:
            'This is a sample Domino Project. This project contains examples for using notebooks, publishing models as APIs, and publishing Python/Flask and R/Shiny web applications.',
          visibility: 'Private',
          tags: [],
          runCounts: [],
          lastUpdated: '2022-09-21T23:44:10.782Z',
          relationship: 'Owned',
          projectType: 'Analytic',
          stageId: '632b72affc5c5c4c97db0fb9',
          status: { status: 'active', isBlocked: false }
        }
      ]);
  }, []);

  return (
    <Router>
      <FeatureListComponent
        {...args}
        featureViews={featureViews.map(featureViewDto2FeatureViewSearchResultDto)}
        projectId={projectMode ? 'mock-project-id' : undefined}
      />
    </Router>
  );
};

export const FeatureList = Template.bind({});
