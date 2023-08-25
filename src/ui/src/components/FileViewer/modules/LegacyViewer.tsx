import * as React from 'react';
import styled from 'styled-components';

import { FileViewCore } from '../../../filebrowser/FileViewCore';
import { useRemoteData } from '../../../utils/useRemoteData';

import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';

require('google-code-prettify/src/prettify.css');

const Wrapper = styled.div`
  flex: 1;
  overflow: auto;
  height: 100%;

  & li.L0, li.L1, li.L2, li.L3, li.L5, li.L6, li.L7, li.L8 {
    list-style-type: decimal;
  }

  & iframe {
    width: 100%;
  }
`;

export const LegacyViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const {
    data: renderedFile,
    hasLoaded,
  } = useRemoteData<string>({
    canFetch: Boolean(metadata.previewUri),
    fetcher: async () => {
      if (!metadata.previewUri) {
        return '';
      }
      const response = await fetch(metadata.previewUri);
      return await response.text();
    },
    initialValue: '',
  });

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '/assets/thirdparty-js/google-code-prettify/bin/prettify.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!hasLoaded) {
    return null
  }

  return (
    <Wrapper>
      <FileViewCore
        filename={metadata.name || ''}
        renderedFile={renderedFile}
      />
    </Wrapper>
  );
};

export const LegacyViewer: FileViewerModule = {
  id: 'legacy-generic',
  Renderer: LegacyViewerRenderer,
  supportedExtensions: [
    new RegExp('.*', 'i'),
  ],
  supportedTypes: [
    new RegExp('.*', 'i'),
  ]
}
