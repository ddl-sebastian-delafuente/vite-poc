import * as React from 'react';
import * as R from 'ramda';
import { List, Tag, Tooltip } from 'antd';
import { ListItemProps } from 'antd/lib/list/Item';
import styled from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoWorkspaceApiWorkspaceDto as Workspace,
  DominoWorkspaceApiWorkspaceSessionDto as WorkspaceSession,
} from '@domino/api/dist/types';
import { startWorkspaceSession } from '@domino/api/dist/Workspace';
import { findDataMountsByProject } from '@domino/api/dist/Datamount';
import { DominoWorkspaceApiWorkspaceSessionStatusInfo as WorkspaceSessionStatusInfo } from '@domino/api/dist/types';
import { colors } from '../..';
import FlexLayout from '../../components/Layouts/FlexLayout';
import Link from '../../components/Link/Link';
import { themeHelper } from '../../styled';
import { getWorkspaceStatusColor, openWorkspaceSession } from '../../utils/workspaceUtil';
import {
  error as errorToast
} from '../../components/toastr';
import { getErrorMessage } from '../../components/renderers/helpers';
import {
  ConfirmRedirectToLogin,
  previousDataStorageKeys
} from '../../confirmRedirect/confirmRedirectToLogin';
import { workspaceDashboardBase } from '../../core/routes';

type WorkspaceListItemWrapperProps = ListItemProps & {
  isClickable: boolean;
  onClick: (e: React.MouseEvent) => void;
};

const WorkspaceListItemWrapper = styled(({ isClickable, ...props }) => (
  <List.Item {...props} />
)) <WorkspaceListItemWrapperProps>`
  && {
    width: 210px;
    display: block;
    padding: ${themeHelper('sizes.tiny')} ${themeHelper('sizes.tiny')} 4px;
    cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};
    color: ${({ isClickable }) => (isClickable ? colors.mineShaft : colors.brownishGrey)};
    &:hover {
      background-color: ${colors.zumthor};
    }
    .ant-list-item-content {
      display: block;
    }
  }
`;

const WorkspaceName = styled.div`
  line-height: ${themeHelper('sizes.medium')};
  font-family: ${themeHelper('fontFamily')};
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BranchAndStatusContainer = styled(FlexLayout)`
  margin-top: 6px;
`;

const hexOpacity = '4F';
const StyledTag = styled(Tag)`
  &.ant-tag {
    height: ${themeHelper('sizes.medium')};
    border: 0;
    padding: 1px 7px;
    display: inline;
    color: ${({ _color }: { _color: string }) => _color};
    background-color: ${({ _color }: { _color: string }) => _color + hexOpacity};
    line-height: ${themeHelper('sizes.small')};
    font-size: ${themeHelper('fontSizes.tiny')};
    font-weight: ${themeHelper('fontWeights.normal')};
    text-transform: none;
  }

  &.ant-tag:hover {
    cursor: default;
  }
`;

const SeeMoreLink = styled(Link)`
  margin: 4px 12px;
  font-size: ${themeHelper('fontSizes.tiny')};
