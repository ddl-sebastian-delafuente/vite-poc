import { 
  MockFileTypesMapping, 
  getDataset,
  getFileMetadata, 
  getFilePreview,
} from '@domino/mocks/dist/mock-stories/Datasetrw';
import { 
  MOCK_ID,
  makeSelectDropdownFromMapping,
  useReload,
} from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import * as React from 'react';

import { getDevStoryPath } from '../../../utils/storybookUtil';
import { UnionToMap } from '../../../utils/typescriptUtils';
import {
  getDatasetGlobalFileViewPathDef,
  getDatasetProjectFileViewPathDef,
} from '../../routes';
import { 
  DatasetFileViewProps,
  DatasetFileView as DatasetFileViewComponent 
} from '../DatasetFileView';

type ViewMode = 'global' | 'project';
const ViewMode: UnionToMap<ViewMode> = {
  global: 'global',
  project: 'project',
}

export default {
  title: getDevStoryPath('Develop/Data/Datasets'),
  component: DatasetFileViewComponent,
  argTypes: {
    fileType: makeSelectDropdownFromMapping(MockFileTypesMapping),
    mode: makeSelectDropdownFromMapping(ViewMode),
  },
  args: {
    fileType: 'text',
    fileURICustom: 'https://files.rcsb.org/download/4HHB.pdb',
    hasSnapshot: false,
    mode: ViewMode.global,
  }
};

interface TemplateProps extends DatasetFileViewProps {
  fileType: string;
  fileURICustom: string;
  hasSnapshot: boolean;
  mode: ViewMode;
}

const Template = ({
  fileType,
  fileURICustom, 
  hasSnapshot,
  mode,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = useReload();

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getDataset())
      .mock(...getFileMetadata(fileType, fileType === 'custom' ? {
        uri: fileURICustom,
      } : undefined))
      .mock(...getFilePreview())
      .spy('glob:https://*')

    setReload(true);
  }, [fileType, fileURICustom, hasSnapshot, mode, setReload]);

  const { routes, routePath } = React.useMemo(() => {
    if (mode === ViewMode.global) {
      return {
        routes: [
          getDatasetGlobalFileViewPathDef({
            datasetId: MOCK_ID,
            filePath: '/mock/file/path/file.txt',
            snapshotId: hasSnapshot ? MOCK_ID : undefined,
          }),
        ],
        routePath: getDatasetGlobalFileViewPathDef()
      }
    }

    return {
      routes: [
        getDatasetProjectFileViewPathDef({
          datasetId: MOCK_ID,
          datasetName: 'mock-dataset',
          filePath: '/mock/file/path/file.txt',
          ownerName: 'mock-owner',
          projectName: 'mock-project',
          snapshotId: hasSnapshot ? MOCK_ID : undefined,
        })
      ],
      routePath: getDatasetProjectFileViewPathDef(),
    }
  }, [hasSnapshot, mode]);

  if (reload) {
    return <div/>
  }

  return (
    <Router initialEntries={routes}>
      <Switch>
        <Route exact path={routePath}>
          <DatasetFileViewComponent {...args}/>
        </Route>
      </Switch>
    </Router>
  )
}

export const DatasetFileView = Template.bind({});
