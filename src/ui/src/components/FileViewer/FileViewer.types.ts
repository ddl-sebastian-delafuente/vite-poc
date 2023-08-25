import { DominoDatasetrwApiDatasetRwSnapshotFileMetadataDto as FileMetadataDto, } from '@domino/api/dist/types';
import { ComponentType } from 'react';

export interface ProjectInfo {
  ownerUsername?: string;
  projectId?: string;
  projectName?: string;
}

export type FileViewerFileMetadata = FileMetadataDto & { data?: string };

export interface FileViewerFileRendererProps {
  /**
   * Flag defines if the renderer should render in a mode
   * where a user can edit or not. Note that not all modules
   * may be capable of providing a edit mode and this setting
   * should be considered best effort.
   *
   * Default False (readonly)
   */
  mutable?: boolean;

  /**
   * Contains file metadata used resolve which file viewer module to use
   * {content: string}
   */
  metadata: FileViewerFileMetadata;

  /**
   * Contains information related a project that the file maybe associated with
   */
  projectInfo?: ProjectInfo;
}

export type SupportedTypes = string | RegExp;

export interface FileViewerModule {
  /**
   * A list of extensions to ignore. This will be resolved first prior
   * to checking for supported extensions and types.
   */
  excludedExtensions?: string[];

  /**
   * Define a unique id for this module
   */
  id: string;

  /**
   * If a viewer module defines this value it denotes a max 
   * filesize limit on on a given module. If the file size 
   * is exceeded the module resolver will skip the module 
   * regardless of its capabilities to support that file.
   *
   * value is defined as bytes
   */
  maxSupportedFilesize?: number;

  /**
   * A React component that will actually handle rendering
   * of the file.
   */
  Renderer: ComponentType<FileViewerFileRendererProps>;

  /**
   * A list of extensions to support. This will be resolved second
   * as it is more specific than a MIME time. However, this relies
   * on the file extension matching the actual contents of the file
   * if they do not match there could be unforseen errors in the
   * rendering component.
   */
  supportedExtensions?: SupportedTypes[];

  /**
   * An array list of mime types or RegExps. Order is important and should
   * be go from most specific to least specific
   */
  supportedTypes: SupportedTypes[];
}
