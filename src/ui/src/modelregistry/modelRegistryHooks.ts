import { MutationFunction, QueryFunction, useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query'
import type { ErrorObject } from '@domino/api/dist/httpRequest'
import type { RegisteredModelV1, PaginatedRegisteredModelsEnvelopeV1, PaginatedRegisteredModelVersionOverviewEnvelopeV1, RegisteredModelVersionDetailsV1 } from './types'

// TODO: these types should come from swagger codegen
export type GetRegisteredModelsQueryArgs = {
  projectId?: string
  searchPattern?: string
  offset?: number
  limit?: number
}

export type GetRegisteredModelByNameArgs = {
  modelName: string
}

export type GetRegisteredModelVersionsArgs = {
  modelName: string
  offset?: number
  limit?: number
}

export type GetRegisteredModelVersionArgs = {
  modelName: string
  version: number
}

type GetRegisteredModelsQueryKey = ['getRegisteredModels', GetRegisteredModelsQueryArgs]
type GetRegisteredModelByNameQueryKey = ['getRegisteredModelByName', GetRegisteredModelByNameArgs]
type GetRegisteredModelVersionsQueryKey = ['getRegisteredModelVersions', GetRegisteredModelVersionsArgs]
type GetRegisteredModelVersionQueryKey = ['getRegisteredModelVersion', GetRegisteredModelVersionArgs]

const GET_REGISTERED_MODELS_QUERY_KEY = 'getRegisteredModels'
const GET_REGISTERED_MODEL_BY_NAME_QUERY_KEY = 'getRegisteredModelByName'
const GET_REGEISTERED_MODEL_VERSIONS_QUERY_KEY = 'getRegisteredModelVersions'
const GET_REGEISTERED_MODEL_VERSION_QUERY_KEY = 'getRegisteredModelVersion'

// a hyper-simplified version of react-query's QueryObserverOptions
type QueryOptions = {
  enabled?: boolean
}

const getRegisteredModelsQueryFn: QueryFunction<PaginatedRegisteredModelsEnvelopeV1, GetRegisteredModelsQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, { projectId, searchPattern, offset, limit }] = queryKey
  const searchParams = new URLSearchParams()
  if (projectId) searchParams.append('projectId', projectId)
  if (searchPattern) searchParams.append('searchPattern', searchPattern)
  if (offset) searchParams.append('offset', String(offset))
  if (limit) searchParams.append('limit', String(limit))

  const response = await fetch(`/api/registeredmodels/beta?${searchParams.toString()}`)
  if (!response.ok) {
    throw await toErrorObject(response)
  }
  return response.json()
}

const getRegisteredModelByNameQueryFn: QueryFunction<RegisteredModelV1, GetRegisteredModelByNameQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, { modelName }] = queryKey

  const response = await fetch(`/api/registeredmodels/beta/${modelName}`)
  if (!response.ok) {
    throw await toErrorObject(response)
  }
  return response.json()
}

const getRegisteredModelVersionsQueryFn: QueryFunction<PaginatedRegisteredModelVersionOverviewEnvelopeV1, GetRegisteredModelVersionsQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, { modelName }] = queryKey

  const response = await fetch(`/api/registeredmodels/beta/${modelName}/versions`)
  if (!response.ok) {
    throw await toErrorObject(response)
  }
  return response.json()
}

const getRegisteredModelVersionQueryFn: QueryFunction<RegisteredModelVersionDetailsV1, GetRegisteredModelVersionQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, { modelName, version }] = queryKey

  const response = await fetch(`/api/registeredmodels/beta/${modelName}/versions/${version}`)
  if (!response.ok) {
    throw await toErrorObject(response)
  }
  return response.json()
}

