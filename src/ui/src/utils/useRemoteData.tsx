import * as React from 'react';
import { getErrorMessage } from '../components/renderers/helpers';
import { success, error as errorToast } from '../components/toastr';

export interface RemoteDataReturn<T> {
  loading: boolean;
  error?: Error;
  data: T;
  hasLoaded: boolean;
  refetch: () => void;
}

interface RemoteDataProps<T> {
  canFetch: boolean,
  fetcher: () => Promise<T>,
  initialValue: T,
  showErrorLog?: boolean,
  showErrorToast?: boolean,
  showSuccessToast?: boolean,
  defaultErrorMessage?: string,
  successMessage?: string,
}

export const useRemoteData = <T extends unknown>({
  fetcher,
  initialValue,
  showErrorLog,
  showErrorToast,
  showSuccessToast,
  defaultErrorMessage,
  successMessage,
  ...props
}: RemoteDataProps<T>): RemoteDataReturn<T> => {
  const [ canFetch, setCanFetch ] = React.useState<boolean>(props.canFetch);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ hasLoaded, setHasLoaded ] = React.useState<boolean>(false);
  const [ error, setError ] = React.useState<Error>();
  const [ data, setData ] = React.useState<T>(initialValue);
  const [ shouldRefetch, setShouldRefetch ] = React.useState<boolean>(false);

  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetcher();
      setData(response);
      setHasLoaded(true);
      setLoading(false);
      if (showSuccessToast) {
        success(successMessage);
      }
    } catch (e) {
      setError(e);
      setLoading(false);
      if (showErrorLog) {
        console.error(e);
      }
      if (showErrorToast) {
        const errMsg = await getErrorMessage(e, defaultErrorMessage);
        errorToast(errMsg);
      }
    }
  }, [
    fetcher,
    setData,
    setError,
    setLoading,
    showErrorLog,
    showErrorToast,
    showSuccessToast,
    defaultErrorMessage,
    successMessage
  ]);

  const refetch = React.useCallback(() => setShouldRefetch(true), [setShouldRefetch]);

  React.useEffect(() => {
    setCanFetch(props.canFetch);
  }, [props.canFetch]);

  React.useEffect(() => {
    if (shouldRefetch || canFetch ) {
      setCanFetch(false);
      setShouldRefetch(false);
      setLoading(true);
      setError(undefined);
      setTimeout(fetchData, 1);
    }
  }, [
    canFetch,
    fetchData,
    shouldRefetch,
    setData,
    setError,
    setLoading,
    setShouldRefetch,
  ]);

  return {
    loading,
    error,
    data,
    hasLoaded,
    refetch,
  }
}
