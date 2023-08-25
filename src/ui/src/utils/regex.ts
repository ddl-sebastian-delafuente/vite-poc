/**
 * Escape regex input
 * @param str
 */
export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

/**
 * Perform regex search and escaping other regex characters
 * @param searchStr
 * @return number - returns the first index of the text match and -1 if no match found
 */
export const regexSearch: (val: string, searchStr: string, escapeRegexChars?: boolean) => number =
  (val, searchStr, escapeRegexChars = true) => escapeRegexChars ?
  String(val).search(new RegExp(escapeRegExp(searchStr), 'i')) :
  String(val).search(new RegExp(searchStr, 'i'));

/**
 * Perform regex search and default escaping other regex characters
 * @param searchStr
 * @return boolean - returns true if a text match is found and false if no match is found
 */
export const regexMatch = (val: string, searchStr: string, escapeRegexChars?: boolean) =>
  regexSearch(val, searchStr, escapeRegexChars) !== -1;

export const numberRegexp = /^-?(0|((0\.)|([1-9](\d+)?\.?))(\d+)?)?$/;
