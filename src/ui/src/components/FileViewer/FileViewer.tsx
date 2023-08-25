import * as React from 'react'; import styled from 'styled-components';

import Button from '../../components/Button/Button';
import WaitSpinner from '../../components/WaitSpinner';
import { FileViewerFileRendererProps } from './FileViewer.types';
import { useViewerModule } from './FileViewer.utils';
import { LegacyViewerRenderer } from './modules/LegacyViewer';

const FileViewerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  overflow: hidden;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`

export type PickedProps =
  'metadata' |
  'mutable' |
  'projectInfo';
export type FileViewerProps = Pick<FileViewerFileRendererProps, PickedProps>

export interface FileViewerWithIntersititalsProps extends FileViewerProps {
  FallbackModule?: React.ComponentType<FileViewerFileRendererProps>,
  /**
   * Metadata lifecycle. If define a error has occurred in loading metadata and will display
   * a error with a retry control.
   */
  metadataError?: Error;
  
  /**
   * Metadata lifecycle flag, If set to true metadata has already been loaded
   */
  metadataHasLoaded: boolean;
  
  /**
   * Metadata lifecycle flag. If set to true metadata is still loading.
   */
  metadataLoading: boolean;
  
  /**
   * Event handler called when retry button is press this should attempt
   * to refetch metadata if that call previously fails. Defaults to noop function
   */
  onRefetchMetadata: () => void;
}

export const FileViewer = ({
  metadata,
  ...props
}: FileViewerProps) => {
  const viewer = useViewerModule(metadata);

  if (!viewer) {
    return null;
  }

  const { Renderer } = viewer;

  return (
    <FileViewerWrapper>
      <Renderer {...props} metadata={metadata} />
    </FileViewerWrapper>
  )
}

export const FileViewerWithIntersititals = ({
  FallbackModule = LegacyViewerRenderer,
  metadata,
  metadataError,
  metadataHasLoaded,
  metadataLoading,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRefetchMetadata = () => {},
  ...props
}: FileViewerWithIntersititalsProps) => {
  const viewer = useViewerModule(metadata);

  if (metadataLoading || (!metadataHasLoaded && !metadataError)) {
    return <WaitSpinner/>
  }

  if (metadataError || !viewer) {
    return (
      <Wrapper>
        Failed to load file information
        <Button onClick={onRefetchMetadata}>Retry</Button>
      </Wrapper>
    )
  }

  if (metadata.exceedsSizeLimit) {
    return (
      <FileViewerWrapper>
        <FallbackModule metadata={metadata} />
      </FileViewerWrapper>
    );
  }

  return (
    <FileViewer {...props} metadata={metadata}/>
  );
}
