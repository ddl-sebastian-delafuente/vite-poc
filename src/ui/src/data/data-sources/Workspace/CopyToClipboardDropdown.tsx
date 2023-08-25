import { getAllConnectionSnippets } from '@domino/api/dist/Datasource';
import { CopyOutlined } from '@ant-design/icons';
import * as React from 'react';

import ActionDropdown from '../../../components/ActionDropdown/ActionDropdown';
import { copyToClipboard } from '../../../utils/copyToClipboard';
import { useRemoteData } from '../../../utils/useRemoteData';

export interface CopyToClipboardDropdownProps {
  dataSourceId: string;
  dataSourceName: string;
}

export const CopyToClipboardDropdown = ({
  dataSourceId,
  dataSourceName,
}: CopyToClipboardDropdownProps) => {
  const [canFetch, setCanFetch] = React.useState(false);
  const {
    data: snippets,
  } = useRemoteData({
    canFetch,
    fetcher: () => getAllConnectionSnippets({ dataSourceId, dataSourceName }),
    initialValue: { snippetsByLanguages: {} },
  });

  const handleFetchData = React.useCallback(() => {
    setCanFetch(true);
  }, [setCanFetch]);

  const menuItems = React.useMemo(() => {
    const { snippetsByLanguages } = snippets;
    return Object.keys(snippetsByLanguages).reduce((memo, keyName) => {
      const value = snippetsByLanguages[keyName];

      if (value !== null) {
        memo.push({
          key: keyName,
          content: keyName
        });
      }

      return memo;
    }, [] as any[]);
  }, [snippets]);

  //eslint-disable-next-line
  const handleMenuClick = React.useCallback(({ key }: { key: string }) => {
    const { snippetsByLanguages } = snippets;

    const value = snippetsByLanguages[key];

    if (value !== null) {
      // handle copy to clipboard
      copyToClipboard(value, { excludeUri: true, element: 'textarea' });
    }
  }, [snippets])

  return (
    <ActionDropdown
      icon={<CopyOutlined onMouseEnter={handleFetchData}/>}
      menuItems={menuItems}
      onMenuClick={handleMenuClick}
      width="auto"
    />
  )
}
