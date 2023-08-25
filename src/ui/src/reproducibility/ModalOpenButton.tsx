import * as React from 'react';
import * as R from 'ramda';
import { findProjectByOwnerAndName } from '@domino/api/dist/Gateway';
import { quotaStatus } from '@domino/api/dist/Workspace';
import { getWorkspaceQuotaMsg } from '@domino/ui/dist/utils/workspaceUtil';
import { error as errorToast } from '@domino/ui/dist/components/toastr';
import { getErrorMessage } from '@domino/ui/dist/components/renderers/helpers';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import Button, { ButtonProps } from '../components/Button/Button';
import useStore from '../globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';

interface ModalOpenButtonProps {
  ModalButton?: any;
  modalBtnProps: ButtonProps;
  modalBtnLabel: string;
  projectId: string;
  projectOwnerName: string;
  projectName: string;
  loggedInUserId: string;
  className?: string;
  disabled?: boolean;
  disabledReason?: string;
}

const ModalOpenButton: React.FC<ModalOpenButtonProps> = ({ModalButton, ...props}) => {
  const { whiteLabelSettings } = useStore();
  const [hasWsLaunchQuota, setHasWsLaunchQuota] = React.useState<boolean>(false);
  const [launchWorkspaceDisabledReason, setLaunchWorkspaceDisabledReason] = React.useState<string>();
  const [canLaunchWorkspace, setCanLaunchWorkspace] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const checkRunQuota = async (projectId: string) => {
    try {
      const { status, currentValue, limit } = await quotaStatus({ projectId, ownerId: props.loggedInUserId });
      const quotaStatusMsg = getWorkspaceQuotaMsg(status, currentValue, limit);
      if (R.isNil(quotaStatusMsg)) {
        setHasWsLaunchQuota(true);
        setLaunchWorkspaceDisabledReason(undefined);
      } else {
        setHasWsLaunchQuota(false);
        setLaunchWorkspaceDisabledReason(replaceWithWhiteLabelling(
          getAppName(whiteLabelSettings))(quotaStatusMsg));
      }
    } catch (err) {
      console.error(err);
      const failureCode = err.status;

      if (failureCode === 401 || failureCode === 403) {
        setLaunchWorkspaceDisabledReason('Your role is not authorized to perform this action');
      } else {
        setLaunchWorkspaceDisabledReason('Error fetching user quota for durable workspaces');
        errorToast(await getErrorMessage(err,
          'Something went wrong while fetching user quota for durable workspaces.'));
      }
      setCanLaunchWorkspace(false);
    }
  };

  const checkUserCanLaunchWorkspace = async () => {
    const { projectOwnerName, projectName } = props;
    try {
      const project = await findProjectByOwnerAndName({ ownerName: projectOwnerName, projectName });
      setCanLaunchWorkspace(project && R.contains('Run', project.allowedOperations));
    } catch (err) {
      console.error(err);
      const failureCode = err.status;

      if (failureCode === 401 || failureCode === 403) {
        setLaunchWorkspaceDisabledReason('Your role is not authorized to perform this action');
      } else {
        setLaunchWorkspaceDisabledReason('Error fetching project to launch workspace in');
        errorToast(await getErrorMessage(err,
          'Something went wrong while fetching the project by owner and name.'));
      }
      setCanLaunchWorkspace(false);
    }
  };

  React.useEffect(() => {
    Promise.all([checkRunQuota(props.projectId), checkUserCanLaunchWorkspace()]).finally(() => {
      setIsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OpenButton = !R.isNil(ModalButton) ? (
    <ModalButton
      {...props.modalBtnProps}
      disabled={!hasWsLaunchQuota || !canLaunchWorkspace || Boolean(props.disabled)}
      loading={isLoading}
      className={props.className}
    >
      {props.modalBtnLabel}
    </ModalButton>) : (
    <Button
      {...props.modalBtnProps}
      btnType="secondary"
      small={true}
      disabled={!hasWsLaunchQuota || !canLaunchWorkspace || Boolean(props.disabled)}
      className={props.className}
    >
      {props.modalBtnLabel}
    </Button>
  );

  const tooltipTitle = () => {
    return (!hasWsLaunchQuota || !canLaunchWorkspace || Boolean(props.disabled)) ?
      (props.disabledReason || launchWorkspaceDisabledReason) : undefined
  }

  return tooltipRenderer(
    tooltipTitle(),
    <span>{OpenButton}</span>
  );
};

export default ModalOpenButton;
