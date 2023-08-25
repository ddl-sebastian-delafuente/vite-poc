import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import {
  dangerBoxBackground,
  dangerBoxBorderColor,
  secondaryWarningRed,
} from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import { withFileDisplayElement } from './util';

export interface FileViewCoreProps {
  filename: string;
  ownerUsername?: string;
  projectId?: string;
  projectName?: string;
  renderedFile: string;
}

interface RenderedFileProps {
  dangerouslySetInnerHTML: { __html: string };
  isEdgeNotebook: boolean;
}

interface WindowInterface extends Window {
  prettyPrint: (x: any, y: any) => any;
}

const IFRAME_STYLES = {
  border: 0,
  height: '500px', 
  minHeight: '100px', 
};

const NotebookIframeWrap = styled.div`
  width: 100%;
  .fetch-error {
    color: ${secondaryWarningRed};
    background-color: ${dangerBoxBackground};
    border: 1px solid ${dangerBoxBorderColor};
    border-radius: ${themeHelper('borderRadius.standard')};
    padding: ${themeHelper('margins.small', '10px')} ${themeHelper('margins.medium', '15px')};
  }
`;

const RenderedFile = styled.div<RenderedFileProps>`
  height: ${props => props.isEdgeNotebook ? '500px' : 'auto'};
  min-height: ${props => props.isEdgeNotebook ? '100px' : '200px'};
  overflow-y: ${props => props.isEdgeNotebook ? 'auto' : 'visible'};
  width: 100%;
  .fetch-error {
    color: ${secondaryWarningRed};
    background-color: ${dangerBoxBackground};
    border: 1px solid ${dangerBoxBorderColor};
    border-radius: ${themeHelper('borderRadius.standard')};
    padding: ${themeHelper('margins.small', '10px')} ${themeHelper('margins.medium', '15px')};
  }
`;

export const FileViewCore = ({
  filename,
  ownerUsername,
  projectId,
  projectName,
  renderedFile,
}: FileViewCoreProps) => {
  const renderedFileMountRef = React.useRef<HTMLDivElement>(null);
  const fileExtension = filename.split('.').pop();
  const isNotebook = fileExtension === 'ipynb';
  const isReadmeFile = fileExtension === 'md';
  const isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
  const FileDisplayElement = withFileDisplayElement(RenderedFile);
  const readmeReplacementRules = R.pipe(
    // Resolve these items in urls in the readme
    (text: string) => projectId ? text.replace(/:projectId/ig, projectId) : text,
    (text: string) => projectName ? text.replace(/:projectName/ig, projectName) : text,
    (text: string) => ownerUsername ? text.replace(/:ownerName/ig, ownerUsername) : text,
    (text: string) => text.replace(/raw\/latest/ig, '../raw/latest')
  );

  const formatContent = React.useCallback(() => {
    const prettyPrint = (window as WindowInterface & typeof globalThis).prettyPrint;
    if (Boolean(prettyPrint) && !!renderedFile && renderedFileMountRef) {
      prettyPrint(null, renderedFileMountRef.current);
    }
  }, [renderedFile, renderedFileMountRef]);

  React.useEffect(() => {
    formatContent();
  }, [
    filename,
    formatContent,
    ownerUsername,
    projectId,
    projectName,
  ]);

  return (
    <NotebookIframeWrap ref={renderedFileMountRef}>
      <FileDisplayElement
        htmlStr={isReadmeFile ? readmeReplacementRules(renderedFile) : renderedFile}
        fileName={filename}
        iframeStyles={IFRAME_STYLES}
        className="resizeable_iframe"
        // @ts-ignore
        dangerouslySetInnerHTML={{ __html: isReadmeFile ? readmeReplacementRules(renderedFile) : renderedFile }}
        isEdgeNotebook={isEdge && isNotebook}
      />
    </NotebookIframeWrap>
  );
};
