import * as R from 'ramda';
import { FetchStatus } from './redux/reducer';
import { urlSearchStringToObject, objectToURLSearchString } from '../utils/searchUtils';

 const getStatusCodeOr = (orDo: () => undefined | number) => R.ifElse(R.isNil, orDo, R.prop('status'));

 const getRedirectUrl = (currentLocation: Location): string => {
  // TODO maybe have unique email query param just for referrer emails
  // and then strip it out of the callback url
  const { href, search } = currentLocation;
  const queryParams = { ...urlSearchStringToObject(search), redirectPath: href };
  return `/secured?${objectToURLSearchString(queryParams)}`;
};

 export const redirectToLogin = () => {
  window.location.assign(getRedirectUrl(window.location));
};

 export type FetchedDataStatuses = {
  fetchedOps?: FetchStatus,
  fetched?: FetchStatus,
};
export const shouldRedirectToLogin = (
  {
    fetchedOps,
    fetched,
  }: FetchedDataStatuses,
  flagFetchFailure: any,
  projectFetchFailure: any,
  userIsAnonymous?: boolean,
): boolean => {
    const fetchingDataFailed = fetchedOps === FetchStatus.failed || fetched === FetchStatus.failed;
    const effectiveStatusCode = getStatusCodeOr(
      () => getStatusCodeOr(() => 500)(flagFetchFailure)
    )(projectFetchFailure);
  return fetchingDataFailed && effectiveStatusCode !== 200 && !R.isNil(userIsAnonymous) && userIsAnonymous;
};
