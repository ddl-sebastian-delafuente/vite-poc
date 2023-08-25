import * as React from 'react';
import styled from 'styled-components';
import { DeleteOutlined, WarningFilled } from '@ant-design/icons';
import { removeUsers } from '@domino/api/dist/Datasource';
import Button from '../../components/Button/Button';
import InvisibleButton from '../../components/InvisibleButton';
import ModalWithButton from '../../components/ModalWithButton';
import { themeHelper, colors, fontSizes } from '../../styled';
import { success, error } from '../../components/toastr';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';

const Wrapper = styled.div`
  text-align: center;
`;
const Header = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  margin-bottom: ${themeHelper('paddings.small')};
`;
const Description = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.boulder};
  margin-bottom: ${themeHelper('margins.medium')};
`;
const DangerButtonWrapper = styled.span`
  .ant-btn {
    background-color: ${colors.cabaret};
  }
  margin-left: ${themeHelper('margins.medium')};
`;

export interface RemoveUserFromDataSourceProps {
  dataSourceId: string;
  userId: string;
  userName: string;
  onRemoveUser: () => void;
}

const RemoveUserFromDataSource = (props: RemoveUserFromDataSourceProps) => {
  const { whiteLabelSettings } = useStore();
  const removeUser = async () => {
    try {
      await removeUsers({
        dataSourceId: props.dataSourceId,
        userIds: [props.userId]
      });
      success(`User '${props.userName}' was removed from this data source.`);
      props.onRemoveUser();
    } catch (e) {
      console.warn(e);
      error(`There was an error removing the user '${props.userName}' from the data source.
      Please try again later`);
    }
  };

  return (
    <ModalWithButton
      showFooter={false}
      ModalButton={InvisibleButton}
      openButtonLabel={<DeleteOutlined style={{fontSize: fontSizes.MEDIUM}}/>}
      openButtonProps={{
        'data-test': 'raise-remove-user-from-datasource-modal'
      }}
      modalProps={{
        bodyStyle: {padding: '30px 30px 40px'}
      }}
      handleFailableSubmit={removeUser}
    >
      {(modalCtx: ModalWithButton) => (
        <Wrapper>
          <WarningFilled style={{ fontSize: '22px', color: colors.mauvelous }} />
          <Header>
            Are you sure you want to remove '{props.userName}'?
          </Header>
          <Description>
            By removing their permission, this user will not be able to view or use this
            data source within {getAppName(whiteLabelSettings)}.
          </Description>
          <div>
            <InvisibleButton onClick={modalCtx.handleCancel} data-test="cancel-remove-user-from-datasource">Cancel</InvisibleButton>
            <DangerButtonWrapper>
              <Button isDanger={true} onClick={modalCtx.handleOk} testId="remove-user-from-ds-submit">
                Yes, Remove
              </Button>
            </DangerButtonWrapper>
          </div>
        </Wrapper>
      )}
    </ModalWithButton>
  );
};

export default RemoveUserFromDataSource;
