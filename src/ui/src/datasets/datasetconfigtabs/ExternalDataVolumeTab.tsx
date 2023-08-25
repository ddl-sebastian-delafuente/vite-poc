import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { WarningFilled } from '@ant-design/icons';
import { DominoDatamountApiDataMountDto as ExternalVolume } from '@domino/api/dist/types';
import {
 findDataMountsByProject,
 checkAndUpdateDataMountStatus,
 getRootPathForProject
} from '@domino/api/dist/Datamount';
import Table from '../../components/Table/Table';
import WaitSpinner from '../../components/WaitSpinnerWithErrorHandling';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import { colors, themeHelper } from '../../styled';
import { DatasetConfigLauncherType } from './DataSetConfigSelectionTabs';

const TextContainer = styled.div`
  white-space: normal;
`;

const SimpleModeTextContainer = styled(TextContainer)`
  margin-bottom: ${themeHelper('margins.medium')};
`;
const StyledError = styled.div`
  display: inline-block;
  width: 20px;
  vertical-align: middle;
`;
const Container = styled.div`
  .ant-table-content {
    overflow-x: auto;
  }
`;

const columns = (dataMountRootPath: string) => [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sorter: false,
    render: (name: string, row: ExternalVolume) => {
      return (
        <div>
          {row.status && <StyledError>
            {tooltipRenderer(
              row.status,
              <span><WarningFilled style={{ fontSize: '13px', color: colors.cabaret }} /></span>
            )}
          </StyledError>}
          <span>{name}</span>
        </div>
      );
    }
  },
  {
    key: 'mountPath',
    title: 'Mount Path',
    dataIndex: 'mountPath',
    sorter: false,
    render: (mountPath: string) => `${dataMountRootPath}/${mountPath}`
  }
];

export type Props = {
  projectId: string;
  launchedBySelector: DatasetConfigLauncherType;
  filterRemoteDataMounts?: boolean;
};

export type State = {
  externalVolumeData: ExternalVolume[];
  loading: boolean;
  dataMountRootPath: string;
};

class ExternalDataVolumeTab extends React.PureComponent<Props, State> {
  state: State = {
    externalVolumeData: [],
    loading: true,
    dataMountRootPath: ''
  };

  UNSAFE_componentWillMount() {
    this.getExternalDataVolumes();
    this.fetchRootPathForProject();
  }

  fetchRootPathForProject = async () => {
    try {
      const dataMountRootPath = await getRootPathForProject({
        projectId: this.props.projectId
      });
      this.setState({dataMountRootPath});
    } catch (e) {
      console.warn(e);
    }
  }

  getExternalDataVolumes = async () => {
    try {
      this.setState({loading: true});
      const dataMounts = await findDataMountsByProject({projectId: this.props.projectId});
      const validMounts = this.props.filterRemoteDataMounts ? dataMounts.filter(dm => dm.dataPlanes.reduce((cur, dp) => dp.isLocal || cur, false)) : dataMounts
      const dataMountsWithStatus = await checkAndUpdateDataMountStatus({
        body: {
          datamountIds: R.pluck('id')(validMounts)
        }
      });
      this.setState({
        externalVolumeData: dataMountsWithStatus
      });
    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({loading: false});
    }
  }

  render() {
    const { externalVolumeData, loading } = this.state;
    const { launchedBySelector } = this.props;
    return R.cond([
      [
        () => loading,
        () => (
          <WaitSpinner>
            Loading default configurations...
          </WaitSpinner>
        )
      ], [
        () => R.isEmpty(externalVolumeData),
        () => (
          <TextContainer>
            <div>
              Your Project doesn't have any mounted external data volumes.
            </div>
          </TextContainer>
        )
      ], [
        R.T,
        () => (
          <Container>
            <SimpleModeTextContainer>
              The following external volume mounts are available for your {launchedBySelector}.
            </SimpleModeTextContainer>
            <Table
              showPagination={false}
              showSearch={false}
              columns={columns(this.state.dataMountRootPath)}
              dataSource={externalVolumeData}
              hideRowSelection={true}
              hideColumnFilter={true}
            />
          </Container>
        )
      ]
    ])();
  }
}

export default ExternalDataVolumeTab;
