import { StorybookConfig } from '@storybook/react-webpack5';

const standardComponentLibrary = [
  'DatePicker',
  'Introduction',
  'Modal',
  'Principles',
  'Tooltip',
];
const standardLibrary = [
  'Accordion',
  'ActionDropdown',
  'Badge',
  'Breadcrumbs',
  'Button',
  'Card',
  'Callout',
  'Checkbox',
  'Drawer',
  'EmailSelection',
  'FileViewer',
  'Link',
  'Modals',
  'NavTabs',
  'Popover',
  'Radio',
  'Search',
  'Table',
  'Tag',
  'TextArea',
  'TextInput',
  'Toast',
  'Tree',
  'Toggle',
  'Wizard',
  'pagination',
];

const stories = process.env.ALL ? [
  '../src/**/__stories__/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  '../**/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'
] : standardComponentLibrary.map(story => `../src/components/__stories__/${story}.stories.@(js|jsx|ts|tsx|mdx)`)
  .concat(standardLibrary.map(story => `../src/components/${story}/__stories__/*.stories.@(js|jsx|ts|tsx|mdx)`))
  .concat([
    '../src/components/Select/__stories__/SingleSelect.stories.mdx',
    '../src/components/Select/__stories__/MultiSelect.stories.mdx',
    '../src/navbar/__stories__/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/icons/__stories__/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/styled/__stories__/*.stories.@(js|jsx|ts|tsx|mdx)',
  ]);

const config: StorybookConfig = {
  stories,
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode'
  ],
  webpackFinal: async (config) => {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      stream: require.resolve('stream-browserify'),
    });
    config.resolve.fallback = fallback;
    return ({
      ...config,
      devtool: 'eval-source-map'
    });
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {fastRefresh: true},
  },
  docs: {
    autodocs: true
  },
  features: {
    storyStoreV7: false
  },
  staticDirs: ['../../../public'],
};

export default config;
