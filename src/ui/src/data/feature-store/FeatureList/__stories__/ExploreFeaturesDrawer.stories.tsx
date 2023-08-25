import { 
  addFeatureViewToProject,
  getFeatureViews,
} from '@domino/mocks/dist/mock-stories/Featurestore';
import { search } from '@domino/mocks/dist/mock-stories/Gateway';
import { useReload } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import {
  ExploreFeaturesDrawerProps,
  ExploreFeaturesDrawer as ExploreFeaturesDrawerComponent
} from '../ExploreFeaturesDrawer';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Feature List'),
  component: ExploreFeaturesDrawerComponent,
  args: {
    projectId: 'mock-project-id',
  }
}

const Template = (args: ExploreFeaturesDrawerProps) => {
  const [reload, setReload] = useReload();

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...addFeatureViewToProject())
      .mock(...getFeatureViews())
      .mock(...search({}))
    setReload(true);
  }, [setReload])

  if (reload) {
    return <div/>
  }

  return (
    <Router>
      <ExploreFeaturesDrawerComponent {...args} />
    </Router>
  )
};

export const ExploreFeaturesDrawer = Template.bind({});
