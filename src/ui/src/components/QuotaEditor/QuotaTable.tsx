import { 
  DeleteOutlined, 
  EditOutlined 
} from '@ant-design/icons';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import { SearchableList } from '../../data/SearchableList';
import { themeHelper } from '../../styled/themeUtils';
import { usePagination } from '../pagination/usePagination';
import { CompactTable } from '../Table/CompactTable';
import { TableProps, TableState } from '../Table/Table';
import { ColumnConfiguration } from '../Table/Table';
import {
  error as errorToast,
  success as successToast,
} from '../toastr';
import { 
  BaseQuota,
  TransformAbs2Prefix,
  TransformPrefix2Abs,
} from './QuotaEditor.types';
import { QuotaExceptionModalProps, QuotaExceptionModal } from './QuotaExceptionModal';

interface LimitColumnProps<T> extends 
  Pick<QuotaExceptionModalProps<T>, 'targetType' | 'units'> {
  canShowEditButton?: boolean;
  onEdit?: (record: T) => void;
  quotaRecord: T,
  readOnly?: boolean;

  /**
   * Optional method that converts a abs value to one that has a unit prefix value.
   * This is useful if unit has different SI prefixes like bytes
   * If not defined will just pass through the value
   */
  transformAbs2Prefix: TransformAbs2Prefix;
}

interface SortProps {
  direction?: 'asc' | 'desc';
  key?: string | number;
}

export interface QuotaTableProps<T> extends
  Pick<QuotaExceptionModalProps<T>, 'performUpdate' | 'targetType' | 'overrideType' | 'units'>,
  Pick<TableProps<T>, 'emptyMessage'>,
  Pick<LimitColumnProps<T>, 'transformAbs2Prefix'> {
  limitLabel?: string,
  list: T[],
  onChange?: (newList: T[]) => void;
  
  /**
   * Callback used to handle persisting with a API
   */
  performDelete: (targetId: string) => Promise<void>;

  /**
   * If set to true disables and edit and delete controls
   */
  readOnly?: boolean;

  /**
   * Optional defines a custom data index for `targetName`
   *
   * Defaults: `targetName`
   */
  targetNameDataIndex?: string | string[];

  /**
   * Optional property to define a customer renderer for the table
   */
  targetNameRenderer?: (name: string, record: T, index: number) => JSX.Element | string;

  transformPrefix2Abs: TransformPrefix2Abs;
}

const LimitColumnText = styled.span<{ canShowEditButton?: boolean }>`
  padding-right: ${props => !props.canShowEditButton ? '21px' : themeHelper('paddings.tiny')}
`;

const LimitColumnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TableWrapper = styled.div`
  margin-bottom: ${themeHelper('margins.small')}
`

const LimitColumn = <T extends BaseQuota>({
  canShowEditButton,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onEdit = () => {},
  quotaRecord,
  transformAbs2Prefix,
}: LimitColumnProps<T>) => {
  const handleEditQuota = React.useCallback(() => onEdit(quotaRecord), [onEdit, quotaRecord])

  return (
    <LimitColumnWrapper>
      <LimitColumnText canShowEditButton={canShowEditButton}>{quotaRecord.limit ? transformAbs2Prefix(quotaRecord.limit) : '--'}</LimitColumnText>
      { canShowEditButton && (
        <EditOutlined
          aria-label="Edit Override"
          role="button"
          tabIndex={0}
          onClick={handleEditQuota}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
          }}
        />
      )}
    </LimitColumnWrapper>
  )
}

