import * as React from 'react';

import ActionDropdown from '../ActionDropdown';

export const PAGE_SIZES = [10, 50, 100];

export interface PageSizeDropdownProps {
  onPageSizeChange?: (newPageSize: number) => () => void;
  pageSizeOptions?: number[];
  pageSize?: number;
  testId?: string;
  width?: string;
}

export const PageSizeDropdown = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageSizeChange = () => () => {},
  pageSizeOptions = PAGE_SIZES,
  pageSize,
  testId,
  width,
}: PageSizeDropdownProps) => {
  return (
    <ActionDropdown
      dataTest={testId ? testId : 'PaginationDropdown'}
      width={width ? width : '90px'}
      getPopupContainer={(trigger: { parentNode: any; }) => trigger.parentNode}
      label={`${pageSize} entries`}
      showCaret={true}
      menuItems={pageSizeOptions!.map((size: number) => ({
        key: size.toString(),
        content: (
          <div onClick={onPageSizeChange(size)}>
            {size} entries
          </div>
        ),
      }))}
    />
  );
}
