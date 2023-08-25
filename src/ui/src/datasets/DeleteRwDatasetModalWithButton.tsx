import * as React from 'react';
import { isNil, length, map, slice } from 'ramda';
import styled from 'styled-components';
import { DominoDatasetrwApiDatasetRwSummaryDto as DatasetSummary } from '@domino/api/dist/types';
import Button from '../components/Button/Button';
import InvisibleButton from '../components/InvisibleButton';
import { colors, themeHelper } from '../styled';
import ModalWithButton from '../components/ModalWithButton';
import { error as ToastError, success as SuccessToast } from '../components/toastr';
import FlexLayout from '../components/Layouts/FlexLayout';
import DataIcon from '../icons/DataIcon';
import WarningBox from '../components/WarningBox';
import Link from '../components/Link/Link';
import { deleteDataset, deleteMarkedDatasets } from '@domino/api/dist/Datasetrw';
import DangerButton from '../components/DangerButton';
import { prettyBytes } from '../utils/prettyBytes';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import HelpLink from '../components/HelpLink';
import { datasetUploadViewPathDef } from '../core/routes';
import DeleteSingleDatasetContent from './DeleteSingleDatasetContent';

const Wrapper = styled.div`
  text-align: center;
`;

const Description = styled.div`
  display: inline-flex;
  text-align: left;
  justify-content: flex-start;
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.boulder};
  width: 612px;
  margin: 20px 0;
`;

const DangerButtonWrapper = styled.span`
  .ant-btn {
    background-color: ${colors.cabaret};
  }
  margin-left: ${themeHelper('margins.medium')};
`;

const WarningSection = styled(WarningBox)`
  width: 612px;
  margin: 0 24px;
  background: ${colors.alabaster}
`;

const ModalTitle = styled(FlexLayout)`
  font-size: ${themeHelper('fontSizes.large')};

  span {
    color: ${colors.doveGray};
  }
`;

const TitleIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: ${themeHelper('icon.borderRadius')};
  padding: 8px;
`;

const DatasetsContainer = styled.div`
  width: 612px;
  display: inline-flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 8px;
`;

const Divider = styled.hr`
  border-top: 1px solid #e8e8e8;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 26px;
  margin-bottom: 8px;
`;

const InfoContainer = styled.div`
  width: 612px;
  text-align: left;
  display: inline-block;
`;

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0;
    width: 100%;
  }
`;

export interface Props {
  rwDatasets: DatasetSummary[];
  onUpdate: () => void;
  isDeleteAllMarkedDatasetsButton?: boolean;
}

class DeleteRwDatasetModalWithButton extends React.Component<Props, {}> {

  deleteDatasets = () => {
    const { rwDatasets } = this.props;
    if (length(rwDatasets) > 1) {
      return deleteMarkedDatasets({}).then(() => {
        this.props.onUpdate();
        SuccessToast('Datasets have been deleted.');
      }).catch((error) => {
        console.warn(error);
        ToastError('Failed to delete marked datasets.');
        return Promise.reject(error);
      });
    } else {
      return deleteDataset({ datasetId: this.props.rwDatasets[0].id }).then(() => {
        this.props.onUpdate();
        SuccessToast('Dataset has been deleted.');
      }).catch((error) => {
        console.warn(error);
        ToastError('Failed to delete dataset.');
        return Promise.reject(error);
      });
    }
  }

  render() {
    const defaultModalProps = {
      title: (
        <ModalTitle justifyContent={'flex-start'}>
          <TitleIconWrapper>
            <DataIcon height={21} width={18} />
          </TitleIconWrapper>
          <span>Confirm Delete {this.props.rwDatasets.length > 1 ? `Datasets` : `Dataset`}?</span>
        </ModalTitle>
      ),
      width: 660,
      className: 'delete-dataset-modal',
      bodyStyle: {
        background: colors.alabaster,
        padding: '12px 0px'
      },
    };
    const { rwDatasets, isDeleteAllMarkedDatasetsButton } = this.props;
    const dataset = rwDatasets[0];
    return (
      <ModalWithButton
        showFooter={false}
        ModalButton={ isDeleteAllMarkedDatasetsButton ? DangerButton : StyledInvisibleButton}
        openButtonLabel={ isDeleteAllMarkedDatasetsButton ? "Delete all marked Datasets" : "Delete Dataset"}
        modalProps={defaultModalProps}
        handleFailableSubmit={this.deleteDatasets}
      >
        {(modalCtx: ModalWithButton) => <>
            {
              rwDatasets.length > 1 ?
              (<Wrapper>
                <WarningSection>
                  Warning! Deleting these datasets and their snapshots cannot be undone.
                </WarningSection>
                <Description>
                  This will permanently delete the following datasets along with the contents and snapshots. This action cannot be undone.
                </Description>
                {
                  map((dataset: DatasetSummary) => {
                    return (
                      <DatasetsContainer>
                        <Link
                          href={datasetUploadViewPathDef(dataset.ownerUsername, dataset.projects.sourceProjectName, dataset.id, dataset.name)}
                          openInNewTab={true}
                        >
                          {dataset.ownerUsername + '/' + dataset.name}
                        </Link>
                        {!isNil(dataset.sizeInBytes) &&
                        // TODO: LastUsedTime is not returned from the API
                          <div>{`${prettyBytes(dataset.sizeInBytes) || '0 B'}`}</div>
                        }
                      </DatasetsContainer>
                    );
                  }, slice(0, 4, rwDatasets))
                }
                {
                  length(rwDatasets) > 4 &&
                  <InfoContainer>
                    <b>and {length(rwDatasets) - 4} more </b>
                    <HelpLink
                      dataTest="learn-more-link"
                      text="(Learn more about managing marked datasets and snapshots)"
                      articlePath={SUPPORT_ARTICLE.DATASETS_OVERVIEW}
                    />
                  </InfoContainer>
                }
              </Wrapper>) :
              <DeleteSingleDatasetContent dataset={dataset}/>
            }
            <Divider/>
            <Footer>
              <Button btnType="tertiary" onClick={modalCtx.handleCancel}>Cancel</Button>
              <DangerButtonWrapper>
                <Button isDanger={true} onClick={modalCtx.handleOk}>
                  {rwDatasets.length > 1 ? `Delete all marked Datasets` : `Delete this Dataset`}
                </Button>
              </DangerButtonWrapper>
            </Footer>
          </>}
      </ModalWithButton>
    );
  }
}

export default DeleteRwDatasetModalWithButton;
