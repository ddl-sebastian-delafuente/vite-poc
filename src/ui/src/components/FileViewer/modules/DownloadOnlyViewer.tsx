import * as React from 'react';

import { RENDER_ERROR } from '../FileViewer.strings';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';

interface DownloadOnlyViewerRendererProps extends FileViewerFileRendererProps {
  text?: string;
}

export const DownloadOnlyViewerRenderer = ({
  text = RENDER_ERROR,
}: DownloadOnlyViewerRendererProps) => {
  return (
    <div>{text}</div>
  );
};

export const DownloadOnlyViewer: FileViewerModule = {
  id: 'download-generic',
  Renderer: DownloadOnlyViewerRenderer,
  supportedExtensions: ['tif', 'tiff'],
  supportedTypes: []
}
