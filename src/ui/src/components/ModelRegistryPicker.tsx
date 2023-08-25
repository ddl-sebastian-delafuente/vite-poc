import * as React from 'react'
import styled from 'styled-components'
import { DDFormItem } from './ValidatedForm'
import { useGetRegisteredModels, useGetRegisteredModelVersions } from '../modelregistry/modelRegistryHooks'
import { RegisteredModelV1 } from '../modelregistry/types'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LabeledValue } from 'antd/lib/select'
import { Select } from 'antd'

const StyledDDFormItem1 = styled(DDFormItem)`
  margin-bottom: 0 !important;
  flex: 1;
`

const StyledDDFormItem2 = styled(DDFormItem)`
  margin-bottom: 0 !important;
  flex: 0 0 150px;
`

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  background-color: #FAFAFA;
  padding: 14px;
  border: 1px solid #E0E0E0;
  width: 100%;
`

type Props = {
  projectId: string
}

const ModelRegistryPicker: React.FC<Props> = ({projectId}) => {
  const [selectedModel, selectedVersion, setSelectedModel, setSelectedVersion] = useModelPickerState()

  const { isLoading: isLoading1, error: error1, data: models } = useGetRegisteredModels({ projectId })

  const isVersionsEnabled = Boolean(selectedModel)
  const { isLoading: isLoading2, error: error2, data: versions } = useGetRegisteredModelVersions({ modelName: selectedModel?.name! }, { enabled: isVersionsEnabled })

  const modelOptions = models?.items.map(m => ({
    label: m.name,
    value: m.name,
  }))
  const versionOptions: LabeledValue[] | undefined = versions?.items.map(v => ({
    label: v.modelVersion === selectedModel!.latestVersion ? `${v.modelVersion} (Latest)` : v.modelVersion,
    value: v.modelVersion,
  }))
  const selectedVersionValueAndLabel: LabeledValue | null = selectedVersion ? {
    value: selectedVersion,
    label: selectedVersion === selectedModel!.latestVersion ? `${selectedVersion} (Latest)` : selectedVersion,
  } : null
  if (error1) console.log(error1)
  if (error2) console.log(error2)

  return (
    <Wrapper>
      <input type="hidden" value={selectedModel?.name ?? ''} name="registeredModelName" />
      <input type="hidden" value={selectedVersion ?? ''} name="registeredModelVersion" />
      <StyledDDFormItem1 label="Model Name">
        <Select
          loading={isLoading1}
          placeholder="Select Model"
          value={selectedModel?.name}
          options={modelOptions}
          onChange={(newModelName) => {
            const newModel = models!.items.find(m => m.name === newModelName)!
            setSelectedModel(newModel)
          }}
          style={{width: '100%'}}
        />
      </StyledDDFormItem1>
      <StyledDDFormItem2 label="Model Version">
        <Select
          labelInValue
          disabled={!isVersionsEnabled}
          loading={isLoading2}
          placeholder={isVersionsEnabled ? "Select Version" : "Select Model"}
          value={selectedVersionValueAndLabel}
          options={versionOptions}
          onChange={selection => setSelectedVersion(Number(selection.value))}
          style={{width: '100%'}}
        />
      </StyledDDFormItem2>
    </Wrapper>
  )
}

export default ModelRegistryPicker

function useModelPickerState(): [model: RegisteredModelV1 | undefined, version: number | undefined, setModel: (model: RegisteredModelV1) => void, setVersion: (version: number) => void] {
  type State = {
    model?: RegisteredModelV1,
    version?: number,
  }

  const [internalState, setInternalState] = React.useState<State>({ model: undefined, version: undefined })

  const setModel = (model: RegisteredModelV1) => setInternalState({ model, version: model.latestVersion })
  const setVersion = (version: number) => setInternalState(state => ({ model: state.model, version }))
 
  return [internalState.model, internalState.version, setModel, setVersion]
}


const embeddedQueryClient = new QueryClient()

/**
 * A copy of ModelRegistryPicker that includes a QueryClientProvider, for embedding in twirl.
 * Do not use this in the SPA. This is exported for react-components only.
 * 
 */
export const ModelRegistryPickerEmbedded: React.FC<Props> = (props) => (
  // since this component is a shim component for twirl, provide a QueryClientProvider here
  // note: the type error below is fixed in react-query 4+, but we use 3.36: https://github.com/TanStack/query/issues/3476
  // @ts-ignore
  <QueryClientProvider client={embeddedQueryClient}>
    <ModelRegistryPicker {...props} />
  </QueryClientProvider>
)
