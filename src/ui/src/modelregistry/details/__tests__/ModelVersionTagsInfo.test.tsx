import React from 'react'
import { render, waitFor } from '@domino/test-utils/dist/testing-library'
import ModelVersionTagsInfo from '../ModelVersionTagsInfo'
import * as hooks from '../../modelRegistryHooks'

jest.mock('../../modelRegistryHooks')
afterAll(() => jest.unmock('../../modelRegistryHooks'))
const mockedHooks = jest.mocked(hooks)

describe('ModelVersionTagsInfo', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state', () => {
    mockedHooks.useGetRegisteredModelVersion.mockReturnValue({ isLoading: true } as any)
    const { findAllByText } = render(<ModelVersionTagsInfo modelName="model1" version={1} />)

    expect(findAllByText('Loading...')).not.toBeNull()
  })

  it('shows error state', () => {
    mockedHooks.useGetRegisteredModelVersion.mockReturnValue({ error: {status: 404, name: 'Not Found'} } as any)
    const { findAllByText } = render(<ModelVersionTagsInfo modelName="model1" version={1} />)

    expect(findAllByText('Error: 404 - Not Found')).not.toBeNull()
  })

  it('shows model version tags', async () => {
    mockedHooks.useGetRegisteredModelVersion.mockReturnValue({
      data: { tags: { 'key1': 'value1', 'key2': 'value2', 'mlflow.key': 'value', 'domino.key': 'value' } }
    } as any)

    const { findAllByText, queryAllByText } = render(<ModelVersionTagsInfo modelName="model1" version={1} />)

    await waitFor(() => {
        
      expect(findAllByText('key1')).not.toBeNull()
      expect(findAllByText('value1')).not.toBeNull()
      expect(findAllByText('key2')).not.toBeNull()
      expect(findAllByText('value2')).not.toBeNull()
      expect(queryAllByText('mlflow.key')).toHaveLength(0)
      expect(queryAllByText('mlflow.domino.key')).toHaveLength(0)
      expect(queryAllByText('domino.key')).toHaveLength(0)
    })
  })
})
