import { AlignType } from 'rc-table/lib/interface';
import { InfoCircleOutlined } from '@ant-design/icons';
import * as React from 'react';
import styled from 'styled-components';

import tooltipRender from '../../components/renderers/TooltipRenderer';
import { SizeStatus } from '../../proxied-api/types';
import { BYTE_MULTPLIER, prettyBytes } from '../../utils/prettyBytes';
import { UserList } from '../UserList';

const DEFAULT_TOOLTIP_TEXT = 'This is an estimate only. Contact your admin to obtain the precise cost.';

const TitleWrapper = styled.span`
  padding-right: 5px;
`

const NumericWrapper = styled.div`
  text-align: right;
`


const MoneyFormat = new Intl.NumberFormat('en-US', { 
  currency: 'USD', 
  maximumFractionDigits: 6,
  style: 'currency', 
});

export const getMonthyCostColumn = (cost: number, tooltipText: string = DEFAULT_TOOLTIP_TEXT) => ({
  align: 'right' as AlignType,
  title: (
    <>
      <TitleWrapper>Monthly Cost Estimate</TitleWrapper>
      {tooltipRender(tooltipText, <InfoCircleOutlined/>)}
    </>
  ),
  key: 'size',
  dataIndex: 'sizeInBytes',
  render: (size: number) => {
    if (size && cost) {
      const sizeInGb = size/BYTE_MULTPLIER.GB;
      return (
        <NumericWrapper>
          {MoneyFormat.format(cost * sizeInGb)}
        </NumericWrapper>
      );
    }

    return '--';
  }, 
  showSorterTooltip: false,
  width: 225
});

export const getOwnernamesColumn = () => ({
  title: 'Owners',
  key: 'owner',
  dataIndex: 'ownerUsernames',
  render: (value: string[]) => (
    <UserList users={value} />
  ),
  width: 300
})

export const getSizeColumn = () => ({
  align: 'right' as AlignType,
  title: 'Total Size',
  key: 'size',
  dataIndex: 'sizeInBytes',
  render: (value: number, record: any) => {
    if (record.sizeStatus === SizeStatus.Pending) {
      return 'Pending...';
    }
    
    return (<NumericWrapper>{value ? prettyBytes(value) : '--'}</NumericWrapper>)
  },
  width: 100
});
