import * as React from 'react';
import Table from 'antd/lib/table';
import { WarningFilled } from '@ant-design/icons';
import FeatureCard from './FeatureCard';
import TrainingHistoryChart, { DataProps as HistoryChartProps } from './TrainingHistoryChart';
import DriftTrendChart, { DataProps as TrendChartProps } from './DriftTrendChart';
import DriftCard from './DriftCard';
import { cabaret } from '../../styled/colors';
import styled from 'styled-components';

const IconContainer = styled.div`
  height: 3.6rem;
`;

interface FeatureType {
  name: string;
  category?: string;
  range: number;
  type?: string;
}
interface TrendTypeProp {
  threshold: {
    lessThan?: number;
    greaterThan?: number;
  };
  trendsData: number[];
}

interface DriftType {
  withinRange: boolean;
  value: number;
}

interface TrainingDataType {
  type: string;
  value: number[];
}

interface ParametersTableData {
  isFail?: boolean;
  feature: FeatureType;
  drift: DriftType;
  range: string;
  training: TrainingDataType;
  prediction: TrainingDataType;
  trend: TrendTypeProp;
}
export interface DataDriftTableProps {
  data: ParametersTableData[];
}

const columns = [
  {
    key: 'isFail',
    title: '',
    dataIndex: 'isFail',
    width: '3rem',
    render: (isFail: boolean) =>
      isFail ? (
        <IconContainer>
          <WarningFilled style={{ fontSize: '13px', color: cabaret }} />
        </IconContainer>
      ) : (
        ''
      )
  },
  {
    key: 'feature',
    title: 'Feature',
    dataIndex: 'feature',
    width: '10rem',
    render: (feature: FeatureType) => <FeatureCard feature={feature} />
  },
  {
    key: 'drift',
    title: 'Drift',
    dataIndex: 'drift',
    width: '8rem',
    render: (drift: DriftType) => <DriftCard drift={drift} />,
    sorter: (a: ParametersTableData, b: ParametersTableData) => {
      if (a.drift.value === b.drift.value) {
        return 0;
      }
      if (a.drift.value > b.drift.value) {
        return 1;
      }
      return -1;
    }
  },
  {
    key: 'range',
    title: 'Target Range',
    dataIndex: 'range',
    width: '10rem'
  },
  {
    key: 'training',
    title: 'Training Data',
    dataIndex: 'training',
    width: '10rem',
    render: (training: HistoryChartProps) => <TrainingHistoryChart trainingData={training} />
  },
  {
    key: 'prediction',
    title: 'Prediction Data',
    dataIndex: 'prediction',
    width: '10rem',
    render: (prediction: HistoryChartProps) => <TrainingHistoryChart trainingData={prediction} />
  },
  {
    key: 'trend',
    title: 'Drift Trend',
    dataIndex: 'trend',
    width: '10rem',
    render: (trend: TrendChartProps) => <DriftTrendChart trainingData={trend} />
  }
];

const DataDriftTable: React.FC<DataDriftTableProps> = ({ data }) => {
  const paginationConfig = {
    total: data?.length,
    defaultPageSize: 10
  };

  return (
    <Table<ParametersTableData>
      columns={columns}
      dataSource={data}
      pagination={paginationConfig}
      rowKey="drift"
    />
  );
};

export default DataDriftTable;
