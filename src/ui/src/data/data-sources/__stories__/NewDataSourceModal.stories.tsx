import { listDataPlanes } from '@domino/mocks/dist/mock-stories/Dataplanes';
import {
  completeWorkflow,
  getAllOrganizations,
  getAuthConfigByType,
  getCurrentUser,
  getDataSourceConfigsNew,
  getDataSourceConfigByType,
  getPrincipal,
  getProjectSummary,
  listUsers,
  validateStep,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';

import { getDevStoryPath } from '../../../utils/storybookUtil';
import { NewDataSourceModalProps, NewDataSourceModal as NewDataSourceModalComponent } from '../NewDataSourceModal';

export default {
  title: getDevStoryPath('Develop/Data/Datasource'),
  component: NewDataSourceModalComponent,
  argTypes: {
    hybridEnabled: { control: 'boolean' },
    isAdminPage: { control: 'boolean' },
    isAdminUser: { control: 'boolean' },
    onCancel: { action: 'onCancel' },
    onCreate: { action: 'onCancel' },
    passValidation: { control: 'boolean' },
    projectId: { control: 'text' },
    visible: { control: 'boolean' }
  },
  args: {
    hybridEnabled: false,
    isAdminPage: false,
    isAdminUser: false,
    passValidation: true,
    projectId: 'test-project-id',
    visible: true,
  },
}

interface TemplateProps extends NewDataSourceModalProps {
  hybridEnabled: boolean;
  isAdminUser: boolean;
  passValidation: boolean;
}

const Template = ({ 
  hybridEnabled,
  isAdminPage,
  isAdminUser, 
  onCancel, 
  passValidation,
  visible, 
  ...args 
}: TemplateProps) => {
  const [isVisible, setIsVisibile] = React.useState<boolean>(visible || false);
  const [rerender, setRerender] = React.useState<boolean>(false);
  React.useEffect(() => setIsVisibile(visible || false), [visible]);
  React.useEffect(() => {
    if (rerender) {
      setRerender(false);
    }
  }, [rerender, setRerender]);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...completeWorkflow(true))
      .mock(...getAllOrganizations())
      .mock(...getAuthConfigByType())
      .mock(...getCurrentUser())
      .mock(...getDataSourceConfigByType())
      .mock(...getDataSourceConfigsNew())
      .mock(...getPrincipal(isAdminUser, hybridEnabled ? ['ShortLived.HybridEnabled'] : []))
      .mock(...getProjectSummary())
      .mock(...listDataPlanes())
      .mock(...listUsers())
      .mock(...validateStep(passValidation, 1000))

    setRerender(true);
  }, [hybridEnabled, isAdminUser, isAdminPage, passValidation, setRerender])

  const handleOnCancel = React.useCallback(() => {
    setIsVisibile(false);
    onCancel && onCancel();
  }, [onCancel, setIsVisibile]);

  if (rerender) {
    return <></>
  }

  return (
    <Router>
      <NewDataSourceModalComponent 
        {...args}
        isAdminPage={isAdminPage}
        onCancel={handleOnCancel}
        visible={isVisible} 
      />
    </Router>
  )
}

export const  NewDataSourceModal = Template.bind({});
