import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Document, Page, pdfjs } from "react-pdf";
//@ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { colors, themeHelper } from '../../../styled';
import { FileViewerFileRendererProps, FileViewerModule } from '../FileViewer.types';
// https://github.com/wojtekmaj/react-pdf/issues/321
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;

  .react-pdf__Page {
    margin-top: ${themeHelper('paddings.small')};
  }

  .react-pdf__Page__canvas {
    margin: 0 auto;
    border: 1px solid ${colors.neutral400};
    box-shadow: 5px 5px 5px 1px ${colors.silverGrayLighter};
    border-radius: 5px;
  }
`;

const PDFViewerRenderer = ({ metadata }: FileViewerFileRendererProps) => {
  const [numPages, setNumPages] = React.useState<number>(0);

  const handleLoadSuccess = React.useCallback(({numPages}: {numPages: number}) => setNumPages(numPages), [setNumPages]);
  const pageElem = React.useMemo(() => {
    return R.times((index: number) => (
      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
    ), numPages);
  }, [numPages]);

  if (!metadata.uri && !metadata.data) {
    return null;
  }

  return (
    <Wrapper>
      <Document
        file={metadata.uri ? metadata.uri : {data: metadata.data}}
        onLoadSuccess={handleLoadSuccess}
      >
        {pageElem}
      </Document>
    </Wrapper>
  );
};

export const PDFViewer: FileViewerModule = {
  id: 'pdf-generic',
  Renderer: PDFViewerRenderer,
  supportedExtensions: ['pdf'],
  supportedTypes: [
    new RegExp('^application/pdf$', 'i'),
  ]
}

export default PDFViewerRenderer;
