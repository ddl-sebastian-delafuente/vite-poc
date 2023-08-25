import * as React from 'react';
import { storiesOf } from '@storybook/react';
import DominoTheme from '../styled/Domino30ThemeProvider';

/**
 * This utility can be used to automatically generate stories, which are automatically wrapped in the domino theme
 * provider, it also reduces the amount of boilerplate needed in order to write stories and automatically
 * nests the stories according to where they are defined in the actual file tree.
 *
 * usage:
 *
 * ./storybook/config.js...
 *
 * function loadStories() {
 *   generateStories(require.context('../src', true, /\.stories\.tsx$/));
 * }
 * configure(loadStories, module);
 *
 * ...
 * Write stories in __stories__ directories which are in the same part of the file tree as the component
 * which the story is for
 *
 * Always suffix storybooks with '.stories.tsx'
 *
 * Define a non-default export called 'stories', which is of type Story[]
 * ...
 *
 * storybookExample.stories.tsx...
 *
 * export const stories = [{ title: 'story1', view: <div>hello</div> }];
 *
 */

export type Story = {
  title: string;
  view: JSX.Element;
  onBeforeRender?: () => void;
};

const subDirMatcher = /__stories__/;
const extensionMatcher = /\.stories\.(tsx|js)$/;

const renderStorybook = (storybookName: string, stories: Story[]): void => {
  const storybook = storiesOf(storybookName, module);

  stories.forEach(({ onBeforeRender, title, view }: Story) => {
    storybook.add(title, () => {
      if (onBeforeRender) {
        onBeforeRender();
      }
      return (
        <DominoTheme>
          {view}
        </DominoTheme>
      );
    });
  });
};

const processStorybookExports = (req: any) => (filename: string) => {
  const { stories } = req(filename);
  const storybookName = 'Legacy/'+filename.slice(1).replace(subDirMatcher, '').replace(extensionMatcher, '');
  renderStorybook(storybookName, stories);
};

export const generateStories = (req: any) => req.keys().forEach(processStorybookExports(req));
