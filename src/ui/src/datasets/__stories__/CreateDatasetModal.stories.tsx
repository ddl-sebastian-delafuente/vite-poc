import {
  completeWorkflow,
  getAllOrganizations,
  getCurrentUserOrganizations,
  getCurrentUser,
  getProjectSummary,
  listUsers,
  validateStep,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import * as React from 'react'

import { getDevStoryPath } from '../../utils/storybookUtil';
import { CreateDatasetModal as CreateDatasetModalComponent, CreateDatasetModalProps } from '../CreateDatasetModal';

export default {
  title: getDevStoryPath('Develop/Data/Datasets'),
  component: CreateDatasetModalComponent,
  argTypes: {
    visible: { control: 'boolean' }
  },
  args: {
    visible: true,
    projectId: 'test-project-id',
  },
}

type TemplateProps = CreateDatasetModalProps;

const Template = (args: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...completeWorkflow(true))
      .mock(...getAllOrganizations())
      .mock(...getCurrentUserOrganizations())
      .mock(...getCurrentUser())
      .mock(...getProjectSummary())
      .mock(...listUsers())
      .mock(...validateStep(true, 1000))
  }, []);

  return <CreateDatasetModalComponent {...args} />
}

export const CreateDatasetModal = Template.bind({});
