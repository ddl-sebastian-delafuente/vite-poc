import { omit, isNil, has } from 'ramda';
import axios from 'axios';
import { equals } from 'ramda';
import { getPrincipal } from '@domino/api/dist/Auth';
import {
  clearPreviousDataStorage,
  getPreviouslySelectedValue,
  previousDataStorageKeys
} from '../confirmRedirect/confirmRedirectToLogin';
import unblockableWindow from '../utils/unblockableWindow';
import { launchedWorkspace } from '../core/routes';

export enum ReturnValues {
  SUCCESS,
  RELOGIN_FAILED_TO_ACQUIRE_CREDENTIALS
}

// Check if any launch notebook details stored after credentials expired. If any, pick details and launch notebook
export const launchNotebookAfterRelogin = async (ownerUsername: string, projectName: string, csrfToken: string,
  projectId?: string) => {
  try {
    const wsPreviousData = getPreviouslySelectedValue(previousDataStorageKeys.launchNotebookFromFiles);
    if (!isNil(wsPreviousData)) {
      const principal = await getPrincipal({});
      const previousUserId = getPreviouslySelectedValue(previousDataStorageKeys.credPropInitiator);
      if (equals(previousUserId, principal.canonicalId!)) {
        const { projectId: previousProjectId, ...wsPreviousDataParsed } = JSON.parse(wsPreviousData);
        if (equals(previousProjectId, projectId)) {
          clearPreviousDataStorage(previousDataStorageKeys.launchNotebookFromFiles);
          clearPreviousDataStorage(previousDataStorageKeys.credPropInitiator);
          try {
            const res = await axios.post(
              wsPreviousDataParsed.submitUrl,
              JSON.stringify({...omit(['submitUrl'], wsPreviousDataParsed), csrfToken: csrfToken}),
              {
                headers: {'Content-Type': 'application/json'}
              }
            );
            const { workspaceId } = res.data;
            openWorkspaceSession(ownerUsername, projectName, workspaceId);
          } catch (err) {
            const result = err.response.data;
            if (has('redirectPath', result)) {
              return ReturnValues.RELOGIN_FAILED_TO_ACQUIRE_CREDENTIALS;
            }
          }
        }
      }
    }
  } catch {
    return ReturnValues.RELOGIN_FAILED_TO_ACQUIRE_CREDENTIALS;
  }
  return ReturnValues.SUCCESS;
};

export function openWorkspaceSession(ownerUsername: string, projectName: string, workspaceId: string) {
  // Create a blank workspace window immediately to avoid popup-blocking
  const openWindow = window.open(unblockableWindow.EMPTY_WINDOW_URL);
  const workspaceHref = launchedWorkspace(ownerUsername, projectName, workspaceId);
  if (workspaceHref) {
    unblockableWindow.new(workspaceHref, openWindow);
  }
}
