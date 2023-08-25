import * as React from 'react';
import styled from 'styled-components';
import { WarningFilled } from '@ant-design/icons';
import { DominoDatamountApiDataMountDto as ExternalVolume } from '@domino/api/dist/types';
import { unregisterDataMount } from '@domino/api/dist/Datamount';
import Button from '../../components/Button/Button';
import InvisibleButton from '../../components/InvisibleButton';
import { colors, themeHelper } from '../../styled';
import ModalWithButton from '../../components/ModalWithButton';
import { error as ToastError } from '../../components/toastr';

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

export interface Props {
  externalVolume: ExternalVolume;
  onUnregister: () => void;
}

class UnregisterExternalDataVolume extends React.Component<Props, {}> {

  unregisterExternalDataMount = () => {
    return unregisterDataMount({datamountId: this.props.externalVolume.id}).then(() => {
      this.props.onUnregister();
    }).catch((error) => {
      console.warn(error);
      ToastError('Failed to unregister external data volumes');
      return Promise.reject(error);
    });
  }

  render() {
    return (
      <ModalWithButton
        showFooter={false}
        ModalButton={StyledInvisibleButton}
        openButtonLabel="Unregister"
        modalProps={{
          bodyStyle: {padding: '30px 20px 40px'}
        }}
        handleFailableSubmit={this.unregisterExternalDataMount}
      >
        {(modalCtx: ModalWithButton) => (
          <Wrapper>
            <WarningFilled style={{ fontSize: '22px', color: colors.mauvelous }} />
            <Header>
              Are you sure you want to Unregister volume “{this.props.externalVolume.name}”?
            </Header>
            <Description>
              This volume is currently mounted on one or more projects.
              <br/>
              Unregistering this volume could impact the execution in those projects.
            </Description>
            <div>
              <InvisibleButton onClick={modalCtx.handleCancel}>Cancel</InvisibleButton>
              <DangerButtonWrapper>
                <Button isDanger={true} onClick={modalCtx.handleOk}>Unregister</Button>
              </DangerButtonWrapper>
            </div>
          </Wrapper>
        )}
      </ModalWithButton>
    );
  }
}

export default UnregisterExternalDataVolume;