`;

interface WorkspaceStatusRenderProps {
  sessionInfo?: WorkspaceSessionStatusInfo;
  isDeleted?: boolean;
}

const WorkspaceStatusRender: React.FunctionComponent<WorkspaceStatusRenderProps> = (props) => {
 const resolvedStatus = props.sessionInfo ? props.sessionInfo.rawExecutionDisplayStatus : '';
 return !!props.isDeleted ? (
    <StyledTag _color={colors.greyishBrown}>Deleted</StyledTag>
  ) : (
    <StyledTag _color={getWorkspaceStatusColor(resolvedStatus)}>{resolvedStatus}</StyledTag>
  );
};

interface WorkspaceListItemProps {
  workspace: Workspace;
  onWSOpen: (id: string, session?: WorkspaceSession) => void;
  onWSStart: (id: string) => void;
}

const WorkspaceListItem: React.FC<WorkspaceListItemProps> = ({ workspace, onWSOpen, onWSStart }) => {
  const isFailed = R.pathOr(true, ['mostRecentSession', 'sessionStatusInfo', 'isFailed'], workspace);

    const onWorkspaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFailed || workspace.deleted) {
      return;
    }
    if (R.pathOr(false, ['mostRecentSession', 'sessionStatusInfo', 'isRunning'], workspace)) {
      onWSOpen(workspace.id, workspace.mostRecentSession);
    } else if (R.pathOr(false, ['mostRecentSession', 'sessionStatusInfo', 'isCompleted'], workspace)
      && !workspace.deleted) {
      onWSStart(workspace.id);
    }
  };

  return (
    <WorkspaceListItemWrapper
      data-test={`WSLISTITEM-${workspace.id}`}
      onClick={onWorkspaceClick}
      isClickable={!isFailed}
    >
      <Tooltip title={workspace.name}>
        <WorkspaceName>{workspace.name}</WorkspaceName>
      </Tooltip>
      <BranchAndStatusContainer flexDirection="row" justifyContent="space-between">
        <WorkspaceStatusRender
          isDeleted={workspace.deleted}
          sessionInfo={R.path(['mostRecentSession', 'sessionStatusInfo'], workspace)}
        />
      </BranchAndStatusContainer>
    </WorkspaceListItemWrapper>
  );
};

export interface WorkspacesPopoverContentProps {
  project: Project;
  userName: string;
  enableExternalDataVolumes: boolean;
  restartableWorkspaces?: Array<Workspace>;
  viewMoreWorkspaces: boolean;
}

export const WorkspacesPopoverContent: React.FC<WorkspacesPopoverContentProps> = (props) => {
  const { project, enableExternalDataVolumes} = props;

  const [redirectPath, setRedirectPath] = React.useState<string>();
  const [reloginPayload, setReloginPayload] = React.useState<string>();

  const onWSOpen = (workspaceId: string, wsSession?: WorkspaceSession) => {
    openWorkspaceSession(workspaceId, project!.owner.userName, project!.name, wsSession);
  };

  const onWSStart = async (workspaceId: string) => {
    try {
      const externalVolumeMounts = R.pluck('id')(enableExternalDataVolumes
        ? await findDataMountsByProject({ projectId: project.id })
        : []);
      const payload = {
        projectId: project!.id,
        workspaceId: workspaceId,
        externalVolumeMounts,
      };
      setRedirectPath(undefined);
      const result = await startWorkspaceSession(payload);
      if (R.has('redirectPath', result)) {
        setRedirectPath((result as any).redirectPath);
        setReloginPayload(JSON.stringify({
          projectOwnerName: project!.owner.userName,
          projectName: project!.name,
          payload: payload
        }));
      } else {
        onWSOpen(workspaceId, result);
      }
    } catch (err) {
      console.error(err);
      errorToast(await getErrorMessage(err, 'Something went wrong while starting workspace session.'));
    }
  };

  return (
    <>
      <List
        dataSource={props.restartableWorkspaces || []}
        renderItem={(workspace: Workspace) => (
          <WorkspaceListItem
            workspace={workspace}
            onWSOpen={onWSOpen}
            onWSStart={onWSStart}
          />
        )}
      />
      {
        props.viewMoreWorkspaces &&
        <FlexLayout justifyContent="flex-end">
          <span>
            <SeeMoreLink
              href={workspaceDashboardBase(props.userName, props.project.name)}
              data-test="seeMoreWorkspaces"
            >
              See More
            </SeeMoreLink>
          </span>
        </FlexLayout>
      }
      {
        !!redirectPath &&
        <ConfirmRedirectToLogin
          redirectUri={redirectPath}
          storageKey={previousDataStorageKeys.startRestartableWorkspaceFromNav}
          value={reloginPayload}
        />
      }
    </>
  );
};

export default WorkspacesPopoverContent;
