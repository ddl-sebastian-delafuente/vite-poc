import * as React from 'react';
import IconButton from './IconButton';

const UNICODE_DISMISS = '\u2715';

export type Props = {
  type?: string;
  onClick?: (event: any) => void;
  title?: string;
  href?: string;
  className?: string;
  'data-test'?: string;
  disabled?: boolean;
};

const XButton = ({
  onClick,
  title,
  href,
  className,
  disabled,
  ...rest
}: Props) => (
  <IconButton
    className={className}
    data-test={rest['data-test']}
    isDanger={true}
    href={href}
    title={title}
    onClick={onClick}
    disabled={disabled}
  >
    {UNICODE_DISMISS}
  </IconButton>
);

export default XButton;
