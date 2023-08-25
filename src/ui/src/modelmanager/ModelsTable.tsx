import React, { useState } from 'react'
import Table from '@domino/ui/dist/components/Table/Table'
import type { TableState } from '@domino/ui/dist/components/Table/Table'
import Input from '@domino/ui/dist/components/TextInput/Input'
import { ColumnKeys, getColumns, ModelAccess, ModelWithAccessAndMonitoringData as ModelWithMonitoringData } from './modelsTableColumns'
import { DEFAULT_PAGE_SIZE, GetModelsQueryArgs, SortField, useGetDataplanes, useGetModelMonitoringSummary, useGetModels } from './modelsTableHooks'
import useStore from '../globalStore/useStore'
import { getAppName } from '../utils/whiteLabelUtil'

type State = Pick<GetModelsQueryArgs, 'pageNumber' | 'pageSize' | 'searchPattern' | 'sortBy' | 'sortDirection' | 'registeredModelName'>

type Props = {
  modelMonitoringEnabled?: boolean;
  asyncModelsEnabled?: boolean;
  dataPlanesEnabled?: boolean;
  projectId?: string;
  environmentId?: string;
  registeredModelName?: string;
  registeredModelVersion?: number;  
}
const ModelsTable: React.FC<Props> = ({ projectId, environmentId, asyncModelsEnabled, dataPlanesEnabled, modelMonitoringEnabled, registeredModelName }: Props) => {
  const { whiteLabelSettings } = useStore();
  const [pageAndSearchVariables, setPageAndSearchVariables] = useState<State>({pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE})

  // monitoring columns are hidden in "view by environment"
  const showMonitoring = !environmentId

  const showDataPlane = dataPlanesEnabled && !environmentId

  const { searchPattern, pageNumber, pageSize, sortBy, sortDirection } = pageAndSearchVariables
  const getModelsQueryArgs: GetModelsQueryArgs = {
    pageNumber,
    pageSize,
    projectId,
    environmentId,
    sortBy,
    sortDirection,
    searchPattern,
    registeredModelName,
  }

  const { isLoading: isModelsLoading, error: modelLoadError, data: modelData } = useGetModels(getModelsQueryArgs)

  const modelVersionIds = (modelData?.models || []).filter(m => Boolean(m.activeModelVersionId)).map(m => m.activeModelVersionId!)

  const { isLoading: isDataplanesLoading,  data: dataplanes } = useGetDataplanes(!!showDataPlane)

  // this useQuery hook MUST be defined before any `return` statements below that check for model loading status / emptines
  // a component should not use a hook in one render then not use it in another (by returning early)
  // the `isEnabled` property on this query will conditionally prevent it from firing an http request
  const { isLoading: isMonitoringDataLoading, data: monitoringData } = useGetModelMonitoringSummary({
    modelVersionIds,
    isEnabled: Boolean(modelMonitoringEnabled) && showMonitoring && !isModelsLoading && typeof modelData !== 'undefined' && modelData.currentItemCount > 0,
  })

  if (modelLoadError) return <p>An error occurred loading models: {modelLoadError.name}</p>
  if (isDataplanesLoading || isModelsLoading || !modelData) return (<div>Loading models data...</div>)

  const modelsWithMonitoringData: ModelWithMonitoringData[] = modelData?.models.map(model => {
    const permissions = modelData.modelAccess[model.id] as ModelAccess
    return {
      ...model,
      dataplane: dataplanes?.find(dp => dp.id == model.activeVersionDataPlaneId),
      access: permissions,
      monitoringData: {
        isLoading: isMonitoringDataLoading,
        data: monitoringData?.find(mv => mv.workbenchModelVersionId === model.activeModelVersionId)
      }
    }
  })

  /*
    * Design for the Model APIs page calls for a large search box left of the page size selector
    * Providing this toolbar as a 'CustomUtilityBar' to the <Table> component achieves that
  */
  const SearchBar: React.FC = () => (
    <div style={{marginBottom: 16, flex: 1}}>
      <div style={{width: 400}}>
        <Input.Search
          defaultValue={searchPattern}
          placeholder="Search by model name"
          data-test="table-search-input"
          onSearch={handleSearch}
          allowClear
        />
      </div>
    </div>
  )

  return (
    /* @ts-ignore a JSX warning about the table having an invalid class  */
    <Table
      dataSource={modelsWithMonitoringData}
      columns={getColumns({
        modelMonitoringEnabled,
        asyncModelsEnabled,
        showActions: Boolean(projectId),
        showStatus: Boolean(environmentId),
        showProject: !projectId,
        showMonitoring,
        showDataPlane,
        appName: getAppName(whiteLabelSettings)
      })}
      showPagination={true}
      showSearch={false}
      hideRowSelection={true}
      hideColumnFilter={true}
      isControlled={true}
      onChange={handleTableChange}
      pageNumber={pageNumber}
      defaultPageSize={pageSize}
      showPageSizeSelector={false}
      totalEntries={modelData.totalItems}
      CustomUtilityBar={SearchBar}
      CustomUtilityBarJustifyContent="left"
    />
  )

  function handleTableChange({pageNumber, pageSize, sortKey, sortDirection}: TableState<ModelWithMonitoringData>) {
    setPageAndSearchVariables(oldVariables => ({
      ...oldVariables,
      sortBy: toSortField(sortKey),
      sortDirection,
      pageNumber,
      pageSize
    }))
  }

  function handleSearch(newSearch: string) {
    setPageAndSearchVariables({
      ...pageAndSearchVariables,
      searchPattern: newSearch
    })
  }
}

/**
 * Converts table column names to a domino api SortField
 */
function toSortField(sortKey: string | number | undefined): SortField | undefined {
  if (typeof sortKey !== 'string') return undefined

  switch (sortKey) {
    case ColumnKeys.Name:
      return 'name'
    case ColumnKeys.Modified:
      return 'modified'
    default:
      return undefined
  }
}

export default ModelsTable
