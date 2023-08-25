import {
  getCredentialConfigs,
  getFeatureStore,
  getFeatureViewsByProjectAndUser,
  getFeatureViews,
} from '@domino/api/dist/Featurestore'
import { listUserEnvironmentVariables } from '@domino/api/dist/Users';
import styled from 'styled-components';
import * as React from 'react';

import RouteLink from '../../components/Link/RouteLink';
import WarningBox from '../../components/WarningBox';
import { 
  jobSection,
} from '../../core/routes';
import { 
  initialCredentialConfigs, 
  initialFeatureStore,
} from '../../proxied-api/initializers';
import { FeatureStoreSyncStatus  } from '../../proxied-api/types';
import { themeHelper } from '../../styled/themeUtils';
import { UnionToMap } from '../../utils/typescriptUtils';
import { useRemoteData } from '../../utils/useRemoteData';
import { ExploreFeaturesDrawer } from './FeatureList/ExploreFeaturesDrawer';
import { FeatureStoreCredentialsButton } from './FeatureList/FeatureStoreCredentialsButton';
import { SearchableFeatureList } from './FeatureList/SearchableFeatureList';
import { LoginInterstitial } from '../LoginInterstitial';
import { NativeControl } from '../SearchableList';
import {
  EmptyStateMode,
  EmptyFeatureList,
} from './FeatureList/EmptyFeatureList';
import { extractFeatureStoreEnvVars } from './utils';
import { usePublishFeatureStore } from './usePublishFeatureStore';

export type DisplayMode =
  'global' |
  'project';
export const DisplayMode: UnionToMap<DisplayMode> = {
  global: 'global',
  project: 'project',
}

export interface FeatureListIndexProps {
  displayMode?: DisplayMode;
  ownerName?: string;
  projectId?: string;
  projectName?: string;
  userIsAnonymous?: boolean;
}

const StyledWarningBox = styled(WarningBox)`
  width: 100%;
`;

const Action = styled.span`
  color: ${themeHelper('link.basic.color')};
  cursor: pointer;
  font-size: ${themeHelper('fontSizes.small')};
  
  &:hover {
    color: ${themeHelper('link.basic.color')};
    text-decoration: underline;
  }
`;

