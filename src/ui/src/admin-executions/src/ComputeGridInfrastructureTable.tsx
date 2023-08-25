import * as React from 'react';
import * as R from 'ramda';
import { getInfrastructureInfo } from '@domino/api/dist/Admin';
import {
  DominoAdminInterfaceComputeNodeInfrastructureInfo as ComputeNodeInfrastructureInfo,
  DominoDataplaneDataPlane
} from '@domino/api/dist/types';
import Link from '../../components/Link';
import Table from '../../components/Table/Table';
import { error as errorToast } from '../../components/toastr';
import {
  describeNode
} from '../../core/routes';
import {
  infrastructureInfoRowFromInfrastructureInfo,
  filterInfrastructureInfoRows
} from './util';
import { stringComparer } from '../../utils/dataManipulation/utils';

export type State = {
  loading: boolean;
  error: boolean;
  nodeInfrastructureInfoRows: InfrastructureInfoRow[];
};

export type Props = {
  hybridEnabled?: boolean;
};

export type InfrastructureInfoRow = {
  name: string;
  nodePool: string;
  instanceType: string;
  isBuildNode: boolean;
  dataPlane: DominoDataplaneDataPlane;
};

const linkStyle = {
  display: 'block'
};

const defaultColumns = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sorter: stringComparer<InfrastructureInfoRow>(R.propOr('', 'name')),
    render: (name: string, row: InfrastructureInfoRow) => (
      <Link style={linkStyle} href={describeNode(row.dataPlane.id, row.name)} openInNewTab={true}>
        {name}
      </Link>
    )
  },
  {
    key: 'instanceType',
    title: 'Instance Type',
    dataIndex: 'instanceType',
    render: (instanceType: string) => <div>{instanceType}</div>
  },
  {
    key: 'nodePool',
    title: 'Node Pool',
    dataIndex: 'nodePool',
    render: (nodePool: string) => <div>{nodePool}</div>
  },
  {
    key: 'isBuildNode',
    title: 'Build Node',
    dataIndex: 'isBuildNode',
    sorter: stringComparer<InfrastructureInfoRow>(
      // boolean to string conversion for use in stringComparer
      infrastructureInfo => R.defaultTo(false.toString(), infrastructureInfo.isBuildNode.toString())
    ),
    render: (isBuildNode: boolean) => isBuildNode ? <div>true</div> : null
  }
];

const dataPlaneColumn = {
  key: 'dataPlane',
  title: 'Data plane',
  dataIndex: 'dataPlane',
  sorter: false,
  render: (dataPlane: DominoDataplaneDataPlane) => <>{dataPlane.name}</>,
}

const infrastructureInfoRowKey = (record: InfrastructureInfoRow) => record.name;

class ComputeGridInfrastructureTable extends React.Component<Props, State> {
  state = {
    loading: true,
    error: false,
    nodeInfrastructureInfoRows: []
  };

  async componentDidMount() {
    try {
      const result: ComputeNodeInfrastructureInfo[] = await getInfrastructureInfo({});
      const nodeInfrastructureInfoRows = R.map(infrastructureInfoRowFromInfrastructureInfo, result);
      const queryParams = new URLSearchParams(window.location.search);
      const dataplaneId = queryParams.get('dataplaneId');
      if (dataplaneId) {
        const filteredNodeInfrastructureInfoRows: InfrastructureInfoRow[] = nodeInfrastructureInfoRows.filter(node => node.dataPlane.id === dataplaneId);
        this.setState({
          nodeInfrastructureInfoRows: filteredNodeInfrastructureInfoRows,
          loading: false
        });
      }else{
        this.setState({
          nodeInfrastructureInfoRows: nodeInfrastructureInfoRows,
          loading: false
        });
      }
    } catch (err) {
      errorToast(`Error fetching node: ${err.status} ${err.name}`);
      this.setState({
        loading: false,
        error: true
      });
      console.warn(err);
    }
  }
  render() {
    const columns = this.props.hybridEnabled ? [...defaultColumns, dataPlaneColumn] : defaultColumns;
    return (
        <Table
          columns={columns}
          dataSource={this.state.nodeInfrastructureInfoRows}
          onFilter={filterInfrastructureInfoRows}
          emptyMessage={this.state.error ?
            <>
              An error occurred while fetching active jobs, workspaces, and apps.{' '}
              <Link href={window.location.href}>Refresh the page</Link>?
            </>
            : 'Nodes in the cluster will appear here'}
          rowKey={infrastructureInfoRowKey}
          loading={this.state.loading}
          hideRowSelection={true}
        />
    );
  }
}

export default ComputeGridInfrastructureTable;
