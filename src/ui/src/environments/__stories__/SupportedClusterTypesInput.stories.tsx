import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import { getDevStoryPath } from '../../utils/storybookUtil';
import SupportedClusterTypesInput from '../SupportedClusterTypesInput';

export const stories = [
  {
    title: 'with spark as a selected cluster type',
    view: <SupportedClusterTypesInput disabled={false} selectedClusterTypes={[ComputeClusterLabels.Spark]} />
  },
  {
    title: 'with no selected cluster types',
    view: <SupportedClusterTypesInput disabled={false} selectedClusterTypes={[]} />
  },
  {
    title: 'disabled',
    view: <SupportedClusterTypesInput selectedClusterTypes={[]} disabled={true} />
  },
  {
    title: 'rendered as a standalone component',
    view: <SupportedClusterTypesInput disabled={false} selectedClusterTypes={[]} standalone={true} />
  }
];

const storiesOfModule = storiesOf(getDevStoryPath('Develop/Environment/Supported Cluster Type Input'), module);

stories.forEach((story) => storiesOfModule.add(story.title, () => <>{story.view}</>));
