import * as React from 'react';

import { PLAYBACK_ERROR } from '../FileViewer.strings';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';
import { usePlaybackError } from '../FileViewer.utils';
import { DownloadOnlyViewerRenderer } from './DownloadOnlyViewer';


const AudioViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
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
    <audio controls onError={handlePlaybackError}>
      <source src={metadata.uri}/>
    </audio>
  );
};

export const AudioViewer: FileViewerModule = {
  id: 'audio-generic',
  Renderer: AudioViewerRenderer,
  supportedTypes: [
    new RegExp('^audio/.*$', 'i'),
  ]
}
