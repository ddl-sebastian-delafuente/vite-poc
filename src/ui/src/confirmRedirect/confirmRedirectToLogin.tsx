import * as React from 'react';
import { propOr, isNil } from 'ramda';
import styled from 'styled-components';
import { Checkbox, CheckboxChangeEvent } from '@domino/ui/dist/components';
import { getPrincipal } from '@domino/api/dist/Auth';
import { themeHelper } from '../styled/themeUtils';
import InfoBox, { StyledInfoCircleOutlined as InfoIcon } from '../components/Callout/InfoBox';
import Modal from '../components/Modal';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import { error as errorToast } from '../components/toastr';
import {
  LocalStorageItemKey,
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem
} from '../utils/localStorageService';
import { greyishBrown } from '../styled/colors';

const StyledInfoBox = styled(InfoBox)`
  margin: ${themeHelper('margins.medium')} 0;
`;

const InfoIconWrap = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${greyishBrown};
  font-size: ${themeHelper('fontSizes.large')};
`;

export const previousDataStorageKeys = {
  credPropInitiator: 'credPropInitiator',
  startJob: 'startJobForm',
  restartJobs: 'restartJobIds',
  rerunWorkspaces: 'rerunWorkspaces',
  launchWorkspace: 'workspaceLaunchForm',
  salvageRunVolume: 'salvageRunVolumeForm',
  startJobFromQuickStart: 'quickStartJobForm',
  launchWorkspaceFromQuickStart: 'quickstartWorksapceForm',
  runJobFromFiles: 'runJobFromFiles',
  launchNotebookFromFiles: 'launchNotebookFromFiles',
  launchRestartableWorkspace: 'launchRestartableWorkspace',
  launchRestartableWorkspaceFromEmptyState: 'launchRestartableWorkspaceFromEmptyState',
  startRestartableWorkspace: 'startRestartableWorkspace',
  startRestartableWorkspaceFromNav: 'startRestartableWorkspaceFromNav',
  startRestartableWorkspaceFromWorkspaceChrome: 'startRestartableWorkspaceFromWorkspaceChrome',
  reproduceFromWorkspaceCommit: 'reproduceFromWorkspaceCommit',
  reproduceFromModelVersionDetails: 'reproduceFromModelVersionDetails',
  reproduceVerboseFromModelVersionDetails: 'reproduceVerboseFromModelVersionDetails'
};

export interface ConfirmRedirectToLoginProps {
  redirectUri: string;
  storageKey: string;
  value: any;
}

export interface ConfirmRedirectToLoginState {
  visible: boolean;
  shouldAutoRedirect: boolean;
  isPreparingForLogout: boolean;
}

export class ConfirmRedirectToLogin extends React.Component<ConfirmRedirectToLoginProps, ConfirmRedirectToLoginState> {
  constructor (props: ConfirmRedirectToLoginProps) {
    super(props);
    this.state = {
      visible: false,
      shouldAutoRedirect: false,
      isPreparingForLogout: false
    };
  }

  componentDidMount () {
    const shouldAutoRedirect = !!getLocalStorageItem(LocalStorageItemKey.AutoRedirectForJobsWS);
    this.setState({
      visible: !shouldAutoRedirect,
      shouldAutoRedirect: shouldAutoRedirect,
      isPreparingForLogout: false
    });
    if (shouldAutoRedirect) {
      this.redirectToLogin();
    }
  }

  redirectToLogin = () => {
    this.setState({ isPreparingForLogout: true }, async () => {
      if (this.state.shouldAutoRedirect) {
        setLocalStorageItem(LocalStorageItemKey.AutoRedirectForJobsWS, 'true');
      } else {
        removeLocalStorageItem(LocalStorageItemKey.AutoRedirectForJobsWS);
      }

      try {
        const result = await getPrincipal({});
        setPreviousDataStorage(previousDataStorageKeys.credPropInitiator, result.canonicalId!);
        setPreviousDataStorage(this.props.storageKey, this.props.value);
        window.location.replace(this.props.redirectUri);
        this.setState({ isPreparingForLogout: false });
      } catch {
        this.setState({ isPreparingForLogout: false });
        errorToast('Error during relogin.');
      }
    });
  }

  onAutomaticRedirectClick = (ev: CheckboxChangeEvent) => {
    this.setState({ shouldAutoRedirect: ev.target.checked });
  }

  render () {
    return (
      <Modal
        closable={false}
        visible={this.state.visible}
        cancelText="Cancel"
        onCancel={() => this.setState({ visible: false })}
        okText="Proceed to login"
        onOk={this.redirectToLogin}
        destroyOnClose={true}
        data-test="acquireAuthorizationModal"
        okButtonProps={{disabled: this.state.isPreparingForLogout}}
        title={(
          <TitleContainer>
            <span>Refresh Temporary Credentials</span>
            {
              tooltipRenderer(
                'Learn more about propagated temporary credentials',
                <InfoIconWrap>
                  <InfoIcon height={16} width={16} />
                </InfoIconWrap>,
                'right'
              )
            }
          </TitleContainer>
        )}
      >
        <>
          <div>The temporary credentials for accessing resources in workspaces or runs associated with your account have expired. You need to login again to renew them.</div>
          <StyledInfoBox>
            Once a workspace or run has successfully started, temporary credentials will automatically refresh.
          </StyledInfoBox>
          <Checkbox
            onChange={this.onAutomaticRedirectClick}
          >Don't ask me again and initiate login automatically
          </Checkbox>
        </>
      </Modal>
    );
  }
}

export const showConfirmRedirectModalToLogin = (
  redirectUri: string,
  storageKey: string,
  value: any
) => {
  return (
    <ConfirmRedirectToLogin
      redirectUri={redirectUri}
      storageKey={storageKey}
      value={value}
    />
  );
};

export function doIfSessionStorage<V>(withSessionStorage: (storage: Storage) => V, defaultValue?: V): V | undefined {
  if (window.sessionStorage) {
    return withSessionStorage(window.sessionStorage);
  }
  return defaultValue;
}
export const getPreviouslySelectedValue: (storageKey: string, itemKey?: string, defaultValue?: string | undefined)
  => any = (storageKey, itemKey= undefined, defaultValue= undefined) => {
  try {
    return doIfSessionStorage(sessionStorage => {
      const previousValue = sessionStorage.getItem(storageKey);

      if (previousValue === 'undefined') {
        return undefined;
      }

      if (isNil(itemKey)) {
        return previousValue || undefined;
      }
      return propOr(defaultValue, itemKey, (previousValue && JSON.parse(previousValue)) || {});
    });
  } catch (err) {
    console.warn(err);
  }
};

export const setPreviousDataStorage = (storageKey: string, value: any) => {
  return doIfSessionStorage(sessionStorage => {
    return sessionStorage.setItem(storageKey, value);
  });
};

export const clearPreviousDataStorage = (storageKey: string) => {
  return doIfSessionStorage(sessionStorage => {
    return sessionStorage.removeItem(storageKey);
  });
};

export const checkPreviousDataStorageKeyExists = (storageKey: string): boolean => {
  return doIfSessionStorage(sessionStorage => {
    return !!sessionStorage.getItem(storageKey);
  }) || false;
};
