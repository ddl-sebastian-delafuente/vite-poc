import * as React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { AntIconButton } from '../components/IconButton';
import { Tooltip } from 'antd';

export type Props = {
  showDropZone: () => void;
  disabled?: boolean;
  isLiteUser?: boolean;
};

const UploadFilesButton: React.FC<Props> = ({
  showDropZone,
  disabled = false,
  isLiteUser,
}) => (
  <Tooltip title={isLiteUser ? 'Contact admin for file upload permission' : 'Upload'} placement="top">
    <span>
      <AntIconButton
        data-test="UploadFilesButton"
        id="uploadBtn"
        disabled={isLiteUser || disabled}
        aria-label="Upload"
        onClick={showDropZone}
      >
        <UploadOutlined />
      </AntIconButton>
    </span>
  </Tooltip>
);

export default UploadFilesButton;
