import {
  addFeatureViewToProject,
  getFeatureView
} from '@domino/mocks/dist/mock-stories/Featurestore';
import { list as listProjects } from '@domino/mocks/dist/mock-stories/Gateway';
import fetchMock from 'fetch-mock';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import * as React from 'react';

import { 
  globalFeatureStoreFeatureViewPath,
  projectFeatureStoreFeatureViewPath,
} from '../../../../core/routes';
import { getDevStoryPath } from '../../../../utils/storybookUtil';
import {
  FeatureViewDetailsProps,
  FeatureViewDetails as FeatureViewDetailsComponent,
} from '../FeatureViewDetails';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Feature View'),
  component: FeatureViewDetailsComponent,
  args: {
    featureViewId: 'mock-feature-view-id',
    isProjectPage: false,
    userIsAnonymous: false,
  }
}

interface TemplateProps extends FeatureViewDetailsProps {
  featureViewId: string,
  isProjectPage?: boolean;
}

const Template = ({ 
  isProjectPage, 
  featureViewId, 
  ...args 
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);

  const { routes, routePath } = React.useMemo(() => {
    if (isProjectPage) {
      return {
        routes: [
          projectFeatureStoreFeatureViewPath({ 
            featureViewId,
            ownerName: 'mockOwner', 
            projectName: 'mockProject', 
          })
        ],
        routePath: projectFeatureStoreFeatureViewPath(),
      }
    }

    return {
      routes: [
        globalFeatureStoreFeatureViewPath({ featureViewId }),
      ],
      routePath: globalFeatureStoreFeatureViewPath(),
    }
  }, [isProjectPage, featureViewId]);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...addFeatureViewToProject())
      .mock(...getFeatureView(1000))
      .mock(...listProjects());

    setReload(true);
  }, [args.userIsAnonymous, isProjectPage, setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);
  
  if (reload) {
    return <div/>
  }


  return (
    <MemoryRouter initialEntries={routes}>
      <Switch>
        <Route path={routePath}>
          <FeatureViewDetailsComponent {...args} />
        </Route>
      </Switch>
    </MemoryRouter>
  );
};

export const FeatureViewDetails = Template.bind({});
