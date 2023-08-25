import {
  DominoLayoutWebCompleteWorkflowResponse as WorkflowReponse
} from '@domino/api/dist/types';
import * as React from 'react';

import { FieldStyle } from '../components/DynamicField';
import { DynamicWizard } from '../components/DynamicWizard';
import Modal, { DominoModalProps } from '../components/Modal';
import { success } from '../components/toastr';
import { WorkflowId } from '../proxied-api/types';

export interface CreateDatasetModalProps extends Pick<DominoModalProps, 'visible'> {
  onClose?: () => void;
  onComplete?: (response: WorkflowReponse) => void;
  projectId: string;
}

export const CreateDatasetModal = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onComplete = (response: WorkflowReponse) => {},
  projectId,
  visible,
}: CreateDatasetModalProps) => {
  const handleComplete = React.useCallback((response: WorkflowReponse) => {
    success('Successfully created dataset');
    onComplete(response);
  }, [onComplete]);

  return (
    <Modal
      bodyStyle={{padding: 0}}
      closable
      maskClosable
      noFooter
      onCancel={onClose}
      titleIconName="DataIcon"
      titleText="Create Dataset"
      visible={visible}
      width={850}
    >
      <DynamicWizard
        antFormProps={{ requiredMark: 'optional'}}
        initialData={{ projectId }}
        fieldStyle={FieldStyle.FormItem}
        onCancel={onClose}
        onComplete={handleComplete}
        stepperProps={{
          contentWidth: '650px',
        }}
        workflowId={WorkflowId.CreateDataset}
      />
    </Modal>
  )
}
