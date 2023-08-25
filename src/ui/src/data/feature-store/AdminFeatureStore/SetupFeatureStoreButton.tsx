import * as React from 'react';

import Button from '../../../components/Button/Button';
import { SetupFeatureStoreModal } from './SetupFeatureStoreModal'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SetupFeatureStoreButtonProps {
  onComplete?: () => void;
}

export const SetupFeatureStoreButton = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete = () => {},
}: SetupFeatureStoreButtonProps) => {
  const [shouldShowWorkflowModal, setShouldShowWorkflowModal] = React.useState(false);

  const isButtonDisabled = shouldShowWorkflowModal;

  const handleStartWorkflow = React.useCallback(() => {
    setShouldShowWorkflowModal(true);
  }, [setShouldShowWorkflowModal]);

  const handleCompleteWorkflow = React.useCallback(async () => {
    setShouldShowWorkflowModal(false);
    onComplete();
  }, [onComplete, setShouldShowWorkflowModal]);

  const handleCloseWorkflowModal = React.useCallback(() => {
    setShouldShowWorkflowModal(false);
  }, [setShouldShowWorkflowModal])

  return (
    <>
      <Button
        disabled={isButtonDisabled}
        onClick={handleStartWorkflow}
      >Setup Feature Store</Button>
      <SetupFeatureStoreModal
        onClose={handleCloseWorkflowModal}
        onComplete={handleCompleteWorkflow}
        visible={shouldShowWorkflowModal}
      />
    </>
  )
}
