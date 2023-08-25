import * as React from 'react';
import { isNil } from 'ramda';
import { getPrincipal as fetchPrincipal } from '@domino/api/dist/Auth';
import {
  DominoNucleusLibAuthPrincipalWithFeatureFlags as Principal
} from '@domino/api/dist/types';
import { formatPrincipal, FormattedPrincipal, formattedPrincipalInitialState } from './util';
import globalStore, { StoreSubscription } from './GlobalStore';
import storageKeys from './storageKeys';

export interface StoreItemDataType {
  isFetching: boolean;
  error?: any;
  value?: Principal;
}

const defaultValue: StoreItemDataType = {
  isFetching: false,
  error: undefined,
  value: undefined
};

export interface PrincipalProps {
  principal?: Principal;
  formattedPrincipal?: FormattedPrincipal;
}

/**
 * This hook fetches and stores the principal, formatted principal to the global store.
 * And subscribes to the global store for the latest values of principal, formattedPrincipal.
 *
 * Usage direction:
 * Sets principal, formattedPrincipal values in the component which uses this hook
 * const { principal, formattedPrincipal } = usePrincipal();
 */

const usePrincipal: () => PrincipalProps = () => {
  let dataInStore: StoreItemDataType | undefined = undefined;
  // Fetch value from the global store and assign it for the initial render
  try {
    dataInStore = globalStore.getItem<StoreItemDataType>(storageKeys.principal);
  } catch (err) {
    console.error(err);
  }
  const valueFromStore = (!isNil(dataInStore) && !dataInStore.isFetching) ? dataInStore.value : undefined;
  const formattedValue = !isNil(valueFromStore) && !Array.isArray(valueFromStore) ? formatPrincipal(valueFromStore) : formattedPrincipalInitialState;

  const [principal, setPrincipal] = React.useState<Principal | undefined>(valueFromStore);
  const [formattedPrincipal, setFormattedPrincipal] =
    React.useState<FormattedPrincipal>(formattedValue);

  // a callback function that triggers when the data of storageKey in the global store gets updated
  const onUpdate = ({ value }: StoreItemDataType) => {
    if (value) {
      // saves the global store data to this component's state variables
      setPrincipal(value);
      setFormattedPrincipal(formatPrincipal(value));
    }
  };

  // Fetches principal endpoint and updates the response in the global store
  const fetchAndSetPrincipal = async () => {
    try {
      const data = globalStore.getItem<StoreItemDataType>(storageKeys.principal);
      
      /**
       * This check is to ensure that the endpoint fetching is neither initiated nor completed
       */
      if (!data.isFetching && isNil(data.value) && isNil(data.error)) {
        globalStore.setItem<StoreItemDataType>(storageKeys.principal, { isFetching: true });
        try {
          const res: Principal = await fetchPrincipal({});
          globalStore.setItem<StoreItemDataType>(storageKeys.principal, {
            isFetching: false,
            error: undefined,
            value: res
          });
        } catch (err) {
          globalStore.setItem<StoreItemDataType>(storageKeys.principal, {
            isFetching: false,
            error: err,
            value: undefined
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    let subscription: StoreSubscription | undefined = undefined;
    try {
      const isStorageKeyInStore = globalStore.hasKey(storageKeys.principal);

      // Subscribe for updates if the storageKey already exists in the global store or else
      // create a key in the global store with the provided default value & subscribe for updates

      // Store the subscription that is returned by the global store on subscribe
      subscription = isStorageKeyInStore ?
        globalStore.subscribe(storageKeys.principal, onUpdate) :
        globalStore.setItem<StoreItemDataType>(storageKeys.principal, defaultValue, onUpdate)
      fetchAndSetPrincipal();
    } catch (err) {
      console.error(err);
    }

    return () => {
      if (!isNil(subscription)) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // returns the latest principal, formattedPrincipal values from the global store
  return { principal, formattedPrincipal };
};

export default usePrincipal;
