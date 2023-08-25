import { replace } from 'ramda';
import { lowerCase, upperFirst } from 'lodash';
import {
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings
} from '@domino/api/dist/types';

/**
 * Replaces instances of `'domino'` and `'Domino'` with 
 * `lowerCase(appName)` and `capitalize(appName)` for `replaceString`.
 * 
 * @example
 * ```ts
 * replaceWithWhiteLabelling('nvidia')('domino Domino dom$ino domino inoDom');
 * // 'nvidia Nvidia dom$ino nvidia inoDom'
 * ```
 * 
 * @param appName default `''`
 * @returns see `@example`
 */
export const replaceWithWhiteLabelling = (appName = '') => (replaceString: string, isLowerCaseReplaceAllowed = true) => {
  const optionalLowerCaseReplaceString = isLowerCaseReplaceAllowed ? replace(/domino/g, lowerCase(appName), replaceString) : replaceString;
  return replace(/Domino/g, upperFirst(appName), optionalLowerCaseReplaceString);
};

/**
 * Returns `whiteLabelSettings.appName` if `whiteLabelSettings` is NOT `undefined`, 
 * otherwise return empty string &mdash; `''`.
 * @param whiteLabelSettings 
 * @returns `whiteLabelSettings.appName ?? ''`
 */
export const getAppName = (whiteLabelSettings?: WhiteLabelSettings) => upperFirst(whiteLabelSettings?.appName ?? '');

export const getCodeAssistName = (whiteLabelSettings?: WhiteLabelSettings) =>
  !whiteLabelSettings || whiteLabelSettings.appName === 'Domino' ? 'Domino Code Assist' : 'Code Assist';

export default {
  getAppName,
  replaceWithWhiteLabelling,
};
