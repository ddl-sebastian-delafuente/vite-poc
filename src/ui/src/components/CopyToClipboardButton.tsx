import * as React from 'react';
import { useState } from 'react';
import { Tooltip } from 'antd';
import copyToClipboard from 'copy-to-clipboard';
import InvisibleButton from './InvisibleButton';
import OcticonClippy from '../icons/OcticonClippy';
import styled from 'styled-components';

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    color: currentColor;
    padding: 0 0 0 15px;
    vertical-align: top;
  }
`;

export interface CopyToClipboardButtonProps {
  textToCopy: string;
  height?: number;
  width?: number;
}
/**
 * A button-only version of CopyToClipboard that uses OcticonClippy as an icon.
 */
const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({textToCopy, height, width}) => {
  const [isCopied, setCopied] = useState(false);

  const handleClick = () => {
    setCopied(true);
    copyToClipboard(textToCopy);
  };

  return (
    <Tooltip
      title={isCopied ? 'Copied!' : 'Click to copy to clipboard'}
      overlayStyle={{
        padding: '0',
        background: 'black',
        borderRadius: '4px'
      }}
      placement="bottom"
    >
      <StyledInvisibleButton onClick={handleClick}>
        <OcticonClippy height={height} width={width} />
      </StyledInvisibleButton>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
