import { getAllConnectionSnippets } from '@domino/mocks/dist/mock-stories/Datasource'
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import { 
  CopyToClipboardDropdownProps,
  CopyToClipboardDropdown as CopyToClipboardDropdownComponent 
} from '../CopyToClipboardDropdown';

export default {
  title: getDevStoryPath('Develop/Data/Datasource/Workspace'),
  component: CopyToClipboardDropdownComponent,
  args: {
    dataSourceId: 'mock-data-source-id',
    dataSourceName: 'mock-data-source-name',
  }
}

type TemplateProps = CopyToClipboardDropdownProps;

const Template = (args: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getAllConnectionSnippets())
  }, [])

  return <CopyToClipboardDropdownComponent {...args}/>
};

export const CopyToClipboardDropdown = Template.bind({});
