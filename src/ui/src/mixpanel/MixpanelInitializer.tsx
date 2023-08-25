import * as React from 'react';
import * as mixpanel from './mixpanel';
import withStore, { StoreProps } from '../globalStore/withStore';

export type OwnProps = { children: React.ReactNode };
export type ComponentProps = StoreProps & OwnProps;
class Inititalizer extends React.PureComponent<ComponentProps> {
  componentDidMount() {
    const {
      isMixpanelEnabled,
      mixpanelToken,
      stage
    } = this.props.formattedFrontendConfig || {};
    
    if (!!mixpanelToken && isMixpanelEnabled) {
      // enable it
      mixpanel.init(mixpanelToken, stage);
    }
  }

  componentDidUpdate(previousProps: ComponentProps) {
    const {
      isMixpanelEnabled,
      mixpanelToken,
      stage
    } = this.props.formattedFrontendConfig || {};

    if (previousProps.formattedFrontendConfig && previousProps.formattedFrontendConfig.mixpanelToken !== mixpanelToken 
      || (previousProps.formattedFrontendConfig && !previousProps.formattedFrontendConfig.isMixpanelEnabled) && isMixpanelEnabled) {
      // enable it
      mixpanel.init(mixpanelToken, stage);
    }

  }

  render() {
    return this.props.children;
  }
}

export const MixpanelInitializer = withStore(Inititalizer);
