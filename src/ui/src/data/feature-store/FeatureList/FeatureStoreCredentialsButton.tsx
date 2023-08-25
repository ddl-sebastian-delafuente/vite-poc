import {
  DominoFeaturestoreApiFeatureStoreDto as FeatureStoreDto,
} from '@domino/api/dist/types';
import * as React from 'react';

import Button, { ButtonProps } from '../../../components/Button/Button';
import { OfflineStoreType, OnlineStoreType } from '../../../proxied-api/types';
import { 
  FeatureStoreEnvVarsModalProps,
  FeatureStoreEnvVarsModal 
} from '../FeatureStoreEnvVarsModal';

export interface FeatureStoreCredentialsButtonProps extends
  Pick<FeatureStoreEnvVarsModalProps, 'data'>,
  Pick<ButtonProps, 'btnType'> {
  buttonText: string;
  featureStore: FeatureStoreDto;
  hasEnvVars?: boolean;
  onCredentialsAdded?: () => void;
}

export const FeatureStoreCredentialsButton = ({
  data = {},
  btnType,
  buttonText,
  featureStore,
  hasEnvVars,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCredentialsAdded = () => {},
}: FeatureStoreCredentialsButtonProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleEnableFeatureStore = React.useCallback(() => {
    if (modalVisible) {
      setModalVisible(false);
    }

    onCredentialsAdded();
  }, [modalVisible, onCredentialsAdded, setModalVisible]);

  const handleRaiseModal = React.useCallback(() => {
    const offlineNoEnvVars = featureStore.offlineStoreType === OfflineStoreType.File;
    const onlineNoEnvVars = featureStore.onlineStoreType === OnlineStoreType.SQLite;
    if ((!offlineNoEnvVars || !onlineNoEnvVars) && !hasEnvVars) {
      setModalVisible(true);
      return;
    }

    handleEnableFeatureStore();
  }, [featureStore, handleEnableFeatureStore, hasEnvVars, setModalVisible]);

  const handleCloseModal = React.useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  return (
    <>
      <Button btnType={btnType} onClick={handleRaiseModal}>{buttonText}</Button>
      {modalVisible && (
        <FeatureStoreEnvVarsModal
          data={data}
          featureStoreId={featureStore.id}
          offlineStoreConfig={featureStore.offlineStoreConfig}
          offlineStoreType={featureStore.offlineStoreType}
          onlineStoreConfig={featureStore.onlineStoreConfig}
          onlineStoreType={featureStore.onlineStoreType}
          onClose={handleCloseModal}
          onComplete={handleEnableFeatureStore}
          visible={modalVisible}
        />
      )}
    </>
  )
}
