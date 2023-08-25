import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { MoreOutlined, WarningFilled } from '@ant-design/icons';
import {
  DominoDatamountApiDataMountDto as ExternalVolume,
  DominoProjectsApiProjectSummary as Project,
  Organization,
  DominoDataplaneDataPlaneDto
} from '@domino/api/dist/types';
import { getProjectSummary } from '@domino/api/dist/Projects';
import { getAllOrganizations } from '@domino/api/dist/Organizations';
import { getAllRegisteredDataMounts, checkAndUpdateDataMountStatus } from '@domino/api/dist/Datamount';
import FlexLayout from '../../components/Layouts/FlexLayout';
import Table, { TableProps } from '../../components/Table/Table';
import { ActionDropdown } from '../../components';
import EmptyExternalVolumeIcon from '../../icons/EmptyExternalVolumeIcon';
import { colors, fontSizes, themeHelper } from '../../styled';
import ExternalDataVolumeView from './ExternalDataVolumeView';
import UnregisterExternalDataVolume from './UnregisterExternalDataVolume';
import EditExternalDataVolume from './EditExternalDataVolume';
import RegisterExternalVolumeData from './RegisterExternalVolumeData';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import WaitSpinner from '../../components/WaitSpinner';
import { error } from '../../components/toastr';
import ProjectsView from './ProjectsView';
import UsersView from './UsersView';
import Tag from '@domino/ui/dist/components/Tag/Tag'
import { AdminPageTitle } from '../../data/data-sources/CommonStyles';
import ErrorPage from "@domino/ui/dist/components/ErrorPage";
import withStore, { StoreProps } from '../../globalStore/withStore';
import { getAppName } from '../../utils/whiteLabelUtil';

const tagColor = colors.grey70;
const StyledTable = styled((props: TableProps<any>) => <Table {...props}/>)`
  .ant-table-tbody td div {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ant-table-tbody td .ant-btn ~ div,.ant-table-tbody td .ant-btn ~ div div {
    overflow: visible;
  }
`;
const EmptyStateHeader = styled.div`
  font-size: 18px;
  font-weight: ${themeHelper('fontWeights.medium')};
  color: ${colors.mineShaft};
  margin: ${themeHelper('paddings.extraLarge')} 0 ${themeHelper('margins.medium')};
`;
const EmptyStateSubHeader = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.greyishBrown};
  text-align: center;
`;
const StyledError = styled.div`
  width: 15px;
  padding-top: 4px;
`;
const StyledName = styled.div`
  margin: 0;
