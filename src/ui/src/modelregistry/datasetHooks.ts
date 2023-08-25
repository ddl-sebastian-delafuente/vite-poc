import { ErrorObject, httpRequest } from '@domino/api/dist/httpRequest'
import { useQueries, UseQueryResult, UseQueryOptions } from 'react-query'
import { getDataSource } from '@domino/api/dist/Datasource'
import { DominoDatasourceApiDataSourceDto } from '@domino/api/dist/types'

const GET_DATASET_QUERY_KEY = 'getDataset'
const GET_DATASOURCE_QUERY_KEY = 'getDatasource'

export function useGetDatasets(datasetIds: string[]): UseQueryResult<Dataset[], ErrorObject> {
  const queries = datasetIds.map<UseQueryOptions<Dataset, Error>>(datasetId => ({
    queryKey: [GET_DATASET_QUERY_KEY, datasetId],
    queryFn: () => getDatasetById(datasetId),
  }))

  const t = useQueries<Dataset[]>(
    queries
  )

  const isLoading = t.some((query: UseQueryResult<Dataset, ErrorObject>) => query.isLoading)
  const error = t.find((query: UseQueryResult<Dataset, ErrorObject>) => query.isError)?.error as ErrorObject
  const data = t.filter((query: UseQueryResult<Dataset, ErrorObject>) => Boolean(query.data)).map((query: UseQueryResult<{dataset: Dataset}, ErrorObject>) => query.data!).map(d => d.dataset)

  return { isLoading, error, data } as UseQueryResult<Dataset[], ErrorObject>
}

export type Dataset = {
  createdAt: string
  description: string
  id: string
  name: string
  projectId: string
  snapshotIds: string[]
  tags: {}
}

const getDatasetById = (datasetId: string): Promise<Dataset> => {
  return httpRequest('GET',
    `/api/datasetrw/v1/datasets/${datasetId}`,
    undefined,
    {},
    undefined,
    null,
    true,
  )
}

export function useGetDataSources(dataSourceIds: string[]): UseQueryResult<DominoDatasourceApiDataSourceDto[], ErrorObject> {
  const queries = dataSourceIds.map<UseQueryOptions<DominoDatasourceApiDataSourceDto, Error>>(dataSourceId => ({
    queryKey: [GET_DATASOURCE_QUERY_KEY, dataSourceId],
    queryFn: () => getDataSource({dataSourceId}),
  }))

  const t = useQueries<DominoDatasourceApiDataSourceDto[]>(
    queries
  )

  const isLoading = t.some((query: UseQueryResult<DominoDatasourceApiDataSourceDto, ErrorObject>) => query.isLoading)
  const error = t.find((query: UseQueryResult<DominoDatasourceApiDataSourceDto, ErrorObject>) => query.isError)?.error as ErrorObject
  const data = t.filter((query: UseQueryResult<DominoDatasourceApiDataSourceDto, ErrorObject>) => Boolean(query.data)).map((query: UseQueryResult<DominoDatasourceApiDataSourceDto, ErrorObject>) => query.data)

  return { isLoading, error, data } as UseQueryResult<DominoDatasourceApiDataSourceDto[], ErrorObject>
}
