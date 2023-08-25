import * as React from 'react';
import { isNil } from 'ramda';
import globalStore, { StoreSubscription } from './GlobalStore';
import storageKeys from './storageKeys';
import {
    DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings,
} from '@domino/api/dist/types';
import { getWhiteLabelConfigurations } from '@domino/api/dist/Admin';

export interface StoreItemDataType {
  isFetching: boolean;
  error?: any;
  value?: WhiteLabelSettings;
}

const defaultValue: StoreItemDataType = {
  isFetching: false,
  error: undefined,
  value: undefined
};

export interface WhiteLabelSettingsProps {
  whiteLabelSettings?: WhiteLabelSettings;
}

const useWhiteLabelSettings: () => WhiteLabelSettingsProps = () => {
  let dataInStore: StoreItemDataType | undefined = undefined;
  // Fetch value from the global store and assign it for the initial render
  try {
    dataInStore = globalStore.getItem<StoreItemDataType>(storageKeys.whiteLabelSettings);
  } catch (err) {
    console.error(err);
  }
  const valueFromStore = (!isNil(dataInStore) && !dataInStore.isFetching) ? dataInStore.value : undefined;

  const [whiteLabelSettings, setWhiteLabelSettings] = React.useState<WhiteLabelSettings | undefined>(valueFromStore);

  // a callback function that triggers when the data of storageKey in the global store gets updated
  const onUpdate = ({ value }: StoreItemDataType) => {
    if (value) {
      // saves the global store data to this component's state variables
      setWhiteLabelSettings(value);
    }
  };

  // Fetches Whitelabelsettings endpoint and updates the response in the global store
  const fetchAndSetWhiteLabelSettings = async () => {
    try {
      const data = globalStore.getItem<StoreItemDataType>(storageKeys.whiteLabelSettings);

      /**
       * This check is to ensure that the endpoint fetching is neither initiated nor completed
       */
      if (!data.isFetching && isNil(data.value) && isNil(data.error)) {
        globalStore.setItem<StoreItemDataType>(storageKeys.whiteLabelSettings, { isFetching: true });
        try {
          const res: WhiteLabelSettings = await getWhiteLabelConfigurations({});
          globalStore.setItem<StoreItemDataType>(storageKeys.whiteLabelSettings, {
            isFetching: false,
            error: undefined,
            value: res
          });
        } catch (err) {
          globalStore.setItem<StoreItemDataType>(storageKeys.whiteLabelSettings, {
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
      const isStorageKeyInStore = globalStore.hasKey(storageKeys.whiteLabelSettings);

      // Subscribe for updates if the storageKey already exists in the global store or else
      // create a key in the global store with the provided default value & subscribe for updates

      // Store the subscription that is returned by the global store on subscribe
      subscription = isStorageKeyInStore ?
        globalStore.subscribe(storageKeys.whiteLabelSettings, onUpdate) :
        globalStore.setItem<StoreItemDataType>(storageKeys.whiteLabelSettings, defaultValue, onUpdate)
        fetchAndSetWhiteLabelSettings();
    } catch (err) {
      console.error(err);
    }

    return () => {
      if (!isNil(subscription)) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // returns the latest whiteLabelSettings value from the global store
  return { whiteLabelSettings };
};

export default useWhiteLabelSettings;
