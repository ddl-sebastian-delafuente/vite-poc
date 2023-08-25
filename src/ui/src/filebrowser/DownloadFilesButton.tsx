import * as React from 'react';
import { AntIconButton } from '../components/IconButton';
import { DownloadOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export type Props = {
  disabled: boolean;
  isLiteUser: boolean;
  handleDownloadFiles: () => void;
};

const DownloadFilesButton: React.FC<Props> = ({
  disabled = false,
  isLiteUser,
  handleDownloadFiles,
}) => (
  <Tooltip title={isLiteUser ? 'Contact admin for file download permission' : 'Download'} placement="top">
    <span> {/* Add this span for Tooltip */}
      <AntIconButton
        data-test="DownloadFilesButton"
        id="downloadSelectedFilesBtn"
        aria-label="Download"
        disabled={isLiteUser || disabled}
        onClick={handleDownloadFiles}
      >
        <DownloadOutlined />
      </AntIconButton>
    </span>
  </Tooltip>
);

export default DownloadFilesButton;