export const QuotaTable = <T extends BaseQuota>({
  emptyMessage,
  list,
  performDelete,
  performUpdate,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = () => {},
  readOnly,
  targetNameDataIndex = 'targetName',
  targetNameRenderer,
  targetType,
  overrideType = 'quota',
  transformAbs2Prefix,
  transformPrefix2Abs,
  units,
  ...props
}: QuotaTableProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortProps, setSortProps] = React.useState<SortProps>({});
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const [selectedQuotaRecord, setSelectedQuotaRecord] = React.useState<T | null>(null);

  const limitLabel = React.useMemo(() => {
    if (props.limitLabel) {
      return `${props.limitLabel} (${units})`;
    }

    return `Quota Per ${targetType} (${units})`;
  } , [props.limitLabel, targetType, units])

  const handleEditQuotaRecord = React.useCallback((record: T) => {
    setSelectedQuotaRecord(record);
  }, [setSelectedQuotaRecord]);

  const handleCloseQuotaExceptionModal = React.useCallback(() => setSelectedQuotaRecord(null), [setSelectedQuotaRecord]);
  const handleUpdateQuota = React.useCallback((updatedQuota: T) => {
    const updatedList = list.reduce((memo, record) => {
      memo.push(record.targetId !== updatedQuota.targetId ? record : updatedQuota);

      return memo;
    }, [] as T[]);

    onChange(updatedList);
    handleCloseQuotaExceptionModal();
  }, [
    handleCloseQuotaExceptionModal,
    list,
    onChange,
  ])

  const handleRowEvents = React.useCallback((record: T, rowIndex: number) => {
    return {
      onMouseEnter: () => setHoverIndex(rowIndex),
      onMouseLeave: () => setHoverIndex(null),
    }
  }, [setHoverIndex]);

  const handleSearch = React.useCallback((query: string) => setSearchTerm(query), [setSearchTerm]);

  const makeDeleteHandler = React.useCallback((targetId: T['targetId']) => {
    return async () => {
      if (!targetId) {
        return;
      }

      try {
        await performDelete(targetId as string);
        const newList = list.filter((record) => record.targetId !== targetId);
        onChange(newList);
        successToast(`Deleted ${overrideType} override`);

      } catch (e) {
        errorToast(`Failed to delete ${overrideType} override`);
      }
    }
  }, [list, performDelete, onChange, overrideType]);

  const columns = React.useMemo(() => {
    const baseColumns: ColumnConfiguration<T>[] = [
      {
        dataIndex: targetNameDataIndex,
        title: targetType,
        render: targetNameRenderer,
      },
      {
        dataIndex: 'limit',
        title: limitLabel,
        width: 200,
        render: (value: number, record, index) => (
          <LimitColumn<T>
            canShowEditButton={index === hoverIndex}
            onEdit={handleEditQuotaRecord}
            quotaRecord={record} 
            readOnly={readOnly}
            targetType={targetType}
            transformAbs2Prefix={transformAbs2Prefix}
          />
        )
      },
    ];

    if (readOnly) {
      return baseColumns;
    }

    return baseColumns.concat([
      {
        sorter: false,
        title: '',
        render: (record: T) => (
          <DeleteOutlined
            aria-label="Delete Override"
            role="button"
            tabIndex={0}
            onClick={makeDeleteHandler(record.targetId)}
            style={{
              color: 'red',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          />
        ),
        width: 24,
      },
    ]);
  }, [
    handleEditQuotaRecord,
    hoverIndex, 
    limitLabel,
    makeDeleteHandler, 
    readOnly,
    targetNameDataIndex,
    targetNameRenderer,
    targetType,
    transformAbs2Prefix,
  ]);

  const sortedList = React.useMemo(() => {
    const { direction, key } = sortProps;

    if (!direction || !key) {
      return list
    }

    return list.sort((a, b) => {
      const aValue = direction === 'asc' ? a[key] : b[key];
      const bValue = direction === 'asc' ? b[key] : a[key];

      if (typeof aValue === 'string' || typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' || typeof bValue === 'number') {
        return (aValue || 0) - (bValue || 0);
      }

      return 0;
    });
  }, [list, sortProps]);

  const filteredList = React.useMemo(() => {
    if (!searchTerm) {
      return sortedList;
    }

    const searchRegex = new RegExp(searchTerm, 'gi');
    const targetNamePath = Array.isArray(targetNameDataIndex) ? targetNameDataIndex : [targetNameDataIndex];
    return sortedList.filter((item) => {
      const targetName = R.path(targetNamePath, item);
      return targetName && searchRegex.test(targetName as string);
    });

  }, [sortedList, searchTerm, targetNameDataIndex]);
  
  const pager = usePagination({
    data: filteredList,
  });

  const pagedList = React.useMemo(() => {
    const [begin, end] = pager.range;
    return filteredList.slice(begin - 1, end);
  }, [filteredList, pager.range]);

  const handleTableChanges = React.useCallback((state: TableState<any>) => {
    const {
      sortDirection: newDirection,
      sortKey: newKey,
    } = state;

    const { direction, key } = sortProps;

    if (!newKey || !newDirection) {
      return setSortProps({});
    }

    if (direction !== newDirection || key !== newKey) {
      setSortProps({
        direction: newDirection || 'asc',
        key: newKey,
      })
    }
  }, [sortProps, setSortProps]);

  return (
    <>
      <SearchableList
        alwaysPaginate
        searchable
        current={pager.current}
        maxPage={pager.maxPage}
        pageSize={pager.pageSize}
        onPageChange={pager.goToPage}
        onPageSizeChange={pager.updatePageSize}
        onSearch={handleSearch}
        range={pager.range}
        searchTerm={searchTerm}
        total={pager.total}
      >
        <TableWrapper>
          <CompactTable
            columns={columns}
            emptyMessage={emptyMessage}
            dataSource={pagedList}
            hideColumnFilter
            hideRowSelection
            onChange={handleTableChanges}
            onRow={handleRowEvents}
            showPagination={false}
            showSearch={false}
          />
        </TableWrapper>
      </SearchableList>
      <QuotaExceptionModal
        onClose={handleCloseQuotaExceptionModal}
        onUpdate={handleUpdateQuota}
        performUpdate={performUpdate}
        quotaRecord={selectedQuotaRecord}
        targetType={targetType}
        overrideType={overrideType}
        targetNameDataIndex={targetNameDataIndex}
        transformAbs2Prefix={transformAbs2Prefix}
        transformPrefix2Abs={transformPrefix2Abs}
        units={units}
        visible={Boolean(selectedQuotaRecord)}
      />
    </>
  );

}
