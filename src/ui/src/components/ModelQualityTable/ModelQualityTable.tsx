import * as React from 'react';
import Table from 'antd/lib/table';

interface ParametersTableData {
  metric: string;
  value: number;
  range: string;
}
export interface ModelQualityTableProps {
  data: ParametersTableData[];
}

function sortNumber<T>(a: T, b: T, property: string): number {
  const nameA = parseFloat(a[property]);
  const nameB = parseFloat(b[property]);

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  return 0;
}

const columns = [
  {
    key: 'metric',
    title: 'Metric',
    dataIndex: 'metric',
    width: '10rem'
  },
  {
    key: 'value',
    title: 'Value',
    dataIndex: 'value',
    width: '10rem',
    sorter: (a: ParametersTableData, b: ParametersTableData) => sortNumber<ParametersTableData>(a, b, 'value')
  },
  {
    key: 'range',
    title: 'Target Range',
    dataIndex: 'range'
  }
];

const ModelQualityTable: React.FC<ModelQualityTableProps> = ({ data }) => {
  const paginationConfig = {
    total: data?.length,
    defaultPageSize: 10
  };

  return (
    <Table<ParametersTableData>
      columns={columns}
      dataSource={data}
      pagination={paginationConfig}
      rowKey="metric"
    />
  );
};

export default ModelQualityTable;
