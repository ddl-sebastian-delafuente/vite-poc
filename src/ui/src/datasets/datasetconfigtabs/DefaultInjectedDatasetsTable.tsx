import * as React from 'react';
import * as R from 'ramda';
import Table from '../../components/Table/Table';
import WaitSpinner from '../../components/WaitSpinnerWithErrorHandling';
import {
  DominoDatasetrwApiDatasetRwProjectMountDto
} from '@domino/api/dist/types';
import {
  getLocalDatasetProjectMountsV2, getSharedDatasetProjectMountsV2
} from '@domino/api/dist/Datasetrw';
import { DatasetConfigLauncherType } from './DataSetConfigSelectionTabs';
import { themeHelper } from '../../styled/themeUtils';
import styled from 'styled-components';
import HelpLink from '../../components/HelpLink';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import { SUPPORT_ARTICLE } from '../../core/supportUtil';
import { DatasetsDeprecationWarning } from '../DatasetsDeprecationWarning';
import { mixpanel } from '../../mixpanel';
import { DatasetsDeprecationWarningDismissEvent, Locations } from '../../mixpanel/types';
import withStore, { StoreProps } from '../../globalStore/withStore';
import { getAppName, replaceWithWhiteLabelling } from '../../utils/whiteLabelUtil';

const xScrollConfig = { x: 500 };

const Container = styled.div`
  .disabled {
    pointer-events: none;
    .showTooltip {
      pointer-events: auto;
    }
  }
`;

const TextContainer = styled.div`
  white-space: normal;
`;

const SimpleModeTextContainer = styled(TextContainer)`
  margin-bottom: ${themeHelper('margins.medium')};
`;

const StyledTable = styled(Table)`
  & .ant-table-tbody > tr > td {
    max-width: 100%;
  }
`;

export const getSnapshotPath = (datasetPath: string) => {
  return R.insert(1, 'snapshots', datasetPath.split('/').reverse()).reverse().join('/');
};

const DeprecationWarningConatiner = styled.div`
  .deprecation-warning {
    margin: 0 0 6px;
  }
`;

const readWriteDatasetsColumns = [
  {
    key: 'name',
    title: 'Dataset Name',
    dataIndex: 'name',
    sorter: false,
    render: (name: string) => tooltipRenderer('', <div className="showTooltip">{name}</div>),
    width: 100
  },
  {
    key: 'path',
    title: 'Path',
    dataIndex: 'mountPathsForProject',
    sorter: false,
    render: (paths: Array<string>) => !R.isEmpty(paths) ? R.head(paths) : '--',
    width: 100
  },
  {
    key: 'snapshotPath',
    title: 'Snapshot Path',
    dataIndex: 'mountPathsForProject',
    sorter: false,
    render: (paths: Array<string>) => !R.isEmpty(paths) ? getSnapshotPath(paths[0]) : '--',
  },
];

// path is unique
const datasetConfigsRowsKey = (row: DefaultDataSetRow) => row.path;

export type DefaultDataSetRow = {
  name: string;
  path: string;
  requestLatest: boolean;
  requestedTag?: string;
  requestedVersionNumber?: number;
};

export type State = {
  rows: DominoDatasetrwApiDatasetRwProjectMountDto[];
  loading: boolean;
  error?: any;
};

export type Props = {
  projectId: string;
  launchedBySelector: DatasetConfigLauncherType;
  onDatasetsFetch?: (datasets: Array<DominoDatasetrwApiDatasetRwProjectMountDto>) => void;
  currentUser: string;
} & StoreProps;

const onDismissWarning = (userName: string) => {
  mixpanel.track(() =>
    new DatasetsDeprecationWarningDismissEvent({
      user: userName,
      location: Locations.DatasetsDeprecationWarning
    })
  );
};

class DefaultInjectedDatasetsTable extends React.PureComponent<Props, State> {
  state = {
    rows: [],
    loading: true,
    error: undefined,
  };

  UNSAFE_componentWillMount() {
    this.getDefaultDatasets();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      projectId
    } = this.props;
    if ((projectId !== prevProps.projectId)) {
      this.getDefaultDatasets();
    }
  }

  async getDefaultDatasets() {
    const {
      projectId,
      onDatasetsFetch
    } = this.props;
    if (projectId) {
      let datasets: DominoDatasetrwApiDatasetRwProjectMountDto[] = [];
      try {
        const rwDatasets = await getLocalDatasetProjectMountsV2({ projectId });
        const sharedRwDatasets = await getSharedDatasetProjectMountsV2({ projectId });
        datasets = R.filter(dataset => R.equals(dataset.versionNumber, 0), rwDatasets);
        datasets = datasets.concat(R.filter(dataset => R.equals(dataset.versionNumber, 0), sharedRwDatasets));
        this.setState({
          loading: false,
          rows: datasets,
        });
        if (onDatasetsFetch) {
          onDatasetsFetch(datasets);
        }
      } catch (error) {
        console.error(error);
        this.setState({ error, loading: false });
      }
    }
  }

  render() {
    const {
      rows,
      loading,
      error,
    } = this.state;
    const {
      whiteLabelSettings,
      launchedBySelector,
      currentUser
    } = this.props;
    const getTextWithFixedWhiteLabel = replaceWithWhiteLabelling(getAppName(whiteLabelSettings));
    if (loading || !!error) {
      return (
        <WaitSpinner errored={!!error}>
          Loading default configurations...
        </WaitSpinner>
      );
    } else if (rows.length === 0 ) {
      return (
        <TextContainer>
          <div>
            Your Project doesn't have any local or mounted Datasets.
          </div>
          <div>
            {getTextWithFixedWhiteLabel('Domino Datasets provide high-performance, versioned and structured filesystem storage in Domino.')}
            {' '}
            <HelpLink
              text="Learn more."
              articlePath={SUPPORT_ARTICLE.DATASETS_OVERVIEW}
              showIcon={false}
            />
          </div>
        </TextContainer>
      );
    }

    return (
      <div>
        <DeprecationWarningConatiner>
          <DatasetsDeprecationWarning
            onChangeUserChoice={() => onDismissWarning(currentUser)}
          />
        </DeprecationWarningConatiner>
        <SimpleModeTextContainer>
          {
            `The following datasets will be made available to your  ${launchedBySelector}.
             Older snapshots of each dataset are also available as Read-only.`
          }
        </SimpleModeTextContainer>
        <Container>
          <StyledTable
            tableLayout="auto"
            scroll={xScrollConfig}
            rowKey={datasetConfigsRowsKey}
            showPagination={false}
            showSearch={false}
            columns={readWriteDatasetsColumns}
            dataSource={rows}
            hideRowSelection={true}
            hideColumnFilter={true}
            rowClassName={'enabled'}
          />
        </Container>
      </div>
    );
  }
}

export default withStore(DefaultInjectedDatasetsTable);