export const FeatureListIndex = ({
  ownerName,
  projectId,
  projectName,
  userIsAnonymous,
  ...props
}: FeatureListIndexProps) => {
  const [emptyStateMode, setEmptyStateMode] = React.useState<EmptyStateMode | null>(null);
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>(props.displayMode || DisplayMode.global);

  React.useEffect(() => {
    setDisplayMode(props.displayMode || DisplayMode.global);
  }, [props.displayMode, setDisplayMode])

  // Fetch Feature Store first
  const {
    data: featureStore,
    error: featureStoreError,
    hasLoaded: featureStoreHasLoaded,
    refetch: featureStoreRefetch,
  } = useRemoteData({
    canFetch: !userIsAnonymous,
    fetcher: () => getFeatureStore({}),
    initialValue: initialFeatureStore,
  });

  const canFetchGlobalFeatureViews = featureStoreHasLoaded &&
    !emptyStateMode &&
    !featureStoreError;

  const canFetchProjectFeatureViews = Boolean(canFetchGlobalFeatureViews && projectId);

  const {
    data: projectFeatureViews,
    hasLoaded: projectFeatureViewsHasLoaded,
    refetch: projectFeatureViewsRefetch,
  } = useRemoteData({
    canFetch: canFetchProjectFeatureViews,
    fetcher: () => {
      if (projectId) {
        return getFeatureViewsByProjectAndUser({ projectId })
      }

      return Promise.resolve([]);
    },
    initialValue: [],
  });

  const {
    data: globalFeatureViews,
    hasLoaded: globalFeatureViewsHasLoaded,
    refetch: globalFeatureViewsRefetch
  } = useRemoteData({
    canFetch: canFetchGlobalFeatureViews,
    fetcher:  () => getFeatureViews({}),
    initialValue: []
  });

  const isGlobalMode = displayMode === DisplayMode.global;
  const isProjectMode = displayMode === DisplayMode.project;

  const featureViews = React.useMemo(() => isGlobalMode ? globalFeatureViews : projectFeatureViews, [
    globalFeatureViews, 
    projectFeatureViews,
    isGlobalMode,
  ]);

  const featureViewsHasLoaded = React.useMemo(() => isGlobalMode ? globalFeatureViewsHasLoaded : projectFeatureViewsHasLoaded, [
    globalFeatureViewsHasLoaded,
    projectFeatureViewsHasLoaded,
    isGlobalMode
  ]);

  const canFetchFeatureViews = React.useMemo(() => isGlobalMode ? canFetchGlobalFeatureViews : canFetchProjectFeatureViews, [
    canFetchGlobalFeatureViews,
    canFetchProjectFeatureViews,
    isGlobalMode,
  ]);

  const { retryPublishJob } = usePublishFeatureStore({
    featureStoreId: featureStore.id,
    onComplete: featureStoreRefetch,
  });

  const {
    data: credentialConfigs,
  } = useRemoteData({
    canFetch: featureStoreHasLoaded,
    fetcher: () => getCredentialConfigs({ featureStoreId: featureStore.id }),
    initialValue: initialCredentialConfigs
  })

  const {
    data: envVars,
    refetch: refetchEnvVars,
  } = useRemoteData({
    canFetch: true,
    fetcher: () => listUserEnvironmentVariables({}),
    initialValue: { vars: [] }
  });

  const extractedVars = React.useMemo(() => {
    return extractFeatureStoreEnvVars(envVars, featureStore.offlineStoreType, featureStore.onlineStoreType);
  }, [
    envVars,
    featureStore.offlineStoreType,
    featureStore.onlineStoreType
  ]);

  const hasEnvVars = React.useMemo(() => {
    const hasOfflineVars = Object.keys(extractedVars.offlineStoreEnvVars).length > 0 || credentialConfigs.offlineStoreCredentials.length === 0;
    const hasOnlineVars =  Object.keys(extractedVars.onlineStoreEnvVars).length > 0 || credentialConfigs.onlineStoreCredentials.length === 0;

    return hasOfflineVars && hasOnlineVars;

  }, [
    credentialConfigs,
    extractedVars, 
  ]);
  const handleCredentialsAdded = React.useCallback(() => {
    refetchEnvVars();
  }, [refetchEnvVars]);

  const handleEnabledFeatureStore = React.useCallback(() => {
    featureStoreRefetch();
    projectFeatureViewsRefetch();
    globalFeatureViewsRefetch();
  }, [
    featureStoreRefetch, 
    globalFeatureViewsRefetch,
    projectFeatureViewsRefetch,
  ]);

  const handleExploreFeatures = React.useCallback(() => {
    setDisplayMode(DisplayMode.global);
  }, [setDisplayMode]);

  const handleRetryJob = React.useCallback(() => {
    if (projectId && featureStore.runId) {
      retryPublishJob(featureStore.runId, projectId);
    }
  }, [featureStore, projectId, retryPublishJob]);
  
  React.useEffect(() => {
    if (featureStoreError) {
      setEmptyStateMode(EmptyStateMode.Setup);
    }
  }, [featureStoreError, setEmptyStateMode]);

  React.useEffect(() => {
    // Check if project has featurestor enabled
    if (!featureStoreError && projectId) {
      setEmptyStateMode(featureStore.projectIds.indexOf(projectId) === -1 ? EmptyStateMode.Enable : null);
    }
  }, [ featureStore, featureStoreError, projectId ]);

  React.useEffect(() => {
    if (projectId) {
      setEmptyStateMode(!isGlobalMode && featureViews.length === 0 ? EmptyStateMode.Explore : null);
    }
  }, [ featureViews, isGlobalMode, projectId, setEmptyStateMode ]);

  React.useEffect(() => {
    // If feature views is empty we're fetching global feature views
    // set mode to empty
    const isEmptyGlobalFeaturesViews = globalFeatureViews.length === 0 &&
      globalFeatureViewsHasLoaded &&
      isGlobalMode;

    if (isEmptyGlobalFeaturesViews) {
      setEmptyStateMode(EmptyStateMode.Empty);
    }
  }, [globalFeatureViews, globalFeatureViewsHasLoaded, setEmptyStateMode, isGlobalMode]);

  if (userIsAnonymous) {
    return <LoginInterstitial/>
  }

  if (emptyStateMode) {
    return (
      <EmptyFeatureList
        featureStore={featureStore}
        hasEnvVars={hasEnvVars}
        hasGlobalFeatures={globalFeatureViews.length > 0}
        mode={emptyStateMode}
        onCredentialsAdded={handleCredentialsAdded}
        onEnabledFeaturestore={handleEnabledFeatureStore}
        onExploreFeatures={handleExploreFeatures}
        projectId={projectId}
      />
    );
  }
  
  if (!featureStoreHasLoaded || (featureStoreHasLoaded && canFetchFeatureViews && !featureViewsHasLoaded)) {
    return null;
  }

  const resolvedProjectId = !isProjectMode ? undefined : projectId;
  const didSyncFail = featureStore.syncStatus === FeatureStoreSyncStatus.Failed;
  const showRetryBanner = didSyncFail && ownerName && projectId && projectName;

  return (
    <>
      {showRetryBanner && (
        <StyledWarningBox>
          The latest feature publishing job was unsuccessful - please check the logs <RouteLink to={jobSection(ownerName, projectName, featureStore.runId, 'logs')}>here</RouteLink>. To retry the job, <Action onClick={handleRetryJob}>click here</Action>
        </StyledWarningBox>
      )}
      <SearchableFeatureList
        featureViews={featureViews}
        headerControlOrder={[
          !hasEnvVars ? <FeatureStoreCredentialsButton
            buttonText="Add Credentials"
            featureStore={featureStore}
            hasEnvVars={hasEnvVars}
            onCredentialsAdded={handleCredentialsAdded}
          /> : null,
          NativeControl.paginationPageControl,
          NativeControl.search,
          isProjectMode ? <ExploreFeaturesDrawer
            projectId={resolvedProjectId}
          /> : null,
        ]}
        projectId={resolvedProjectId}
        shouldUseClientsideSearch={isProjectMode}
        title="Feature views"
      />
    </>
  )
}
