import * as React from 'react';
import styled from 'styled-components';
import { ButtonProps } from 'antd/lib/button';
import { isEmpty, findLast, propEq, isNil } from 'ramda';
import ReproduceInWorkspaceButton from '../reproducibility/ReproduceInWorkspaceButton';
import { useReproducibility } from './ModelDetailsViewToolbar';
import { DominoModelmanagerApiModelVersionReproduceInWorkspaceDetails } from '@domino/api/dist/types';
import InvisibleButton from '../components/InvisibleButton';
import { lightBlackTwo } from '@domino/ui/dist/styled/colors';

const StyledInvisibleButton = styled(InvisibleButton)`
  &, &:hover {
    color: ${lightBlackTwo};
  }
  &.ant-btn, &.ant-btn[disabled] {
    padding: 0px;
  }
`;

interface ActionDropdownReproduceInWorkspaceButtonProps {
    isWorkspaceReproducibilityEnabled: boolean;
    modelVersionId: string;
    modelId: string;
}

const reproduceInWorkspaceButtonPropsByModalVersionId = (modelVersionId: string, modelVersionsList: Array<DominoModelmanagerApiModelVersionReproduceInWorkspaceDetails>) => {
    return findLast(propEq('modelVersionId', modelVersionId))(modelVersionsList);
}

export const ActionDropdownReproduceInWorkspaceButton: React.FC<ActionDropdownReproduceInWorkspaceButtonProps> = (props) => {
    const { isWorkspaceReproducibilityEnabled, modelId, modelVersionId } = props;
    const { isLoading, reproduceInWorkspaceButtonsProps } = useReproducibility(
        modelId,
        isWorkspaceReproducibilityEnabled,
        false
    );
    const reproduceInWorkspaceButtonProp = reproduceInWorkspaceButtonPropsByModalVersionId(modelVersionId, reproduceInWorkspaceButtonsProps);
    return (
        <>
            { !isEmpty(reproduceInWorkspaceButtonsProps)
                && reproduceInWorkspaceButtonProp
                && reproduceInWorkspaceButtonsProps.length > 0
                &&
                <ReproduceInWorkspaceButton
                    {...reproduceInWorkspaceButtonProp}
                    canBeReproduced={reproduceInWorkspaceButtonProp.canBeReproduced}
                    loggedInUserId={reproduceInWorkspaceButtonProp.requestedUserId}
                    ModalButton={(modalButtonProps: ButtonProps) =>
                        <StyledInvisibleButton
                            {...modalButtonProps}
                            disabled={!modalButtonProps.loading && modalButtonProps.disabled}
                            data-test="modal-table-versions-open-in-workspace"
                        />}
                />
            }
            { (isEmpty(reproduceInWorkspaceButtonsProps) || isNil(reproduceInWorkspaceButtonProp))
                &&
                <StyledInvisibleButton
                    loading={isLoading}
                    disabled={!isLoading && (isEmpty(reproduceInWorkspaceButtonsProps) || isNil(reproduceInWorkspaceButtonProp))}
                    data-test="modal-table-versions-open-in-workspace"
                >
                    Open in Workspace
                </StyledInvisibleButton>
            }
        </>
    );
};
