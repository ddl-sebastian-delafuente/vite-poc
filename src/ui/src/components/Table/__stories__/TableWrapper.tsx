import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import Link from '../../Link/Link';
import Select from '../../Select/Select';
import Tag from '../../Tag/Tag';
import FlexLayout from '../../Layouts/FlexLayout';
import Table, { TableProps, TextContainer } from '../Table';
import {
  defaultActions,
  ItemLevelActionsButtonWrapper
} from '../../ActionDropdown/__stories__/ItemLevelActionsButtonWrapper';

const Wrapper = styled.div`
  .ant-table-row-indent + .ant-table-row-expand-icon {
    float: left;
    margin-top: 2px;
  }
`;

const ROW_COUNT = 6;
enum Columns {
  Text,
  Tag,
  Link,
  Select,
  NumberValue,
  Action,
}

type ColumnType = {
  title?: string | React.ReactNode;
  key: string;
  dataIndex: string;
  sorter?: ((a: {}, b: {}) => number) | boolean;
  hideFilter?: boolean;
  fixed?: string;
  width: string | number,
  align?: string;
}

const getDataSource = (columns: ColumnType[], rowCount: number, parentRowId?: number) =>
  Array(rowCount).fill(1).map((_, rowIndex) => columns.reduce((obj, value, columnIndex)  => {
  const rowId = parentRowId === undefined ? `${rowIndex}` : `${parentRowId}.${rowIndex}`;
  switch (columnIndex) {
    case Columns.Link:
      obj[value.key] = ({
        text: `Action row ${rowId} col ${columnIndex}`,
        link: 'https://www.dominodatalab.com/',
      });
      break;
    case Columns.Tag:
    case Columns.Select:
    case Columns.NumberValue:
      obj[value.key] = rowIndex;
      break;
    default: // text
      obj[value.key] = `Table cell text row ${rowId} col ${columnIndex}`;
  }
  return obj;
}, {}));

export const getData = (rowCount: number) => {
  const columns = Array(Object.keys(Columns).filter((key) => isNaN(Number(key))).length).fill(1).map((_, index) => {
    switch (index) {
      case Columns.Link:
        return ({
          title: `Table Header ${index}`,
          key: `column${index}`,
          dataIndex: `column${index}`,
          // @ts-ignore
          sorter: (a: { [`column${index}`]: { text: string }}, b: { [`column${index}`]: { text: string } }) =>
            a[`column${index}`].text.localeCompare(b[`column${index}`].text),
          fixed: '',
          width: 'auto',
        });

      case Columns.Action:
        return ({
          key: `column${index}`,
          dataIndex: `column${index}`,
          sorter: false,
          hideFilter: true,
          fixed: '',
          width: 50,
        });

      case Columns.NumberValue:
        return ({
          title: `Table Header ${index}`,
          key: `column${index}`,
          dataIndex: `column${index}`,
          fixed: '',
          align: 'right',
          width: 140,
        });

      default: // text, tag, select
        return ({
          title: `Table Header ${index}`,
          key: `column${index}`,
          dataIndex: `column${index}`,
          sorter: index === Columns.Text,
          fixed: '',
          width: index === Columns.Select ? 130 : 'auto',
        });
    }
  });

  const dataSource = getDataSource(columns, rowCount) as {children?: any}[];
  dataSource[0].children = getDataSource(columns, 3, 0);
  return {columns, dataSource};
}

export const {columns, dataSource} = getData(ROW_COUNT);

interface TableWrapperProps extends TableProps<any> {
  scrollX?: number;
  showNestedData?: boolean;
}

/**
 * This component is a wrapper of Table. This is not a component for anyone to use. It is a hack for storybook controls
 * to separate the JSON structure with renderers. Otherwise, dynamically configuring the data structure will get renderers lost.
 * @param columns
 * @param dataSource
 * @param scrollX
 * @constructor
 */
export const TableWrapper: React.FC<TableWrapperProps> = (
  {
    columns,
    dataSource,
    scrollX,
    showNestedData,
  }
) => {
  const columnsWithRenderers = [...columns];
  columnsWithRenderers[Columns.Link].render =
    ({text, link}: { text: string, link: string }) => <Link href={link} openInNewTab>{text}</Link>;
  columnsWithRenderers[Columns.Tag].render =
    (rowIndex) => (
      <FlexLayout justifyContent="flex-start" flexWrap={"nowrap"}>
        {Array(Math.min(rowIndex + 1, 3)).fill(1).map((_, index) => <Tag key={index}>tag {index}</Tag>)}
        {rowIndex > 2 ? <TextContainer>{`\uFF0B${rowIndex - 2}`}</TextContainer> : null}
      </FlexLayout>
    )
  columnsWithRenderers[Columns.Select].render =
    (rowIndex) => (
      <Select placeholder="Select" size="small" containerId="table-container">
        <Select.Option>
          Select {rowIndex}
        </Select.Option>,
      </Select>
    )
  columnsWithRenderers[Columns.NumberValue].render = (rowIndex) => rowIndex * 100000 + 0.01;
  columnsWithRenderers[Columns.Action].render =
    () => <ItemLevelActionsButtonWrapper actions={defaultActions.actions}/>;
  let finalData;
  if (showNestedData) {
    finalData = dataSource;
  } else {
    finalData = R.clone(dataSource) as {children?: any}[];
    delete finalData[0].children;
  }
  return (
    <Wrapper id="table-container">
      <Table
        columns={columnsWithRenderers}
        alwaysShowColumns={['column0']}
        dataSource={finalData}
        scroll={{x: scrollX}}
      />
    </Wrapper>
  );
};
