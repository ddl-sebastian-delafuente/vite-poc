import React from 'react'
import styled from 'styled-components'
import { colors, themeHelper } from '../styled'
import Table from '../components/Table/Table'
import moment from 'moment'

/**
 * Copied from apps/web/src/modules/experiments/util.tsx
 * since packages/ui can't import apps/web
 */
export const MLflowNoteContentKey = 'mlflow.note.content'
export const MLflowRunNameKey = 'mlflow.runName'
export const MLflowLogModelHistory = 'mlflow.log-model.history'

/**
 * Copied from apps/web/src/modules/experiments/util.tsx
 */
 export const StyledTable = styled(Table)`
 table {
   border: 0;
   background-color: ${colors.white};
   border-bottom: 1px solid ${colors.neutral300};
   th.ant-table-cell {
     border: 0;
     border-bottom: 1px solid ${colors.neutral300};
     font-size: ${themeHelper('fontSizes.small')};
     text-transform: none;
     background-color: ${colors.white};
     padding: 12px ${themeHelper('margins.small')};
     color: ${colors.mineShaft};
   }
   tr:first-child > td {
     border-top: 1px solid ${colors.neutral300};
   }
   td:not(:last-child) {
     border-right: 1px solid ${colors.neutral300};
   }
   td {
     padding: 12px ${themeHelper('margins.small')};
     color: ${colors.mineShaft};

     div {
       white-space: normal;
     }
   }
 }
 .ant-table-thead > tr > th::before {
   display: none;
 }`

/**
 * Copied from apps/web/src/modules/experiments/components/ExperimentRunDetails.tsx
 */
const NoDataText = styled.div`
  color: ${colors.mediumGrey};
`

/**
* Copied from apps/web/src/modules/experiments/components/ExperimentRunDetails.tsx
*/
export const parametersNoDatasource = [{
  key: <NoDataText>no data</NoDataText>,
  value: <NoDataText>no data</NoDataText>,
}]

/**
 * Copied from apps/web/src/modules/experiments/components/ExperimentRunDetails.tsx
 */
export const metricsNoDatasource = [{
  key: <NoDataText>no data</NoDataText>,
  value: <NoDataText>no data</NoDataText>,
  timestamp: <NoDataText>no data</NoDataText>,
}]

/**
 * Copied from apps/web/src/modules/experiments/components/ExperimentRunDetails.tsx
 */
export const parameterTableColumns = [{
  title: 'Parameter',
  dataIndex: 'key',
  key: 'parameter',
  sorter: false,
  width: 200,
}, {
  title: 'Value',
  dataIndex: 'value',
  key: 'value',
  sorter: false
}]

/**
 * Copied from apps/web/src/modules/experiments/components/ExperimentRunDetails.tsx
 */
export const metricTableColumns = [{
  title: 'Metric',
  dataIndex: 'key',
  key: 'metric',
  sorter: false,
  width: 200
}, {
  title: 'Value',
  dataIndex: 'value',
  key: 'value',
  sorter: false,
  width: 200,
  render: (value: number) => value,
}, {
  title: 'Time',
  dataIndex: 'timestamp',
  key: 'time',
  sorter: false,
  render: (time: any) => isNaN(time) ? time : moment(time).format('MMMM D, YYYY hh:mm A')
}]
