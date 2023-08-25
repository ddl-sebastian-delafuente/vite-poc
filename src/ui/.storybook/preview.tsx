import * as React from 'react';
import { Preview } from '@storybook/react';
import 'antd/dist/antd.css';
import '@ant-design/compatible/assets/index.css';
import { useDarkMode } from 'storybook-dark-mode';
import { DEV_LIBRARY, STANDARD_LIBRARY } from '../src/utils/storybookUtil';
import Domino30ThemeProvider from '../src/styled/Domino30ThemeProvider';
import './style.css';
import fetchMock from 'fetch-mock';
fetchMock.config.fallbackToNetwork = true;

const preview: Preview = {
  parameters: {
    darkMode: {
      stylePreview: true, // TODO, when 5.4 is ready and dark mode is still not working well. We should set it to false
      classTarget: 'body',
      darkClass: 'darkClass',
      lightClass: 'lightClass',
    },
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order:
          [
            STANDARD_LIBRARY,
            [
              'Introduction',
              'Principles',
              'Foundations',
              [
                'Color Palette',
                'Icons',
              ],
              'Action',
              [
                'Primary Button',
                'Secondary Button',
                'Multi-Action Button',
                'Item-Level Actions Button',
                'Toggle',
                'Link',
              ],
              'Message',
              [
                'Badge',
                'Tooltip',
                'Toast',
                'Confirmation',
                'Callout',
                'Tag',
              ],
              'Form',
              [
                'Select',
                [
                  'Single-select',
                  'Multi-select',
                  [
                    'Standard',
                    'Email-select',
                  ],
                  'Radio',
                  'Checkbox',
                ],
                'Date picker',
                'Input',
                [
                  'Text input',
                  'Text area'
                ]
              ],
              'Table',
              'Navigation',
              [
                'Nav Bar L1',
                'Nav Bar L2',
                'Breadcrumbs',
                'Search',
              ],
              'Content Containers',
              [
                'Modal',
                'Wizard',
                'Drawer',
                'Tabs',
                'Accordion',
                'Popover',
                'Card',
                'Carousel',
                'Pagination',
                'Tree',
                'FileViewer',
              ],
              '*'
            ],
            DEV_LIBRARY,
            [
              'Components',
              'Charts',
              'Admin',
              'Plan',
              [
                'Account',
                'API Key',
                'Git Credentials',
              ],
              'Develop',
              [
                'Data',
                'Code',
                'Files',
                'Workspaces',
                'Jobs',
                'Environment',
              ],
              'Publish',
              [
                'Model APIs',
                'Deployments',
              ],
              '*'
            ]
          ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const [semanticTokens, updateSemanticTokens] = React.useState();
      return (
        <Domino30ThemeProvider isDarkMode={useDarkMode()} semanticTokens={semanticTokens} isStorybook={true}>
          <Story {...context} updateSemanticTokens={updateSemanticTokens}/>
        </Domino30ThemeProvider>
      )
    }
  ],
};

export default preview;
