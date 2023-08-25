import * as React from 'react';

import { 
  FileViewerFileMetadata,
  FileViewerModule,
  SupportedTypes,
} from './FileViewer.types';
import { DefaultViewers } from './modules';

const CustomViewers: FileViewerModule[] = [];

const FileExtensionRegExp = /.*\.(\w+)$/;

const extractFileExtension = (str: string) => {
  const parts = str.split('.');
  const ext = parts.length > 1 ? parts.pop() : undefined;

  if (!ext) {
    return;
  }

  return ext.toLowerCase();
}

export const getFileExtension = (name?: string, uri?: string) => {
  if (name && FileExtensionRegExp.test(name)) {
    return extractFileExtension(name);
  }

  // if URL has a query string exclude it before checking
  if (uri && uri.indexOf('?') > -1) {
    const [uriClean] = uri.split('?');

    if (!FileExtensionRegExp.test(uriClean)) {
      return;
    }

    return extractFileExtension(uriClean);
  }

  if (uri && FileExtensionRegExp.test(uri)) {
    return extractFileExtension(uri);
  }

  return;
}

const validateType = (supportedType: SupportedTypes, value?: string) => {
  if (supportedType instanceof RegExp && value) {
    return supportedType.test(value);
  }

  if (typeof supportedType === 'string' && value) {
    return supportedType.toLowerCase() === value.toLowerCase();
  }

  return false;
}

const findViewer = (metadata: FileViewerFileMetadata, viewers: FileViewerModule[]) => {
  return viewers.find(({ excludedExtensions, maxSupportedFilesize, supportedExtensions, supportedTypes }) => {
    // Check if there is a maxSupportedFilesize and if the given file exceeds it
    if (maxSupportedFilesize && metadata.fileSize && metadata.fileSize > maxSupportedFilesize) {
      return false;
    }

    const fileExtension = getFileExtension(metadata.name, metadata.uri);
    const hasExcludedExtension = excludedExtensions && fileExtension &&
      excludedExtensions.indexOf(fileExtension) > -1;

    if (hasExcludedExtension) {
      return false;
    }

    // Check if supported extensions is defined and if file has a file extension
    // if so then resolve the file if none match continue to checking mime types
    const extensionIndex = supportedExtensions && supportedExtensions.findIndex((supportedExtension) => {
      return validateType(supportedExtension, fileExtension);
    });

    if (typeof extensionIndex !== 'undefined' && extensionIndex > -1) {
      return true;
    }

    // search through the supported types
    const index = supportedTypes.findIndex((supportedType) => {
      return validateType(supportedType, metadata.mimeType);
    });

    return index > -1;
  });
}

const getViewer = (metadata: FileViewerFileMetadata) => {
  const customerViewer = findViewer(metadata, CustomViewers);

  if ( customerViewer ) {
    return customerViewer;
  }

  const defaultViewer = findViewer(metadata, DefaultViewers);
  if ( defaultViewer ) {
    return defaultViewer;
  }

  throw new Error(`Missing Viewer for type ${metadata.mimeType}`);
}

/**
 * Used to register custom modules. If you pass a `FileViewModule`
 * with the same id as an existing module it will overwrite that
 * module
 */
export const registerModule = (fileViewerModule: FileViewerModule) => {
  // @TODO update to handle overwriting modules
  CustomViewers.push(fileViewerModule);
}

export const usePlaybackError = () => {
  const [playbackError, setPlaybackError] = React.useState(false);

  const handlePlaybackError = React.useCallback(() => {
    setPlaybackError(true);
  }, [setPlaybackError]);

  return {
    handlePlaybackError,
    playbackError,
  }
}

export const useViewerModule = (metadata: FileViewerFileMetadata): FileViewerModule | null => {
  const viewer = React.useMemo(() => {
    const fileExtension = getFileExtension(metadata.name, metadata.uri);
    if (!metadata.mimeType && !fileExtension) {
      return null;
    }

    return getViewer(metadata);
  }, [metadata]);

  return viewer;
}
