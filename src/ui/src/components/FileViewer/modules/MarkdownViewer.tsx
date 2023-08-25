import * as React from 'react';
import styled from 'styled-components';

import { useRemoteData } from '../../../utils/useRemoteData';
import { MarkdownRender } from '../../Markdown';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';
import { CodeViewer } from './CodeViewer/CodeViewer';

const Wrapper = styled.div`
  flex: 1;
  overflow: auto;
  height: 100%;
`;

const MarkdownViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const {
    data,
  } = useRemoteData({
    canFetch: Boolean(metadata?.uri),
    fetcher: async () => {
      const response = await fetch(metadata.uri as string);
      return await response.text();
    },
    initialValue: ''
  });

  const renderCode = React.useCallback(({ language, value }: { language: string, value: string }) => {
    return (
      <CodeViewer language={language} code={value} />
    );
  }, []);

  return (
    <Wrapper>
      <MarkdownRender
        skipHtml
        renderers={{
          code: renderCode,
        }}
      >
        {data}
      </MarkdownRender>
    </Wrapper>
  );
}

export const MarkdownViewer: FileViewerModule = {
  id: 'markdown-generic',
  Renderer: MarkdownViewerRenderer,
  supportedExtensions: ['md'],
  supportedTypes: []
}
