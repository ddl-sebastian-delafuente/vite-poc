import React from 'react'
import { render } from '@domino/test-utils/dist/testing-library'
import ModelsTable from '../ModelsTable'
import * as hooks from '../modelsTableHooks'
import { QueryObserverSuccessResult } from 'react-query'
import type { DominoModelmanagerApiModelsForUiApiResponse as ModelDataWrapper, DominoModelmanagerApiModel as ApiModel } from '@domino/api/dist/types'
import type { ErrorObject } from '@domino/api/dist/httpRequest'

hooks.useGetIsModelsEmpty
hooks.useGetModelApiPermissions
hooks.useGetModelMonitoringSummary
hooks.useGetModels

jest.mock('../modelsTableHooks')
afterAll(() => jest.unmock('../modelsTableHooks'))

// , () => ({
//   __esModule: true,
//   useGetModels(params: UseGetModelsParams): UseGetModelsResult {
//     return ()
//   },
// })

const mockedHooks = jest.mocked(hooks)
type UseGetModelsParams = Parameters<typeof mockedHooks.useGetModels>
// type UseGetModelsResult = ReturnType<typeof mockedHooks.useGetModels>

type UseGetModelMonitoringSummaryParams = Parameters<typeof mockedHooks.useGetModelMonitoringSummary>

mockedHooks.useGetModels.mockReturnValue(getModelsSuccess())
mockedHooks.useGetModelMonitoringSummary.mockImplementation(() => {
  return {
    data: null,
    isLoading: false,
    isError: false,
  } as hooks.UseGetModelMonitoringSummaryResult
})
mockedHooks.useGetDataplanes.mockReturnValue(
  {
    data: null,
    isLoading: false,
    isError: false
  } as hooks.UseGetDataplanesResult
)

describe('ModelsTable', () => {
  describe('Global view', () => {
    // react hooks need to be called every single render, even if they're not needed
    // when we don't need the results of model monitoring, we call the hook with an additional
    // flag, isEnabled: false, to supress the HTTP call
    it('calls useGetModelMonitoringSummary with isEnabled: false when modelMonitoringEnabled is false', () => {
      render(<ModelsTable modelMonitoringEnabled={false} />)
      expect(mockedHooks.useGetModelMonitoringSummary).toHaveBeenCalledWith<UseGetModelMonitoringSummaryParams>({
        modelVersionIds: expect.anything(),
        isEnabled: false,
      })
    })
    it('calls useGetDataplanes with isEnabled: false when modelMonitoringEnabled is false', () => {
      render(<ModelsTable dataPlanesEnabled={false} />)
      expect(mockedHooks.useGetDataplanes).toHaveBeenCalledWith(false)
    })
  })

  describe('Project view', () => {
    it('calls useGetModels with project id set', () => {
      render(<ModelsTable projectId="project123" />)
      expect(mockedHooks.useGetModels).toHaveBeenCalledWith<UseGetModelsParams>({
        projectId: 'project123',
        pageNumber: 1,
        pageSize: hooks.DEFAULT_PAGE_SIZE,
      })
    })
  })

  describe('Environments view', () => {
    it('calls useGetModels with environment id set', () => {
      render(<ModelsTable environmentId="environment123" />)
      expect(mockedHooks.useGetModels).toHaveBeenCalledWith<UseGetModelsParams>({
        environmentId: 'environment123',
        pageNumber: 1,
        pageSize: hooks.DEFAULT_PAGE_SIZE,
      })
    })
    it('calls useGetModelMonitoringSummary with isEnabled: false since environments page does not use it', () => {
      render(<ModelsTable modelMonitoringEnabled={true} environmentId="environment123" />)
      expect(mockedHooks.useGetModelMonitoringSummary).toHaveBeenCalledWith<UseGetModelMonitoringSummaryParams>({
        modelVersionIds: expect.anything(),
        isEnabled: false,
      })
    })
    it('calls useGetDataplanes with isEnabled: false since environments page does not use it', () => {
      render(<ModelsTable dataPlanesEnabled={true} environmentId="environment123" />)
      expect(mockedHooks.useGetDataplanes).toHaveBeenCalledWith(false)
    })
  })
})


/**
 * Returns mock data in the shape that react-query would
 */
function getModelsSuccess() {
  return {
    data: {
      currentItemCount: 1,
      startIndex: 0,
      itemsPerPage: 1,
      totalItems: 1,
      models: [

      ] as ApiModel[],
      modelAccess: {},
    },
    error: null,
    isError: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    status: 'success',
  } as QueryObserverSuccessResult<ModelDataWrapper, ErrorObject>
}
