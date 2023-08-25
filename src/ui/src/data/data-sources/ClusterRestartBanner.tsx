import {
  getDataSourcesByEngineType,
  restartStarburst,
  shouldRestartStarburst,
} from '@domino/api/dist/Datasource';
import * as React from 'react';
import styled from 'styled-components';
import Modal from '../../components/Modal';
import {
  boulder,
  linkBlue,
  mineShaftColor,
  tulipTree,
} from '../../styled/colors';
import { useRemoteData } from '../../utils/useRemoteData';
import { StyledWarningBox } from '../commonStyles';
import { EngineType } from './CommonData';

interface ClusterRestartConfirmationModalProps {
  impactedDataSources?: string[],
  onClose: () => void;
  onRestartSuccess: () => void;
  visible: boolean;
}

const StyledModal = styled(Modal)`
  .button[type="primary"] button {
    background: ${tulipTree};
    border-color: ${tulipTree};
  }
`

const ClusterRestartLink = styled.span`
  color: ${linkBlue};
  cursor: pointer;
  text-decoration: underline;
`;

const ClusterRestartMessage = styled.div`
  color: ${boulder};
`;

const ImpactedDataSourceList = styled.div`
  color: ${mineShaftColor};
  margin-top: 30px;
`;

const ClusterRestartConfirmationModal = ({
  impactedDataSources = [],
  onClose,
  onRestartSuccess,
  visible
}: ClusterRestartConfirmationModalProps) => {
  const handleClusterRestart = React.useCallback(async () => {
    try {
      await restartStarburst({});
      onRestartSuccess();
    } catch(e) {
      console.warn(e);
    }

    onClose();
  }, [onClose, onRestartSuccess]);

  const impactedDataSourcesList = React.useMemo(() => {
    if (impactedDataSources.length > 3) {
      const shortendList = impactedDataSources.slice(0, 3);
      return `${shortendList.join(', ')} etc.`
    }

    return impactedDataSources.join(', ');
  }, [impactedDataSources])

  return (
    <StyledModal
      closable={true}
      okText="Restart Cluster"
      onCancel={onClose}
      onOk={handleClusterRestart}
      titleIconName="DataIcon"
      titleText="Confirm Cluster Restart?"
      visible={visible}
    >
      <div>
        <ClusterRestartMessage>While the cluster is restarting, any users currently executing queries on any of the following data sources will temporarily fail until the restart is complete.</ClusterRestartMessage>
        {impactedDataSources.length > 0 && (
          <ImpactedDataSourceList>{impactedDataSourcesList}</ImpactedDataSourceList>
        )}
      </div>
    </StyledModal>
  )
}

export const ClusterRestartBanner = () => {
  const [showConfirmationModal, setShowConfirmationModal] = React.useState<boolean>(false);
  const [showBanner, setShowBanner] = React.useState<boolean>(false);
  const { data: restartRequired } = useRemoteData<boolean>({
    canFetch: true,
    fetcher: async () => await shouldRestartStarburst({}),
    initialValue: false,
  });

  const { data: datasources } = useRemoteData({
    canFetch: true,
    fetcher: async () => {
      const res = await getDataSourcesByEngineType({ engineType: EngineType.Starburst });
      if (Array.isArray(res)) {
        return res;
      }

      return [res];
    },
    initialValue: [],
  });

  const handleCloseConfirmationModal = React.useCallback(() => {
    setShowConfirmationModal(false);
  }, [setShowConfirmationModal]);

  const handleShowConfirmationMoadal = React.useCallback(() => {
    setShowConfirmationModal(true);
  }, [setShowConfirmationModal]);

  const handleRestartSuccess = React.useCallback(() => setShowBanner(false), [setShowBanner]);

  const impactedDataSources = React.useMemo(() => {
    return datasources
      .map((datasource) => datasource.name || null)
      .filter(Boolean) as string[];
  }, [datasources]);
  
  React.useEffect(() => {
    if (restartRequired) {
      setShowBanner(true);
    }
  }, [restartRequired, setShowBanner]);

  if (!showBanner) {
    return null;
  }

  return (
    <>
      <StyledWarningBox>There are one or more data sources that need a cluster restart to be available to use. <ClusterRestartLink onClick={handleShowConfirmationMoadal} role="link">Click here to trigger a restart</ClusterRestartLink></StyledWarningBox>
      <ClusterRestartConfirmationModal
        impactedDataSources={impactedDataSources}
        onClose={handleCloseConfirmationModal}
        onRestartSuccess={handleRestartSuccess}
        visible={showConfirmationModal}
      />
    </>
  )
}
