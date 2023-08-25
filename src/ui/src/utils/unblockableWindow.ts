function doIfNotNull(blockingWindow: Window | null | void, cb: (blockingWindow: Window) => void): Window | void {
  if (blockingWindow) {
    return cb(blockingWindow);
  }
  console.error('failed to create window');
  return;
}

/**
 * how to use:
 *
 * 1. open a blank window immediately in the function which executes in reponse to user trigger
 * 2. execute new
 * 3. if you want to close the window, trigger the callback returned by new, or close manually
 *
 * example:
 *
 *
 * handleForkSuccess = (newProjectName: string) => {
 *   const openWindow = window.open(unblockableWindow.EMPTY_WINDOW_URL);
 *   launchNotebook().then(({ url }) => {
 *     try {
 *       unblockableWindow.new(url, openWindow);
 *     } catch (error) {
 *       errorToast('Unable to launch notebook window.');
 *       console.error(error);
 *       unblockableWindow.close(openWindow);
 *     }
 *   });
 *   .catch((error: any) => {
 *     console.error(error);
 *     errorToast('Failed to launch notebook.');
 *     unblockableWindow.close(openWindow);
 *   });
 * }
 */
export default {
  EMPTY_WINDOW_URL: 'about:blank',

  close: (openWindow: Window | null) => {
    doIfNotNull(openWindow, bw => {
      bw.close();
    });
  },

  new: (location: string, openWindow: Window | null) => {
    doIfNotNull(openWindow, bw => {
      bw.location.href = location;
    });
  },
};
