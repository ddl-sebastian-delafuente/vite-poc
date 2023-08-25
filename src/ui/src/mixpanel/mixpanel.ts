import mixpanel from 'mixpanel-browser';
import {
  MixpanelEvent,
} from './types';

export interface SettingsWindow extends Window {
  __env: {
    MIXPANEL_TOKEN: string,
    MIXPANEL_REDACTEDMODE: string
  };
  mixpanel: any;
}

// https://github.com/microsoft/TypeScript/issues/33128#issuecomment-527572596
export type SettingsWindowType = SettingsWindow & typeof globalThis;

const win = <SettingsWindowType> window;
let env = 'undefined' !== typeof win ? win.__env : process.env;

if (!env) {
  env = {
    MIXPANEL_TOKEN: '',
    MIXPANEL_REDACTEDMODE: 'false'
  };
}

function getMixpanelToken() {
  return env.MIXPANEL_TOKEN || '';
}

function getMixpanel() {
  if ((<SettingsWindowType> window).mixpanel) {
    return (<SettingsWindowType> window).mixpanel;
  }
  return mixpanel;
}

function isMixpanelEnabled() {
  if ((<SettingsWindowType> window).mixpanel) {
    // check via lplay mixpanel
    return (<SettingsWindowType> window).mixpanel.__loaded;
  }
  return !!getMixpanelToken();
}

function inPlay() {
  return !!(<SettingsWindowType> window).mixpanel;
}

function removeSuperProperties() {
  getMixpanel().register({
    '$email': null
  });
}

function isRedactedModeEnabled() {
  return env.MIXPANEL_REDACTEDMODE === 'true';
}

export const init = (overridingToken?: string, stage?: string) => {
  if (!inPlay()) {
    const token = overridingToken || getMixpanelToken();
    env.MIXPANEL_TOKEN = token;

    // eslint-disable-next-line no-console
    console.log(`Mixpanel ${token === '' ? 'has no token' : 'loaded with token'}`);
    const mixPanel = getMixpanel();
    mixPanel.init(token, {'property_blacklist': ['$current_url', '$referrer'], cross_subdomain_cookie: false});

    if (isMixpanelEnabled()) {
      mixPanel.register({ stage });
    }

    if (isRedactedModeEnabled()) {
      removeSuperProperties();
    }
  }
};

export function track<T extends MixpanelEvent>(getEvent: () => T, callback?: () => void): void {
  if (isMixpanelEnabled()) {
    const event = getEvent();
    const { name } = event;
    const { properties } = event;
    const propertiesToSend = {...properties, stage: getMixpanel().get_property('stage')};

    // eslint-disable-next-line no-console
    console.log('Mixpanel track event', name, propertiesToSend);
    getMixpanel().track(name, propertiesToSend, callback);
  }
}

export function trackLink(selector: string, name: string, properties?: {}): void {
  if (isMixpanelEnabled()) {
    getMixpanel().track_links(selector, name, properties);
  }
}

export function getTotalExperiments(formValues: any): number {
  const {
    parameterKeys = [],
  } = formValues;
  if (parameterKeys.length > 0) {
    return parameterKeys.reduce((totalCombinations: number, key: string) => {
      const stringifiedArgs = formValues[key];
      const totalPossiblities = stringifiedArgs.trim().split(/\s*,\s*/).length;
      return totalCombinations * totalPossiblities;
    }, 1);
  }
  return 1;
}

export function getTotalParameters(formValues: any): number {
  const {
    command = '',
  } = formValues;
  const params = command.trim().split(/\s+/);
  return params.length - 1;
}
