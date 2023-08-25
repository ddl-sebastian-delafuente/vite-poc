import * as React from 'react';
import { getRouter } from '../scalaRouting';
import Panel from '../components/Panel';
import ApiKeyGenerator from './ApiKeyGenerator';
import HelpLink from '../../components/HelpLink';
import { SUPPORT_ARTICLE } from '../../core/supportUtil';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';

export const regenerateApiKeyRoute = getRouter('accountRouter').getRoute(
  'domino.server.user.ui.AccountController.regenerateApiKey',
);

export type ViewProps = {
  generating: boolean;
  isAPIEnabled?: boolean;
  apiKey?: string;
  error?: any;
  onRegenerate: () => Promise<void>;
};

export const ApiKeySettingsPanel = ({
  generating,
  isAPIEnabled, // Obsolete
  apiKey,
  error,
  onRegenerate,
  ...otherProps
}: ViewProps) => {
  const { whiteLabelSettings } = useStore();
  return (
    <Panel header="API Key" {...otherProps}>
    {
      isAPIEnabled ?
        (
          <div>
            <p>
              Your API key can be used to requests you make against the{' '}
              <HelpLink text={`${getAppName(whiteLabelSettings)}`} articlePath={SUPPORT_ARTICLE.DOMINO_API} showIcon={false} /> or your{' '}
              <HelpLink text="API Endpoints" articlePath={SUPPORT_ARTICLE.PUBLISH_MODELS} showIcon={false} />
              .
              <br />
              <strong>This key should be treated as a password!</strong>
            </p>

            <ApiKeyGenerator
              generating={generating}
              apiKey={apiKey}
              error={error}
              onRegenerate={onRegenerate}
            />
          </div>
        ) :
        (
          <p>
            API is disabled for this deployment. Please contact administrator.
          </p>
        )
    }

    </Panel>
  );
};

type OuterProps = {
  viewer: {
    id: string;
    username: string;
  };
};

export const ApiKeySettingsPanelWithData = (props: OuterProps) => {
  const [generating, setGenerating] = React.useState<boolean>(false);
  const [apiKey, setApiKey] = React.useState<string>();
  const [error, setError] = React.useState<any>();

  const onRegenerate = async () => {
    setApiKey(undefined);
    setError(undefined);
    setGenerating(true);
    const viewerId = props.viewer.id;
    try {
      const responseBody = await regenerateApiKeyRoute(viewerId).fetch();
      const apiKey = responseBody.raw;
      setApiKey(apiKey);
    } catch (error) {
      setError(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ApiKeySettingsPanel
      {...props}
      generating={generating}
      apiKey={apiKey}
      error={error}
      onRegenerate={onRegenerate}
    />
  );
}

export default ApiKeySettingsPanelWithData;
