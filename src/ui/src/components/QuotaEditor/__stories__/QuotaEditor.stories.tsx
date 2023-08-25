import { generateGenericQuotaOverrides } from '@domino/mocks/dist/generators/Quota';
import { deleteQuota, updateQuota } from '@domino/mocks/dist/mock-stories/Quota';
import {
  getCurrentUserOrganizations,
  getCurrentUser,
  getAllOrganizations,
  getProjectSummary,
  listUsers,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { BYTE_MULTPLIER } from '../../../utils/prettyBytes';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import { UserAndOrgQuotaTargetSelector } from '../QuotaTargetSelectors';
import {
  BaseQuota,
  QuotaEditorProps,
  QuotaEditor as QuotaEditorComponent 
} from '../';

interface TemplateProps extends QuotaEditorProps<BaseQuota> {
  initialValues: boolean;
}

const MOCK_LIST: BaseQuota[] = generateGenericQuotaOverrides(11);

export default {
  title: getDevStoryPath('Components/Quota Editor'),
  component: QuotaEditorComponent,
  argTypes: {
    list: { control: false },
    performDelete: { control: false },
    performUpdate: { control: false },
    QuotaTargetSelector: { control: false },
    recordInitializer: { control: false },
    transformAbs2Prefix: { control: false },
    transformPrefix2Abs: { control: false },
  },
  args: {
    initialValues: true,
    readOnly: false,
    recordInitializer: { targetId: '', targetName: '', limit: 0 }
  }
}

const Template = ({
  initialValues,
  ...args
}: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getAllOrganizations())
      .mock(...getCurrentUser())
      .mock(...getCurrentUserOrganizations())
      .mock(...getProjectSummary())
      .mock(...listUsers())
      .mock(...deleteQuota())
      .mock(...updateQuota());

  }, [args.readOnly]);

  const list = React.useMemo<TemplateProps['list']>(() => {
    if (!initialValues) {
      return [];
    }

    return MOCK_LIST;
  }, [initialValues]);

  const performAdd = React.useCallback(() => Promise.resolve(), [])
  const performDelete = React.useCallback(() => Promise.resolve(), [])
  const performUpdate = React.useCallback((record: BaseQuota, newLimit: number) => Promise.resolve({
    ...record,
    limit: newLimit,
  }), [])

  return (
    <QuotaEditorComponent<BaseQuota>
      {...args}
      performAdd={performAdd}
      performDelete={performDelete}
      performUpdate={performUpdate}
      list={list}
    />
  );
};

export const GenericQuotaEditor = Template.bind({});

export const QuotaEditorWithUserOrOrganizationTarget = Template.bind({});
QuotaEditorWithUserOrOrganizationTarget.args = {
  QuotaTargetSelector: UserAndOrgQuotaTargetSelector,
  units: 'GB',
  targetType: 'User',
  transformPrefix2Abs: (prefixValue: number) => prefixValue * BYTE_MULTPLIER.GB,
  transformAbs2Prefix: (absValue: number) => absValue/BYTE_MULTPLIER.GB,
}
