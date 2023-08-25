import React, {useState} from 'react';
import DominoModal from '@domino/ui/dist/components/Modal';
import {DMM_LINK as basePath} from "@domino/ui/dist/dmmConfiguration";
import {TestsAndThresholdContainer} from "@domino/ui/dist/modelmanager/atoms";
import {StyledThresholdModal} from "./atoms";

interface Props {
  visible: boolean;
  closeModal: () => void;
  dmmModelId: string;
}

const TestsAndThresholds = ({visible, closeModal, dmmModelId}: Props) => {
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const modelContainerId = `${dmmModelId}-dmm-threshold-modal`;
  return (
    <StyledThresholdModal id={modelContainerId} data-test="tests-and-thresholds-modal">
      <DominoModal
        width="95%"
        destroyOnClose
        getContainer={document.getElementById(modelContainerId)!}
        title="Configure Tests and Thresholds"
        maskClosable={false}
        closable={true}
        footer={null}
        visible={visible}
        onCancel={closeModal}>
        <TestsAndThresholdContainer>
          {isIframeLoading && 'Loading...'}
          <iframe
            onLoad={() => {
              setIsIframeLoading(false);
            }}
            src={`${basePath}/workbench-model-drift-analyse/${dmmModelId}`}
            title="Data Drift"
            data-test="tests-and-threshold-iframe"
          />
        </TestsAndThresholdContainer>
      </DominoModal>
    </StyledThresholdModal>
  );
}

export default TestsAndThresholds;
