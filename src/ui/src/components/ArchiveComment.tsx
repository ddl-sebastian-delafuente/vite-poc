import * as React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import ModalWithButton from './ModalWithButton';
import InvisibleButton from './InvisibleButton';
import styled from 'styled-components';
import { fontSizes } from '@domino/ui/dist/styled';

export interface ArchiveProps {
  onArchive: (id: string, threadId: string) => void;
  threadId: string;
  id: string;
}

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0 10px;
    &::after {
      border: 0;
    }
  }
`;

const ArchiveComment = (props: ArchiveProps) => {

  const archive = () => {
    const index = props.id as string;
    props.onArchive(index, props.threadId);
  };

  return (
    <ModalWithButton
      ModalButton={StyledInvisibleButton}
      openButtonLabel={<DeleteOutlined style={{fontSize: fontSizes.MEDIUM}} />}
      openButtonProps={{ type: 'default' }}
      handleSubmit={archive}
      modalSubmitButtonLabel="Yes, Delete"
    >
      Are you sure you want to delete this comment? <b>You will not be able to undo this.</b>
    </ModalWithButton>
  );
};

export default ArchiveComment;
