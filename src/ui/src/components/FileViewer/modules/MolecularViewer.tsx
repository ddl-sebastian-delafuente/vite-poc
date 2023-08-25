import { Stage, Component } from 'react-ngl';
import * as React from 'react';

import { useRemoteData } from '../../../utils/useRemoteData';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';
import { getFileExtension } from '../FileViewer.utils';

const MolecularViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const { data } = useRemoteData<Blob | null>({
    canFetch: Boolean(metadata.uri),
    fetcher: async () => {
      if (!metadata.uri) {
        return null;
      }

      const response = await fetch(metadata.uri);
      return await response.blob();
    },
    initialValue: null
  });

  if (!metadata.uri || !data) {
    return null;
  }
  
  const fileExtension = getFileExtension(metadata.name, metadata.uri);
  
  return (
    // @ts-ignore
    <Stage height="95vh" width="95vw">
      <Component path={data} loadFileParams={{ ext: fileExtension }} reprList={[{ type: 'cartoon' }]} />
    </Stage>
  );
};

export const MolecularViewer: FileViewerModule = {
  id: 'molecular-generic',
  Renderer: MolecularViewerRenderer,
  supportedExtensions: ['pdb', 'ent', 'pqr'],
  supportedTypes: []
}
