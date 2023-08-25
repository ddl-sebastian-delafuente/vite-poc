import { FileViewerModule } from '../FileViewer.types';
import { AudioViewer } from './AudioViewer';
import { DownloadOnlyViewer } from './DownloadOnlyViewer';
import { GeoJSONViewerModule } from './GeoJSONViewer';
import { ImageViewer } from './ImageViewer';
import { MarkdownViewer } from './MarkdownViewer';
import { MolecularViewer } from './MolecularViewer'
import { PDFViewer } from './PDFViewer';
import { PlainTextViewer } from './PlainTextViewer';
import { TableViewer } from './TableViewer';
import { LegacyViewer } from './LegacyViewer';
import { VideoViewer } from './VideoViewer';


export const DefaultViewers: FileViewerModule[] = [
  ImageViewer,
  AudioViewer,
  VideoViewer,
  PDFViewer,
  MarkdownViewer,
  MolecularViewer,
  GeoJSONViewerModule,
  TableViewer,
  PlainTextViewer,
  DownloadOnlyViewer,
  LegacyViewer,
]
