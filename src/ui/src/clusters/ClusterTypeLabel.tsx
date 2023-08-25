import { ComputeClusterType } from '@domino/api/dist/types';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Tag } from 'antd';
import { ComputeClusterLabels } from '../clusters/types';
import { colors } from '../styled';

export type Props = {
  clusterType: ComputeClusterType;
};

export const ClusterTypeLabel = ({ clusterType }: Props) => (
  <Tag color={colors.secondaryBackground} style={{ cursor: 'pointer' }}>
    {ComputeClusterLabels[clusterType] || clusterType}
  </Tag>
);
