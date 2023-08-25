import * as React from 'react';
import styled from 'styled-components';

import { highlightYellow } from '../styled/colors';

const Highlighted = styled.span`
  background-color: ${highlightYellow};
`

export const getSearchRegex = (searchTerm: string | RegExp): RegExp => {
  if (typeof searchTerm === 'string') {
    return new RegExp(searchTerm, 'gi');
  }

  return searchTerm;
}

export const highlightText = (text: string, searchTerm?: RegExp) => {
  if (!searchTerm) {
    return text;
  }
  
  const matches = text.match(searchTerm);
  const splits = text.split(searchTerm);

  return splits.reduce((memo, text) => {
    if (!matches || matches.length === 0 || matches[0] !== text) {
      return <>{memo}{text}</>;
    }

    matches.shift();
    return <>{memo}<Highlighted>{text}</Highlighted></>;
  }, null);
}

const searchObjectRecursive = <T extends {}>(obj: T, searchTerm: RegExp, searchKeyName?: boolean): boolean => {
  const result =  Object.keys(obj).find((keyName) => {
    const value = obj[keyName];

    if (typeof value === 'string' && !searchKeyName) {
      return searchTerm.test(value);
    }
    
    if (typeof value === 'string' && searchKeyName) {
      return searchTerm.test(value) || searchTerm.test(keyName);
    }

    if (typeof value === 'function' || Array.isArray(value) || value === null) {
      return false;
    }

    if (typeof value === 'object') {
      return searchObjectRecursive(value, searchTerm, keyName === 'tags');
    }

    return false
  });

  return result !== undefined;
}

/**
 * Checks if object contains the search term
 * @returns boolean true if value exists in object false if not;
 */
export const searchObject = <T extends {}>(obj: T, searchTerm: string | RegExp): boolean => {
  const regexp = getSearchRegex(searchTerm);

  return searchObjectRecursive<T>(obj, regexp);
}
