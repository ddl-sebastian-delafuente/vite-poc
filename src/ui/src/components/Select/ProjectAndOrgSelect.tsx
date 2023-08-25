import * as React from 'react';
import styled from 'styled-components';
import { httpRequest } from '@domino/api/dist/httpRequest';
import { getAllOrganizations } from '@domino/api/dist/Organizations';
import { Organization } from '@domino/api/dist/types';
import { colors } from '../../styled';
import { useRemoteData } from '../../utils/useRemoteData';
import Select, { OptionProp, SelectProps } from './Select';
import { CostBudgetV1BudgetLabelEnum } from '@domino/api/dist/domino-cost-client';

const OwnerNameWrapper = styled.div`
  color: ${colors.neutral500};
`;
const StyledSelect = styled(Select)`
  &&&&.ant-select .ant-select-item.ant-select-item-group {
    background-color: ${colors.neutral300};
  }
`;

type ProjectType = {
  id: string;
  name: string;
  owner: string;
};

export type QuotaDto = {
  targetName: string, targetId: string, limit: number, type: CostBudgetV1BudgetLabelEnum, ownerName: string
};

export type ProjectAndOrgSelectProps<T> = SelectProps & {
  existingRecords?: T[];
}

const ProjectAndOrgSelect = (props: ProjectAndOrgSelectProps<QuotaDto>) => {
  const [value, setValue] = React.useState();
  const {data: projectList} = useRemoteData({
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
  const {data: orgList} = useRemoteData({
    canFetch: true,
    fetcher: () => getAllOrganizations({}),
    initialValue: [],
    showErrorLog: true,
    showErrorToast: true,
    defaultErrorMessage: 'Cannot get org list'
  });

  const options = React.useMemo(() => {
    const [ omitOrgList, omitProjectList ] =
      (props.existingRecords ?? []).reduce((list: string[][], override: QuotaDto) => {
        if (override.type === CostBudgetV1BudgetLabelEnum.Project) {
          list[1].push(override.targetId);
        } else {
          list[0].push(override.targetId);
        }
        return list;
      }, [[], []]);
    const projects = projectList.filter((project: ProjectType) => !omitProjectList.includes(project.id)).reduce(
      (list: OptionProp[], project: ProjectType) => [...list, {
        label: (
          <>
            <div>{project.name}</div>
            <OwnerNameWrapper>Owner: {project.owner}</OwnerNameWrapper>
          </>
        ),
        value: project.id,
        dataName: project.name + project.owner,
        dataGroup: 'Project'
      }], []);

    const orgs = orgList.filter((org: Organization) => !omitOrgList.includes(org.id)).reduce(
      (list: OptionProp[], org: Organization) => [...list, {
        label: org.name,
        value: org.id,
        dataName: org.name,
        dataGroup: 'Organization'
      }], []);

    return ([
      {
        label: 'Project',
        options: projects
      },
      {
        label: 'Org',
        options: orgs,
      },
    ]);
  }, [projectList, orgList, props.existingRecords]);

  return (
    <StyledSelect
      useOptionsAsProp
      showSearch
      value={value}
      options={options}
      onSelect={(value) => setValue(value)}
      optionFilterProp="dataName"
      {...props}
    />
  );
};

export default ProjectAndOrgSelect;