type PatchRegisteredModelVariables = {
  modelName: string,
  discoverable?: boolean,
  description?: string
}
const patchRegisteredModelMutationFn: MutationFunction<RegisteredModelV1, PatchRegisteredModelVariables> = async ({modelName, discoverable, description}) => {
  const response = await fetch(`/api/registeredmodels/beta/${modelName}`, {
    method: 'PATCH',
    body: JSON.stringify({
      discoverable,
      description
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  if (!response.ok) {
    throw await toErrorObject(response)
  }
  return response.json()
}

/**
 * Exposes a react hook that executes a query for a paginated list of registered models
 * @param projectId optional - project id that registered models should be associated with
 * @param search optional - a search term to filter results by
 * @param offset optional - a number of records skip (for pagination). defaults to 0
 * @param limit optional - the maximium number of results to return. defaults to 20
 */
export function useGetRegisteredModels({ projectId, searchPattern, offset, limit }: GetRegisteredModelsQueryArgs): UseQueryResult<PaginatedRegisteredModelsEnvelopeV1, ErrorObject> {
  const queryKey: GetRegisteredModelsQueryKey = [GET_REGISTERED_MODELS_QUERY_KEY, { projectId, searchPattern, offset, limit }]
  return useQuery<PaginatedRegisteredModelsEnvelopeV1, ErrorObject>(queryKey, getRegisteredModelsQueryFn)
}

/**
 * Exposes a react hook that executes a query for a single registered model
 * @param modelName - the id of the registered model to fetch
 */
 export function useGetRegisteredModelByName({ modelName }: GetRegisteredModelByNameArgs): UseQueryResult<RegisteredModelV1, ErrorObject> {
  const queryKey: GetRegisteredModelByNameQueryKey = [GET_REGISTERED_MODEL_BY_NAME_QUERY_KEY, { modelName }]
  return useQuery<RegisteredModelV1, ErrorObject>(queryKey, getRegisteredModelByNameQueryFn)
}

/**
 * Exposes a react hook that executes a query for a paginated list of versions for a single registered model
 * @param modelName - the id of the registered model to fetch versions for
 * @param offset optional - a number of records skip (for pagination). defaults to 0
 * @param limit optional - the maximium number of results to return. defaults to 20
 */
export function useGetRegisteredModelVersions({ modelName, offset, limit }: GetRegisteredModelVersionsArgs, options?: QueryOptions): UseQueryResult<PaginatedRegisteredModelVersionOverviewEnvelopeV1, ErrorObject> {
  const queryKey: GetRegisteredModelVersionsQueryKey = [GET_REGEISTERED_MODEL_VERSIONS_QUERY_KEY, { modelName, offset, limit }]
  return useQuery<PaginatedRegisteredModelVersionOverviewEnvelopeV1, ErrorObject>(queryKey, getRegisteredModelVersionsQueryFn, options)
}
/*
 * Exposes a react hook that fetches a single registered model version
 * @param modelName - the id of the registered model
 * @param version - the version number of the record to fetch 
 * @param options - optional - options passed on to react-query's useQuery
 */
export function useGetRegisteredModelVersion({ modelName, version }: GetRegisteredModelVersionArgs, options?: QueryOptions): UseQueryResult<RegisteredModelVersionDetailsV1, ErrorObject> {
  const queryKey: GetRegisteredModelVersionQueryKey = [GET_REGEISTERED_MODEL_VERSION_QUERY_KEY, { modelName, version }]
  return useQuery<RegisteredModelVersionDetailsV1, ErrorObject>(queryKey, getRegisteredModelVersionQueryFn, options)
}

// Mutation for PATCH request to update model discoverability
// After the patch's response, it replaces the cache of useGetRegisteredModels and useGetRegisteredModelByName with the new data
// https://tanstack.com/query/v4/docs/react/guides/updates-from-mutation-responses
export function useMutateModelDiscoverability() {
  const queryClient = useQueryClient()

  return useMutation<RegisteredModelV1, ErrorObject, PatchRegisteredModelVariables>({
    mutationFn: patchRegisteredModelMutationFn,
    onSuccess: (data) => {
      // replace the cached copy of any useGetRegisteredModelByName calls for this model
      const byNameQueryKey: GetRegisteredModelByNameQueryKey = [GET_REGISTERED_MODEL_BY_NAME_QUERY_KEY, { modelName: data.name }]
      queryClient.setQueryData(byNameQueryKey, data)

      // invalidate any useGetRegisteredModels caches
      queryClient.invalidateQueries({ queryKey: [GET_REGISTERED_MODELS_QUERY_KEY] })
    },
  })
}

async function toErrorObject(response: Response): Promise<ErrorObject> {
  return {
    status: response.status,
    name: response.statusText,
    body: await response.text(),
    headers: response.headers,
  }
}
