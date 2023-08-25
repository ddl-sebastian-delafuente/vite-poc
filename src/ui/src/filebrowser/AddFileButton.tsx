import * as React from 'react';
import { Tooltip } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { AntIconButton } from '../components/IconButton';

export type Props = {
  createFileEndpoint: string;
  disabled?: boolean;
  isLiteUser?: boolean;
};

const AddFileButton: React.FC<Props> = ({
  createFileEndpoint,
  disabled = false,
  isLiteUser
}) => (
  <Tooltip title={isLiteUser ? 'Contact admin for file addition permission' : 'Add File'} placement="top">
    <span>
      <AntIconButton
        data-test="CreateFileButton"
        disabled={isLiteUser || disabled}
        href={createFileEndpoint}
        id="createFileBtn"
        aria-label="Add File"
      >
        <FileAddOutlined />
      </AntIconButton>
    </span>
  </Tooltip>
);

export default AddFileButton;
