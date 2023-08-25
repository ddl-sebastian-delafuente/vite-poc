import { ErrorObject } from '@domino/api/dist/httpRequest'
import { QueryFunction, useQuery, UseQueryResult } from 'react-query'
import { getRun, listArtifacts } from '../experiments/api'
import { Run, Artifacts } from '../experiments/types'

const GET_RUN_QUERY_KEY = 'getRun'
const LIST_ARTIFACTS_QUERY_KEY = 'listArtifacts'

type GetRunQueryKey = [typeof GET_RUN_QUERY_KEY, GetRunArgs]

type GetRunArgs = {
  runId: string
}
/**
 * Exposes a react hook that executes a query for an experiment run
 * @param projectId - project id that the run belongs to
 * @param runId - id of the run to fetch
 */
export function useGetRun({ runId }: GetRunArgs): UseQueryResult<Run, ErrorObject> {
  const queryKey: GetRunQueryKey = [GET_RUN_QUERY_KEY, { runId }]
  return useQuery<Run, ErrorObject>(queryKey, getRunQueryFn)
}


const getRunQueryFn: QueryFunction<Run, GetRunQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, { runId }] = queryKey

  const { run } = await getRun({ run_id: runId })
  return run
}


type ListArtifactsQueryKey = [typeof LIST_ARTIFACTS_QUERY_KEY, ListArtifactsArgs]
type ListArtifactsArgs = Parameters<typeof listArtifacts>[0]

/**
 * Exposes a react hook that executes a query for an experiment run
 * @param projectId - project id that the run belongs to
 * @param run_id - id of the run to fetch artifacts for
 * @param path - (optional) path or sub-directory to list artifacts for
 * @param page_token - (optional) page token for subsequent page requests
 */
export function useListArtifacts(params: ListArtifactsArgs): UseQueryResult<Artifacts, ErrorObject> {
  const queryKey: ListArtifactsQueryKey = [LIST_ARTIFACTS_QUERY_KEY, params]
  return useQuery<Artifacts, ErrorObject>(queryKey, listArtifactsQueryFn)
}

const listArtifactsQueryFn: QueryFunction<Artifacts, ListArtifactsQueryKey> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, params] = queryKey

  const data = await listArtifacts(params)
  return data
}
