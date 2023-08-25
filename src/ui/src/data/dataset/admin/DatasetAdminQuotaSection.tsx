import * as Quota from '@domino/api/dist/Quota';
import * as React from 'react';
import styled from 'styled-components';

import WaitSpinner from '../../../components/WaitSpinner';
import { initialQuota } from '../../../proxied-api/initializers';
import { useRemoteData } from '../../../utils/useRemoteData';
import {
  GlobalQuotas,
  QuotaExceptions,
  QuotaNotifications,
  StatsAndDownloadCSVProps,
  StatsAndDownloadCSV,
} from './quotas';
import { bytesToGigabytes } from './quota.utils';

import {
  Section,
  SectionHeader
} from '../../../components/QuotaStyles';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  & input.ant-input::placeholder {
    font-size: 14px;
    font-style: normal;
  }
`;

export type DatasetAdminQuotaSectionProps = StatsAndDownloadCSVProps;

export const DatasetAdminQuotaSection = ({
  storageUsage,
}: DatasetAdminQuotaSectionProps) => {
  const {
    data: globalQuota,
    refetch: globalQuotaRefetch,
    hasLoaded: globalQuotaHasLoaded,
  } = useRemoteData({
    canFetch: true,
    fetcher: () => Quota.getQuota({}),
    initialValue: initialQuota,
  });

  const emails = React.useMemo(() => {
    if (!globalQuota?.actionMetadata) {
      return undefined;
    }

    return (globalQuota.actionMetadata as { emails: { emails: string[] } }).emails.emails;
  }, [globalQuota])

  const humanizedGlobalQuota = React.useMemo(() => {
    if (!globalQuota?.limit) {
      return;
    }

    return bytesToGigabytes(globalQuota.limit);
  }, [globalQuota]);

  const handleUpdateGlobalQuota = React.useCallback(() => {
    globalQuotaRefetch();
  }, [globalQuotaRefetch]);

  return (
    <Wrapper>
      <Section>
        <StatsAndDownloadCSV storageUsage={storageUsage}/>
      </Section>
      <Section>
        <SectionHeader>Quota Notifications</SectionHeader>
        {globalQuotaHasLoaded ? (
          <QuotaNotifications
            emails={emails}
            onUpdate={handleUpdateGlobalQuota}
          />
        ) : <WaitSpinner/>}
      </Section>
      <Section>
        <SectionHeader>Default Quota</SectionHeader>
        {globalQuotaHasLoaded ? (
          <GlobalQuotas
            onUpdate={handleUpdateGlobalQuota}
            quota={humanizedGlobalQuota}
          />
        ) : <WaitSpinner/>}
      </Section>
      <Section>
        <SectionHeader>Quota Overrides</SectionHeader>
        <QuotaExceptions/>
      </Section>
    </Wrapper>
  );
}
