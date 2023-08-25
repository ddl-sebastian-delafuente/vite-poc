import React from 'react'
import styled from 'styled-components'
import { useGetRegisteredModelByName } from '../modelRegistryHooks'
import ModelsTable from '../../modelmanager/ModelsTable'

type Props = {
  modelName: string
  isModelMonitoringEnabled: boolean
  isAsyncModelsEnabled: boolean
}
const ModelApiList: React.FC<Props> = ({modelName, isModelMonitoringEnabled, isAsyncModelsEnabled}) => {
  const { isLoading, error, data: model } = useGetRegisteredModelByName({ modelName });

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!model) return <p>No data!</p>
  const projectId = model.project.id

  return (
    <Wrapper>
      <ModelsTable
        modelMonitoringEnabled={isModelMonitoringEnabled}
        asyncModelsEnabled={isAsyncModelsEnabled}
        registeredModelName={modelName}
        projectId={projectId}
      />
    </Wrapper>
  )
}

export default ModelApiList

const Wrapper = styled.div.attrs({className: 'ModelApiList'})`
  padding: 25px 0 0;
`
