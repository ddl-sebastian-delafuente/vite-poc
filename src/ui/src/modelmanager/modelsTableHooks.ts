import { QueryFunction, useQuery, UseQueryResult } from 'react-query'
import * as hydrator from '@domino/ui/dist/modelmanager/ModelListingTableHydrator'
import * as modelManagerApi from '@domino/api/dist/ModelManager'
import type { ErrorObject } from '@domino/api/dist/httpRequest'
import type { ModelVersionSummary } from '@domino/api/dist/dmm-api-client'
import type { DominoDataplaneDataPlaneDto, DominoModelmanagerApiModelsForUiApiResponse as ModelDataWrapper } from '@domino/api/dist/types'
import { listDataPlanes } from '@domino/api/dist/Dataplanes'

export type GetModelsQueryArgs = Parameters<typeof modelManagerApi.getModelsForUI>[0]
export type SortField = GetModelsQueryArgs['sortBy']
export type SortDirection = GetModelsQueryArgs['sortDirection']
type GetModelsQueryKey = [string, GetModelsQueryArgs]

export const DEFAULT_PAGE_SIZE = 50
const GET_MODELS_QUERY_KEY = 'getModelsForUi'
const GET_MODEL_MONITORING_QUERY_KEY = 'modelMonitoring'

const getModelsQueryFn: QueryFunction<ModelDataWrapper, GetModelsQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, { projectId, environmentId, registeredModelName, pageNumber, pageSize, sortBy, sortDirection, searchPattern }] = queryKey
  const data = await modelManagerApi.getModelsForUI({
    projectId,
    environmentId,
    registeredModelName,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchPattern,
  })
  return data
}

type UseGetIsModelsEmptyResult = {
  isLoading: boolean
  isEmpty: boolean
}

/**
 * Exposes a react hook that executes a query for the first page of data at the default page size
 * If the number of records returned is more than 0, isEmpty will be false.
 * Since this hook uses react-query underneath it, multiple calls to it, or calling it from other components
 * (like ModelsOverview) will not cause double requests
 * @param projectId optional - project id that models should be associated with
 * @param isEnabled - optional (default true). whether to actually execute this fetch (a feature flag might dictate this never gets called)
 */
export function useGetIsModelsEmpty(projectId?: string, isEnabled = true): UseGetIsModelsEmptyResult {
  const queryKey: GetModelsQueryKey = [GET_MODELS_QUERY_KEY, { projectId, pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE }]
  const { isLoading, data } = useQuery<ModelDataWrapper, ErrorObject>(queryKey, getModelsQueryFn, { keepPreviousData: true, enabled: isEnabled })
  const isEmpty = !isLoading && typeof data !== 'undefined' && data.totalItems === 0
  return { isLoading, isEmpty }
}

/**
 * Exposes a react hook that executes a query for a paginated list of models
 * @param projectId optional - project id that models should be associated with (mutually exclusive with environmentId)
 * @param environmentId optional - environment id that models should be associated with (mutually exclusive with projectId)
 * @param registeredModelName optional - the registered model name that models should be associated with
 * @param pageNumber optional - the page number to fetch. defaults to 1
 * @param pageSize optional - the number of results to include in a page. defaults to `DEFAULT_PAGE_SIZE`
 * @param sortBy optional - a field to sort on. valid values are of type `SortField`
 * @param sortDirection optional - if 'sortBy' is provided, a direction for the sort. valid values are of type `SortDirection`
 * @param searchPattern optional - a string to filter results by
 */
export function useGetModels({ projectId, environmentId, registeredModelName, searchPattern, pageNumber, pageSize, sortBy, sortDirection }: GetModelsQueryArgs): UseQueryResult<ModelDataWrapper, ErrorObject> {
  const queryKey: GetModelsQueryKey = [GET_MODELS_QUERY_KEY, { projectId, environmentId, registeredModelName, pageNumber, pageSize, sortBy, sortDirection, searchPattern }]
  return useQuery<ModelDataWrapper, ErrorObject>(queryKey, getModelsQueryFn, { keepPreviousData: true })
}


type UseGetModelApiPermissionsResult = {
  isLoading: boolean
  canCreateModelApis?: boolean
}
const DEFAULT_PERMISSION_RESPONSE: UseGetModelApiPermissionsResult = {
  isLoading: false,
  canCreateModelApis: true,
}
/**
 * Exposes a react hook that executes a query for the current user's permission regarding model APIs
 * Due to the way permission work in nucleus, the query only works when its scoped to a projectId
 * Passing "undefined" for a projectId will result in a static object being returned
 * @param projectId optional - project id to check permissions against
 * @param isEnabled - optional (default true). whether to actually execute this fetch (a feature flag might dictate this never gets called)
 */
export function useGetModelApiPermissions(projectId?: string, isEnabled = true): UseGetModelApiPermissionsResult {
  const enabled = isEnabled && typeof projectId === 'string'
  const queryKey = ['getModelProjectPermissions', projectId]
  const queryFn = async () => {
    const { canCreateModelApi } = await modelManagerApi.getModelPermissionsForProject({projectId: projectId!})
    return canCreateModelApi
  }
  const { isLoading, data: canCreateModelApis } = useQuery(queryKey, queryFn, { enabled })
  return enabled ? { isLoading, canCreateModelApis } : DEFAULT_PERMISSION_RESPONSE
}


type MonitoringQueryKey = string[]
const modelMonitoringQueryFn: QueryFunction<ModelVersionSummary[] | null, MonitoringQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, ...modelVersionIds] = queryKey

  const results = await hydrator.fetchModelSummary(modelVersionIds)
  return results
}

type UseGetModelMonitoringSummaryParams = {
  modelVersionIds: string[],
  isEnabled: boolean
}
export type UseGetModelMonitoringSummaryResult = UseQueryResult<ModelVersionSummary[] | null, ErrorObject>

/**
 * Exposes a react hook that fetches model monitoring results in a batch
 * This hook can conditionally supress the HTTP fetch if model monitoring is disabled or if there are no
 * models to operate on by passing isEnabled: false
 * @param modelVersionIds - a list of model versions to fetch monitoring results for. this shouldn't exceed ~50 ids
 * @param isEnabled - whether to actually execute this fetch.
 */
export function useGetModelMonitoringSummary({modelVersionIds, isEnabled}: UseGetModelMonitoringSummaryParams): UseGetModelMonitoringSummaryResult {
  const modelMonitoringQueryKey = [GET_MODEL_MONITORING_QUERY_KEY, ...modelVersionIds]
  // this useQuery hook MUST be defined before any `return` statements below that check for model loading status / emptines
  // a component should not use a hook in one render then not use it in another (by returning early)
  // the `enabled` property on this query will conditionally prevent it from firing an http request
  return useQuery<ModelVersionSummary[] | null, ErrorObject>(
    modelMonitoringQueryKey,
    modelMonitoringQueryFn,
    {
      enabled: isEnabled,
      keepPreviousData: false,
    }
  )
}

export type UseGetDataplanesResult = UseQueryResult<DominoDataplaneDataPlaneDto[] | null, ErrorObject>

/**
 * Exposes a react hook that executes a query for the available dataplanes
 */
export function useGetDataplanes(isEnabled: boolean): UseGetDataplanesResult {
  const queryKey = ['getDataplanes']
  const queryFn = async () => {
    return await listDataPlanes({showArchived: true})
  }
  return useQuery(queryKey, queryFn, { enabled: isEnabled })
}
