import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import ExternalLink from '../../../icons/ExternalLink';
import Link, { LinkProps } from '../Link';

export const LinkWrapper: React.FC<LinkProps<any>> = (
  {
    openInNewTab,
    ...rest
  }) => {
  return (
    <Link {...rest} openInNewTab={openInNewTab} icon={openInNewTab ? <ExternalLink/> : <DownloadOutlined/>}/>
  );
};
