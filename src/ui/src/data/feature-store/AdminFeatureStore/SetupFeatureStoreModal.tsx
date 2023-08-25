import { getCurrentUser } from '@domino/api/dist/Users';
import * as React from 'react';

import { FieldStyle } from '../../../components/DynamicField';
import { DynamicWizard, WORKFLOW } from '../../../components/DynamicWizard';
import Modal, { DominoModalProps } from '../../../components/Modal';
import { success } from '../../../components/toastr';
import { initialUser } from '../../../proxied-api/initializers';
import { useRemoteData } from '../../../utils/useRemoteData';

export interface SetupFeatureStoreModalProps extends Pick<DominoModalProps, 'visible'> {
  onClose?: () => void;
  onComplete?: (featureViewId: string) => void;
}

export const SetupFeatureStoreModal = ({ 
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete = () => {},
  visible,
}: SetupFeatureStoreModalProps) => {
  const { data: user } = useRemoteData({
    canFetch: true,
    fetcher: () => getCurrentUser({}),
    initialValue: initialUser,
  })

  const handleComplete = React.useCallback(() => {
    success('Successfully created the feature store');
    onComplete('todo-on-integratio-pr');
  }, [onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      bodyStyle={{padding: 0}}
      closable
      noFooter
      onCancel={onClose}
      titleIconName="DataIcon"
      titleText="Set Up Feature Store"
      visible={visible}
      width={850}
    >
      <DynamicWizard
        antFormProps={{ requiredMark: 'optional'}}
        fieldStyle={FieldStyle.FormItem}
        onCancel={onClose}
        onComplete={handleComplete}
        stepperProps={{
          allowForwardNavigationWithErrors: false,
          contentWidth: '650px',
        }}
        userId={user.id}
        workflowId={WORKFLOW.createFeatureStore}
      />
    </Modal>
  )
}
