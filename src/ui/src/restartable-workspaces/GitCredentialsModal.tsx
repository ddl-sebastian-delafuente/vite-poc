import * as React from 'react';
import { WarningFilled } from '@ant-design/icons';
import { colors, fontSizes } from '@domino/ui/dist/styled';
import Modal, { ModalTitle, Title } from '@domino/ui/dist/components/Modal';
import Link from '@domino/ui/dist/components/Link/Link';
import Button from '@domino/ui/dist/components/Button/Button';
import { equals } from 'ramda';

export enum ExecutionType {
  Job = "Job",
  Workspace = "Workspace",
}

interface Props {
  visible: boolean;
  hideModal: () => void;
  executionType: ExecutionType
}

const GitCredentialsModal = (props: Props) => {
  return (
    <Modal
      title={
        <ModalTitle justifyContent="flex-start">
          <WarningFilled style={{fontSize: fontSizes.MEDIUM, color: colors.tulipTree}}/>
          <Title>Git credentials missing</Title>
        </ModalTitle>
      }
      visible={props.visible}
      footer={
          <Button btnType="primary" onClick={props.hideModal}>
            Ok
          </Button>
      }
      closable={true}
      onCancel={props.hideModal}
    >
      {`Your Git credentials are needed to
      ${equals(props.executionType, ExecutionType.Workspace) ? 'create a Workspace' : 'run a Job'} because it’s needed
      to access the project code repository. Please set up your `}
      <Link href="/account#gitIntegration">Git credential</Link>
      {` under your Account Settings first.`}
    </Modal>
  );
};

export default GitCredentialsModal;
