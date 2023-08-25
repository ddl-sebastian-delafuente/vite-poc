import * as React from 'react';
import 'jest-styled-components';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import DataFetcher from '../DataFetcher';

type TestFetcherState = {
  testId: string
}

type fetchedResponseType = {
  testKey?: string;
}

const TestFetcher: new() => DataFetcher<TestFetcherState, fetchedResponseType | undefined> = DataFetcher as any;
const mockComponent = jest.fn(
  (result: fetchedResponseType | undefined, loading: boolean, delegatedDataFetcher?: any, error?: any) => <div />);

describe('DataFetcher', () => {
  it('should send the default values to mockCompoent on load', () => {
    const testApi = async ({ testId }: TestFetcherState) => Promise.resolve({ testKey: 'testKey' });
    render(<TestFetcher
        testId={'testId'}
        fetchData={testApi}
        initialChildState={undefined} 
      >
        {mockComponent}
      </TestFetcher>);
    
    const valuesWhenFetcherLoaded = mockComponent.mock.calls[0];
    expect(valuesWhenFetcherLoaded[0]).toEqual(undefined);
    expect(valuesWhenFetcherLoaded[1]).toEqual(true);
  });

  it('should send the testApi response to mockCompoent when API is success', async () => {
    const mockResponse = { testKey: 'testKey' };
    const testApi = async ({ testId }: TestFetcherState) => Promise.resolve(mockResponse);
    render(<TestFetcher
        testId={'testId'}
        fetchData={testApi}
        initialChildState={undefined} 
      >
        {mockComponent}
      </TestFetcher>);

      await waitFor(() => expect(mockComponent).toHaveBeenCalledTimes(2));
      const valuesWhenFetcherFetchDataResolves = mockComponent.mock.calls[1];
      await waitFor(() => expect(valuesWhenFetcherFetchDataResolves[0]).toEqual(mockResponse));
      await waitFor(() => expect(valuesWhenFetcherFetchDataResolves[1]).toEqual(false));
  });

  it('should send the error response to mockCompoent when API is error', async () => {
    const mockErrResponse = { error: 'some reason' };
    const testApi = async ({ testId }: TestFetcherState) => Promise.reject(mockErrResponse);
    render(<TestFetcher
        testId={'testId'}
        fetchData={testApi}
        initialChildState={undefined} 
      >
        {mockComponent}
      </TestFetcher>);
      
      await waitFor(() => expect(mockComponent).toHaveBeenCalledTimes(2));;
      const valuesWhenFetcherFetchDataResolves = mockComponent.mock.calls[1];
      await waitFor(() => expect(valuesWhenFetcherFetchDataResolves[1]).toEqual(false));
      await waitFor(() => expect(valuesWhenFetcherFetchDataResolves[3]).toEqual(mockErrResponse));
  });

  it('should call the dataGetter when dataGetter is supplied in props and API is resolved', async () => {
    const mockResponse = { testKey: 'testKey' };
    const testApi = async ({ testId }: TestFetcherState) => Promise.resolve(mockResponse);
    const mockDataGetter = jest.fn((data: any) => undefined);

    render(<TestFetcher
        testId={'testId'}
        fetchData={testApi}
        dataGetter={mockDataGetter}
        initialChildState={undefined} 
      >
        {mockComponent}
      </TestFetcher>);
    
    await waitFor(() => expect(mockDataGetter).toHaveBeenCalledWith(mockResponse));
  });

  it('should give the dataFetcher to parent when delegatedDataFetcher is supplied in props', async () => {
    const mockResponse = { testKey: 'testKey' };
    const testApi = async (props: TestFetcherState) => Promise.resolve(mockResponse);
    
    render(<TestFetcher
        testId={'testId'}
        delegatedDataFetcher={testApi}
        initialChildState={undefined}   
      >
        {mockComponent}
      </TestFetcher>);

    const valuesWhenFetcherLoaded = mockComponent.mock.calls[0];
    const wrappedDelegatedDataFetcher = valuesWhenFetcherLoaded[2];
    wrappedDelegatedDataFetcher();
    await waitFor(() => expect(mockComponent).toHaveBeenCalledTimes(2));
    const valuesWhenFetcherFetchDataResolves = mockComponent.mock.calls[1];
    await waitFor(() => expect(valuesWhenFetcherFetchDataResolves[0]).toEqual(mockResponse));
    await waitFor(() => expect(valuesWhenFetcherFetchDataResolves[1]).toEqual(false));
  });
});
