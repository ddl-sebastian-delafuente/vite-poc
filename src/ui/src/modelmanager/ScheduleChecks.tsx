import React, { useState } from 'react';
import DominoModal from '@domino/ui/dist/components/Modal';
import { DMM_LINK as basePath } from '../dmmConfiguration';
import { ScheduleCheckContainer } from '@domino/ui/dist/modelmanager/atoms';

interface Props {
  visible: boolean;
  closeModal: () => void;
  dmmModelId: string;
}

const ScheduleChecks = ({visible, closeModal, dmmModelId}: Props) => {
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  return (
    <DominoModal
      width="70%"
      destroyOnClose
      title="Configure Schedule"
      maskClosable={false}
      closable={true}
      visible={visible}
      onCancel={closeModal}
      noFooter
      testId="schedule-checks-modal-"
      data-test="schedule-checks-modal"
    >
      <ScheduleCheckContainer data-test="schedule-check-container">
        {isIframeLoading && 'Loading...'}
        <iframe
          onLoad={() => {
            setIsIframeLoading(false);
          }}
          src={`${basePath}/workbench-model-drift-schedule-check/${dmmModelId}`}
          title="Data Drift"
          data-test="schedule-check-iframe"
        />
      </ScheduleCheckContainer>
    </DominoModal>
  );
}

export default ScheduleChecks;
