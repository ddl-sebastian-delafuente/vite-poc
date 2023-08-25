import * as React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { contains, equals, find, has, isEmpty, isNil, map, propEq } from 'ramda';
import styled, { withTheme } from 'styled-components';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoWorkspaceApiWorkspaceDto as Workspace,
  DominoWorkspaceApiRestartableWorkspaceChangeEvent as WorkspaceChangeEventResponse
} from '@domino/api/dist/types';
import {
  ownerProvisionedWorkspaces,
  startWorkspaceSession
} from '@domino/api/dist/Workspace';
import { Popover, PopoverProps } from '../../components';
import {
  clearPreviousDataStorage,
  getPreviouslySelectedValue,
  previousDataStorageKeys
} from '../../confirmRedirect/confirmRedirectToLogin';
import { RELOGIN_WS_START_FAIL } from '../../restartable-workspaces/Launcher';
import WorkspacesPopoverContent from '../components/WorkspacesPopoverContent';
import {
  warning as warningToast
} from '../../components/toastr';
import { openWorkspaceSession } from '../../utils/workspaceUtil';
import { leaveSocketChannel, subscribeTo } from '../../utils/socket';
import { getStyledIcon } from './styleUtil';

const WORKSPACES_PAGE_SIZE = 5;

const getWorkspaceUpdateChannel = (projectId: string, onWorkspaceUpdate: any) => ({
  room: projectId,
  eventName: 'RestartableWorkspaceChangeEvent',
  handler: onWorkspaceUpdate,
});

const StyledPopover = styled(({ className, ...rest }: PopoverProps & { className?: string }) => (
  <Popover overlayClassName={className} {...rest} />
))`
  & .ant-popover-inner-content {
    padding: 0;
  }
  & .ant-spin-container .ant-list-item:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  & .ant-spin-container .ant-list-item:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export interface SubNavWorkspaceLauncherProps {
  project: Project;
  username: string;
  userId?: string;
  enableExternalDataVolumes: boolean;
  globalSocket?: SocketIOClient.Socket;
  setGlobalSocket: (socket?: SocketIOClient.Socket) => void;
  onError?: (err: any) => void;
  theme?: any;
}

const SubNavWorkspaceLauncher: React.FC<SubNavWorkspaceLauncherProps> = (props) => {
  const {
    project,
    userId,
    enableExternalDataVolumes,
    globalSocket,
    setGlobalSocket,
    onError = err => console.error(err),
    theme,
  } = props;

  const [restartableWorkspaces, setRestartableWorkspaces] = React.useState<Array<Workspace>>();
  const [restartableWorkspacesCount, setRestartableWorkspacesCount] = React.useState<number>(0);
  const [workspaceForUpdate, setWorkspaceForUpdate] = React.useState<Workspace>();

  const workspaceUpdateChannel = getWorkspaceUpdateChannel(
    project.id,
    (data: WorkspaceChangeEventResponse) => !!data.workspace && setWorkspaceForUpdate(data.workspace)
  );

  const checkAndStartPreviousWorkspace = async () => {
   try {
      const previousUserId = getPreviouslySelectedValue(previousDataStorageKeys.credPropInitiator);
      if (equals(previousUserId, userId)) {
        const previousData = getPreviouslySelectedValue(previousDataStorageKeys.startRestartableWorkspaceFromNav);
        if (!isNil(previousData)) {
          const { projectOwnerName, projectName, payload } = JSON.parse(previousData);
          if (equals(payload.projectId, project.id)) {
            const result = await startWorkspaceSession(payload);

            clearPreviousDataStorage(previousDataStorageKeys.startRestartableWorkspaceFromNav);
            if (has('redirectPath', result)) {
              warningToast(RELOGIN_WS_START_FAIL, '', 0);
            } else {
              openWorkspaceSession(payload.workspaceId, projectOwnerName, projectName, result);
            }
          }
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchOwnerWorkspaces = async () => {
    try {
      const {workspaces, totalWorkspaceCount} = await ownerProvisionedWorkspaces({
        projectId: project.id,
        ownerId: userId!,
        offset: 0,
        limit: WORKSPACES_PAGE_SIZE
      });
      setRestartableWorkspaces(workspaces);
      setRestartableWorkspacesCount(totalWorkspaceCount);
    } catch (err) {
      onError(err);
    }
  };

  const onWorkspaceUpdate = () => {
    if (!!workspaceForUpdate && equals(workspaceForUpdate.ownerId, userId)) {
      const workspaceToUpdate = find(propEq('id', workspaceForUpdate.id), restartableWorkspaces || []);
      if (isNil(workspaceToUpdate) || (!!workspaceToUpdate && workspaceForUpdate.deleted)) {
        fetchOwnerWorkspaces();
      } else if (workspaceToUpdate) {
        const updatedWorkspaces = map((ws: Workspace) => {
          if (ws.id === workspaceForUpdate.id) {
            return workspaceForUpdate;
          } else {
            return ws;
          }
        })(restartableWorkspaces || []);
        setRestartableWorkspaces(updatedWorkspaces);
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(onWorkspaceUpdate, [workspaceForUpdate]);

  React.useEffect(() => {
    checkAndStartPreviousWorkspace();

    return () => {
      if (!!globalSocket && !!project) {
        leaveSocketChannel(globalSocket, workspaceUpdateChannel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (userId) {
      fetchOwnerWorkspaces();
      subscribeTo(
        workspaceUpdateChannel,
        setGlobalSocket,
        onError,
        globalSocket
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const canLaunchWorkspace = contains('Run', project.allowedOperations);
  const StyledRightOutlined = getStyledIcon(RightOutlined, !canLaunchWorkspace);

  return (
    <>
      {!isNil(restartableWorkspaces) && !isEmpty(restartableWorkspaces) && (
        <StyledPopover
          arrowPointAtCenter={true}
          content={
            <WorkspacesPopoverContent
              project={project}
              userName={props.username}
              enableExternalDataVolumes={enableExternalDataVolumes}
              restartableWorkspaces={restartableWorkspaces}
              viewMoreWorkspaces={restartableWorkspacesCount > WORKSPACES_PAGE_SIZE}
            />}
          placement="rightTop"
          trigger="click"
        >
          <StyledRightOutlined
            style={{
              color: theme.nav.secondary.background
            }}
            data-test="restartableWorkspacesListIcon"
          />
        </StyledPopover>
      )}
    </>
  );
};

export default withTheme(SubNavWorkspaceLauncher);
