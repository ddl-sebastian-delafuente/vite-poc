import * as React from 'react';
import { useEffect, useState } from 'react';
import { isEmpty, head, map, filter } from 'ramda';
import { CaretDownOutlined } from '@ant-design/icons';
import { getModelReproductionDetails } from '@domino/api/dist/ModelManager';
import {
  DominoModelmanagerApiModelVersionReproduceInWorkspaceDetails as ReproduceInWorkspaceDetails
} from '@domino/api/dist/types';
import { ButtonProps } from '@domino/ui/dist/components/Button/Button';
import SuccessButton from '../components/SuccessButton';
import { SeparatedToolbar } from '../components/Toolbar';
import ArchiveModelButton from './ArchiveModelButton';
import ReproduceInWorkspaceButton from '../reproducibility/ReproduceInWorkspaceButton';
import { ActionDropdown } from '../components';
import SecondaryButton from '../components/SecondaryButton';
import Button from '../components/Button/Button';
import { StyledInvisibleButton } from './atoms';

interface ToolBarReproduceInWorkspaceButtonProps {
  reproduceInWorkspaceButtonsProps: Array<ReproduceInWorkspaceDetails>;
  isLoading: boolean;
}

export const ToolBarReproduceInWorkspaceButton: React.FC<ToolBarReproduceInWorkspaceButtonProps> = (props) => {
  const { reproduceInWorkspaceButtonsProps, isLoading } = props;
  if (isEmpty(reproduceInWorkspaceButtonsProps)) {
    return (
      <Button
        btnType="secondary"
        loading={isLoading}
        disabled={!isLoading && isEmpty(reproduceInWorkspaceButtonsProps)}
        testId="modal-toolbar-open-in-workspace"
      >
        Open in Workspace
      </Button>
    );
  }

  const reproduceInWorkspaceButtonProp = head(reproduceInWorkspaceButtonsProps);
  if (reproduceInWorkspaceButtonProp && reproduceInWorkspaceButtonsProps.length === 1) {
    return (
      <ReproduceInWorkspaceButton
        {...reproduceInWorkspaceButtonProp}
        canBeReproduced={reproduceInWorkspaceButtonProp.canBeReproduced}
        loggedInUserId={reproduceInWorkspaceButtonProp.requestedUserId}
        ModalButton={(modalButtonProps: ButtonProps) => <Button {...modalButtonProps} btnType="secondary" testId="modal-toolbar-open-in-workspace"/>}
      />
    );
  }

  const menuItems = map((workspaceButtonProps) => {
    return {
      key: workspaceButtonProps.modelVersionId,
      content: (
        <ReproduceInWorkspaceButton
          key={workspaceButtonProps.modelVersionId}
          {...workspaceButtonProps}
          canBeReproduced={workspaceButtonProps.canBeReproduced}
          loggedInUserId={workspaceButtonProps.requestedUserId}
          ModalButton={(modalButtonProps: ButtonProps & {loading: boolean}) => (
            <StyledInvisibleButton
              {...modalButtonProps}
              data-test="modal-toolbar-open-in-workspace"
              disabled={!modalButtonProps.loading && modalButtonProps.disabled}
            >
              {`Version ${workspaceButtonProps.versionNumber}`}
            </StyledInvisibleButton>
          )}
        />
      )
    };
  }, reproduceInWorkspaceButtonsProps);

  return (
    <ActionDropdown
      menuItems={menuItems}
      CustomTrigger={SecondaryButton}
      label="Open in Workspace"
      showCaret={true}
      caretIcon={<CaretDownOutlined />}
      dataTest="toolbar-ws-reproduce-dropdown"
    />
  );
};

export const getModelReproductionDetailsHook = (
  modelId: string,
  setReproduceInWorkspaceButtonsProps: React.Dispatch<React.SetStateAction<ReproduceInWorkspaceDetails[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  shouldFilterRunningModalVersions: boolean
) =>
  (async function () {
    const reproduceInWorkspaceButtonsProps = await getModelReproductionDetails({ modelId });
    setReproduceInWorkspaceButtonsProps(
      shouldFilterRunningModalVersions ?
      filter((detail) => detail.status === 'running', reproduceInWorkspaceButtonsProps)
      : reproduceInWorkspaceButtonsProps
    );
    setIsLoading(false);
  })();

export const useReproducibility = (modelId: string, isWorkspaceReproducibilityEnabled: boolean, shouldFilterRunningModalVersions: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reproduceInWorkspaceButtonsProps, setReproduceInWorkspaceButtonsProps] =
    useState<Array<ReproduceInWorkspaceDetails>>([]);

  useEffect(() => {
    if (isWorkspaceReproducibilityEnabled) {
      (() => getModelReproductionDetailsHook(modelId, setReproduceInWorkspaceButtonsProps, setIsLoading, shouldFilterRunningModalVersions))();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, reproduceInWorkspaceButtonsProps };
};

interface Props {
  onConfirm: () => void;
  publishVersionFormUrl: string;
  canPublishModel: boolean;
  canArchiveModel: boolean;
  isWorkspaceReproducibilityEnabled: boolean;
  isAsyncModel: boolean;
  modelId: string;
}

export const ModelDetailsViewToolbar = ({
  onConfirm,
  publishVersionFormUrl,
  canPublishModel,
  canArchiveModel,
  modelId,
  isWorkspaceReproducibilityEnabled,
  isAsyncModel
}: Props) => {
  const { isLoading, reproduceInWorkspaceButtonsProps } = useReproducibility(
    modelId,
    isWorkspaceReproducibilityEnabled,
    true
  );

  return canPublishModel || canArchiveModel || isWorkspaceReproducibilityEnabled ? (
    <SeparatedToolbar justifyContent="flex-end">
      {canArchiveModel && <ArchiveModelButton onConfirm={onConfirm} isAsyncModel={isAsyncModel} />}
      {isWorkspaceReproducibilityEnabled && (
        <ToolBarReproduceInWorkspaceButton
          reproduceInWorkspaceButtonsProps={reproduceInWorkspaceButtonsProps}
          isLoading={isLoading}
        />
      )}
      {canPublishModel &&
        <SuccessButton href={publishVersionFormUrl} data-test="publish-model-success-button">
          New Version
        </SuccessButton>}
    </SeparatedToolbar>
  ) : <React.Fragment />;
};
