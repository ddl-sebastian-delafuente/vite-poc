import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { storiesOf } from "@storybook/react";
import { getDevStoryPath } from '../../utils/storybookUtil';
import CreateEnvironment from '../CreateEnvironment';
import { resultEnvironmentCreate } from './data';

const defaultProps = {
  cancelUrl: '/cancelUrl',
  toggleVisibility: () => undefined,
  isEditMode: false,
  disabled: false,
  standalone: false,
  isClusterImage: false,
  defaultOpen: false,
  ...resultEnvironmentCreate
};

export const stories = [
  {
    title: 'basic',
    view: (
      <CreateEnvironment
        {...defaultProps}
      />
    ),
  }
];

const storiesOfModule = storiesOf(getDevStoryPath('Develop/Environment/Create Environment'), module);

stories.forEach((story) => storiesOfModule.add(story.title, () => <Router>{story.view}</Router>));
