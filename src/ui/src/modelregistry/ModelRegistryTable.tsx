import React, { useState } from 'react'
import Table, { TableState } from '../components/Table/Table'
import Input from '../components/TextInput/Input'
import { ColumnKeys, getColumns } from './modelRegistryTableColumns'
import { GetRegisteredModelsQueryArgs, useGetRegisteredModels } from './modelRegistryHooks'
import type { RegisteredModelV1 } from './types'
import { useModelRegistryRoutes } from './ModelRegistryRouteContext'

const DEFAULT_PAGE_SIZE = 20
type State = {
  pageNumber: number
  pageSize: number
  searchPattern: string
}
export type Props = {
  projectId?: string
}
const ModelRegistryTable: React.FC<Props> = ({ projectId }: Props) => {
  const [pageAndSearchVariables, setPageAndSearchVariables] = useState<State>({pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, searchPattern: ''})
  const getRegisteredModelsQueryArgs: GetRegisteredModelsQueryArgs = {
    projectId,
    searchPattern: pageAndSearchVariables.searchPattern,
  }
  const { isLoading, error, data } = useGetRegisteredModels(getRegisteredModelsQueryArgs)
  const routes = useModelRegistryRoutes()

  /*
    * Design for the Model APIs page calls for a large search box left of the page size selector
    * Providing this toolbar as a 'CustomUtilityBar' to the <Table> component achieves that
  */
  const SearchBar: React.FC = () => (
    <div style={{marginBottom: 16, flex: 1}}>
      <div style={{width: 400}}>
        <Input.Search
          defaultValue={pageAndSearchVariables.searchPattern}
          placeholder="Search by model name"
          data-test="table-search-input"
          onSearch={handleSearch}
          allowClear
        />
      </div>
    </div>
  )

  const pageSize = DEFAULT_PAGE_SIZE

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!data) return <p>No data...</p>

  const { offset, totalCount } = data.metadata
  const pageNumber = offset === 0 ? 1 : Math.ceil(offset / (pageSize-1))

  return (
    /* @ts-ignore a JSX warning about the table having an invalid class  */
    <Table
      dataSource={data.items}
      columns={getColumns({
        showProject: !projectId,
        routes,
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
      totalEntries={totalCount}
      CustomUtilityBar={SearchBar}
      CustomUtilityBarJustifyContent="left"
    />
  )

  function handleTableChange({pageNumber, pageSize, sortKey, sortDirection}: TableState<RegisteredModelV1>) {
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

type SortField = 'name' | 'created' // TODO this type will be inferred from an API type

/**
 * Converts table column names to a domino api SortField
 */
function toSortField(sortKey: string | number | undefined): SortField | undefined {
  if (typeof sortKey !== 'string') return undefined

  switch (sortKey) {
    case ColumnKeys.ModelName:
      return 'name'
    case ColumnKeys.Created:
      return 'created'
    default:
      return undefined
  }
}

export default ModelRegistryTable
