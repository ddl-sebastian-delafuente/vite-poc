import {
  getFeatureViews,
} from '@domino/api/dist/Featurestore'
/**
 * The Domino drawer wrapper has limitations that I am trying to avoid
 * namely contents don't unmount when the drawer is hidden and also a 
 * button is pre integrated to show/hide the drawer
 */
// eslint-disable-next-line no-restricted-imports
import { Drawer } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button/Button';
import XIcon from '../../../icons/X';
import { borderGrey } from '../../../styled/colors';
import { themeHelper } from '../../../styled/themeUtils';
import { useRemoteData } from '../../../utils/useRemoteData';
import { SearchableFeatureList } from './SearchableFeatureList';

const DrawerContentHeader = styled.header`
  align-items: center;
  border-bottom: 1px solid ${borderGrey};
  display: flex;
  font-size: ${themeHelper('fontSizes.large')};
  justify-content: space-between;
  padding: 10px;
`;

const DrawerContentBody = styled.div`
  padding: 10px;
`

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
`;

const StyledXIcon = styled(XIcon)`
  color: grey;
  cursor: pointer;

  path {
    fill: grey;
  }
`

export interface ExploreFeaturesDrawerProps {
  projectId?: string;
}

export const ExploreFeaturesDrawer = ({ projectId }: ExploreFeaturesDrawerProps) => {
  const [contentVisible, setContentVisible] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const {
    data: globalFeatureViews,
  } = useRemoteData({
    canFetch: contentVisible,
    fetcher:  () => getFeatureViews({}),
    initialValue: []
  });

  const handleCloseDrawer = React.useCallback(() => setVisible(false), [setVisible]);
  const handleOpenDrawer = React.useCallback(() => setVisible(true), [setVisible]);

  const handleAfterVisible = React.useCallback((newVisible: boolean) => {
    setContentVisible(newVisible);
  }, [setContentVisible]);

  return (
    <>
      <StyledDrawer
        afterVisibleChange={handleAfterVisible}
        closable={false}
        placement="right"
        visible={visible}
        width="800px"
      >
        <DrawerContentHeader>
          <span>Add more features</span>
          <StyledXIcon onClick={handleCloseDrawer} height="22" width="22" />
        </DrawerContentHeader>
        <DrawerContentBody>
          <SearchableFeatureList 
            featureViews={globalFeatureViews}
            projectId={projectId}
            title="Feature views across all projects"
          />
        </DrawerContentBody>
      </StyledDrawer>
      <Button onClick={handleOpenDrawer}>Add more features</Button>
    </>
  )
}
