import * as React from 'react';
import styled from 'styled-components';
import {
  DominoHardwaretierApiHardwareTierOverprovisioningDto as OverProvisioningInfo,
  DominoHardwaretierApiHardwareTierGpuConfigurationDto as GpuConfiguration,
  DominoDataplaneDataPlaneDto
} from '@domino/api/dist/types';
import Modal, { Title } from '@domino/ui/dist/components/Modal';
import { listDataPlanes } from '@domino/api/dist/Dataplanes';
import DangerDarkButton from '@domino/ui/dist/components/DangerButtonDark';
import ModalFooter from '@domino/ui/dist/components/ModalFooter';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import CSRFInputField from '../../filebrowser/CSRFInputField';
import Link from '../../components/Link/Link';
import Table, { ColumnConfiguration } from '../../components/Table/Table';
import { mixpanel } from '../../mixpanel';
import { HardwareTiersButtonEvent, Locations } from '../../mixpanel/types';
import {
  filterHardwareTierInfoRows
} from './util';
import {
  numberComparer
 } from '../../utils/dataManipulation/utils';
import HelpLink from '../../components/HelpLink';

// Type describing component State
export type State = {
  loading: boolean;
  error: boolean;
  hardwareTierRows: HardwareTierRow[];
  rowId?: string | null;
  displayModal: boolean;
};

// Type describing component Props
export type Props = {
  // TODO: This is actualy generated from the hardware tier view model, which is
  // different from our generated typescript Dto type. We should probably export
  // a new Dto and use this so that we catch changes in the future.
  hardwareTierRows: HardwareTierRow[];
  canManage: boolean;
  csrfToken: string;
  isDominoHosted?: boolean;
  isDataAnalystEnabled?: boolean;
  hybridEnabled?: boolean;
};

// Type describing Rows for table.
// Each row contains relevant descriptive attributes that are described in table cells
export type HardwareTierRow = {
  name: string;
  id: string;
  clusterType: string;
  resources: Resources;
  gpuConfiguration: GpuConfiguration;
  nodePool: string;
  isFree: boolean;
  isAllowedDuringTrial: boolean;
  isDefault: boolean;
  isDataAnalystTier?: boolean;
  isVisible: boolean;
  isGlobal: boolean;
  centsPerMinute: number;
  overprovisioning: OverProvisioningInfo;
  dataPlaneId: string|undefined;
  dataPlane?: DominoDataplaneDataPlaneDto;
  availabilityZones?: string[]|undefined|null;
};

export type Resources = {
  cores: number;
  coresLimit: number;
  memory: number;
  memoryLimit: number;
}

const StyledDangerDarkButton = styled(DangerDarkButton)`
  margin-left: 5px;
`;
// Removes hover effect for text span surrounded by anchor tag.
const UnstyledLink = styled(HelpLink)`
  & > span {
    color:black;
    padding-right:5px;
  }
`;

// Function that determines whether action links are displayed
// if clusterType is Kubernetes, allow for action, else put explanatory text
const determineActionButton = (clusterType: string | undefined, linkText: string, linkPath: string) => {
  if (clusterType==="Kubernetes") {
    return (
      <a
        href={linkPath}
        data-test={"action-button"}

        onClick={()=> {

          mixpanel.track(() =>
          new HardwareTiersButtonEvent({
              button: linkText,
              location: Locations.HardwareTiers
            }));

          }
        }
      >
        {linkText}
      </a>
    )
  } else {
    // To do -- abstract into component
     return tooltipRenderer(
        <span>{`This ${clusterType} hardware tier is not supported in this version.`}</span>,
        <span data-test={"action-button-classicAws"}>
          <UnstyledLink
            text={linkText}
            articlePath="compute/compute-grid.html"
            basePath="https://admin.dominodatalab.com"
          />
        </span>
      )
  }

}

// The width declaration on the table is not working
// Using a styled component wrapper in the title component is a work around
// To establish a min width on a column.  Display is inline to avoid breaking filter menu
const MinWidthCell = styled.div`
  min-width: 60px;
  display: inline;
`;



// Row key extractor utility function
const hardwareTierRowKey = (record: any) => record.rowKey;

class ComputeGridHardwareTierTable extends React.Component<Props, State> {
  state = {
    loading: false,
    error: false,
    hardwareTierRows: [],
    displayModal: false,
    rowId: undefined,
  };