`;

export enum VolumeType {
  Nfs = 'Nfs',
  Smb = 'Smb'
}

export const getVolumeType: (type: string) => string
  = (type: string) => type === 'Generic' ? type : R.toUpper(type);

const defaultPageSize = 50;
const getColumns = (
  editModalContainer: HTMLDivElement | null,
  refreshDataMounts: () => void,
  allProjects: Project[],
  allOrganizations: Organization[],
  hybridEnabled: boolean | undefined) => {

    const defaultColumns = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    render: (name: string, row: ExternalVolume) => (
      <FlexLayout justifyContent="flex-start">
        {row.status && <StyledError>
          {tooltipRenderer(row.status,
            <span><WarningFilled style={{ fontSize: '13px', color: colors.cabaret }} /></span>)}
        </StyledError>}
        <StyledName>
          <ExternalDataVolumeView externalVolume={row} allProjects={allProjects} allOrganizations={allOrganizations}/>
        </StyledName>
      </FlexLayout>
    )
  },
  {
    title: 'Type',
    key: 'volumeType',
    dataIndex: 'volumeType',
    render: (volumeType: string) => getVolumeType(volumeType)
  },
  {
    title: 'Description',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: 'Projects',
    key: 'projects',
    dataIndex: 'projects',
    render: (projectIds: string[]) =>
      <ProjectsView projectIds={projectIds} allProjects={allProjects}/>
  },
  {
    title: 'Volume Access',
    key: 'access',
    dataIndex: 'isPublic',
    render: (isPublic: boolean, row: ExternalVolume) =>
      isPublic ? 'Everyone' : <UsersView userIds={row.users} allOrganizations={allOrganizations}/>
  }];
  const actions = {
    key: 'actions',
    dataIndex: 'name',
    hideFilter: true,
    width: 50,
    sorter: false,
    render: (name: string, row: ExternalVolume) => {
      const menuItems = [{
        key: 'edit',
        content: (
          <EditExternalDataVolume
            externalVolume={row}
            editModalContainer={editModalContainer}
            onUpdate={refreshDataMounts}
            hybridEnabled={hybridEnabled}
          />
        )
      }, {
        key: 'unregister',
        content: (
          <UnregisterExternalDataVolume
            externalVolume={row}
            onUnregister={refreshDataMounts}
          />
        )
      }];
      return <ActionDropdown icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />} menuItems={menuItems} />;
    }
  }
    const dataPlaneColumn = {
      title: 'Data Plane',
      key: 'dataPlanes',
      dataIndex: 'dataPlanes',
      sorter: false,
      render: (dataPlanes: DominoDataplaneDataPlaneDto[]) =>
        dataPlanes.map(dataPlane => <Tag key={dataPlane.name} color={tagColor}>{dataPlane.name}</Tag>)
    }
  return hybridEnabled ? [...defaultColumns, dataPlaneColumn, actions] : [...defaultColumns, actions];
}

const fetchProjects: (allProjectIds: string[]) => Promise<Project []> =
  async allProjectIds =>
    Promise.all(R.map((projectId: string) => getProjectSummary({ projectId }), allProjectIds));

export interface ExternalDataVolumesState {
  externalVolumeData: ExternalVolume[];
  loading: boolean;
  projects: Project[];
  allOrganizations: Organization[];
  hasAccessError: boolean;
}

export type Props = {
  hybridEnabled?: boolean;
} & StoreProps;

class ExternalDataVolumes extends React.Component<Props, ExternalDataVolumesState> {
  state: ExternalDataVolumesState = {
    externalVolumeData: [],
    loading: true,
    projects: [],
    allOrganizations: [],
    hasAccessError: false
  };
  editModalContainer = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.getExternalDataVolumes();
    this.getAllOrganizations();
  }

  getAllOrganizations = async () => {
    try {
      const allOrganizations = await getAllOrganizations({});
      this.setState({allOrganizations});
    } catch (e) {
      console.warn(e);
    }
  }

  getExternalDataVolumes = async () => {
    try {
      this.setState({loading: true});
      const dataMounts = await getAllRegisteredDataMounts({});
      const projectIds = R.uniq(R.reduce((acc: string[], dataMount: ExternalVolume) =>
       acc.concat(dataMount.projects), [], dataMounts));
      this.getAllProjects(projectIds);
      const dataMountsWithStatus = await checkAndUpdateDataMountStatus({
        body: {
          datamountIds: R.pluck('id')(dataMounts)
        }
      });
      this.setState({externalVolumeData: dataMountsWithStatus});
    } catch (e) {
      const failureCode = e.status;
      if(failureCode == 403){
        this.setState({hasAccessError: true})
      }
      else{
        error('Failed to get registered volumes');
      }
      console.warn(e);
    } finally {
      this.setState({loading: false});
    }
  }

  getAllProjects = async (projectIds: any) => {
    try {
      const projects = await fetchProjects(projectIds);
      this.setState({projects: projects});
    } catch (e) {
      const failureCode = e.status;
      console.warn(e);
      if(failureCode != 403) {
        error('Failed to get Projects');
      }
    }
  }

  render() {
    const { externalVolumeData, projects, allOrganizations } = this.state;
    const appName = getAppName(this.props.whiteLabelSettings);
    if(this.state.hasAccessError){
      return <ErrorPage status = {403} />
    }
    return (
      <div>
        <FlexLayout justifyContent="space-between" alignItems="flex-start">
          <div>
            <AdminPageTitle>External Data Volumes</AdminPageTitle>
          </div>
          <RegisterExternalVolumeData onRegister={this.getExternalDataVolumes} hybridEnabled={this.props.hybridEnabled}/>
        </FlexLayout>
        {R.cond([
          [
            ({loading}) => loading,
            () => <WaitSpinner />
          ], [
            () => R.isEmpty(externalVolumeData),
            () => (
              <FlexLayout padding={'150px 0px'} flexDirection="column" alignContent="center">
                <EmptyExternalVolumeIcon/>
                <EmptyStateHeader>No External Volumes Found</EmptyStateHeader>
                <EmptyStateSubHeader>
                  {`Looks like you haven’t registered any external volumes with ${appName} yet. Get started by`}
                  <br/>
                  {`clicking on the ‘Register a Volume’ button.`}
                </EmptyStateSubHeader>
              </FlexLayout>
            )
          ], [
            R.T,
            () => (
              <StyledTable
                defaultPageSize={defaultPageSize}
                dataSource={externalVolumeData}
                columns={getColumns(
                  this.editModalContainer.current,
                  this.getExternalDataVolumes,
                  projects,
                  allOrganizations,
                  this.props.hybridEnabled
                )}
                rowKey={({id}) => id}
                hideRowSelection={true}
                highlightSortedColumn={true}
              />
            )
          ]
        ])(this.state)}
        <div ref={this.editModalContainer} id="edit-modal-mount" />
      </div>
    );
  }
}

export default withStore(ExternalDataVolumes);
