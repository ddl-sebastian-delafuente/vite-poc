import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import {
  DominoDatasourceApiDataSourceOwnerInfoDto as OwnerInfoDto
} from '@domino/api/dist/types';
import {
  addProject,
  getAuthenticationStatus,
  getDataSourcesByUser,
  isAllowedToGetProjectSpecificDataSourceData,
  updateDataSourceCredentials
} from '@domino/api/dist/Datasource';
import Button, { ExtendedButtonProps } from '../../../components/Button/Button';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import tooltipRenderer from '../../../components/renderers/TooltipRenderer';
import { getErrorMessage } from '../../../components/renderers/helpers';
import Table from '../../../components/Table/Table';
import Modal from '../../../components/Modal';
import { error, success } from '../../../components/toastr';
import AdminShield from '../../../icons/AdminShield';
import { mixpanel } from '../../../mixpanel';
import * as mixpanelTypes from '../../../mixpanel/types';
import { colors, themeHelper } from '../../../styled';
import { useWindowSize } from '../../../utils/CustomHooks';
import { NewDataSourceModal } from '../NewDataSourceModal';
import {
  AuthenticationType,
  CredentialType,
  DataSourceDto,
  DataSourceType,
  getDataSourceIcon,
  getDateInFormat
} from '../CommonData';
import { AdminShieldWrapper, StyledIconWrapper } from '../CommonStyles';
import {
  dataSourceOwnerSorter,
  getDataSourcePermissions,
  useAuthenticationState,
  useCanManageDataSourceProjectOnlyData,
  useDatasourceConfigs,
} from '../utils';
import DataSourceDetails from './DataSourceDetails';
import { PlusOutlined } from '@ant-design/icons';

const scrollConfig = { y: 510 };

const HEADER_FOOTER_COMBINED_HEIGHT = 150;
const BODY_MAX_HEIGHT = 800;
const PASSWORD_ONLY_AUTH = [
  AuthenticationType.AzureBasic,
  AuthenticationType.GCPBasic,
];

const USERNAME_ONLY_AUTH = [
  AuthenticationType.AWSIAMRoleWithUsername,
  AuthenticationType.UserOnly,
];

const Title = styled.div`
  color: ${colors.doveGreyDarker};
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.normal')};
`;
const SubTitle = styled.div`
  font-weight: ${themeHelper('fontWeights.normal')};
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.neutralGrey};
`;
const BodyLayout = styled(FlexLayout)`
  margin-bottom: ${themeHelper('paddings.large')};
  width: 100%;
`;
const DataSourceLayout = styled(FlexLayout)`
  width: 100%;
  margin: 0;
  min-height: 650px;
`;
const DataSourcesList = styled.div`
  width: 50%;
  margin: ${themeHelper('margins.medium')} 0;
  padding-right: ${themeHelper('margins.large')};
  &&& .table-actions-wrapper {
    width: 100%;
    margin-top: 2px;
    margin-left: -${themeHelper('margins.small')};
    div {
      margin-right: 0;
    }
  }
`;
const DataSourceDetailsLayout = styled.div`
  width: 50%;
  margin: ${themeHelper('margins.medium')} 0;
  .ant-card-bordered {
    border-radius: ${themeHelper('borderRadius.standard')};
  }
`;
const ModalFooter = styled(FlexLayout)`
  .ant-btn {
    font-size: ${themeHelper('fontSizes.small')};
  }
`;
const ButtonWithoutBorder = styled(Button)`
  &&& {
    border: none;
    font-size: ${themeHelper('fontSizes.small')};
    background: transparent;
    box-shadow: none;
  }
`;
const dataSourcesColumns = () => [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    width: 20,
    render: (name: string, row: DataSourceDto) => (
      <FlexLayout alignItems="center" justifyContent="flex-start" flexWrap="nowrap">
        <StyledIconWrapper>{getDataSourceIcon(row.dataSourceType as DataSourceType)}</StyledIconWrapper>
        <span>{name}</span>
      </FlexLayout>)
  },
  {
    title: 'Owner',
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
        {tooltipRenderer(
          ownerName,
          <span>{ownerName}</span>
        )}
      </FlexLayout>
    ),
    width: 10
  },

  {
    title: 'Last Updated',
    key: 'lastUpdated',
    dataIndex: 'lastUpdated',
    width: 15,
    render: (lastUpdated: number) => (
      <span>{getDateInFormat(lastUpdated)}</span>
    )
  }];

