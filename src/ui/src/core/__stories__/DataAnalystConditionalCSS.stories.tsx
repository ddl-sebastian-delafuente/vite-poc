import fetchMock from 'fetch-mock';
import * as React from 'react';
import { getDevStoryPath } from '../../utils/storybookUtil';

import { AccessControlProvider } from '../AccessControlProvider';
import { DataAnalystConditionalCSS, DataAnalystConditionalCSSProps } from '../DataAnalystConditionalCSS';

export default {
  title: getDevStoryPath('Core/DataAnalyst Conditional CSS'),
  component: DataAnalystConditionalCSS,
  argTypes: {
    isDataAnalyst: {
      defaultValue: false,
      control: 'boolean'
    }
  },
};

interface TemplateProps extends DataAnalystConditionalCSSProps {
  isDataAnalyst: boolean;
}

const Template = ({ isDataAnalyst, ...args }: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .get('/v4/users/isDataAnalystUser', { isDataAnalyst });
  }, [isDataAnalyst])

  return (
    <AccessControlProvider>
      <DataAnalystConditionalCSS {...args}>
        <div>This is a element</div>
        <div data-deny-data-analyst={true}>This is a element that should be hidden from lite users</div>
        <div>
          This is a element
            <div data-deny-data-analyst={true}>This is a nested element that should be hidden from lite users</div>
        </div>
        <div>This is a element</div>
      </DataAnalystConditionalCSS>
    </AccessControlProvider>
  )
};

export const InteractiveExample = Template.bind({});