  setRows =  async () => {
    try {
      const { hardwareTierRows, hybridEnabled } = this.props;
      if (hybridEnabled){
        const dataPlanesList = await listDataPlanes({});

        const updatedRows: HardwareTierRow[] = hardwareTierRows.map(row => {
          const dataPlaneId = row.dataPlaneId ? row.dataPlaneId : "000000000000000000000000";
          const dataPlane: DominoDataplaneDataPlaneDto | undefined = dataPlanesList.find((dataPlane: DominoDataplaneDataPlaneDto) => dataPlaneId === dataPlane.id);
          return { ...row, dataPlane }
        });

        this.setState({ ...this.state, hardwareTierRows: updatedRows })
      }else{
        this.setState({ ...this.state, hardwareTierRows })
      }
    } catch (err) {
      console.warn(err);
    }
  }

   componentDidMount(){
     this.setRows();
  }
  // Array describing action buttons at end of table.
  // Only appended to hardware tier row desciptor when canManage === true
  actionButtonDescriptors: ColumnConfiguration[] = [
    {
      key: 'actionEdit',
      title: <MinWidthCell>{' '}</MinWidthCell>,
      dataIndex: 'clusterType',
      // canEdit should be hideFilter
      hideFilter: true,
      sorter: false,
      render: (actionEdit: boolean, row: HardwareTierRow) => {
        return determineActionButton(row.clusterType, "Edit", `/admin/hwtiers/edit/${row.id}`)
      },
      width: 60
    },
    {
      key: 'actionClone',
      title: <MinWidthCell>{' '}</MinWidthCell>,
      dataIndex: 'clusterType',
      hideFilter: true,
      sorter: false,
      render: (actionClone: boolean, row: HardwareTierRow) => {
        return determineActionButton(row.clusterType, "Clone", `/admin/hwtiers/clone/${row.id}`)
      },
      width: 60
    },
    {
      key: 'actionArchive',
      title: <MinWidthCell>{' '}</MinWidthCell>,
      dataIndex: 'clusterType',
      hideFilter: true,
      sorter: false,
      render: (actionArchive: boolean, row: HardwareTierRow) => {
        return (
          <a
            data-test={"hwt-archive-button"}
            onClick={()=> {

              mixpanel.track(() =>
              new HardwareTiersButtonEvent({
                button: "Archive",
                location: Locations.HardwareTiers
              }));

              return this.setState({rowId: row.id, displayModal: true})
            }
          }
          >
              Archive
          </a>
        )
      },
      width: 60
    }
  ]

  dataPlaneColumn: ColumnConfiguration = {
    key: 'dataPlane',
    title: 'Data plane',
    dataIndex: 'dataPlane',
    sorter: false,
    render: (dataPlane: DominoDataplaneDataPlaneDto) => dataPlane ? <div>{dataPlane.name}</div> : null,
    width: 60
  }

