import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import {
  CostBudgetV1,
  CostBudgetV1BudgetLabelEnum,
  CostBudgetV1BudgetTypeEnum,
  CostBudgetV1WindowEnum
} from '@domino/api/dist/domino-cost-client';
import { httpRequest } from '@domino/api/dist/httpRequest';
import { getAllOrganizations } from '@domino/api/dist/Organizations';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import { colors } from '@domino/ui/dist/styled';
import { useRemoteData } from '@domino/ui/dist/utils/useRemoteData';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import { costApi } from '../../costApis';
import { BaseQuota, QuotaEditor, QuotaTargetSelectorProps } from '../../components/QuotaEditor';
import ProjectAndOrgSelect, { QuotaDto } from '../../components/Select/ProjectAndOrgSelect';

const TARGET_NAME = 'Project or Org';
const OVERRIDE_TYPE = 'budget';

const OwnerNameWrapper = styled.div`
  color: ${colors.neutral500};
`;

const CustomTargetSelector = <T extends BaseQuota>(props: QuotaTargetSelectorProps<T>) => {

  const onChange = (value: string, option: any) => {
    props.onChange([{
      targetName: option.dataGroup + '.' + option.label,
      targetId: value
    }]);
  };

  return (
    // @ts-ignore
    <ProjectAndOrgSelect
      {...props}
      placeholder="Search..."
      style={{minWidth: 200}}
      onChange={onChange}
      data-test="project-org-select"
    />
  );
};

const targetNameRenderer = (value: string, record: QuotaDto) => (
  <>
    <FlexLayout itemSpacing={10} justifyContent="flex-start">
      {tooltipRenderer(
        <>
          <div>Type: {record.type}</div>
          <div>Name: {record.targetName}</div>
        </>, <div>{record.targetName}</div>)}
      {R.equals(record.type, CostBudgetV1BudgetLabelEnum.Project) &&
      <OwnerNameWrapper>Owner: {record.ownerName}</OwnerNameWrapper>}
    </FlexLayout>
  </>
);

export const BudgetOverrides = () => {
  const [budgets, setBudgets] = React.useState<QuotaDto[]>([]);
  const {data: projectList, hasLoaded: projectsLoaded} = useRemoteData({
    canFetch: true,
    fetcher: () => httpRequest('GET',
      `${window.location.origin}/admin/briefProjectInfos`,
      undefined,
      {},
      {'Csrf-Token': 'nocheck'}, // TODO update once we have a way to get CSRF tokens on the client
    ),
    initialValue: [],
    showErrorLog: true,
    showErrorToast: true,
    defaultErrorMessage: 'Cannot get project list'
  });
  const {data: orgList, hasLoaded: orgsLoaded} = useRemoteData({
    canFetch: true,
    fetcher: () => getAllOrganizations({}),
    initialValue: [],
    showErrorLog: true,
    showErrorToast: true,
    defaultErrorMessage: 'Cannot get org list'
  });

  const findTarget = React.useCallback((override: CostBudgetV1) => {
    if (override.budgetLabel === CostBudgetV1BudgetLabelEnum.Project) {
      const foundTarget = R.find(R.propEq('id', override.labelId), projectList);
      return ({
        targetName: foundTarget?.name || override.labelId,
        ownerName: foundTarget?.owner || 'Owner'
      });
    } else {
      const foundTarget = R.find(R.propEq('id', override.labelId), orgList);
      return ({
        targetName: foundTarget?.name || override.labelId,
        ownerName: foundTarget?.organizationUserId || 'Owner'
      });
    }
  }, [orgList, projectList]);

  const getCostBudgetOverrides = React.useCallback(async () => {
    try {
      const response = await costApi.v4CostBudgetsOverridesGet({});
      const data = response.data as CostBudgetV1[];
      setBudgets(data ? data.map((override: CostBudgetV1) => {
        const target = findTarget(override);
        return ({
          targetName: target.targetName,
          targetId: override.labelId || '',
          limit: override.limit || 0,
          type: override.budgetLabel,
          ownerName: target.ownerName
        });
      }) : []);
    } catch (e) {
      console.warn(e);
    }
  }, [findTarget]);

  const handlePerformAdd = async (newRecords: QuotaDto[]) => {
    await costApi.v4CostBudgetsOverridesPost({
      limit: newRecords[0].limit,
      labelId: newRecords[0].targetId,
      window: CostBudgetV1WindowEnum.Monthly,
      budgetLabel: R.head(newRecords[0].targetName?.split('.') || []) as CostBudgetV1BudgetLabelEnum,
      budgetType: CostBudgetV1BudgetTypeEnum.Override
    });
    getCostBudgetOverrides();
  };

  const handlePerformDelete = React.useCallback(async (targetId: string) => {
    await costApi.v4CostBudgetsOverridesLabelIdDelete(targetId);
    getCostBudgetOverrides();
  }, [getCostBudgetOverrides]);

  const handlePerformUpdate = React.useCallback((existingRecord: QuotaDto, newLimit: number) => {
    return costApi.v4CostBudgetsOverridesLabelIdPut(existingRecord.targetId, {
      limit: newLimit,
      labelId: existingRecord.targetId,
      window: CostBudgetV1WindowEnum.Monthly,
      budgetLabel: existingRecord.type,
      budgetType: CostBudgetV1BudgetTypeEnum.Override
    }).then(() => {
      getCostBudgetOverrides();
      return Promise.resolve({
        ...existingRecord,
        limit: newLimit,
      });
    }).catch(async (e) => {
      console.error(e);
      return Promise.reject();
    });
  }, [getCostBudgetOverrides]);

  React.useEffect(() => {
    if (projectsLoaded && orgsLoaded) {
      getCostBudgetOverrides();
    }
  }, [projectsLoaded, orgsLoaded, projectList, orgList, getCostBudgetOverrides]);

  return (
    <QuotaEditor
      QuotaTargetSelector={CustomTargetSelector}
      limitLabel="Limit"
      list={budgets}
      recordInitializer={{
        targetName: '',
        targetId: '',
        limit: 0,
        type: CostBudgetV1BudgetLabelEnum.Project,
        ownerName: 'owner'
      } as QuotaDto}
      targetType={TARGET_NAME}
      overrideType={OVERRIDE_TYPE}
      units="$k"
      performAdd={handlePerformAdd}
      performDelete={handlePerformDelete}
      performUpdate={handlePerformUpdate}
      transformAbs2Prefix={(value) => value}
      transformPrefix2Abs={(value) => value}
      targetNameRenderer={targetNameRenderer}
    />
  );
};
