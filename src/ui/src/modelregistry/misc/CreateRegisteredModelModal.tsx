import * as React from 'react'
import * as R from 'ramda';
import ModalWithButton from '../../components/ModalWithButton'
import Radio, { RadioChangeEvent } from '../../components/Radio/Radio'
import { colors } from '../../styled'
import { DDFormItem } from '../../components/ValidatedForm'
import Select from '../../components/Select/Select'
import TextInput from '../../components/TextInput/Input'
import styled from 'styled-components'
import { CreateNewModelState, UpdateExistingModelState, Mode, useCreateRegisteredModelState } from './CreateRegisteredModelModal.types'
import { useGetRegisteredModels } from '../modelRegistryHooks'
import { useListArtifacts } from '../experimentsHooks'
import { error, success } from '../../components/toastr'
import { getErrorMessage } from '../../components/renderers/helpers'
import { createModelFromRun, getRegisteredModelByName } from '../api'
import TextArea from 'antd/lib/input/TextArea'
import { useGetRun } from '../experimentsHooks'

const StyledDDFormItem = styled(DDFormItem)`
  margin-top: 16px;
`

const CreateNewModelForm: React.FC<{ state: CreateNewModelState }> = ({ state }) => {
  const { isLoading, error, data: run } = useGetRun({ runId: state.experimentRunId })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!run) return <p>No data!</p>

  return (
    <div className="CreateRegisteredModelModal">
      <h4 style={{ backgroundColor: colors.neutral100, lineHeight: '36px', marginBottom: '16px' }}>Experiment Run: {run.info.run_name}</h4>

      <ModePicker value={state.mode} onChange={(newMode) => state.setMode(newMode)} />

      {/* new model name text input (create new model only) */}
      <ModelNameTextInput value={state.modelName} isValid={state.isModelNameValid} onChange={(name) => state.setModelName(name)} />

      {/* logged mlflow model */}
      <LoggedModelPicker
        runId={state.experimentRunId}
        value={state.loggedModelName}
        onChange={(newLoggedModelName) => state.setLoggedModelName(newLoggedModelName)}
      />

      {/* description */}
      <DescriptionTextArea value={state.description} onChange={(description) => state.setDescription(description)} />
    </div>
  )
}

const UpdateExistingModelForm: React.FC<{ state: UpdateExistingModelState }> = ({ state }) => {
  const { isLoading, error, data: run } = useGetRun({ runId: state.experimentRunId })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!run) return <p>No data!</p>

  return (
    <div className="CreateRegisteredModelModal">
      <h4 style={{ backgroundColor: colors.neutral100, lineHeight: '36px', marginBottom: '16px' }}>Experiment Run: {run.info.run_name}</h4>

      <ModePicker value={state.mode} onChange={(newMode) => state.setMode(newMode)} />

      {/* picker (use existing model only) */}
      <ExistingModelPicker
        projectId={state.projectId}
        value={state.modelName}
        onChange={(selectedModel) => {
          state.setModelName(selectedModel ?? '')
        }}
      />

      {/* logged mlflow model */}
      <LoggedModelPicker
        runId={state.experimentRunId}
        value={state.loggedModelName}
        onChange={(newLoggedModel) => state.setLoggedModelName(newLoggedModel)}
      />

      {/* description */}
      <DescriptionTextArea value={state.description} onChange={(description) => state.setDescription(description)} />
    </div>
  )
}

type FormComponentProps<T> = {
  value: T
  onChange: (newValue: T) => void
}

const ModePicker: React.FC<FormComponentProps<Mode>> = ({ value, onChange }) => (
  <Radio
    direction="horizontal"
    items={[
      {
        key: 'create',
        value: 'create',
        label: 'Create new model'
      },
      {
        key: 'update',
        value: 'update',
        label: 'Update an existing model'
      },
    ]}
    onChange={(e: RadioChangeEvent) => {
      const newValue = e.target.value as Mode
      onChange(newValue)
    }}
    value={value}
  />
)

