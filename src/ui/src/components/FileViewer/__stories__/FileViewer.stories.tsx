import { 
  MockFileTypesMapping, 
  MockFileTypes,
  getFilePreview 
} from '@domino/mocks/dist/mock-stories/Datasetrw';
import { makeSelectDropdownFromMapping } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getStandardStoryPath } from '../../../utils/storybookUtil';
import {
  FileViewerProps,
  FileViewer as FileViewerComponent
} from '../FileViewer';

export default {
  title: getStandardStoryPath('Content Containers'),
  component: FileViewerComponent,
  argTypes: {
    fileType: makeSelectDropdownFromMapping(MockFileTypesMapping),
    fileExtension: { table: { disable: true }},
    metadata: { table: { disable: true }},
    mutable: { table: { disable: true }},
    projectInfo: { table: { disable: true }},
  },
  args: {
    fileType: MockFileTypesMapping.custom,
    fileURICustom: 'https://files.rcsb.org/download/4HHB.pdb',
  }
}

interface TemplateProps extends FileViewerProps {
  fileType: string;
  /**
   * Pass a custom URI to view contents. Note fileType must be set to `custom`
   */
  fileURICustom: string;
}

const Template = ({ 
  fileType = MockFileTypesMapping.custom, 
  fileURICustom, 
  ...args 
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getFilePreview())
      .spy('glob:https://*')

    setReload(true);
  }, [fileType, setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  const metadata = React.useMemo(() => {
    if (fileType !== MockFileTypesMapping.custom) {
      return MockFileTypes[fileType];
    }

    return {
      uri: fileURICustom,
    }
  }, [fileType, fileURICustom]);

  if (reload) {
    return <div/>
  }

  return (
    <FileViewerComponent {...args} metadata={metadata} />
  )
};

export const FileViewer = Template.bind({});
