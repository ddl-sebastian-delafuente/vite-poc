import * as React from 'react';
import { isNil } from 'ramda';
import {
	DominoNucleusLibFrontendFrontendConfigDto as FrontendConfig
} from '@domino/api/dist/types';
import { frontendConfig as getFrontendConfig } from '@domino/api/dist/Frontend';
import globalStore, { StoreSubscription } from './GlobalStore';
import storageKeys from './storageKeys';
import { formatFrontendConfig, FormattedFrontendConfig, formattedFrontendConfigInitialState } from './util';

export interface StoreItemDataType {
	isFetching: boolean;
	error?: any;
	value?: FrontendConfig;
}

const defaultValue: StoreItemDataType = {
	isFetching: false,
	error: undefined,
	value: undefined
};

export interface FrontendConfigProps {
	frontendConfig?: FrontendConfig;
	formattedFrontendConfig?: FormattedFrontendConfig;
}

/**
 * This hook fetches and stores the frontendConfig and formattedFrontendConfig to the global store.
 * And subscribes to the global store for the latest values of frontendConfig and formattedFrontendConfig.
 *
 * Usage direction:
 * Sets frontendConfig, formattedFrontendConfig values in the component which uses this hook
 * const { frontendConfig, formattedFrontendConfig } = useFrontendConfig();
 */

const useFrontendConfig: () => FrontendConfigProps = () => {
	let dataInStore: StoreItemDataType | undefined = undefined;
	// Fetch value from the global store and assign it for the initial render
	try {
		dataInStore = globalStore.getItem<StoreItemDataType>(storageKeys.frontendConfig);
	} catch (err) {
		console.error(err);
	}
	const valueFromStore = (!isNil(dataInStore) && !dataInStore.isFetching) ? dataInStore.value : undefined;
	const formattedValue = !isNil(valueFromStore) && !Array.isArray(valueFromStore) ? formatFrontendConfig(valueFromStore) : formattedFrontendConfigInitialState;

	const [frontendConfig, setFrontendConfig] = React.useState<FrontendConfig | undefined>(valueFromStore);
	const [formattedFrontendConfig, setFormattedFrontendConfig] =
		React.useState<FormattedFrontendConfig>(formattedValue);

	// a callback function that triggers when the data of storageKey in the global store gets updated
	const onUpdate = ({ value }: StoreItemDataType) => {
		if (value) {
			// saves the global store data to this component's state variables
			setFrontendConfig(value);
			setFormattedFrontendConfig(formatFrontendConfig(value));
		}
	};

	// Fetches getFrontendConfig endpoint and updates the response in the global store
	const fetchAndSetFrontendConfig = async () => {
		try {
			const data = globalStore.getItem<StoreItemDataType>(storageKeys.frontendConfig);

			/**
			 * This check is to ensure that the endpoint fetching is neither initiated nor completed
			 */
			if (!data.isFetching && isNil(data.value) && isNil(data.error)) {
				globalStore.setItem<StoreItemDataType>(storageKeys.frontendConfig, { isFetching: true });
				try {
					const res: FrontendConfig = await getFrontendConfig({});
					globalStore.setItem<StoreItemDataType>(storageKeys.frontendConfig, {
						isFetching: false,
						error: undefined,
						value: res
					});
				} catch (err) {
					globalStore.setItem<StoreItemDataType>(storageKeys.frontendConfig, {
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
			const isStorageKeyInStore = globalStore.hasKey(storageKeys.frontendConfig);

			// Subscribe for updates if the storageKey already exists in the global store or else
			// create a key in the global store with the provided default value & subscribe for updates

			// Store the subscription that is returned by the global store on subscribe
			subscription = isStorageKeyInStore ?
				globalStore.subscribe(storageKeys.frontendConfig, onUpdate) :
				globalStore.setItem<StoreItemDataType>(storageKeys.frontendConfig, defaultValue, onUpdate)
			fetchAndSetFrontendConfig();
		} catch (err) {
			console.error(err);
		}

		return () => {
			if (!isNil(subscription)) {
				subscription.unsubscribe();
			}
		};
	}, []);

	// returns the latest frontendConfig, formattedFrontendConfig values from the global store
	return { frontendConfig, formattedFrontendConfig };
};

export default useFrontendConfig;
