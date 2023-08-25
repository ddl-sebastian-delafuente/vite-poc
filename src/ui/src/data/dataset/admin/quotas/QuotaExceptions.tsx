import * as Quota from '@domino/api/dist/Quota';
import { 
  DominoQuotaApiQuotaDto as QuotaDto,
  DominoQuotaWebCreateQuotaOverridesRequest as CreateQuotaOverridesRequest
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import { UserAndOrgQuotaTargetSelector } from '../../../../components/QuotaEditor/QuotaTargetSelectors'
import { BaseQuota, QuotaEditor, QuotaTargetSelectorProps } from '../../../../components/QuotaEditor';
import { QuotaType } from '../../../../proxied-api/types';
import { useRemoteData } from '../../../../utils/useRemoteData';
import { bytesToGigabytes, gigabytesToBytes } from '../quota.utils';

const CustomTargetSelector = <T extends BaseQuota>(props: QuotaTargetSelectorProps<T>) => (
  <UserAndOrgQuotaTargetSelector
    {...props}
    aria-label="Select User"
    data-test="user-dropdown"
    omitOrgs
    placeholder="Search for a user"
  />
);

const OverrideHeading = styled.div`
  margin-top: 23px;
  margin-bottom: 8px;
`

const Wrapper = styled.div`
  width: 800px;
`;

export const QuotaExceptions = () => {
  const [list, setList] = React.useState<QuotaDto[]>([]);
  const {
    data: remoteList,
    refetch,
  } = useRemoteData({
    canFetch: true,
    fetcher: () => Quota.getQuotaOverrides({}),
    initialValue: []
  });

  React.useEffect(() => {
    setList(remoteList);
  }, [remoteList])

  const handlePerformAdd = React.useCallback(async (newRecords: QuotaDto[]) => {
    const body = newRecords.reduce((memo, record, index) => {
      if (index == 0) {
        memo.quotaLimit = record.limit as number;
      }

      memo.targetIds.push(record.targetId as string);
      return memo;
    }, { targetIds: [], quotaLimit: 0 } as CreateQuotaOverridesRequest);

    await Quota.createQuotaOverrides({ body });
    refetch();
  }, [refetch]);

  const handlePerformDelete = React.useCallback(async (targetId: string) => {
    await Quota.deleteQuota({ targetId });
  }, [])
  const handlePerformUpdate = React.useCallback(async (existingRecord: QuotaDto, newLimit: number) => {
    return await Quota.updateQuota({
      body: {
        targetId: existingRecord.targetId,
        quotaLimit: newLimit,
      }
    })
  }, []);

  return (
    <Wrapper>
      <OverrideHeading>Grant Quota Overrides</OverrideHeading>
      <QuotaEditor
        emptyMessage="No users added"
        QuotaTargetSelector={CustomTargetSelector}
        list={list}
        recordInitializer={{ id: '', quotaType: QuotaType.Override }}
        onChange={setList}
        performAdd={handlePerformAdd}
        performDelete={handlePerformDelete}
        performUpdate={handlePerformUpdate}
        quotaLimitLabel="Datasets & snapshot quota"
        quotaTargetLabel="Users"
        targetNameDataIndex={['targetMetadata', 'username']}
        targetType="User"
        transformAbs2Prefix={bytesToGigabytes}
        transformPrefix2Abs={gigabytesToBytes}
        units="GB"
      />
    </Wrapper>
  );
}
