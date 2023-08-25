import Papa from 'papaparse';
import * as React from 'react';
import styled from 'styled-components';

import { useRemoteData } from '../../../utils/useRemoteData';
import Table, { ColumnConfiguration } from '../../Table/Table';
import { FileViewerFileRendererProps, FileViewerModule } from '../FileViewer.types';

const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
  padding-top: 5px;
`;

const TableViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const {
    data,
  } = useRemoteData({
    canFetch: Boolean(metadata?.uri),
    fetcher: async () => {
      const response = await fetch(metadata.uri as string);
      return await response.text();
    },
    initialValue: ''
  });

  const {columns, parsedData} = React.useMemo((): { columns: ColumnConfiguration<any>[], parsedData: {}[] } => {
    if (!data) {
      return {
        columns: [],
        parsedData: [],
      };
    }

    // parse record and skip empty lines
    const records = Papa.parse(data)?.data.filter((row: string[]) => row.length > 0 && row.some(item => item !== '')) || [];

    const {columns, parsedData} = records.reduce<{ columns: ColumnConfiguration<any>[], parsedData: {}[] }>(
      (memo: { columns: ColumnConfiguration<any>[], parsedData: {}[] }, item: {}, index: number) => {
        if (index === 0) {
          memo.columns = (records[index] as string[]).map(keyName => ({
            title: keyName,
            key: keyName,
            dataIndex: keyName,
          }));
        } else {
          const obj = {key: index};
          (records[index] as string[]).forEach((value, colIdx) => {
            const columnKey = String(memo.columns[colIdx]?.dataIndex);
            if (columnKey) {
              obj[columnKey] = value;
            }
          });
          memo.parsedData.push(obj);
        }
        return memo;
      }, {
        columns: [] as ColumnConfiguration<any>[],
        parsedData: [] as {}[]
      });

    return {
      columns,
      parsedData
    };
  }, [data]);

  return (
    <Wrapper>
      <Table
        hideRowSelection
        columns={columns}
        dataSource={parsedData}
      />
    </Wrapper>
  );
}

export const TableViewer: FileViewerModule = {
  id: 'tabular-data-generic',
  Renderer: TableViewerRenderer,
  maxSupportedFilesize: 25000000, // 25MB
  supportedExtensions: ['csv', 'tsv'],
  supportedTypes: []
}
