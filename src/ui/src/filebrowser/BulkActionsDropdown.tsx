import * as React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import SecondaryButton from '../components/SecondaryButton';
import ActionDropdown from '../components/ActionDropdown';
import InvisibleButton from '../components/InvisibleButton';
import BulkMoveDialog from './BulkMoveDialog';
import RemoveFilesConfirmationModal from './RemoveFilesConfirmationModal';
import { SelectedEntity } from './types';
import LinkGoal from '../goals/LinkGoal';
import { fontSizes } from '../styled';

export type Props = {
  disableRemoveFilesButton: boolean;
  successfulFilesRemovalEndpoint: string;
  projectContainsCommits: boolean;
  atHeadCommit: boolean;
  userIsAllowedToEditProject: boolean;
  disabled: boolean;
  projectName: string;
  relativePath: string;
  ownerUsername: string;
  selectedEntities: SelectedEntity[];
  onGoalsLink: (goalIds: Array<string>) => void;
  projectId: string;
  isLinkGoalsDisabled: boolean;
  isLiteUser?: boolean;
};

const BulkActionsDropdown: React.FC<Props> = ({
  successfulFilesRemovalEndpoint,
  projectContainsCommits,
  atHeadCommit,
  userIsAllowedToEditProject,
  disabled,
  projectName,
  relativePath,
  ownerUsername,
  selectedEntities,
  disableRemoveFilesButton,
  onGoalsLink,
  projectId,
  isLinkGoalsDisabled,
  isLiteUser
}) => (
  <ActionDropdown
    menuTestKey="BulkActionsDropdownMenu"
    dataTest="BulkActionsDropdownButton"
    label="More"
    buttonProps={{
      customIcon: <MoreOutlined style={{ fontSize: fontSizes.SMALL }} />,
    }}
    CustomTrigger={SecondaryButton}
    disabled={isLiteUser || disabled}
    menuItems={[
      {
        key: 'movefilesbutton',
        content: (
          <BulkMoveDialog
            isBulkAction={true}
            CustomButton={InvisibleButton}
            key="movefilesbutton"
            projectName={projectName}
            relativePath={relativePath}
            ownerUsername={ownerUsername}
            selectedEntities={selectedEntities}
          />
        ),
      },
      ...(projectContainsCommits && atHeadCommit && userIsAllowedToEditProject ?
        [{
          key: 'removeselectedfilesbutton',
          content: (
            <RemoveFilesConfirmationModal
              projectName={projectName}
              ownerUsername={ownerUsername}
              CustomButton={InvisibleButton}
              successfulFilesRemovalEndpoint={successfulFilesRemovalEndpoint}
              paths={selectedEntities.map(x => x.path)}
              openButtonProps={{
                disabled: disableRemoveFilesButton,
                key: 'removeselectedfilesbutton',
              }}
            />
          )
        }] : []),
      {
        key: 'linkGoal',
        content: (
          <LinkGoal
            selectedIds={[]}
            isDisabled={isLinkGoalsDisabled}
            projectId={projectId}
            onSubmit={onGoalsLink}
            noTooltip={true}
            buttonIcon={'Link to Goals'}
            disabledReason={'Please select only files'}
          />
        )
      }
    ]}
  />
);

export default BulkActionsDropdown;
