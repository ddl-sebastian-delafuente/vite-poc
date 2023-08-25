import * as React from 'react';
import usePrincipal, { PrincipalProps } from './usePrincipal';
import useWhiteLabelSettings, { WhiteLabelSettingsProps } from './useWhiteLabelSettings';
import useFrontendConfig, { FrontendConfigProps } from './useFrontendConfig';

// TODO: All redux objects come here
export type StoreProps = PrincipalProps & WhiteLabelSettingsProps & FrontendConfigProps;

/**
 * A react higher order component that provides data that is stored in the global store.
 *
 * Any react component can be wrapped in this HOC like below to get the global store data.
 * withStore(Component);
 */
const withStore = <P extends StoreProps>(Component: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = ((props : P) => {
    const { principal, formattedPrincipal } = usePrincipal();
    const { whiteLabelSettings } = useWhiteLabelSettings();
    const { frontendConfig, formattedFrontendConfig } = useFrontendConfig();

    return (
      <Component
        {...props}
        principal={principal}
        formattedPrincipal={formattedPrincipal}
        whiteLabelSettings={whiteLabelSettings}
        frontendConfig={frontendConfig}
        formattedFrontendConfig={formattedFrontendConfig}
      />);
  });
  return Wrapper;
};

export default withStore;
