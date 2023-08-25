import * as React from 'react';
import * as R from 'ramda';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { notification } from 'antd';
import styled from 'styled-components';
import {
  DominoWorkspaceApiWorkspaceSessionDto as WorkspaceSession,
  DominoWorkspaceApiWorkspaceSessionStatusInfo as WorkspaceSessionStatusInfo
} from '@domino/api/dist/types';
import { error as errorToast, success as successToast } from '../components/toastr';
import { colors } from '../styled';
import { caseInsensitiveContains } from '../components/utils/util';
import {
  UNSUCCESSFUL_STATES,
  LOADING_STATES,
  SUCCESSFUL_STATES,
  RUNNING_STATES,
  COMPLETING_STATES,
} from '../components/enums/RunStatus';
import unblockableWindow from './unblockableWindow';
import { launchedWorkspace } from '../core/routes';
import { determineBrowser } from './common';

const StyledNotificationIcon = styled.span`
  position: relative;
  top: 12px;
  path {
    fill: ${colors.warningBoxIconFill};
  }
`;

export const toastPopupBlocked = () => {
  // Creates ant-d warning notification
  notification.warning({
    message: (
      <span>
        Please disable pop-up blocking to access workspaces.
      </span>
    ),
    description: null,
    style: {
      borderBottom: `1px solid ${colors.warningBoxBorderColor}`,
      borderTop: `1px solid ${colors.warningBoxBorderColor}`,
      borderLeft: `4px solid ${colors.warningBoxBorderColor}`,
      borderRight: `1px solid ${colors.warningBoxBorderColor}`,
      height: '90px'
    },
    placement: 'topRight',
    className: 'workspace-safari-notification',
    duration: 10,
    icon: (
      <StyledNotificationIcon>
        <ExclamationCircleFilled className="warning-box-icon" />
      </StyledNotificationIcon>
    ),
  });
};

export function getWorkspaceStatusColor(status: string) {
  const running = caseInsensitiveContains(status, RUNNING_STATES);
  const stopping = caseInsensitiveContains(status, COMPLETING_STATES);
  const loading = caseInsensitiveContains(status, LOADING_STATES);
  const stoppedFailed = caseInsensitiveContains(status, UNSUCCESSFUL_STATES);
  const stoppedSuccessful = caseInsensitiveContains(status, SUCCESSFUL_STATES);
  return R.cond([
    [() => running, () => colors.goodGreenColor],
    [() => stopping || stoppedSuccessful, () => colors.linkBlue],
    [() => loading, () => colors.malibu],
    [() => stoppedFailed, () => colors.cabaret],
    [R.T, () => colors.darkEggplantPurple],
  ])();
}

// We want to move away from logic based on a raw status string and instead use the new WorkspaceSessionStatusInfo
export function getWorkspaceSessionStatusColor(sessionInfo?: WorkspaceSessionStatusInfo) {
  if (!!sessionInfo) {
    return R.cond([
      [() => sessionInfo.isLoading, () => colors.malibu],
      [() => sessionInfo.isRunning, () => colors.goodGreenColor],
      [() => sessionInfo.isSuccessful || sessionInfo.isCompleting, () => colors.linkBlue],
      [() => sessionInfo.isFailed, () => colors.cabaret],
      [R.T, () => colors.darkEggplantPurple]
    ])();
  } else {
    return colors.darkEggplantPurple;
  }
}

export const openWorkspaceSession = (
  workspaceId: string,
  projectOwnerName: string,
  projectName: string,
  wsSession?: WorkspaceSession,
  openInCurrentWindow: boolean = false
) => {
  if (!R.isNil(wsSession)) {
    // Create a blank workspace window immediately to avoid popup-blocking
    const openWindow = openInCurrentWindow ? window.open(unblockableWindow.EMPTY_WINDOW_URL, '_self') :
      window.open(unblockableWindow.EMPTY_WINDOW_URL);

    const workspaceHref = launchedWorkspace(projectOwnerName, projectName, wsSession.executionId, workspaceId);
    if (workspaceHref) {
      unblockableWindow.new(workspaceHref, openWindow);
    }
    // Check if new tab popup was blocked before toasting success in Safari context
    const isSafari = determineBrowser() === 'Safari';
    if (isSafari && (!openWindow || openWindow.closed || typeof openWindow.closed === 'undefined')) {
      toastPopupBlocked();
    } else {
      openInCurrentWindow ? successToast('Workspace launched') : successToast('Workspace launched in new tab');
    }
  } else {
    errorToast('Workspace has no active session to open');
  }
};

export const getWorkspaceQuotaMsg = (
  status: string,
  currentValue?: number,
  limit?: number
) => {
  switch (status) {
    case 'QuotaNotExceeded':
      return null;
    case 'OverQuotaForMaxWorkspacesPerUserPerProject':
      return(`The number of workspaces (${currentValue}) has met the user\'s limit of ${limit} for
      this project. Delete user-owned workspaces in this project or alert a Domino administrator.`);
    case 'OverQuotaForMaxWorkspacesPerUser':
      return(`The number of workspaces (${currentValue}) has met the user\'s limit of ${limit} across
      all projects. Delete user-owned workspaces or alert a Domino administrator.`);
    case 'OverQuotaForMaxWorkspaces':
      return(`The number of workspaces (${currentValue}) has met the Domino-wide limit of ${limit}.
      Delete workspaces or alert a Domino administrator.`);
    case 'OverQuotaForMaxAllocatedVolumeSizeAcrossAllWorkspaces':
      return(`A new workspace would require ${currentValue}GiB total volume size. This is over the
      Domino-wide volume size limit of ${limit}GiB. Lower the requested volume size for a new workspace, delete
        workspaces, or contact your Domino administrator.`);
    default:
      return null;
  }
};
