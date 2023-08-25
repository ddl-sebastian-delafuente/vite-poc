import * as React from 'react';
import fetchMock from 'fetch-mock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import { CostBudgetsAndAlertsSection } from '../CostBudgetsAndAlerts';
import { getAllOrganizations, getBriefProjectInfos } from '@domino/mocks/dist/mockStories';

const mock = new MockAdapter(axios);

export default {
  title: getDevStoryPath('Develop/Admin'),
  component: CostBudgetsAndAlertsSection,
};

export const CostBudgetsAndAlerts = {
  render: () => {
    fetchMock.restore().mock(...getBriefProjectInfos()).mock(...getAllOrganizations());
    mock.onGet(/\/alertsSettings/).reply(200, {
      'alertsEnabled': false,
      'alertTargets': [{'label': 'Project', 'emails': []}, {'label': 'Organization', 'emails': []}],
      'notifyOrgOwner': true
    }).onGet(/\/defaults/).reply(200, [
      {
        'limit': 0,
        'window': 'monthly',
        'budgetLabel': 'Organization',
        'budgetType': 'Default'
      },
      {
        'limit': 20,
        'window': 'monthly',
        'budgetLabel': 'Project',
        'budgetType': 'Default'
      }
    ])
      .onGet(/\/overrides/).reply(200, []).onAny().reply(200);
    return <CostBudgetsAndAlertsSection />;
  }
};
