import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import AlertSettings from '../AlertSettings';

const mock = new MockAdapter(axios);

export default {
  title: getDevStoryPath('Admin/Cost Budgets And Alerts/Alert Settings'),
  component: AlertSettings,
};

export const Default = {
  render: () => {
    mock.onGet(/\/alertsSettings/).reply(200, {
      'alertsEnabled': false,
      'alertTargets': [{'label': 'Project', 'emails': []}, {'label': 'Organization', 'emails': []}],
      'notifyOrgOwner': true
    }).onPut(/\/alertsSettings/).reply(200);
    return <AlertSettings />;
  }
};
