import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '@domino/ui/dist/utils/storybookUtil';
import { WaitSpinner } from '../WaitSpinner';

storiesOf(getDevStoryPath('Components/WaitSpinner'), module)
  .add('no props, no children', () => (
  <WaitSpinner />
)).add('with color prop (lightblue)', () => (
  <WaitSpinner fill="lightblue" />
)).add('with children', () => (
  <WaitSpinner>
    Loading Projects
  </WaitSpinner>
)).add('with long text as children', () => (
  <WaitSpinner>
    Mothers of America
    let your kids go to the movies!
    get them out of the house so they won't know what you're up to
    it's true that fresh air is good for the body
    but what about the soul
    that grows in darkness, embossed by silvery images
    and when you grow old as grow old you must
    they won't hate you
    they won't criticize you they won't know
    they'll be in some glamorous country
    they first saw on a Saturday afternoon or playing hookey
  </WaitSpinner>
)).add('with size props (25px)', () => (
  <WaitSpinner
    height={25}
    width={25}
  />
));
