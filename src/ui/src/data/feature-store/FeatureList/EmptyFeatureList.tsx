import {
  enableFeatureStoreForProject
} from '@domino/api/dist/Featurestore';
import {
  DominoFeaturestoreApiFeatureStoreDto as FeatureStoreDto,
} from '@domino/api/dist/types';
import { getErrorMessage } from '@domino/ui/dist/components/renderers/helpers';
import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName } from '@domino/ui/dist/utils/whiteLabelUtil';
import * as React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button/Button';
import HelpLink from '../../../components/HelpLink';
import { error as raiseToastError, success } from '../../../components/toastr';
import { SUPPORT_ARTICLE } from '../../../core/supportUtil';
import EmptyFeatureStore from '../../../icons/EmptyFeatureStore';
import { themeHelper } from '../../../styled/themeUtils';
import { UnionToMap } from '../../../utils/typescriptUtils';
import { FeatureStoreCredentialsButton } from './FeatureStoreCredentialsButton';

export type EmptyStateMode = 'Empty' | 'Enable' | 'Explore' | 'Setup';
export const EmptyStateMode: UnionToMap<EmptyStateMode> = {
  Empty: 'Empty',
  Enable: 'Enable',
  Explore: 'Explore',
  Setup: 'Setup',
};

export interface EmptyFeatureListProps {
  featureStore: FeatureStoreDto;
  hasEnvVars?: boolean;
  hasGlobalFeatures?: boolean;
  mode: EmptyStateMode,
  onCredentialsAdded: () => void;
  onEnabledFeaturestore: () => void;
  onExploreFeatures: () => void;
  projectId?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ControlsContainer = styled.div`
  & > *:not(:last-child) {
    margin-right: ${themeHelper('margins.small')};
  }
`;

const Description = styled.div`
  // Non Standard margin
  margin-bottom: 32px;

  text-align: center;

  & > div:not(:last-child) {
    margin-bottom: 24px;
  }
`;

const Heading = styled.div`
  // Non Standard font-size;
  font-size: 24px;

  // Non Standard margin
  margin-top: 43px;
  margin-bottom: 11px;
`

export const EmptyFeatureList = ({
  featureStore,
  hasEnvVars,
  hasGlobalFeatures,
  mode,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCredentialsAdded = () => {},

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onEnabledFeaturestore = () => {},

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onExploreFeatures = () => {},
  projectId,
}: EmptyFeatureListProps) => {
  const { whiteLabelSettings } = useStore();

  const handleAddCredentials = React.useCallback(() => {
    onCredentialsAdded();
  }, [onCredentialsAdded]);

  const handleEnableFeatureStore = React.useCallback(async () => {
    try {
      if (!projectId || !featureStore) {
        return;
      }

      await enableFeatureStoreForProject({ featureStoreId: featureStore.id, projectId });

      success('Feature Store was enabled successfully for your project');
      handleAddCredentials();
      onEnabledFeaturestore();
    } catch (e) {
      const errorMessage = await getErrorMessage(e, 'You may have Git credentials missing from your user account.');
      raiseToastError(`Failed to enable feature store on project. ${errorMessage}`);
    }
  }, [featureStore, handleAddCredentials, projectId,  onEnabledFeaturestore]);

  const { title, description, controls } = React.useMemo(() => {
    switch(mode) {
      case EmptyStateMode.Empty:
        return {
          title: 'Explore Feature Store',
          description: 'There are no features currently in your account. You can either publish features in your workspace in any of your projects.',
          controls: (
            <>
              <HelpLink btnType="secondary" type="primary" articlePath={SUPPORT_ARTICLE.FEATURE_STORE_LINK} showIcon={false} text="Publish Features"/>
              {!hasEnvVars && projectId && (<FeatureStoreCredentialsButton
                buttonText="Add Credentials"
                featureStore={featureStore}
                hasEnvVars={hasEnvVars}
                onCredentialsAdded={handleAddCredentials}
              />)}
            </>
          ),
        }
      case EmptyStateMode.Enable:
        return {
          title: 'Feature Store',
          description: 'Feature Store is a centralized repository of features. It enables feature sharing and discovery across your organization and also ensures that the same feature computation code is used for model training and inference.',
          controls: (
            <FeatureStoreCredentialsButton
              buttonText="Enable Feature Store"
              featureStore={featureStore}
              hasEnvVars={hasEnvVars}
              onCredentialsAdded={handleEnableFeatureStore}
            />
          ),
        }
      case EmptyStateMode.Explore:
        return {
          title: 'Explore Feature Store',
          description: 'There are no features currently in your project. You can either publish your own features in your workspace or explore features across your organization.',
          controls: (
            <>
              <Button disabled={!hasGlobalFeatures} onClick={onExploreFeatures}>Explore Features</Button>
              <HelpLink btnType="secondary" type="primary" articlePath={SUPPORT_ARTICLE.FEATURE_STORE_LINK} showIcon={false} text="Publish Features"/>
              {!hasEnvVars && projectId && (<FeatureStoreCredentialsButton
                btnType="secondary"
                buttonText="Add Credentials"
                featureStore={featureStore}
                hasEnvVars={hasEnvVars}
                onCredentialsAdded={handleAddCredentials}
              />)}
            </>
          ),
        }
      case EmptyStateMode.Setup:
        return {
          title: 'Feature Store',
          description: (
            <>
              <div>Feature Store is a centralized repository of features. It enables feature sharing and discovery across your organization and also ensures that the same feature computation code is used for model training and inference.</div>
              <div>Feature Store has not been set up for your account yet. Please request your {getAppName(whiteLabelSettings)} admin to set it up by following these <HelpLink articlePath={SUPPORT_ARTICLE.FEATURE_STORE_LINK} showIcon={false} text="instructions" />.</div>
            </>
          ),
        }
      default:
        return {}
    }
  }, [
    featureStore,
    handleAddCredentials,
    handleEnableFeatureStore,
    hasEnvVars,
    hasGlobalFeatures,
    mode,
    onExploreFeatures,
    projectId,
    whiteLabelSettings
  ]);

  return (
    <Container>
      <EmptyFeatureStore/>
      <Heading>{title}</Heading>
      <Description>{description}</Description>
      {controls && <ControlsContainer>{controls}</ControlsContainer>}
    </Container>
  )
}
