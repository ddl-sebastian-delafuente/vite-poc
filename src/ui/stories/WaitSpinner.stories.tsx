import * as React from 'react';
import { storiesOf } from '@storybook/react';
import WaitSpinner from '../src/components/WaitSpinner';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const withLittleContainer = (spinner: JSX.Element) => (
  <div style={{ border: '1px solid', height: 400 }}>
    {spinner}
  </div>
);

const stories = storiesOf(getDevStoryPath('Components/WaitSpinner'), module);

stories.add('basic small, without message', () => (withLittleContainer(
  <WaitSpinner />
)));

stories.add('with long message', () => withLittleContainer((
  <WaitSpinner>
    {`Mothers of America
    let your kids go to the movies!
    get them out of the house so they won't know what you're up to
    it's true that fresh air is good for the body
    but what about the soul
    that grows in darkness, embossed by silvery images
    and when you grow old as grow old you must
    they won't hate you
    they won't criticize you they won't know
    they'll be in some glamorous country
    they first saw on a Saturday afternoon or playing hookey`}
  </WaitSpinner>
)));

stories.add('with short message', () => withLittleContainer((
  <WaitSpinner>
    You’re not a good artist, Adolf.
  </WaitSpinner>
)));

stories.add('basic, for page, without message', () => (
  <WaitSpinner forPage={true} />
));

stories.add('basic, for page, with message', () => (
  <WaitSpinner forPage={true}>
    {`Mothers of America
    let your kids go to the movies!
    get them out of the house so they won't know what you're up to
    it's true that fresh air is good for the body
    but what about the soul
    that grows in darkness, embossed by silvery images
    and when you grow old as grow old you must
    they won't hate you
    they won't criticize you they won't know
    they'll be in some glamorous country
    they first saw on a Saturday afternoon or playing hookey`}
  </WaitSpinner>
));
