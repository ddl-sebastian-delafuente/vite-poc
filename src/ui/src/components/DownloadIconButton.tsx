import * as React from 'react';
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined';
import Button from './Button/Button';

interface DownloadIconButtonProps {
  onClick: (e?: any) => void;
  componentType: string;
  themeType: string;
  children: React.ReactNode;
  "aria-label": string;
}

const DownloadIconButton: React.FC<DownloadIconButtonProps> = (props) => {
  const buttonProps = {
    componentType: props.componentType,
    themeType: props.themeType,
    children: props.children,
    "aria-label": props['aria-label'],
  };

  return (
    <Button
      icon={<DownloadOutlined />}
      onClick={props.onClick}
      {...buttonProps}
      data-test='downloadIcon-button'
    />
  );
};

export default DownloadIconButton;
