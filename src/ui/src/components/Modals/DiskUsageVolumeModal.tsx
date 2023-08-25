import * as React from 'react';
import styled from 'styled-components';
import { WarningFilled } from '@ant-design/icons';
import { colors, themeHelper } from '../../styled';
import Modal from '../Modal';
import FlexLayout from '../Layouts/FlexLayout';
import WarningBox from '@domino/ui/dist/components/WarningBox'
import Link from '@domino/ui/dist/components/Link/Link';
import ModalFooter from '@domino/ui/dist/components/ModalFooter';
import { projectSettings } from '@domino/ui/dist/core/routes';

const ModalContent = styled.div`
  padding: 46px ${themeHelper('paddings.large')} 43px;
`;

const ModalBody = styled.span`
  margin-top: 19px;
  line-height: 22px;
`;

const StyledWarningBox = styled(WarningBox)`
  & {
    margin: 0;
  }
`;

export interface DiskUsageVolumeModalProps {
  isVisible: boolean;
  children?: JSX.Element | string | never[];
  okText?: string;
  cancelText?: string;
  modalTestId?: string;
  okTestId?: string;
  handleCancel: () => void;
  handleOk: () => void;
  modalProps: {
    ownerName: string;
    projectName: string;
  };
  executionType: string;
  highDiskUsageThresholdPercent: number;
}

const DiskUsageVolumeModal: React.FC<DiskUsageVolumeModalProps> = (
  {isVisible, handleCancel, children, handleOk, okText = 'OK', cancelText = 'Cancel',
    modalTestId = 'modal', okTestId = 'confirm-button', executionType,
    highDiskUsageThresholdPercent = 90,
    modalProps: { ownerName, projectName } }) => {
  return (
    <Modal
      closable={true}
      visible={isVisible}
      bodyStyle={{padding: 0, background: colors.white}}
      centered={true}
      testId={modalTestId}
      title={`${executionType} Volume Utilization Warning`}
      onCancel={handleCancel}
      footer={
        <ModalFooter
          testId={okTestId}
          modalSubmitButtonLabel={okText}
          modalCancelButtonLabel={cancelText}
          handleCancel={handleCancel}
          handleOk={handleOk}
          visible={true}
        />
      }
    >
      <ModalContent>
        <FlexLayout justifyContent="flex-start">
          <StyledWarningBox icon={<WarningFilled style={{ fontSize: '22px', color: colors.tulipTree }} />}>
            This {executionType} has met or exceeded {highDiskUsageThresholdPercent}% of its volume utilization, and you may encounter
            performance issues or {executionType} failures as a result.
          </StyledWarningBox>
          <ModalBody>
            Consider reducing overall project size by managing your code and artifacts, or you can adjust volume size
            under {(
              <Link href={projectSettings('execution')(ownerName, projectName)} dataTest="projectSettings_link">
                project settings
              </Link>)} for future {executionType}s.
          </ModalBody>
        </FlexLayout>
        {children}
      </ModalContent>
    </Modal>
  );
};

export default DiskUsageVolumeModal;
