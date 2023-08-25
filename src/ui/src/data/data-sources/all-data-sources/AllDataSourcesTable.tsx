import * as React from 'react';
import * as R from 'ramda';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
  DominoDatasourceApiDataSourceAdminInfoDto as AdminInfoDto,
  DominoDatasourceApiDataSourceDto as DataSourceDto,
  DominoDatasourceApiDataSourceOwnerInfoDto as OwnerInfoDto,
  DominoDatasourceApiDataSourcePermissionsDto as DataSourcePermissionsDto,
} from '@domino/api/dist/types';
import { getAllDataSources, getDataSourcesByUser, isAllowedToAccessDataSourceAdminPage } from '@domino/api/dist/Datasource';
import { getCurrentUser } from '@domino/api/dist/Users';
import Button from '../../../components/Button/Button';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import Link from '../../../components/Link/Link';
import { stageTimeRenderer } from '../../../components/renderers/tableColumns';
import Table, { ColumnConfiguration } from '../../../components/Table/Table';
import { WaitSpinner } from '../../../components/WaitSpinner';
import { error } from '../../../components/toastr';
import { getErrorMessage } from '../../../components/renderers/helpers';
import ErrorPage from '../../../components/ErrorPage';
import { projectBase, getProjectDataSourceDetailsPage } from '../../../core/routes';
import AdminShield from '../../../icons/AdminShield';
import { colors } from '../../../styled';
import { mixpanel } from '../../../mixpanel';
import * as mixpanelTypes from '../../../mixpanel/types';
import DataFetcher from '../../../utils/DataFetcher';
import { regexMatch } from '../../../utils/regex';
import { getDataSourceIcon, DataSourceType } from '../CommonData';
import {
  AdminShieldWrapper, HeaderLayout, NoMarginLink, ProjectTextDiv, SeparatorSpan, StyledIconWrapper,
  AdminPageTitle
} from '../CommonStyles';
import DataSourcesEmptyState from '../DataSourcesEmptyState';
import { NewDataSourceModal } from '../NewDataSourceModal';
import { dataSourceOwnerSorter, getDataSourcePermissions } from '../utils';
import { PlusOutlined } from '@ant-design/icons';

export type State = {
  dataSources: DataSourceDto[];
};

type DataGetterResult = DataSourceDto[];

const DataSourcesFetcher: new () => DataFetcher<any, State> = DataFetcher as any;

type ProjectLink = {
  projectId: string,
  projectName: string,
  projectOwner: string,
};

const MAX_PROJECT_COUNT = 3;

const getSortedProjects = (adminInfo: AdminInfoDto, projectIds: string[], maxCount: number) => {
  const projectNameSort = R.sortWith([R.ascend(R.prop('projectName'))]);
  return projectNameSort(R.reduce((acc: ProjectLink[], projectId: string) =>
    acc.concat({
      projectId,
      projectName: adminInfo.projectNames[projectId],
      projectOwner: adminInfo.projectIdOwnerUsernameMap[projectId],
    }), [], projectIds.slice(0, maxCount)));
};

const getCredentialTypeText = (credentialType: string) =>
  credentialType === 'Shared' ? 'Service Account' : credentialType;

