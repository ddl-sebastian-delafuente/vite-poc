export enum LocalStorageItemKey {
  SubViewType = 'SubViewType',
  IsSideNavClosed = 'IsSideNavClosed',
  AutoRedirectForJobsWS = 'autoRedirectForJobsWS',
  IsFilesIntroDisabled = 'IsFilesIntroDisabled',
  HideReadWriteDatasetsDeprecationWarning= 'HideReadWriteDatasetsDeprecationWarning',
  DefaultColorPalette = 'default-color-palette',
  DarkColorPalette = 'dark-color-palette'
}

export function getLocalStorageItem(key: LocalStorageItemKey): string | null {
  const localStorage = getLocalStorage();
  if (localStorage) {
    return localStorage.getItem(key.toString());
  } else {
    return null;
  }
}

export function setLocalStorageItem(key: LocalStorageItemKey, value: any) {
  const localStorage = getLocalStorage();
  if (localStorage) {
    // Catching exception as per https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem#Exceptions
    try {
      localStorage.setItem(key.toString(), value);
    } catch (err) {
      console.warn(err);
    }
  }
}

export function removeLocalStorageItem(key: LocalStorageItemKey) {
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.removeItem(key.toString());
  }
}

export function getLocalStorage(): Storage | undefined {
  // Ensuring localStorage is available
  // http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
  let localStorage;
  try {
    localStorage = window.localStorage;
  } catch (err) {
    console.warn(err);
  }
  return localStorage;
}
