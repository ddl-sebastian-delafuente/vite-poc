export const mockBudgetDefaults = [{
  budgetLabel: 'Organization',
  budgetType: 'Default',
  limit: 0,
  window: 'monthly'
}, {
  budgetLabel: 'Project',
  budgetType: 'Default',
  limit: 0,
  window: 'monthly'
}];

export const mockBudgetOverrides = [{
  budgetLabel: 'Organization',
  budgetType: 'Override',
  limit: 20,
  window: 'monthly',
  labelId: '4e2b2cd3ee1744a5b6fe62cf428c4727'
}, {
  budgetLabel: 'Project',
  budgetType: 'Override',
  limit: 10,
  window: 'monthly',
  labelId: '63eb1477fe89093adaf2e42b'
}];

export const mockAlertSettings = {
  alertsEnabled: false,
  alertTargets: [{label: 'Project', emails: []}, {label: 'Organization', emails: []}],
  notifyOrgOwner: false
};
