import * as React from 'react';
import fetchMock from 'fetch-mock';
import { SelectProps } from '../Select';
import { getAllOrganizations, getBriefProjectInfos } from '@domino/mocks/dist/mockStories';
import { getDevStoryPath, getDisabledObj } from '../../../utils/storybookUtil';
import { default as ProjectAndOrgSelectComponent } from '../ProjectAndOrgSelect';

export default {
  title: getDevStoryPath('Components/ProjectAndOrgSelect'),
  component: ProjectAndOrgSelectComponent,
  argTypes: getDisabledObj([
    'closeAfterSelect',
    'closeAfterDeselect',
    'containerId',
    'options',
    'ref',
    'size',
    'useOptionsAsProp'
  ]),
};

export const ProjectAndOrgSelect = {
  render: (args: SelectProps) => {
    fetchMock.restore().mock(...getBriefProjectInfos()).mock(...getAllOrganizations());
    return <ProjectAndOrgSelectComponent {...args}/>;
  },
  args: {
    style: {width: 200}
  }
};
