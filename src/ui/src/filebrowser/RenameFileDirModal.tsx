import * as React from 'react';
import { ExtendedButtonProps } from '../components/Button/Button';
import SmallIconButton from '../components/SmallIconButton';
import { Warning, InputOptions, InputType } from '../components/FormattedForm';
import ModalWithButton from '../components/ModalWithButton';
import RenameFileDirContent from './RenameFileDirContent';
import {
  getFileDirName,
  capitalize,
  validateFileDirName,
} from '../utils/shared-components/validateFileNameFormUtil';
import { EntityType } from './types';
import { EditOutlined } from '@ant-design/icons';

const EditButton = (props: ExtendedButtonProps) => <SmallIconButton {...props} icon={<EditOutlined />} />;

const fields = (oldName: string) => [
  [{
    inputType: 'warning' as InputType,
    inputOptions: {
      key: 'renameEntityInfo',
      content: 'Renaming the file will cut ties to its version history' +
        ' - the version history is maintained with the old file name and you will not be able to compare revisions.',
    } as Warning,
  }],
  [{
    inputType: 'input' as InputType,
    inputOptions: {
      key: 'newName',
      label: 'New Name',
      validated: true,
      validators: [
        {
          checker: (value: string, props: any) =>
            !!validateFileDirName(value, oldName, props.entityType),
          errorCreator: (value: string, props: any) =>
            validateFileDirName(value, oldName, props.entityType),
        }
      ],
      ignoreEnter: true,
    } as InputOptions,
  }],
];

export interface Props {
  disabled?: boolean;
  locationUrl: string;
  ownerUsername: string;
  projectName: string;
  editLabel?: string;
  oldPath: string;
  OpenButton?: React.FunctionComponent<ExtendedButtonProps>;
  entityType: EntityType.FILE | EntityType.DIRECTORY;
  defaultValues?: {};
  onSubmit?: () => void;
}

const RenameFileDirModal = ({
  OpenButton = EditButton,
  entityType,
  disabled,
  defaultValues = {},
  editLabel,
  ...props
}: Props) => (
  <ModalWithButton
    showFooter={false}
    openButtonLabel={editLabel}
    ModalButton={OpenButton}
    disabled={disabled}
    openButtonProps={{ testId: 'rename-file-dir-modal-btn' }}
    modalProps={{
      title: `Rename a ${capitalize(entityType)}`
    }}
  >
    {(modalContext: ModalWithButton) => (
      <RenameFileDirContent
        defaultValues={defaultValues}
        locationUrl={props.locationUrl}
        entityType={entityType}
        projectName={props.projectName}
        ownerUsername={props.ownerUsername}
        oldPath={props.oldPath}
        onCancel={modalContext.handleCancel}
        submitLabel={`Rename ${capitalize(entityType)}`}
        asModal={true}
        fieldMatrix={fields(getFileDirName(props.oldPath) || '')}
        onSubmit={props.onSubmit}
      />
    )}
  </ModalWithButton>
);

export default RenameFileDirModal;