const ModelNameTextInput: React.FC<FormComponentProps<string> & { isValid: boolean }> = ({ value, isValid, onChange }) => (
  <StyledDDFormItem label="Model Name">
    <TextInput placeholder="Enter a new model name to register" value={value} onChange={(e) => onChange(e.target.value)} status={isValid ? '' : 'error'} />
    {!isValid && <div style={{ color: '#ff4d4f' }}>A model with this name already exists.</div>}
  </StyledDDFormItem>
)

const DescriptionTextArea: React.FC<FormComponentProps<string>> = ({ value, onChange }) => (
  <StyledDDFormItem label="Description">
    <TextArea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={"Enter a description for the new model version being created."}
      style={{ minHeight: 80 }}
    />
  </StyledDDFormItem>
)

const ExistingModelPicker: React.FC<{ projectId: string } & FormComponentProps<string>> = ({ projectId, value, onChange }) => {
  const { isLoading: isLoading, data: models } = useGetRegisteredModels({ projectId })
  const modelOptions = models?.items.map(m => ({
    label: m.name,
    value: m.name,
  }))
  return (
    <StyledDDFormItem label="Model Name">
      <Select
        loading={isLoading}
        placeholder="Select Model"
        value={value}
        options={modelOptions}
        onChange={onChange}
        style={{ width: '100%' }}
      />
    </StyledDDFormItem>
  )
}

type LoggedModelPicker = FormComponentProps<string> & {
  runId: string
}
const LoggedModelPicker: React.FC<LoggedModelPicker> = ({ runId, value, onChange }) => {
  // @ts-ignore
  const { isLoading, data: foo } = useListArtifacts({ run_id: runId })
  const dirs = R.isNil(foo) || R.isEmpty(foo) ? [] : foo?.files
    .filter(f => f.is_dir)
    .map(f => ({
      label: f.path,
      value: f.path,
    }))
  return (
    <StyledDDFormItem label="Logged MLflow Model">
      <Select
        loading={false}
        placeholder="Select Logged MLflow Model"
        value={value}
        options={dirs}
        onChange={onChange}
        style={{ width: '100%' }}
      />
      <div style={{ color: colors.neutral500 }}>Select the target MLfLow artifact</div>
    </StyledDDFormItem>
  )
}

type ButtonProps = {
  projectId: string
  experimentRunId: string
  disable?: boolean
}
const Button: React.FC<ButtonProps> = ({ projectId, experimentRunId, disable }) => {
  const state = useCreateRegisteredModelState(projectId, experimentRunId)

  const onSubmit = async () => {
    if (state.mode === 'create') {
      // first check if there's already a registered model with that name
      // this is a little backwards, because if this call does get a model, then the form is in an error state
      // if this call doesn't find an error, then everything is fine

      try {
        const existingModel = await getRegisteredModelByName({ modelName: state.modelName })
        if (existingModel) {
          state.setModelNameValid(false)
          return Promise.reject()
        }
      } catch { }
    }

    try {
      await createModelFromRun({
        modelName: state.modelName,
        experimentRunId: state.experimentRunId,
        artifact: state.loggedModelName,
        description: state.description,
      })
      success('Succesfully created new model version')
      return Promise.resolve()
    } catch (e) {
      console.error(e)
      error(await getErrorMessage(e, 'Failed to create a new model version'))
      return Promise.reject()
    }
  }

  return (
    <ModalWithButton
      modalProps={{
        titleIconName: "ModelMonitorIcon",
        titleText: "Register model from this run"
      }}
      openButtonLabel="Register model from run"
      openButtonProps={
        {
          btnType: 'primary',
          ...disable && {
            tooltipContent: 'Model registered',
            placement: 'left'
          }
        }}
      modalSubmitButtonLabel="Register Model"
      modalCancelButtonLabel="Cancel"
      modalSubmitButtonDisable={!state.isValid}
      handleFailableSubmit={onSubmit}
      closable={true}
      disabled={disable}
    >
      {state.mode === 'create' ? <CreateNewModelForm state={state} /> : <UpdateExistingModelForm state={state} />}
    </ModalWithButton >
  )
}

export { Button }
