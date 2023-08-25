import { RouteComponentProps } from 'react-router';
import { DocumentType } from '@domino/api/dist/types';
import * as R from 'ramda';

type QueryObject = {
  query: string;
  area?: DocumentType;
};
export function searchUrlFor(searchQuery: string, area?: DocumentType): string {
  const queryObject: QueryObject = area ? { query: searchQuery, area } : { query: searchQuery };
  const searchQueryObject = new URLSearchParams(queryObject);
  searchQueryObject.sort();
  return `/search?${searchQueryObject.toString()}`;
}

export function searchUrlForTag(tag: string): string {
  return searchUrlFor(`project.tag=${tag}`, 'project');
}

export const getField = (searchString: string, field: string): string | undefined =>
  new URLSearchParams(searchString).get(`${field}`) || undefined;

export const appendToQuery = (searchString: string, newQuery: Record<string, any>): string => {
  const searchParamObject = new URLSearchParams(searchString);
  R.forEachObjIndexed((value, key) => {
    if (!R.isNil(value)) {
      searchParamObject.set(key,value);
    } else {
      searchParamObject.delete(key);
    }
  }, newQuery);
  searchParamObject.sort();
  const urlSearchParamString = searchParamObject.toString();
  return urlSearchParamString ? `?${urlSearchParamString}` : '';
};

export const removeFromQuery = (searchString: string, fields: string[]): string => {
  const searchParamObject = new URLSearchParams(searchString);
  R.forEach(key => searchParamObject.delete(key), fields);
  searchParamObject.sort();
  const urlSearchParamString = searchParamObject.toString();
  return urlSearchParamString ? `?${urlSearchParamString}` : '';
};

export const updateQuery = (route: RouteComponentProps<{}, {}>, query: string): string =>
  `${route.location.pathname}${query}${route.location.hash}`;

export const urlSearchStringToObject = (urlSearchString: string | string[][] | Record<string, string> | URLSearchParams | undefined) => {
  const searchParamObject = new URLSearchParams(urlSearchString)
  const queryParams: Record<string, any> = {}
  searchParamObject.forEach((value, key) => {
    queryParams[key] = value;
  })
  return queryParams;
}

export const objectToURLSearchString =(queryObject: string | string[][] | Record<string, string> | URLSearchParams | undefined)=>{
  const searchQueyObject = new URLSearchParams(queryObject);
  searchQueyObject.sort();
  return searchQueyObject.toString();
}
