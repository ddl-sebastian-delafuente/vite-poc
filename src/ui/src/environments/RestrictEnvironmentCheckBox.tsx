import * as React from 'react';
import styled from 'styled-components';
import { Checkbox } from '@domino/ui/dist/components';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import { colors, fontSizes } from '@domino/ui/dist/styled';
import tooltipRender from '@domino/ui/dist/components/renderers/TooltipRenderer';
import InfoCircleOutlined from '@ant-design/icons/lib/icons/InfoCircleOutlined';
import withStore, { StoreProps } from '@domino/ui/dist/globalStore/withStore';
import { useEffect, useState } from 'react';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import { getEnvironmentPermissions, updateEnvironmentRevisionIsRestricted } from '@domino/api/dist/Environments';
import Button from '@domino/ui/dist/components/Button/Button';
import Modal from '../components/Modal';
import * as Toast from '@domino/ui/dist/components/toastr';
import HelpLink from '@domino/ui/dist/components/HelpLink';
import { SUPPORT_ARTICLE } from '@domino/ui/dist/core/supportUtil';

const RESTRICT_ENV_LABEL_TEXT = 'Restricted';
const DISABLED_RESTRICT_ENV_TOOLTIP = <>This revision cannot be classified as restricted, because it is not ready for use. Please check the logs for the environment, or contact your administrator to fix the environment.</>
const okModalButtonText = `Yes, designate as 'Restricted'`;

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox {
    margin-right: 5px;
  }
  span {
    font-weight: ${themeHelper('fontWeights.medium')};
    color: ${colors.lightBlackThree};
    line-height: 1;
  }
`;

const StyledSubmitButton = styled(Button)`
  .ant-btn {
    background-color: ${colors.orange500};
    border:none;
    margin:0px 4px;
    :hover,:focus {
      background-color: ${colors.orange500};
  }
`;

const ModalTitle = styled.span`
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.normal')};
`;

export interface RestrictEnvironmentCheckBoxProps extends StoreProps {
  isEditMode: boolean;
  isRestricted: boolean;
  environmentId: string;
  isRevisionBuilt: boolean;
  environmentRevisionId?: string;
  revisionNumber?: string;
}

const RestrictEnvironmentCheckBox: React.FC<RestrictEnvironmentCheckBoxProps> = (props) => {
  const { formattedPrincipal, isEditMode, isRestricted, environmentId, environmentRevisionId, isRevisionBuilt, revisionNumber } = props;

  const [canClassifyEnvironment, setCanClassifyEnvironment] = useState<boolean>(false);
  const [isRevisionRestricted, setIsRestricted] = useState<boolean>(isRestricted);
  const [visible, setVisible] = useState<boolean>(false);

  const getRestrictEnvTooltip = () => (
    <>
      Restricted environments are allowed to be used with restricted Projects.
      {
        !isRevisionRestricted && (
          <>
            <br /><br /><b>Please Note:</b> <p>Assigning 'Restricted' to this revision will remove the restricted
              designation for all other revisions of this environment</p>
            {
              revisionNumber &&
              <p>On clicking the checkbox revision #{revisionNumber} will be classified as restricted</p>}
          </>
        )
      }
    </>
  );

  const fetchProjectPermissions = async () => {
    const environmentsPermission = await getEnvironmentPermissions({});
    setCanClassifyEnvironment(Boolean(environmentsPermission?.canClassifyEnvironments));
  };

  const onCancelModal = () => {
    setVisible(false);
    setIsRestricted(false);
  };

  const handleCheckboxChange = () => {
    setVisible(true);
    setIsRestricted(true);
  }

  /**
   * Checkbox is only checked if the revision is already restricted
   * Don't show checkbox if in edit mode
   * call API to set restricteed
   */
  const onSubmitModal = () => {
    setVisible(false);
    if (environmentRevisionId) {
      const body = { isRestricted: true };
      updateEnvironmentRevisionIsRestricted({ body, environmentId, environmentRevisionId })
        .then(() => {
          Toast.success(`Environment set to 'Restricted' successfully`);
        })
        .catch(e => {
          Toast.error(`Couldn't restrict environment ${environmentId} with revision ${environmentRevisionId}`);
          console.error(`Couldn't restrict environment ${environmentId} with revision ${environmentRevisionId}`, e);
          setIsRestricted(false);
        });
    } else {
      Toast.error('Environment revision is not defined. Can\'t set revision to restricted');
      console.error('Environment revision is not defined. Can\'t set revision to restricted');
      setIsRestricted(false);
    }
  };

  useEffect(() => {
    fetchProjectPermissions();
  }, []);

  return isEditMode && !isRestricted ? null : (
    formattedPrincipal?.enableRestrictedAssets ?
      <>
        <FlexLayout style={{ marginBottom: '12px' }}>
          <StyledCheckbox
            id='RestrictEnvironmentCheckBox'
            name='RestrictEnvironmentCheckBox'
            checked={isRevisionRestricted}
            disabled={!canClassifyEnvironment || isRevisionRestricted || !isRevisionBuilt}
            onChange={!isEditMode ? handleCheckboxChange : undefined}
            data-test='restrict-env-checkbox'
          >
            {RESTRICT_ENV_LABEL_TEXT}
          </StyledCheckbox>
          {tooltipRender(isRevisionBuilt ? getRestrictEnvTooltip() : DISABLED_RESTRICT_ENV_TOOLTIP, <InfoCircleOutlined style={{ fontSize: fontSizes.LARGE }} />, 'right')}
        </FlexLayout >
        <Modal
          title={
            <ModalTitle>
              Secure environment ready?
            </ModalTitle>
          }
          visible={visible}
          onCancel={onCancelModal}
          footer={
            <React.Fragment>
              <Button
                key="cancel"
                btnType="secondary"
                onClick={onCancelModal}
                style={{ margin: "0px 4px" }}
              >
                Cancel
              </Button>
              <StyledSubmitButton
                key="yes"
                btnType="primary"
                onClick={onSubmitModal}
                data-test='submit-button'
              >
                {okModalButtonText}
              </StyledSubmitButton>
            </React.Fragment>
          }
          closable={true}
        >
          <div>
            <p>
              Our docs show how to properly configure a restricted environment to <br />
              <HelpLink text="prevent user modifications" articlePath={SUPPORT_ARTICLE.RESTRICT_ENVIRONMENT} showIcon={false} /> in a running workspace (or similar workload). <b>Is<br /> the environment ready? </b>
            </p>
            {!isRestricted && <p>Classifying a revision as restricted will make the previously restricted revision non-restricted.</p>}
          </div>
        </Modal>
      </>
      : null
  );
}

export default withStore(RestrictEnvironmentCheckBox);