const getColumns = (isAdminPage: boolean, currentUsername?: string) => {
  const columns: ColumnConfiguration<any>[] =
    [{
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      render: (name: string, row: DataSourceDto) => {
        const testId = `datasource-table-row-name-col-${name}`;
        return (
          <FlexLayout justifyContent="flex-start" alignItems="center" flexWrap="nowrap">
            <StyledIconWrapper>{getDataSourceIcon(row.dataSourceType as DataSourceType)}</StyledIconWrapper>
            {isAdminPage ?
              <Link
                href={`/data/dataSource/${currentUsername}/${row.id}`}
                openInNewTab={true}
                data-test={testId}
              >
                {name}
              </Link> :
              <span data-test={testId}>{name}</span>
            }
          </FlexLayout>
        );
      }
    }, {
      title: 'Data Store',
      key: 'displayName',
      dataIndex: 'displayName',
    }, {
      title: 'Data Source Owner',
      key: 'ownerName',
      dataIndex: 'ownerInfo',
      sorter: dataSourceOwnerSorter,
      // TODO might need to DRY this up couple difference places where owner is defined as a column
      render: ({ ownerName, isOwnerAdmin }: OwnerInfoDto) => (
        <FlexLayout justifyContent="flex-start" alignItems="center" flexWrap="nowrap">
          {isOwnerAdmin &&
            <AdminShieldWrapper>
              <AdminShield primaryColor={colors.goodGreenColor} width={14} height={14} />
            </AdminShieldWrapper>}
          <span>{ownerName}</span>
        </FlexLayout>
      ),
    }, {
      title: 'Last Accessed',
      key: 'lastAccessed',
      dataIndex: 'lastAccessed',
      sorter: (a, b) => {
        const aValues: number[] = Object.values(a.lastAccessed);
        const bValues: number[] = Object.values(b.lastAccessed);

        const aMax = aValues.length === 0 ? 0 : Math.max(...aValues);
        const bMax = bValues.length === 0 ? 0 : Math.max(...bValues);
        return aMax - bMax;
      },
      render: (lastAccessed: {}) => {
        const lastAccessedValues: number[] = Object.values(lastAccessed);
        const lastAccessedMax = lastAccessedValues.length === 0 ? 0 : Math.max(...lastAccessedValues);

        return lastAccessedMax === 0 ? '--' : stageTimeRenderer(lastAccessedMax)
      },
    }];

  if (isAdminPage) {
    columns.push(
      {
        title: 'Projects Using',
        key: 'projectIds',
        dataIndex: 'projectIds',
        sorter: false,
        render: (projectIds: string[], { id, adminInfo }: DataSourceDto) => {
          const uniqProjects = R.uniq(projectIds);
          return (
            <FlexLayout justifyContent="flex-start" alignItems="center">
              {R.intersperse(<SeparatorSpan>,</SeparatorSpan>, R.map((projectLink: ProjectLink) =>
                <NoMarginLink
                  href={projectBase(projectLink.projectOwner, projectLink.projectName)}
                  openInNewTab={true}
                  key={projectLink.projectId}
                >
                  {projectLink.projectName}
                </NoMarginLink>,
                getSortedProjects(adminInfo, uniqProjects, MAX_PROJECT_COUNT)) as ReadonlyArray<JSX.Element>)
              }
              {uniqProjects.length > MAX_PROJECT_COUNT &&
                <>
                  <ProjectTextDiv>and</ProjectTextDiv>
                  <NoMarginLink
                    href={`/data/dataSource/${currentUsername}/${id}?tab=dependent_projects`}
                    openInNewTab={true}
                    key={uniqProjects[MAX_PROJECT_COUNT]}
                  >
                    {uniqProjects.length - MAX_PROJECT_COUNT} more
                  </NoMarginLink>
                </>
              }
            </FlexLayout>
          );
        }
      });
  }

  columns.push(
    {
      title: 'Credential Type',
      key: 'credentialType',
      dataIndex: 'dataSourcePermissions',
      render: (dataSourcePermissions: DataSourcePermissionsDto) =>
        getCredentialTypeText(dataSourcePermissions.credentialType)
    });
  return columns;
};

const dataSourceRowKey = (row: DataSourceDto) => row.id;
type RouteProps = RouteComponentProps<{ ownerName: string; projectName: string }>;
type DataSourcesTableProps = {
  currentUserUsername?: string;
  ownerName?: string;
  projectName?: string;
  userId?: string;
  isAdminPage?: boolean;
} & RouteProps;