export type AddDataSourceButtonProps = {
  disabled?: boolean;
  navigateToDetailPageOnDatasourceCreation?: boolean;
  onAddDataSource: () => void;
  openButtonProps?: ExtendedButtonProps;
  projectId: string;
  userId: string;
  dataPlaneId?: string;
};

const AddDataSourceButton = ({
  ...props
}: AddDataSourceButtonProps) => {
  const { onAddDataSource, projectId, userId } = props;
  const [addableDataSources, setAddableDataSources] = useState<DataSourceDto[]>([]);
  const [authTypes, setAuthTypes] = useState<AuthenticationType[]>([]);
  const [authError, setAuthError] = useState<string | undefined>();
  const [isAddDataSourceButtonEnabled, setIsAddDataSourceButtonEnabled] = useState<boolean>(!props.disabled);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceDto | undefined>();
  const [showAddDataSourceModal, setShowAddDataSourceModal] = useState<boolean>(false);
  const [showCreateDataSourceModal, setShowCreateDataSourceModal] = useState<boolean>(false);
  const canManageDataSource = useCanManageDataSourceProjectOnlyData(projectId);

  const datasourceType = selectedDataSource?.dataSourceType as DataSourceType;
  const { getConfigByDataSourceType } = useDatasourceConfigs();

  const {
    authenticationType,
    authTypes: filteredAuthTypes,
    username,
    password,
    setUsername,
    setPassword,
    resetAuthenticationState,
  } = useAuthenticationState({
    authenticationType: selectedDataSource?.authType,
    authTypes,
    credentialType: selectedDataSource?.dataSourcePermissions.credentialType as CredentialType,
    datasourceType,
  });

  useEffect(() => {
    if (datasourceType) {
      const dataSourceConfig = getConfigByDataSourceType(datasourceType);
      setAuthTypes(dataSourceConfig?.authTypes || []);
    }
  }, [datasourceType, getConfigByDataSourceType, setAuthTypes]);

  const fetchAuthenticationStatus = async (dataSource: DataSourceDto) => {
    try {
      const authenicated = await getAuthenticationStatus({ dataSourceId: dataSource.id });
      setIsAuthenticated(authenicated);
    } catch (e) {
      console.warn('Failed to fetch authentication status', e);
      error('Failed to fetch Authentication Status');
    }
  }

  const fetchDataSourcesByUser = useCallback(async () => {
    try {
      const dataSourcesList = await getDataSourcesByUser({ userId, dataPlaneId: props.dataPlaneId });
      const filteredDataSources = R.filter((dataSource) => !R.contains(projectId, dataSource.projectIds), dataSourcesList);
      setAddableDataSources(filteredDataSources as DataSourceDto[]);
      if (filteredDataSources.length > 0) {
        setSelectedDataSource(filteredDataSources[0] as DataSourceDto);
      }
    } catch (e) {
      console.warn('Failed to fetch datasources', e);
    }
  }, [
    props.dataPlaneId,
    projectId,
    setAddableDataSources,
    setSelectedDataSource,
    userId,
  ]);

  async function addDataSourceToProject(dataSource: DataSourceDto) {
    try {
      await addProject({ dataSourceId: dataSource.id, projectId: props.projectId });
      success('Successfully added data source to the project.');
      mixpanel.track(() =>
        new mixpanelTypes.AddDataSourceToProjectSuccess({
          dataSourceId: dataSource.id,
          projectId,
          location: mixpanelTypes.Locations.AddDataSourceToProjectSuccess
        })
      )
      setShowAddDataSourceModal(false);
      onAddDataSource();
      resetAuthenticationState();
    } catch (e) {
      console.warn('Failed to add datasource to project', e);
      error('Failed to add data source to the project.');
      mixpanel.track(() =>
        new mixpanelTypes.AddDataSourceToProjectFailed({
          dataSourceId: dataSource.id,
          projectId,
          location: mixpanelTypes.Locations.AddDataSourceToProjectFailed
        })
      )
      setShowAddDataSourceModal(true);
    }
  }

  useEffect(() => {
    fetchDataSourcesByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showAddDataSourceModal) {
      fetchDataSourcesByUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddDataSourceModal]);

  useEffect(() => {
    selectedDataSource && fetchAuthenticationStatus(selectedDataSource);
  }, [selectedDataSource]);

  useEffect(() => {
    setAuthError(undefined);
  }, [username, password]);

  useEffect(() => {
    const getPermission = async () => {
      try {
        const isAllowed = await isAllowedToGetProjectSpecificDataSourceData({ projectId });
        setIsAddDataSourceButtonEnabled(isAllowed);
      } catch (err) {
        const errorBody = await err.body?.json();
        error(errorBody?.message);
        console.warn('Failed to fetch isAllowedToGetProjectSpecificDataSourceData', errorBody?.message);
      }
    };

    if (!props.disabled) {
      getPermission();
    }
  }, [projectId, props.disabled]);

  const addCredentials = async (dataSource: DataSourceDto) => {
    const { credentialType } = getDataSourcePermissions(dataSource);
    try {
      await updateDataSourceCredentials({
        dataSourceId: dataSource.id,
        body: {
          authType: dataSource.authType!,
          credentialType: credentialType,
          visibleCredential: username,
          secretCredential: password
        }
      });
      return Promise.resolve();
    } catch (e) {
      console.warn('Failed to add credentials to the data source', e);
      setAuthError(await getErrorMessage(e, 'Failed to add credentials to the data source'));
      setShowAddDataSourceModal(true);
      return Promise.reject();
    }
  };
  const hasAllCredentials = React.useMemo(() => {
    if (PASSWORD_ONLY_AUTH.indexOf(authenticationType as AuthenticationType) !== -1) {
      return Boolean(password);
    }

    if (USERNAME_ONLY_AUTH.indexOf(authenticationType as AuthenticationType) !== -1) {
      return Boolean(username);
    }

    return Boolean(username) && Boolean(password);

  }, [authenticationType, username, password]);

  const handleSubmit = async () => {
    mixpanel.track(() =>
      new mixpanelTypes.DataSourceAddToProject({
        dataSourceId: selectedDataSource ? selectedDataSource.id : '',
        projectId,
        location: mixpanelTypes.Locations.DataSourceAddToProject
      })
    )
    if (selectedDataSource) {
      if (hasAllCredentials) {
        addCredentials(selectedDataSource).then(async () => {
          await addDataSourceToProject(selectedDataSource);
        }).catch(e => console.warn('Failed to add credentials', e));
      } else if (isAuthenticated) {
        await addDataSourceToProject(selectedDataSource);
      }
    }
  };

  const hideDataSourceModal = () => {
    setShowAddDataSourceModal(false);
  };
  const setExternalDataSourceModal = () => {
    setShowCreateDataSourceModal(true);
    hideDataSourceModal();
  };

  const setDataSourceModal = () => {
    setShowAddDataSourceModal(false);
    resetAuthenticationState();
  };

  const onCreate = () => {
    fetchDataSourcesByUser();
    setShowCreateDataSourceModal(false);
    onAddDataSource();
  };

  const onShowAddDataSourceModal = () =>
    R.isEmpty(addableDataSources) ? setShowCreateDataSourceModal(true) : setShowAddDataSourceModal(true);

  const onCancelCreateDataSource = () => {
    setShowCreateDataSourceModal(false);
    if (!R.isEmpty(addableDataSources)) {
      setShowAddDataSourceModal(true);
    }
  };

  const onRowClick = (record: DataSourceDto) => {
    if (!R.equals(record.id, selectedDataSource?.id)) {
      setAuthError(undefined);
      setIsAuthenticated(false);
      resetAuthenticationState();
      setSelectedDataSource(record);
    }
  }

  const windowSize = useWindowSize();

  const bodyMaxHeight = windowSize.height < BODY_MAX_HEIGHT + HEADER_FOOTER_COMBINED_HEIGHT ?
    windowSize.height - HEADER_FOOTER_COMBINED_HEIGHT : BODY_MAX_HEIGHT;

  const isAddToProjectButtonDisabled = React.useMemo(() => {
    if (isAuthenticated) {
      return false;
    }

    if (PASSWORD_ONLY_AUTH.indexOf(selectedDataSource?.authType as AuthenticationType) !== -1) {
      return !password;
    }

    if (USERNAME_ONLY_AUTH.indexOf(selectedDataSource?.authType as AuthenticationType) !== -1) {
      return !username;
    }

    return !username || !password
  }, [isAuthenticated, password, selectedDataSource, username]);
  return (
    <>
      {showAddDataSourceModal &&
        <Modal
          bodyStyle={{ background: colors.white, padding: '0 24px', maxHeight: `${bodyMaxHeight}px`, overflowY: 'auto' }}
          centered={true}
          className="add-data-source-modal"
          footer={
            <ModalFooter justifyContent="flex-end">
              <ButtonWithoutBorder onClick={setDataSourceModal} btnType="secondary" testId="cancel-add-datasource-to-project">Cancel</ButtonWithoutBorder>
              <Button
                btnType="primary"
                onClick={handleSubmit}
                testId="add-datasource-to-project"
                disabled={isAddToProjectButtonDisabled}
              >
                Add to Project
              </Button>
            </ModalFooter>
          }
          onCancel={hideDataSourceModal}
          title={
            <FlexLayout justifyContent="space-between">
              <div>
                <Title>Add a Data Source</Title>
                <SubTitle>Add from existing Data Sources below or create new Data Source</SubTitle>
              </div>
              <Button testId="create-new-data-source-button" onClick={setExternalDataSourceModal}>Create New Data Source</Button>
            </FlexLayout>
          }
          visible={showAddDataSourceModal}
          width={1100}
        >
          {addableDataSources.length ? <div>
            <BodyLayout flexDirection="column" alignItems="flex-start">
              <DataSourceLayout flexDirection="row" alignItems="flex-start">
                <DataSourcesList>
                  <Table
                    columns={dataSourcesColumns()}
                    dataSource={addableDataSources}
                    defaultSelectedRowId={addableDataSources[0].id}
                    filterPlaceHolder="Search for an existing data source"
                    hideColumnFilter={true}
                    hideRowSelection={true}
                    isRowClickable={true}
                    onRowClick={(record) => onRowClick(record)}
                    rowKey="id"
                    scroll={scrollConfig}
                    showPagination={false}
                    showSearch={true}

                  />
                </DataSourcesList>
                <DataSourceDetailsLayout>
                  {selectedDataSource && <DataSourceDetails
                    authError={authError}
                    authenticationType={authenticationType}
                    authTypes={filteredAuthTypes}
                    isAuthenticated={isAuthenticated}
                    password={password}
                    selectedDataSource={selectedDataSource}
                    setPassword={setPassword}
                    setUsername={setUsername}
                    userId={userId}
                    username={username}
                  />}
                </DataSourceDetailsLayout>
              </DataSourceLayout>
            </BodyLayout>
          </div> : <h4>No Data</h4>}
        </Modal>}
      <NewDataSourceModal
        navigateToDetailPageOnDatasourceCreation={props.navigateToDetailPageOnDatasourceCreation}
        onCancel={onCancelCreateDataSource}
        onCreate={onCreate}
        projectId={props.projectId}
        visible={showCreateDataSourceModal}
      />
      {/* @ts-ignore */}
      <Button
        icon={<PlusOutlined />}
        onClick={onShowAddDataSourceModal}
        testId="add-datasource"
        disabled={!isAddDataSourceButtonEnabled || !canManageDataSource}
        {...props.openButtonProps}
      >
        Add a Data Source
      </Button>
    </>
  );
};

export default AddDataSourceButton;
