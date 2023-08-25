import * as React from 'react';
import { defaultTo, pipe } from 'ramda';
import styled from 'styled-components';
import {
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings
} from '@domino/api/dist/types';
import { httpRequest } from '@domino/api/dist/httpRequest';
import { WaitSpinner } from '../../components/WaitSpinner';
import { renderFileContentsEndpoint } from '../../core/legacyApiEndpoints';
import DataFetcher from '../../utils/DataFetcher';
import { FAILED_FILE_FETCH_MESSAGE, withFileDisplayElement } from '../util';
import { getAppName, replaceWithWhiteLabelling } from '../../utils/whiteLabelUtil';

type RenderedFileProps = {
  dangerouslySetInnerHTML: any;
  isEdgeNotebook: boolean;
};
const RenderedFile = styled.div<RenderedFileProps>`
  height: ${props => props.isEdgeNotebook ? '500px' : 'auto'};
  min-height: ${props => props.isEdgeNotebook ? '100px' : '200px'};
  overflow-y: ${props => props.isEdgeNotebook ? 'auto' : 'visible'};
  width: 100%;
`;

interface WindowInterface extends Window {
  prettyPrint: (x: any, y: any) => any;
}

const formatContent = (fileContent: string, element: null | HTMLDivElement): void => {
  const prettyPrint = (window as WindowInterface & typeof globalThis).prettyPrint;
  if (Boolean(prettyPrint) && !!fileContent && element) {
    prettyPrint(null, element);
  }
};

export type OuterProps = {
  ownerUsername: string;
  projectId: string;
  projectName: string;
  path: string;
  filename: string;
  commitId: string;
  whiteLabelSettings?: WhiteLabelSettings;
};

export type InnerProps = {
  renderedFile: string;
} & OuterProps;

export class View extends React.PureComponent<InnerProps> {
  renderedFileMount: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    this.prettyPrintRenderedFile();
  }

  componentDidUpdate() {
    this.prettyPrintRenderedFile();
  }

  prettyPrintRenderedFile = () => {
    formatContent(this.props.renderedFile, this.renderedFileMount.current);
  }

  render() {
    const {
      ownerUsername,
      projectId,
      projectName,
      filename,
      renderedFile,
    } = this.props;

    // Edge can't render iframes for notebooks correctly so need to render in div
    const isNotebook = filename.split('.').pop() === 'ipynb';
    const isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
    const isReadmeFile = filename.split('.').pop() === 'md';
    const FileDisplayElement = withFileDisplayElement(RenderedFile);
    const readmeReplacementRules = pipe(
      // Resolve these items in urls in the readme
      (text: string) => projectId ? text.replace(/:projectId/ig, projectId) : text,
      (text: string) => projectName ? text.replace(/:projectName/ig, projectName) : text,
      (text: string) => ownerUsername ? text.replace(/:ownerName/ig, ownerUsername) : text,
      (text: string) => text.replace(/raw\/latest/ig, '../raw/latest')
    );
    return (
      <FileDisplayElement
        htmlStr={isReadmeFile ? readmeReplacementRules(renderedFile) : renderedFile}
        fileName={filename}
        iframeStyles={{height: '500px', minHeight: '100px', border: 0}}
        className="resizeable_iframe"
        // @ts-ignore
        dangerouslySetInnerHTML={{ __html: isReadmeFile ? readmeReplacementRules(renderedFile) : renderedFile }}
        isEdgeNotebook={isEdge && isNotebook}
      />);
  }
}


type FetcherProps = {
  ownerUsername: string;
  projectName: string;
  path: string;
  commitId: string;
  renderUnknownFilesAsText: boolean;
};

type FetchResult = {
  fileContents: string;
};

const Fetcher: new() => DataFetcher<FetcherProps, FetchResult> = DataFetcher as any;
const fetchFileContents = async ({
  ownerUsername,
  projectName,
  path,
  commitId,
  renderUnknownFilesAsText,
}: FetcherProps): Promise<FetchResult> => {
  const gettingFileContents = httpRequest(
    'GET',
    renderFileContentsEndpoint(ownerUsername, projectName, path, commitId, renderUnknownFilesAsText),
    undefined,
    {},
    {
      accept: '*/*',
      'Content-Type': 'text/html'
    },
    undefined,
    false
  );

  const fileContents = await gettingFileContents;
  const finalFileContents = defaultTo('')(fileContents);

  return {
    fileContents: finalFileContents
  };
};

export const SharedFileDisplay = (props: OuterProps) => (
  <Fetcher
    initialChildState={{
      fileContents: '',
    }}
    fetchData={fetchFileContents}
    renderUnknownFilesAsText={true}
    {...props}
  >
    {(
      {fileContents, ...result}: FetchResult,
      loading: boolean,
      delegatedFetcher: any,
      error: any) => (
      loading ? (
        <WaitSpinner forPage={true} />
      ) : (
        <View
          {...props}
          {...result}
          renderedFile={error ? `<div class="fetch-error">${replaceWithWhiteLabelling(getAppName(props.whiteLabelSettings))(FAILED_FILE_FETCH_MESSAGE)}</div>` : fileContents}
        />
      )
    )}
  </Fetcher>
);