  getColumns(): ColumnConfiguration[] {
    const {
      canManage,
      hybridEnabled,
      isDominoHosted,
      isDataAnalystEnabled,
    } = this.props;

    // Column attributes for table
    const defaultColumns: ColumnConfiguration[] = [
      {
        key: 'id',
        title: <MinWidthCell>{'Id'}</MinWidthCell>,
        dataIndex: 'id',
        width: 60
      },
      {
        key: 'name',
        title: <MinWidthCell>{'Name'}</MinWidthCell>,
        dataIndex: 'name',
        width: 60
      },
      {
        key: 'clusterType',
        title: <MinWidthCell>{'Cluster Type'}</MinWidthCell>,
        dataIndex: 'clusterType',
        width: 60
      },
      {
        key: 'cores',
        title: 'Cores',
        dataIndex: ['resources', 'cores'],
        align: 'right',
        width: 50
      },
      {
        key: 'coresLimit',
        title: 'Cores Limit',
        dataIndex: ['resources', 'coresLimit'],
        align: 'right',
        width: 50
      },
      {
        key: 'memory',
        title: 'Memory (GiB)',
        dataIndex: ['resources', 'memory'],
        align: 'right',
        width: 50
      },
      {
        key: 'memoryLimit',
        title: 'Memory Limit (GiB)',
        dataIndex: ['resources', 'memoryLimit'],
        align: 'right',
        width: 50
      },
      {
        key: 'numberOfGpus',
        title: 'Number of GPUs',
        dataIndex: 'gpuConfiguration',
        sorterDataIndex: ['gpuConfiguration', 'numberOfGpus'],
        align: 'right',
        render: (gpuConfiguration: GpuConfiguration) => <div>{gpuConfiguration.numberOfGpus}</div>,
        width: 50
      },
      {
        key: 'overprovisioning',
        title: 'Over-provision',
        dataIndex: 'overprovisioning',
        sorterDataIndex: ['overprovisioning', 'instances'],
        align: 'right',
        render: (overprovisioning: OverProvisioningInfo) => <div>{overprovisioning.instances}</div>,
        width: 50
      },
      {
        key: 'nodePool',
        title: <MinWidthCell>{'Node Pool'}</MinWidthCell>,
        dataIndex: 'nodePool',
        width: 60,
      },
      {
        key: 'isDefault',
        title: 'Is Default',
        dataIndex: 'isDefault',
        sorter: numberComparer<HardwareTierRow>(hardwareRow => Number(hardwareRow.isDefault)),
        render: (isDefault: boolean) => <div>{isDefault ? "true" : "false"}</div>,
        width: 50
      },
      ...(isDataAnalystEnabled ? [
        {
          key: 'isDataAnalystTier',
          title: 'Is Data Analyst Tier',
          dataIndex: 'isDataAnalystTier',
          sorter: numberComparer<HardwareTierRow>(hardwareRow => Number(hardwareRow.isDataAnalystTier)),
          render: (isDataAnalystTier: boolean) => <div>{isDataAnalystTier ? "true" : "false"}</div>,
          width: 50
        }
      ] : []),
      {
        key: 'isVisible',
        title: 'Is Visible',
        dataIndex: 'isVisible',
        sorter: numberComparer<HardwareTierRow>(hardwareRow => Number(hardwareRow.isVisible)),
        render: (isVisible: boolean) => <div>{isVisible ? "true" : "false"}</div>,
        width: 50
      },
      {
        key: 'isGlobal',
        title: 'Is Global',
        dataIndex: 'isGlobal',
        sorter: numberComparer<HardwareTierRow>(hardwareRow => Number(hardwareRow.isGlobal)),
        render: (isGlobal: boolean) => <div>{isGlobal ? "true" : "false"}</div>,
        width: 50
      }
    ]

    // Columns that are only injected when hosting by Domino
    const dominoHostingColumns: ColumnConfiguration[] = [
      {
        key: 'centsPerMinute',
        title: 'Cents Per Minute Per Run',
        dataIndex: 'centsPerMinute',
        width: 50
      },
      {
        key: 'isFree',
        title: 'Is Free',
        dataIndex: 'isFree',
        sorter: numberComparer<HardwareTierRow>(hardwareRow => Number(hardwareRow.isFree)),
        render: (isFree: boolean) => <div>{isFree ? "true" : "false"}</div>,
        width: 50
      },
      {
        key: 'isAllowedDuringTrial',
        title: 'Is Allowed During Trial',
        dataIndex: 'isAllowedDuringTrial',
        sorter: numberComparer<HardwareTierRow>(hardwareRow => Number(hardwareRow.isAllowedDuringTrial)),
        render: (isAllowedDuringTrial: boolean) => <div>{isAllowedDuringTrial ? "true" : "false"}</div>,
        width: 50
      },
    ];

    return [
      ...defaultColumns,
      ...(isDominoHosted ? dominoHostingColumns : []),
      ...(hybridEnabled ? [this.dataPlaneColumn] : []),
      ...(canManage ? this.actionButtonDescriptors : []),
    ];
  }

  modalHandleOk = () => {
    const form = document.getElementById('archiveHardwareTierModalForm') as (null | HTMLFormElement);
    if (form) {
      form.submit();
    }
  }

  render() {
    const { displayModal, rowId, hardwareTierRows} = this.state;
    const { csrfToken } = this.props;

    const hardwareTierColumns = this.getColumns();

    return (
      <React.Fragment>
        <Table
          columns={hardwareTierColumns}
          dataSource={hardwareTierRows}
          onFilter={filterHardwareTierInfoRows}
          emptyMessage={this.state.error ?
            <>
              An error occurred while fetching hardware tier information.
              <Link href={window.location.href}>Refresh the page</Link>?
            </>
            : 'Hardware Tier information will appear here'}
          rowKey={hardwareTierRowKey}
          loading={this.state.loading}
          hideRowSelection={true}
          columnsToHideByDefault={['clusterType']}
        />
        <form id="archiveHardwareTierModalForm" action="/admin/hwtiers/archive" method="POST" className="form-inline">
          <input type="hidden" id="hardwareTierIdField" name="hardwareTierId" value={rowId}/>
          <CSRFInputField csrfToken={csrfToken} />
        </form>
        <Modal
          visible={displayModal}
          onCancel={()=>this.setState({displayModal: false})}
          title={<Title >Archive Hardware Tier</Title>}
          footer={<ModalFooter
            modalCancelButtonLabel="Cancel"
            handleCancel={()=>this.setState({displayModal: false})}
            CustomSubmitButton={StyledDangerDarkButton}
            modalSubmitButtonLabel="Archive Hardware Tier"
            submitButtonProps={{htmlType: "submit"}}
            visible={true}
            handleOk={() => this.modalHandleOk()}
          />}
          data-test="api-key-generator"
          closable={true}
        >
          <p><strong className="text-danger">You will not be able to undo this.</strong></p>
          <p>Are you sure you want to archive the hardware tier '{rowId}'?</p>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ComputeGridHardwareTierTable;
