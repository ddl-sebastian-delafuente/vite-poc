import * as React from 'react';
import styled from 'styled-components';
import { WarningFilled } from '@ant-design/icons';
import { DominoDatasetrwApiDatasetRwSummaryDto as DatasetSummary } from '@domino/api/dist/types';
import { updateDatasetStatus } from '@domino/api/dist/Datasetrw';
import Button from '../components/Button/Button';
import InvisibleButton from '../components/InvisibleButton';
import { colors, themeHelper } from '../styled';
import ModalWithButton from '../components/ModalWithButton';
import { error as ToastError, success } from '../components/toastr';

const Wrapper = styled.div`
  text-align: center;
`;

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0;
    width: 100%;
  }
`;

const Header = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  margin-bottom: ${themeHelper('paddings.small')};
`;

const DangerButtonWrapper = styled.span`
  .ant-btn {
    background-color: ${colors.tulipTree};
    border: none;

    :hover {
      background-color: ${colors.tulipTree};
    }
  }
  margin-left: ${themeHelper('margins.medium')};
`;

export interface Props {
  rwDataset: DatasetSummary;
  onUpdate: () => void;
}

class MarkDatasetAsActiveModal extends React.Component<Props, {}> {

  markAsActive = () => {
    return updateDatasetStatus({
      datasetId: this.props.rwDataset.id,
      body: {
        status: 'Active'
      }
    }).then(() => {
      this.props.onUpdate();
      success('Marked As Active');
    }).catch((error) => {
      console.warn(error);
      ToastError('Failed to Mark Dataset as Active.');
      return Promise.reject(error);
    });
  }

  render() {
    return (
      <ModalWithButton
        showFooter={false}
        ModalButton={StyledInvisibleButton}
        openButtonLabel="Mark as Active"
        modalProps={{
          bodyStyle: {padding: '30px 20px 40px'}
        }}
        handleFailableSubmit={this.markAsActive}
      >
        {(modalCtx: ModalWithButton) => (
          <Wrapper>
            <WarningFilled style={{ fontSize: '22px', color: colors.tulipTree }} />
            <Header>
              Are you sure you want to mark this dataset as 'Active'?
            </Header>
            <div>
              <InvisibleButton onClick={modalCtx.handleCancel}>No</InvisibleButton>
              <DangerButtonWrapper>
                <Button onClick={modalCtx.handleOk}>Yes, Mark</Button>
              </DangerButtonWrapper>
            </div>
          </Wrapper>
        )}
      </ModalWithButton>
    );
  }
}

export default MarkDatasetAsActiveModal;
