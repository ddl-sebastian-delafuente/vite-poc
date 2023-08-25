import * as React from 'react';
import { ReactElement } from 'react'
import { ColumnConfiguration } from '@domino/ui/dist/components/Table/Table'
import styled from 'styled-components';
import { themeHelper, colors } from '@domino/ui/dist/styled';
import { ModelApiItems, ModelApiSummary } from '../api';
import { stageTimeRenderer } from '../../components/renderers/tableColumns'
import FlexLayout from '../../components/Layouts/FlexLayout';
import WaitSpinner from '../../components/WaitSpinner';
import { Table } from '../../components';
import { modelsOverviewPage, createModelApiPageFromProject } from '../../core/routes';

const ModelApiLayout = styled.div`
  position: relative;
  padding-top: 10px;  
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.neutral300};
  table {
    border: none; 
  }
`;
const Header = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  line-height: 22px;
  flex-grow: 1;
`;
const EmptyState = styled(FlexLayout)`
  font-size:  ${themeHelper('fontSizes.small')};
  color: ${colors.neutral500};
  margin-top: 36px;
  padding-bottom: 60px;
`;
type ModelApisInfoProps = {
  modelApiSummary?: ModelApiSummary;
  loadingModelApis: boolean;
}

const ModelApisInfo = (props: ModelApisInfoProps) => {
  const { modelApiSummary, loadingModelApis } = props;

  return (
    <ModelApiLayout>
      <div style={{display: 'flex', padding: '0 12px'}}>
        <Header>Model APIs</Header>
        <a href={createModelApiPageFromProject(modelApiSummary?.projectId)} title={"Create a new Model API"}> 
          Create
        </a>
      </div>
      { 
        loadingModelApis ? <WaitSpinner/> : (
          modelApiSummary?.ModelApis && modelApiSummary.ModelApis.length > 0  ? (
            <Table style={{paddingTop: '20px'}}
              dataSource={modelApiSummary.ModelApis?.slice(0,3)}
              columns={getColumns()}
              showHeader={false}
              hideRowSelection={true}
              showPagination={false}
              showSearch={false}
              hideColumnFilter={true}
              isStriped={true}
            />
          ) : <EmptyState>There are no model APIs.</EmptyState>
        )
      }
    </ModelApiLayout>
  )
}
export default ModelApisInfo;

function renderName(name: string, record: ModelApiItems): ReactElement {
  return (
    <a href={modelsOverviewPage(record.modelApiId)} title={name}>
      {name}
    </a>
  )
}

function getColumns() {
  const columns: ColumnConfiguration<ModelApiItems>[] = [
    {
      title: "Model Api Name",
      dataIndex: 'modelApiName',
      key: 'modelApiName',
      render: renderName,
      align: 'left',
    },
    {
      title: "Status",
      dataIndex: 'status',
      key: 'status',
      align: 'right',
    },
    {
      title: "Last Modified",
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: stageTimeRenderer,
      align: 'right',
    },
  ]
  return columns
}
