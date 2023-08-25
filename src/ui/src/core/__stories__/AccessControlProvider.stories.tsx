import {
  DATASET_ROLE,
  getPrincipal,
  getDatasetPermissions,
  isDataAnalystUser,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import * as React from 'react'

import { EntityType } from '../../proxied-api/Auth';
import { getDevStoryPath } from '../../utils/storybookUtil';
import { AccessControlProvider, useAccessControl } from '../AccessControlProvider';
import { AccessControlResourceMapping } from '../accessControlResourceMappings';

export default {
  title: getDevStoryPath('Develop/Core/Access Controls'),
  component: AccessControlProvider,
  argTypes: {
    isAdmin: { control: { type: 'boolean' } },
    isDataAnalyst: { control: { type: 'boolean' } },
    role: {
      options: Object.keys(DATASET_ROLE),
      control: { type: 'select', labels: Object.keys(DATASET_ROLE) }
    }
  },
  args: {
    isAdmin: true,
    isDataAnalyst: false,
    role: DATASET_ROLE.editor,
  }
}

interface TemplateProps {
  isAdmin: boolean;
  isDataAnalyst: boolean;
  role: string;
}

const MockComponent = () => {
  const accessControl = useAccessControl();

  return (
    <div>
      {Object.keys(AccessControlResourceMapping).map((resourceId) => (
        <div key={resourceId}>
          {`Access to resource '${resourceId}' ${accessControl.hasAccessToResource(resourceId, { [EntityType.DatasetInstance]: 'test-instance-id' }) ? 'true' : 'false'}`}
        </div>
      ))}
    </div>
  );
}

const Template = ({ isAdmin, isDataAnalyst, role }: TemplateProps) => {
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getDatasetPermissions(role))
      .mock(...getPrincipal(isAdmin))
      .mock(...isDataAnalystUser(isDataAnalyst))
    setReload(true);
  }, [isAdmin, isDataAnalyst, role, setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    console.warn('reloading')
    return <div/>;
  }

  return <AccessControlProvider><MockComponent/></AccessControlProvider>
}

export const UsingHooks = Template.bind({});
