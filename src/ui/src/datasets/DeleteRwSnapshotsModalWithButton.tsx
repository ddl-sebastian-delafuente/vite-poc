import * as React from 'react';
import { isNil, length, map, slice } from 'ramda';
import moment from 'moment';
import styled from 'styled-components';
import { DominoDatasetrwApiDatasetRwSnapshotAdminSummaryDto as SnapshotSummary } from '@domino/api/dist/types';
import Button from '../components/Button/Button';
import InvisibleButton from '../components/InvisibleButton';
import { colors, themeHelper } from '../styled';
import ModalWithButton from '../components/ModalWithButton';
import { error as ToastError, success as SuccessToast } from '../components/toastr';
import FlexLayout from '../components/Layouts/FlexLayout';
import DataIcon from '../icons/DataIcon';
import WarningBox from '../components/WarningBox';
import Link from '../components/Link/Link';
import { deleteMarkedSnapshots, deleteSnapshot } from '@domino/api/dist/Datasetrw';
import DangerButton from '../components/DangerButton';
import { prettyBytes } from '../utils/prettyBytes';
import HelpLink from '../components/HelpLink';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import { datasetUploadViewPathDef } from '../core/routes';

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

const WarningSection = styled(WarningBox)`
  width: 612px;
  margin: 0 24px;
  background: ${colors.alabaster}
`;

const DatasetsContainer = styled.div`
  width: 612px;
  display: inline-flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 8px;
`;

const Divider = styled.hr`
  border-top: 1px solid ${colors.borderTableGrey};
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

export const formatDateWithDateAndTime: (createdAt: number) => string = createdAt => moment(createdAt).format('lll');

export interface Props {
  rwSnapshots: SnapshotSummary[];
  onUpdate: () => void;
  isDeleteAllMarkedSnapshotsButton?: boolean;
}

class DeleteRwSnapshotsModalWithButton extends React.Component<Props, {}> {

  deleteSnapshots = () => {
    const { rwSnapshots } = this.props;
    if (length(rwSnapshots) > 1) {
      return deleteMarkedSnapshots({}).then(() => {
        this.props.onUpdate();
        SuccessToast('Snapshots have been deleted.');
      }).catch((error) => {
        console.warn(error);
        ToastError('Failed to delete Marked Snapshots.');
        return Promise.reject(error);
      });
    } else {
      return deleteSnapshot({ snapshotId: this.props.rwSnapshots[0].snapshot.id }).then(() => {
        this.props.onUpdate();
        SuccessToast('Snapshot has been deleted.');
      }).catch(async (error) => {
        const errorBody = await error.body.json();
        console.warn(errorBody.message);
        ToastError(errorBody.message);
        return Promise.reject(errorBody.message);
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
          <span>Confirm Delete {this.props.rwSnapshots.length > 1 ? `Snapshots` : `Snapshot`}?</span>
        </ModalTitle>
      ),
      width: 660,
      className: 'delete-snapshot-modal',
      bodyStyle: {
        background: colors.alabaster,
        padding: '12px 0px'
      },
    };
    const { rwSnapshots, isDeleteAllMarkedSnapshotsButton } = this.props;
    return (
      <ModalWithButton
        showFooter={false}
        ModalButton={ isDeleteAllMarkedSnapshotsButton ? DangerButton : StyledInvisibleButton}
        openButtonLabel={ isDeleteAllMarkedSnapshotsButton ? "Delete all marked Snapshots" : "Delete Snapshot"}
        modalProps={defaultModalProps}
        handleFailableSubmit={this.deleteSnapshots}
      >
        {(modalCtx: ModalWithButton) => (
          <Wrapper>
            <WarningSection>
              Warning! Deleting these snapshots cannot be undone.
            </WarningSection>
            <Description>
              This will permanently delete the following snapshots. This action cannot be undone.
            </Description>
            {
              map((snapshot: SnapshotSummary) => {
                return (
                  <DatasetsContainer>
                    <Link
                      href={datasetUploadViewPathDef(snapshot.ownerUsername, snapshot.projectName, snapshot.snapshot.datasetId, snapshot.datasetName, snapshot.snapshot.id)}
                      openInNewTab={true}
                    >
                      {snapshot.ownerUsername + '/' + snapshot.datasetName + '/' + `Snapshot-${snapshot.snapshot.version}`}
                    </Link>
                    {!isNil(snapshot.snapshot.storageSize) &&
                      <div>{`${prettyBytes(snapshot.snapshot.storageSize) || '0 B'}, Last Used: ${formatDateWithDateAndTime(snapshot.snapshot.creationTime) || `--`}`}</div>
                    }
                  </DatasetsContainer>
                );
              }, slice(0, 4, rwSnapshots))
            }
            {
              length(rwSnapshots) > 4 &&
              <InfoContainer>
                <b>and {length(rwSnapshots) - 4} more </b>
                <HelpLink
                  dataTest="learn-more-link"
                  text="(Learn more about managing marked datasets and snapshots)"
                  articlePath={SUPPORT_ARTICLE.DATASETS_OVERVIEW}
                />
              </InfoContainer>
            }
            <Divider/>
            <Footer>
              <Button btnType="tertiary" onClick={modalCtx.handleCancel}>Cancel</Button>
              <DangerButtonWrapper>
                <Button isDanger={true} onClick={modalCtx.handleOk}>
                  {rwSnapshots.length > 1 ? `Delete all marked Snapshots` : `Delete this Snapshot`}
                </Button>
              </DangerButtonWrapper>
            </Footer>
          </Wrapper>
        )}
      </ModalWithButton>
    );
  }
}

export default DeleteRwSnapshotsModalWithButton;
