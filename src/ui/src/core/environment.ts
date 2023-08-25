export interface SettingsWindow extends Window {
  __env: {
    isNucleusApp?: boolean;
  };
}

// https://github.com/microsoft/TypeScript/issues/33128#issuecomment-527572596
export type SettingsWidowType = SettingsWindow & typeof globalThis;

if (!(<SettingsWidowType> window).__env) {
  (<SettingsWidowType> window).__env = {};
}

const env = ((<SettingsWidowType> window).__env) ? (<SettingsWidowType> window).__env : {};
export const setIsNucleusApp = (nucleusApp: boolean) => env.isNucleusApp = nucleusApp;
export const isNucleusApp = () => env.isNucleusApp;
