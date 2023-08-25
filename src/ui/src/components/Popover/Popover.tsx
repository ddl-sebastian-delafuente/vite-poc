import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Popover as AntdPopover, PopoverProps } from 'antd';

const Popover = (props: PopoverProps) => {
  return <AntdPopover {...props} />;
};

export { PopoverProps };
export default Popover;
