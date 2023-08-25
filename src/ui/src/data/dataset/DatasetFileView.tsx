import {
  getDataset,
  getFileMetadata,
} from '@domino/api/dist/Datasetrw';
import { useAccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import { useHistory, useParams } from 'react-router-dom';
import * as React from 'react';
import styled from 'styled-components';

import Button from '../../components/Button/Button';
import { FileViewerWithIntersititals } from '../../components/FileViewer';
import SimpleBreadcrumbs from '../../components/SimpleBreadCrumbs';
import { EntityType } from '../../proxied-api/Auth';
import { initialDatasetRw } from '../../proxied-api/initializers';
import { themeHelper } from '../../styled/themeUtils';
import { formatTimestamp } from '../../utils/common';
import { prettyBytes } from '../../utils/prettyBytes';
import { useRemoteData } from '../../utils/useRemoteData';
import { KeyValueList } from '../KeyValue';
import { 
  GetDatasetGlobalFileViewPathDefProps as GlobalRouteParams, 
  GetDatasetProjectFileViewPathDefProps as ProjectRouteParams,
  datasetDetailsGlobalPathDef as getDatasetGlobalDirectoryViewPathDef,
  datasetUploadViewPathDef as getDatasetProjectDirectoryViewPathDef,
} from '../routes';
import { generateDownloadUri } from './file.utils';

export interface DatasetFileViewProps {
  projectId?: string;
}

const BreadcrumbWrapper = styled.div`
`;

const Header = styled.header`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${themeHelper('margins.small')};
`;

const KeyValueListWrapper = styled.div`
  margin-top: ${themeHelper('margins.small')};
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  width: 100%;
`;

const externalURIRegex = new RegExp('^[a-zA-Z]+://');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DatasetFileView = (props: DatasetFileViewProps) => {
  const params = useParams<GlobalRouteParams | ProjectRouteParams>();
  const history = useHistory();
  const accessControl = useAccessControl();

  const {
    data: dataset,
    hasLoaded: datasetHasLoaded,
  } = useRemoteData({
    canFetch: Boolean(params.datasetId),
    fetcher: () => getDataset({ datasetId: params.datasetId || '' }),
    initialValue: initialDatasetRw,
  });

  const snapshotId = params?.snapshotId || dataset.readWriteSnapshotId || ''
  
  const {
    data: metadata,
    error: metadataError,
    hasLoaded: metadataHasLoaded,
    loading: metadataLoading,
    refetch: metadataRefetch,
  } = useRemoteData({
    canFetch: Boolean(datasetHasLoaded && snapshotId && params.filePath),
    fetcher: () => getFileMetadata({ snapshotId: snapshotId, path: params?.filePath || '' }),
    initialValue: {},
  });

  const handleBreadcrumbNavigation = React.useCallback((path: string[]) => {
    return () => {
      const dirPath = path.length > 0 ? path.join('/') : undefined; 
      const {
        ownerName,
        projectName,
        datasetId,
        datasetName,
        snapshotId,
      } = params as ProjectRouteParams;

      const uri = ownerName ? getDatasetProjectDirectoryViewPathDef(
        ownerName,
        projectName,
        datasetId,
        datasetName,
        snapshotId,
        dirPath,
      ) : getDatasetGlobalDirectoryViewPathDef({
          datasetId,
          dirPath,
          snapshotId, 
      });

      history.push(uri);
    }
  }, [history, params]);

  const entityIds = {
    [EntityType.DatasetInstance]: params.datasetId
  };
  const canDownload = params.datasetId && accessControl.hasAccessToResource('dataset.file-viewer.download', entityIds);

  const buttonProps = React.useMemo(() => {
    if (metadata.uri) {
      if (externalURIRegex.test(metadata.uri)) {
        return {
          href: metadata.uri,
          target: '_blank',
        }
      }

      return generateDownloadUri(metadata.uri);
    }

    return {}
  }, [metadata.uri]);


  const filesize = React.useMemo(() => {
    return metadata.fileSize ? prettyBytes(metadata.fileSize) : '--';
  }, [metadata.fileSize]);

  const lastModified = React.useMemo(() => {
    return metadata.lastModified ? formatTimestamp(metadata.lastModified) : '--';
  }, [metadata.lastModified]);

  const list = [
    { name: 'File Size', value: filesize },
    { name: 'Last Modified', value: lastModified },
  ];

  return (
    <Wrapper>
      <Header>
        <BreadcrumbWrapper>
          <SimpleBreadcrumbs
            onNavigate={handleBreadcrumbNavigation}
            path={params.filePath?.split('/') || []}
            root="root"
          />
          <KeyValueListWrapper>
            <KeyValueList list={list} />
          </KeyValueListWrapper>
        </BreadcrumbWrapper>
        {canDownload && <Button {...buttonProps} >Download</Button>}
      </Header>
      <FileViewerWithIntersititals 
        metadata={metadata}
        metadataError={metadataError}
        metadataHasLoaded={metadataHasLoaded}
        metadataLoading={metadataLoading}
        onRefetchMetadata={metadataRefetch}
      />
    </Wrapper>
  );
}
