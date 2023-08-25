import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { getDataSourcesByUser } from '@domino/api/dist/Datasource';
import FlexLayout from '../../components/Layouts/FlexLayout';
import EmptyDatabase from '../../icons/EmptyDatabase';
import { colors, themeHelper } from '../../styled';
import Button from '../../components/Button/Button';
import { WaitSpinner } from '../../components/WaitSpinner';
import AddDataSourceButton from './add-existing-data-source/AddDataSourceButton';
import { NewDataSourceModal } from './NewDataSourceModal';
import { useCanManageDataSourceProjectOnlyData } from './utils';

const NO_DATASOURCES_MESSAGE = 'You can connect to external data sources like Snowflake, Redshift, S3 etc.';

const WaitSpinnerContainer = styled.div`
  height: 300px;
`;
const EmptyDataIconContainer = styled(FlexLayout)`
  border: 1px solid ${colors.btnGrey};
  border-radius: ${themeHelper('borderRadius.standard')};
  height: 600px;
  background: ${colors.white};
`;
const EmptyMessage = styled.div`
  margin-top: ${themeHelper('paddings.small')};
`;
const ButtonWrapper = styled.div`
  margin-top: ${themeHelper('margins.large')};
  .ant-btn {
    font-weight: ${themeHelper('fontWeights.normal')};
    font-size: ${themeHelper('fontSizes.small')}
  }
`;

export interface DataSourcesEmptyStateProps {
  projectId?: string;
  onCreate: () => void;
  userId?: string;
  isAdminPage?: boolean;
}

const DataSourcesEmptyState: React.FC<DataSourcesEmptyStateProps> = ({
  isAdminPage = false,
  projectId,
  onCreate,
  userId,
}) => {
  const [showCreateDataSourceModal, setShowCreateDataSourceModal] = useState<boolean>(false);
  const [showAddDataSourceButton, setShowAddDataSourceButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDataSources = async ()  => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        const dataSourcesList = await getDataSourcesByUser({userId: userId || ''});
        if (projectId && !R.isEmpty(dataSourcesList)) {
          setShowAddDataSourceButton(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDataSources();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const canManageDataSource = useCanManageDataSourceProjectOnlyData(projectId);
  const onCreateDataSource = useCallback(() => {
    setShowAddDataSourceButton(true);
    setShowCreateDataSourceModal(false);
    if (onCreate) {
      onCreate();
    }
  }, [onCreate, setShowAddDataSourceButton, setShowCreateDataSourceModal]);

  const onCancelCreateDataSource =  useCallback(() => {
    setShowCreateDataSourceModal(false)
  }, [setShowCreateDataSourceModal]);

  return loading ? (
    <WaitSpinnerContainer>
      <WaitSpinner forPage={true} dataTest="wait-spinner"/>
    </WaitSpinnerContainer>
  ) : (
    <EmptyDataIconContainer flexDirection="column" alignItems="center" alignContent="center">
      <div><EmptyDatabase height={132} width={210} /></div>
      <EmptyMessage>{NO_DATASOURCES_MESSAGE}</EmptyMessage>
      <ButtonWrapper>
        {
          !showAddDataSourceButton ?
          <Button disabled={projectId ? !canManageDataSource : false} testId="connect_external_datasource" onClick={() => setShowCreateDataSourceModal(true)}>Connect to External Data</Button> :
          projectId && userId && <AddDataSourceButton projectId={projectId} onAddDataSource={onCreate} userId={userId} navigateToDetailPageOnDatasourceCreation={true}/>
        }
        <NewDataSourceModal
          isAdminPage={isAdminPage}
          visible={showCreateDataSourceModal}
          navigateToDetailPageOnDatasourceCreation={true}
          onCancel={onCancelCreateDataSource}
          onCreate={onCreateDataSource}
          projectId={projectId}
        />
      </ButtonWrapper>
    </EmptyDataIconContainer>
  );
};

export default DataSourcesEmptyState;
