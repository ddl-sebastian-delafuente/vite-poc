import * as React from 'react';
import styled from 'styled-components';

import { useRemoteData } from '../../../utils/useRemoteData';
import { LanguageAry, CodeViewer, findLanguageByExtension } from './CodeViewer/CodeViewer';
import { 
  FileViewerFileRendererProps,
  FileViewerModule 
} from '../FileViewer.types';
import { getFileExtension } from '../FileViewer.utils';

const Wrapper = styled.div`
  flex: 1;
  overflow: auto;
  height: 100%;
`;

const TextViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const {
    data,
  } = useRemoteData<string>({
    canFetch: Boolean(metadata.uri),
    fetcher: async () => {
      if (!metadata.uri) {
        return '';
      }
      const response = await fetch(metadata.uri);
      return await response.text();
    },
    initialValue: ''
  });

  const fileExtension = getFileExtension(metadata.name, metadata.uri);

  if (!data) {
    return null;
  }

  const language = findLanguageByExtension(fileExtension)
  return (
    <Wrapper>
      <CodeViewer code={data} language={language} />
    </Wrapper>
  )
};

export const PlainTextViewer: FileViewerModule = {
  id: 'text-generic',
  Renderer: TextViewerRenderer,
  excludedExtensions: ['md'],
  supportedExtensions: LanguageAry,
  supportedTypes: [
    'application/json',
    new RegExp('^text/.*$', 'i'),
  ]
}
