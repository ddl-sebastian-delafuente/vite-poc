import { getCredentialConfigs } from '@domino/api/dist/Featurestore';
import * as React from 'react';

import {
  FieldStyle,
  FieldData,
} from '../../components/DynamicField';
import {
  DynamicWizard,
  WORKFLOW,
} from '../../components/DynamicWizard';
import Modal, { DominoModalProps } from '../../components/Modal';
import { 
  OfflineStoreType, 
  OnlineStoreType,
} from '../../proxied-api/types';
import { useRemoteData } from '../../utils/useRemoteData';

export interface FeatureStoreEnvVarsModalProps extends
  Pick<DominoModalProps, 'visible'> {
  data?: FieldData;
  featureStoreId: string;
  offlineStoreConfig?: FieldData;
  offlineStoreType?: OfflineStoreType;
  onlineStoreConfig?: FieldData;
  onlineStoreType?: OnlineStoreType;
  onClose?: () => void;
  onComplete?: () => void;
}

export const FeatureStoreEnvVarsModal = ({
  data = {},
  offlineStoreConfig = {},
  featureStoreId,
  offlineStoreType,
  onlineStoreConfig = {},
  onlineStoreType,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete = () => {},
  visible,
}: FeatureStoreEnvVarsModalProps) => {
  const {
    data: config,
    hasLoaded,
    loading,
  } = useRemoteData({
    canFetch: true,
    fetcher: () => getCredentialConfigs({ featureStoreId }),
    initialValue:{
      offlineStoreCredentials: [],
      onlineStoreCredentials: [],
    }
  });

  const multiStep = React.useMemo(() => {
    return config.offlineStoreCredentials.length > 0 && config.onlineStoreCredentials.length > 0;
  }, [config]);

  const initialData = {
    ...data,
    offlineStoreConfig,
    onlineStoreConfig,
    featureStoreId,
    offlineStoreType,
    onlineStoreType,
  };

  return (
    <Modal
      closable
      noFooter
      onCancel={onClose}
      titleIconName="DataIcon"
      titleText="Setup Feature Store Data Source Credentials"
      visible={visible}
      width={multiStep ? 850 : 650}
    >
      {hasLoaded && !loading && (
        <DynamicWizard
          antFormProps={{ requiredMark: 'optional'}}
          fieldStyle={FieldStyle.FormItem}
          initialData={initialData}
          onCancel={onClose}
          onComplete={onComplete}
          stepperProps={{
            contentWidth: '650px',
          }}
          workflowId={WORKFLOW.addFeatureStoreCredentials}
        />
        )}
    </Modal>
  );
}
