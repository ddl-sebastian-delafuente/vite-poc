import {
  getCodeSnippet
} from '@domino/mocks/dist/mock-stories/Featurestore';
import {
  featureViewDto
} from '@domino/mocks/dist/mocks';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import { CopyCodeSnippetWithState } from '../CopyCodeSnippet';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Workspace'),
  component: CopyCodeSnippetWithState,
}

const Template = () => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getCodeSnippet({}))
  }, []);

  return <CopyCodeSnippetWithState featureView={featureViewDto}/>
};

export const CopyCodeSnippet = Template.bind({});