const DataSourcesTable: React.FC<DataSourcesTableProps> = (
  { currentUserUsername, ownerName, projectName, userId, isAdminPage = true, ...props }) => {
  const [showCreateDataSourceModal, setShowCreateDataSourceModal] = React.useState<boolean>(false);
  const [currentUsername, setCurrentUsername] = React.useState<string | undefined>(currentUserUsername);
  const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(userId);
  const [hasAdminAccess, setHasAdminAccess] = React.useState<boolean>(true);
  const [fetchingAccess, setFetchingAccess] = React.useState<boolean>(true);

  // Using a ref here instead of state because rerenders are happening
  // too quickly and useState is unable to update fast enough to prevent
  // duplicate fetch calls.
  const isDataSourcesFetchStarted = React.useRef<boolean>(false);

  const checkIfAdminAccess = React.useCallback(async () => {
    setFetchingAccess(true);
    try {
      const hasAdminAccess = await isAllowedToAccessDataSourceAdminPage({});
      setHasAdminAccess(hasAdminAccess);
    } catch (e) {
      error(e);
    }
    setFetchingAccess(false);
  }, [])

  const getUser = async () => {
    try {
      const user = await getCurrentUser({});
      setCurrentUsername(user.userName);
      setCurrentUserId(user.id);
    } catch (e) {
      error(await getErrorMessage(e, 'Failed to get current user.'));
    }
  };

  React.useEffect(() => {
    checkIfAdminAccess();
    if (!currentUsername || !currentUserId) {
      getUser();
    }
  }, [currentUsername, currentUserId, checkIfAdminAccess]);

  const onClickCreateDataSourceButton = React.useCallback(() => {
    setShowCreateDataSourceModal(true);
    mixpanel.track(() =>
      new mixpanelTypes.CreateNewDataSourceClick({
        location: mixpanelTypes.Locations.CreateNewDataSourceClick
      })
    );
  }, []);
  const fetchData = () => {
    isDataSourcesFetchStarted.current = true;
    return R.cond([
      [() => isAdminPage, () => getAllDataSources({})],
      [() => (!isAdminPage && !R.isNil(currentUserId)), () => !R.isNil(currentUserId) && getDataSourcesByUser({ userId: currentUserId })]
    ])();
  };

  const shouldFetchData = () => {
    return !isDataSourcesFetchStarted.current
  }

  const onCreateDataSource = () => {
    isDataSourcesFetchStarted.current = false;
    setShowCreateDataSourceModal(false);
  };

  const onCancelCreateDataSource = () => setShowCreateDataSourceModal(false);

  function dataGetter(dataSources: DataGetterResult): State {
    return {
      dataSources
    };
  }
  const onRowClick = (dataSource: DataSourceDto) => {

    mixpanel.track(() =>
      new mixpanelTypes.DataSourceClickEvent({
        dataSourceId: dataSource.id,
        location: mixpanelTypes.Locations.DataSourceClick
      })
    );
    if (projectName) {
      props.history.push(getProjectDataSourceDetailsPage(ownerName, projectName, dataSource.id));
      return;
    }

    if (!isAdminPage && currentUsername) {
      props.history.push(`/data/dataSource/${currentUsername}/${dataSource.id}`);
    }
  };

  const onFilter = (record: DataSourceDto, searchText: string) => {
    const { credentialType } = getDataSourcePermissions(record);
    return regexMatch(record.name, searchText) ||
      regexMatch(record.displayName || '', searchText) ||
      regexMatch(record.ownerInfo.ownerName, searchText) ||
      regexMatch(getCredentialTypeText(credentialType), searchText) ||
      isAdminPage &&
      R.any((name: string) => regexMatch(name, searchText), Object.values(record.adminInfo.projectNames));
  };

  return (
    <>
      <DataSourcesFetcher
        initialChildState={{
          dataSources: []
        }}
        fetchData={fetchData}
        dataGetter={dataGetter}
        shouldFetchData={shouldFetchData}
      >
        {({
          dataSources
        }: State, loading: boolean) => (
          <>
            {isAdminPage && hasAdminAccess && !fetchingAccess &&
              <HeaderLayout justifyContent="space-between">
                <AdminPageTitle>Data Sources</AdminPageTitle>
                {!R.isEmpty(dataSources) && <Button testId="create_data_source" onClick={onClickCreateDataSourceButton} icon={<PlusOutlined />}>
                  Create a Data Source
                </Button>}
              </HeaderLayout>}
            {
              R.cond([
                [() => isAdminPage && !hasAdminAccess, () => <ErrorPage status={403} />],
                [() => loading || fetchingAccess, () => <WaitSpinner forPage={true} dataTest="wait-spinner" />],
                [() => R.isEmpty(dataSources), () =>
                  <DataSourcesEmptyState
                    onCreate={onCreateDataSource}
                    userId={userId}
                    isAdminPage={isAdminPage}
                  />],
                [R.T, () => (
                  <Table
                    isRowClickable={true}
                    columns={getColumns(isAdminPage, currentUsername)}
                    dataSource={dataSources}
                    hideRowSelection={true}
                    rowKey={dataSourceRowKey}
                    data-test="DataSourcesTable"
                    extraUtilities={() => isAdminPage ? <div /> :
                      <Button testId="create_data_source" onClick={onClickCreateDataSourceButton} icon={<PlusOutlined />}>
                        Create a Data Source
                      </Button>
                    }
                    onRowClick={onRowClick}
                    onFilter={onFilter}
                  />
                )]
              ])()
            }
          </>
        )}
      </DataSourcesFetcher>
      <NewDataSourceModal
        isAdminPage={isAdminPage}
        navigateToDetailPageOnDatasourceCreation={true}
        onCancel={onCancelCreateDataSource}
        onCreate={onCreateDataSource}
        visible={showCreateDataSourceModal}
      />
    </>
  );
};

export default withRouter(DataSourcesTable);
