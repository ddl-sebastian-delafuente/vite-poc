import usePrincipal, { PrincipalProps } from './usePrincipal';
import useWhiteLabelSettings, { WhiteLabelSettingsProps } from './useWhiteLabelSettings';
import useFrontendConfig, { FrontendConfigProps } from './useFrontendConfig';

// TODO: All redux objects come here
export type StoreProps = PrincipalProps & WhiteLabelSettingsProps & FrontendConfigProps;

/**
 * A react hooks component that provides data that is stored in the global store.
 *
 * This hook can be used like below from any functional component to get the global store data.
 * const { principal, formattedPrincipal } = useStore();
 */
const useStore: () => StoreProps = () => {
  const { principal, formattedPrincipal } = usePrincipal();
  const { whiteLabelSettings } = useWhiteLabelSettings();
  const { frontendConfig, formattedFrontendConfig } = useFrontendConfig();

  return { principal, formattedPrincipal, whiteLabelSettings, frontendConfig, formattedFrontendConfig };
};

export default useStore;
