import { getDatasetStorageUsage } from '@domino/api/dist/Datasetrw'
import * as React from 'react';

import Link from '../../components/Link/Link';
import { useRemoteData } from '../../utils/useRemoteData';
import { StyledWarningBox } from '../commonStyles';

export interface OverQuotaWarningBannerProps {
  /**
   * User ID of the current logged in user
   */
  userId: string;
}

export const OverQuotaWarningBanner = ({ userId }: OverQuotaWarningBannerProps) => {
  const {
    data,
  } = useRemoteData({
    canFetch: true,
    fetcher: () => getDatasetStorageUsage({ userIds: [userId] }),
    initialValue: [],
  });

  const [usage] = data;

  if (!usage || !usage.isAtWarningThreshold) {
    return null;
  }

  return (
    <StyledWarningBox>
      The allowed storage quota across all Datasets that you own in one or more projects is almost reached. Check <Link href="/notifications">notifications</Link> for more details.
    </StyledWarningBox>
  );
}
