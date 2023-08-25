import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';

import AddDataSourceButton, { AddDataSourceButtonProps } from '../../../../src/data/data-sources/add-existing-data-source/AddDataSourceButton';
import { getDevStoryPath } from '../../../../src/utils/storybookUtil';
import { addDataSourceButton } from '../CommonMocks';

export default {
  title: getDevStoryPath('Develop/Data/Datasource/Add Existing Datasource'),
  component: AddDataSourceButton,
  argTypes: {
    disabled: {
      control: 'boolean',
      defaultValue: false
    },
    navigateToDetailPageOnDatasourceCreation: {
      control: 'boolean',
      defaultValue: false
    },
    onAddDataSource: {
      control: false,
    },
    projectId: {
      control: false,
    },
    userId: {
      control: false,
    },
    visibleCredentialUsername: {
      control: 'text',
      defaultValue: 'TEST_USER'
    },
  },
  decorators: [
    (Story: any) => (
      <MemoryRouter>
        <Story/>
      </MemoryRouter>
    )
  ]
};

type TemplateProps = {
  visibleCredentialUsername: string,
} & AddDataSourceButtonProps;

const AddDataSourceButtonTemplate = ({ visibleCredentialUsername, ...args }: TemplateProps) => {
  addDataSourceButton({ visibleCredentialUsername });

  const props = {
    ...args,
    projectId: 'test-project-id',
    userId: 'test-user-id',
  }

  return (
    <AddDataSourceButton {...props} />
  );
}

export const AddDataSourceButtonExample  = AddDataSourceButtonTemplate.bind({});
