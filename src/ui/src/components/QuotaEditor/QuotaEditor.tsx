import * as React from 'react';
import styled from 'styled-components';

import { 
  QuotaEditorInputProps, 
  QuotaEditorInput,
} from './QuotaEditorInput';
import { BaseQuota } from './QuotaEditor.types';
import { QuotaTable, QuotaTableProps } from './QuotaTable';

const Wrapper = styled.div`

`;

export interface QuotaEditorProps<T> extends 
  Pick<QuotaTableProps<T>, 
    'emptyMessage' |
    'limitLabel' |
    'list' | 
    'performDelete' |
    'performUpdate' |
    'onChange' |
    'readOnly' | 
    'targetNameDataIndex' |
    'targetNameRenderer' |
    'targetType' |
    'overrideType' |
    'transformAbs2Prefix'
  >,
  QuotaEditorInputProps<T> {
}

export const QuotaEditor = <T extends BaseQuota>({ 
  emptyMessage,
  limitLabel,
  list = [],
  onChange,
  performAdd,
  performDelete,
  performUpdate,
  QuotaTargetSelector,
  readOnly, 
  recordInitializer,
  targetNameDataIndex,
  targetNameRenderer,
  transformAbs2Prefix = (absValue: number) => absValue,
  transformPrefix2Abs = (prefixValue: number) => prefixValue,
  targetType = 'Type',
  overrideType = 'quota',
  units = 'Unit',
}: QuotaEditorProps<T>) => {
  return (
    <Wrapper>
      {!readOnly && (
        <QuotaEditorInput<T>
          existingRecords={list}
          performAdd={performAdd}
          QuotaTargetSelector={QuotaTargetSelector}
          quotaTargetLabel={targetType}
          recordInitializer={recordInitializer}
          targetType={targetType}
          transformPrefix2Abs={transformPrefix2Abs}
          units={units}
          quotaLimitLabel={limitLabel}
        />
      )}
      <QuotaTable<T>
        emptyMessage={emptyMessage}
        limitLabel={limitLabel}
        list={list}
        performDelete={performDelete}
        performUpdate={performUpdate}
        onChange={onChange}
        readOnly={readOnly}
        targetNameDataIndex={targetNameDataIndex}
        targetNameRenderer={targetNameRenderer}
        targetType={targetType}
        overrideType={overrideType}
        transformAbs2Prefix={transformAbs2Prefix}
        transformPrefix2Abs={transformPrefix2Abs}
        units={units}
      />
    </Wrapper>
  )
}
