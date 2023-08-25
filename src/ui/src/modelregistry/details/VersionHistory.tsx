import React from 'react'
import styled from 'styled-components'
import Table from '../../components/Table/Table'
import { getColumns } from './versionHistoryTableColumns'
import { useGetRegisteredModelVersions } from '../modelRegistryHooks'
import { useModelRegistryRoutes } from '../ModelRegistryRouteContext'

type Props = {
  modelName: string
}
const VersionHistory: React.FC<Props> = ({ modelName }) => {
  const { isLoading, error, data } = useGetRegisteredModelVersions({ modelName })
  const routes = useModelRegistryRoutes()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!data) return <p>No data!</p>

  /* @ts-ignore a JSX warning about the table having an invalid class  */
  return (
    <VersionHistoryWrapper>
      <Table
        dataSource={data.items}
        columns={getColumns({ modelName, routes })}
        showPagination={true}
        showSearch={false}
        hideRowSelection={true}
        hideColumnFilter={true}
        isControlled={true}
        CustomUtilityBarJustifyContent="left"
      />
    </VersionHistoryWrapper>
  )
}

const VersionHistoryWrapper = styled.div.attrs({className: 'VersionHistory'})`
  margin-top: 10px;
`
export default VersionHistory
