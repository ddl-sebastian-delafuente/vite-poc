import { useState } from 'react'

export type Mode = 'create' | 'update'

export interface RegisterModelState {
  readonly projectId: string
  readonly experimentRunId: string
  readonly mode: Mode
  setMode(mode: Mode): void
  readonly loggedModelName: string
  setLoggedModelName(loggedModelName: string): void
  readonly modelName: string
  setModelName(modelName: string): void
  readonly description: string
  setDescription(tags: string): void
  readonly isValid: boolean
}

export interface CreateNewModelState extends RegisterModelState {
  mode: 'create',
  readonly isModelNameValid: boolean,
  setModelNameValid(value: boolean): void,
}

export interface UpdateExistingModelState extends RegisterModelState {
  mode: 'update'
}

/**
 * The ModalWithButton component forces us to manage modal state and callbacks at the button that launches the modal,
 * making encapsulation very difficult, especially in the case of the CreateRegisteredModelModal, which embodies two different forms.
 * This hook extracts all the state, validation, and form-posting logic out of the components so we don't have to create a god object.
 */
export function useCreateRegisteredModelState(projectId: string, experimentRunId: string): CreateNewModelState | UpdateExistingModelState {
  const [mode, setModeInternal] = useState<Mode>('create')
  const [modelName, setModelName] = useState<string>('')
  const [loggedModel, setLoggedModel] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isModelNameValid, setModelNameValid] = useState<boolean>(true)

  const setMode = (mode: Mode) => {
    setModelName('')
    setModeInternal(mode)
  }

  const base: RegisterModelState = {
    get projectId() { return projectId },
    get experimentRunId() { return experimentRunId },
    get mode() { return mode },
    setMode(value: Mode) { setMode(value) },
    get modelName() { return modelName },
    setModelName(value: string) { setModelName(value) },
    get loggedModelName() { return loggedModel },
    setLoggedModelName(value: string) { setLoggedModel(value) },
    get description() { return description },
    setDescription(value: string) { setDescription(value) },
    get isValid() {
      if (
        modelName && modelName.length > 0 &&
        (mode !== 'create' || isModelNameValid) &&
        loggedModel && loggedModel.length > 0 &&
        this.description && this.description.length > 0
      ) return true
      return false
    },
  }
  if (mode === 'create') {
    return {
      ...base,
      get isModelNameValid() { return isModelNameValid },
      setModelNameValid(value: boolean) { setModelNameValid(value) },
      setModelName(value: string) { setModelNameValid(true); setModelName(value) },
    } as CreateNewModelState
  } else if (mode === 'update') {
    return {
      ...base,
    } as UpdateExistingModelState
  }
  throw new Error("unreachable")
}
