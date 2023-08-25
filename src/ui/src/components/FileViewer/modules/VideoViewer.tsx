import * as React from 'react';
import styled from 'styled-components';

import { PLAYBACK_ERROR } from '../FileViewer.strings';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';
import { usePlaybackError } from '../FileViewer.utils';
import { DownloadOnlyViewerRenderer } from './DownloadOnlyViewer';

const StyledVideo = styled.video`
  max-height: 100%;
  max-width: 100%;
  width: 100%;
`

const VideoViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const {
    handlePlaybackError,
    playbackError,
  } = usePlaybackError();

  if (!metadata.uri) {
    return null;
  }

  if (playbackError) {
    return <DownloadOnlyViewerRenderer metadata={metadata} text={PLAYBACK_ERROR}/>
  }

  return (
    <StyledVideo onError={handlePlaybackError} controls>
      <source src={metadata.uri} type={metadata.mimeType}/>
    </StyledVideo>
  );
};

export const VideoViewer: FileViewerModule = {
  id: 'video-generic',
  Renderer: VideoViewerRenderer,
  supportedTypes: [
    new RegExp('(^video/.*$)|(application/x-mpegURL)', 'i'),
  ]
}
