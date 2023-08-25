import { getCodeSnippet } from '@domino/api/dist/Featurestore';
import { DominoFeaturestoreApiFeatureViewDto } from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import CopyToClipBoard from '../../../components/CopyToClipBoard';
import { OfflineStoreType } from '../../../proxied-api/types';
import { useRemoteData } from '../../../utils/useRemoteData';

const BIG_QUERY_SNIPPET = `# example data source definition for BigQuery offline store
# see https://docs.feast.dev/reference/data-sources/bigquery for more info

from feast import BigQuerySource

my_bigquery_source = BigQuerySource(
  table_ref="gcp_project:bq_dataset.bq_table",
)

# using a query
'''
BigQuerySource(
    query="SELECT timestamp as ts, created, f1, f2 "
          "FROM \`my_project.my_dataset.my_features\`",
)
'''`;

const FILE_SNIPPET = `# example data source definition for File offline store
# see https://docs.feast.dev/reference/data-sources/file for more info

from feast import FileSource
from feast.data_format import ParquetFormat

parquet_file_source = FileSource(
  file_format=ParquetFormat(),
  path="file:///feast/customer.parquet",
)`;

const REDSHIFT_SNIPPET = `# example data source definition for Redshift offline store
# see https://docs.feast.dev/reference/data-sources/redshift for more info

from feast import RedshiftSource

my_redshift_source = RedshiftSource(
  table="redshift_table",
)

# using a query
'''
my_redshift_source = RedshiftSource(
    query="SELECT timestamp as ts, created, f1, f2 "
          "FROM redshift_table",
)
'''`;

const SNOWFLAKE_SNIPPET = `# example data source definition for Snowflake offline store
# see https://docs.feast.dev/reference/data-sources/snowflake for more info

from feast import SnowflakeSource

my_snowflake_source = SnowflakeSource(
    database="FEAST",
    schema="PUBLIC",
    table="FEATURE_TABLE",
)`

const OFFLINE_STORE_SNIPPET_MAP = {
  [OfflineStoreType.BigQuery]: BIG_QUERY_SNIPPET,
  [OfflineStoreType.File]: FILE_SNIPPET,
  [OfflineStoreType.Redshift]: REDSHIFT_SNIPPET,
  [OfflineStoreType.Snowflake]: SNOWFLAKE_SNIPPET,
};

const StyledCopyToClipBoard = styled.div`
  .text-container {
    display: none;
  }
  float: right;
`;

export interface CopyCodeSnippetProps {
  codeSnippet: string;
}

const CopyCodeSnippet = ({
  codeSnippet
}: CopyCodeSnippetProps) => {
  return (
    <StyledCopyToClipBoard data-test="copy-code-string">
      <CopyToClipBoard text={codeSnippet} />
    </StyledCopyToClipBoard>
  );
};

export default CopyCodeSnippet;

export interface CopyCodeSnippetWithStateProps {
  featureView?: DominoFeaturestoreApiFeatureViewDto;
  offlineStoreType?: OfflineStoreType;
}

export const CopyCodeSnippetWithState = ({
  featureView,
  offlineStoreType,
}: CopyCodeSnippetWithStateProps) => {
  const {
    data,
  } = useRemoteData({
    canFetch: Boolean(featureView && !offlineStoreType),
    fetcher: () => getCodeSnippet({ featureViewId: featureView?.id || '' }),
    initialValue: { snippet: '' },
  });

  const resolvedSnippet = React.useMemo(() => {
    if (!offlineStoreType) {
      return data.snippet
    }

    return OFFLINE_STORE_SNIPPET_MAP[offlineStoreType] || '';
  }, [data.snippet, offlineStoreType]);

  return (
    <CopyCodeSnippet
      codeSnippet={resolvedSnippet}
    />
  );
};
