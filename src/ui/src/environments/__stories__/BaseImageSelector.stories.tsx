import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import { storiesOf } from "@storybook/react";
import { DominoEnvironmentsApiEnvironmentDetails } from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import { getDevStoryPath } from '../../utils/storybookUtil';
import WithStateFetching from '../BaseImageSelector';
import { BaseImageSelectorView as BaseImageSelector, ImageType } from '../BaseImageSelector';
import { defaultEnvironmentData, selfEnvironmentsData } from './baseImageSelectorData';

const defaultEnvironment: DominoEnvironmentsApiEnvironmentDetails = {
  id: 'DominoId-1',
  archived: false,
  name: 'defaulterenvironment',
  visibility: 'Private',
  supportedClusters: [],
  latestRevision: {
    id: 'DomilkjlkjnoId-latrev2',
    number: 2,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  },
  selectedRevision: {
    id: 'DominoIdjsdflskdfjsjjj-latrev2',
    number: 1,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  },
};

const otherEnvironment: DominoEnvironmentsApiEnvironmentDetails = {
  id: 'DominoId-2',
  archived: false,
  name: 'otherenvironment',
  visibility: 'Private',
  supportedClusters: [ComputeClusterLabels.Spark],
  latestRevision: {
    id: 'DominoId-latrev2',
    number: 2,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  },
  selectedRevision: {
    id: 'DominoIdjjjj-latrev2',
    number: 1,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  },
};

const defaultProps = {
  isDefaultEnvironment: false,
  missingValueErrorMessages: [],
  imageType: 'Environment' as ImageType,
  setImageType: () => undefined,
  setEnvironmentViewId: () => undefined,
  setEnvironmentRevisionId: () => undefined,
  setLoadingBaseEnvironments: () => undefined,
  environments: [defaultEnvironment, otherEnvironment],
  defaultEnvironment: defaultEnvironment,
  loadingBaseEnvironments: false,
  environment: otherEnvironment,
  environmentViewId: otherEnvironment.id,
  environmentRevisionId: otherEnvironment.selectedRevision!.id,
  isEditMode: false,
  disabled: false,
  standalone: false,
  isClusterImage: false,
};

const handleOnBeforeRender = () => fetchMock.restore()
    .get('/v4/environments/defaultEnvironment', defaultEnvironmentData)
    .get('/v4/environments/self', selfEnvironmentsData);

export const stories = [
  {
    title: 'basic',
    view: (
      <BaseImageSelector
        {...defaultProps}
      />
    ),
  },
  {
    title: 'with state fetching, no selected base environment revision',
    view: (
      <WithStateFetching
        isDefaultEnvironment={false}
        latestDefaultEnvironmentImage="docker.io\/dominodatalab\/base:Ubuntu18_DAD_Py3.6_R3.6_20200508"
        missingValueErrorMessages={[]}
        dockerImage={undefined}
        imageType="Environment"
        isEditMode={false}
        disabled={false}
        standalone={false}
        isClusterImage={false}
      />
    ),
  },
  {
    title: 'with state fetching, selected base environment revision',
    view: (
      <WithStateFetching
        isDefaultEnvironment={false}
        latestDefaultEnvironmentImage="docker.io\/dominodatalab\/base:Ubuntu18_DAD_Py3.6_R3.6_20200508"
        baseEnvironmentRevisionId="5f0349a2f842a52fca759c0c"
        missingValueErrorMessages={[]}
        dockerImage={undefined}
        imageType="Environment"
        isEditMode={false}
        disabled={false}
        standalone={false}
        isClusterImage={false}
      />
    ),
  },
];

const storiesOfModule = storiesOf(getDevStoryPath('Develop/Environment/Base Image Selector'), module);

stories.forEach((story) => {
  storiesOfModule.add(story.title, () => {
    handleOnBeforeRender();
    return (
      <Router>
        {story.view}
      </Router>
    );
  });
});
