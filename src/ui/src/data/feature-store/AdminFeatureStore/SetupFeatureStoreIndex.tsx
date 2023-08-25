import { getFeatureStore } from '@domino/api/dist/Featurestore';
import * as React from 'react';
import styled from 'styled-components';

import EmptyFeatureStore from '../../../icons/EmptyFeatureStore';
import { initialFeatureStore } from '../../../proxied-api/initializers';
import { useRemoteData } from '../../../utils/useRemoteData';
import { SetupFeatureStoreButton } from './SetupFeatureStoreButton';
import { FeatureStoreDescription } from './FeatureStoreDescription';
import { FeatureStoreDetails } from './FeatureStoreDetails';

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

const EmptyFeatureStoreContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 800px;
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SetupFeatureStoreIndexProps {}

export const SetupFeatureStoreIndex = () => {
  const {
    error: featureStoreError,
    data,
    hasLoaded,
    refetch,
  } = useRemoteData({
    canFetch: true,
    fetcher: () => getFeatureStore({}),
    initialValue: initialFeatureStore,
  });

  const isFeatureStoreSetup = React.useMemo(() => {
    return !featureStoreError && hasLoaded;
  }, [featureStoreError, hasLoaded]);

  const handleSetupComplete = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDelete = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isFeatureStoreSetup) {
    return (
      <Container>
        <FeatureStoreDetails featureStore={data} onDelete={handleDelete}/>
      </Container>
    )
  }

  return (
    <Container>
      <EmptyFeatureStoreContainer>
        <EmptyFeatureStore/>
        <FeatureStoreDescription shouldDisplayForEmptyState  />
        <SetupFeatureStoreButton onComplete={handleSetupComplete}/>
      </EmptyFeatureStoreContainer>
    </Container>
  );
}

export default SetupFeatureStoreIndex;
