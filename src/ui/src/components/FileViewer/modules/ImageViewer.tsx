import * as React from 'react';
import styled from 'styled-components';

import WaitSpinner from '../../WaitSpinner';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';

const StyledImage = styled.img<{ loaded: boolean }>`
  display: ${p => p.loaded ? 'block' : 'none'}
  max-height: 100%;
  max-width: 100%;
`;

const LoadingWrapper = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
`;

const Wrapper = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  height: 100%;
`;

const ImageViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const [loaded, setLoaded] = React.useState(false);

  const handleImageLoaded = React.useCallback(() => setLoaded(true), [setLoaded])

  if (!metadata.uri) {
    return null;
  }

  return (
    <>
      <Wrapper>
        <StyledImage loaded={loaded} src={metadata.uri} onLoad={handleImageLoaded}/>
        {!loaded && <LoadingWrapper><WaitSpinner/></LoadingWrapper>}
      </Wrapper>
    </>
  );
};

export const ImageViewer: FileViewerModule = {
  excludedExtensions: ['tif', 'tiff'],
  id: 'image-generic',
  Renderer: ImageViewerRenderer,
  supportedExtensions: [
    'gif',
    'jpeg', 
    'jpg', 
    'png',
  ],
  supportedTypes: [
    new RegExp('^image/.*$', 'i'),
  ]
}
