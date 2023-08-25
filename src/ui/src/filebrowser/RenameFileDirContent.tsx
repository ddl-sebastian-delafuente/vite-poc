import FormattedForm, { FormattedFormInputValues } from '../components/FormattedForm';
import {
  getFileDirName,
  getNewFilePath,
  cleanPath,
} from '../utils/shared-components/validateFileNameFormUtil';
import { postRenameFileOrDir } from '../utils/shared-components/queryUtil';
import { forceReload } from '../utils/sharedComponentUtil';
import { EntityType } from './types';

export interface Props {
  locationUrl: string;
  ownerUsername: string;
  projectName: string;
  oldPath: string;
  onCancel?: () => void;
  entityType: EntityType.FILE | EntityType.DIRECTORY;
  submitLabel?: string;
  cancelLabel?: string;
  defaultValues?: {};
  onSubmit?: (values: FormattedFormInputValues) => void;
}

class RenameFileDirContent extends FormattedForm<Props> {
  static defaultProps = {
    entityType: EntityType.FILE,
    submitLabel: 'Rename File',
    cancelLabel: 'Cancel',
    onCancel: () => undefined,
    defaultValues: {},
  };

  onSubmit = (values: FormattedFormInputValues) => {
    const {
      onSubmit,
      oldPath,
      ownerUsername,
      projectName,
      entityType,
      locationUrl,
    } = this.props;
    const newPath = getNewFilePath(values.newName, oldPath);

    // ValidatedForm (parent) handles errors thrown in here
    return postRenameFileOrDir(ownerUsername, projectName, cleanPath(oldPath), cleanPath(newPath), entityType)
      .then(() => {
        if (onSubmit) {
          onSubmit(values);
        } else {
          forceReload(locationUrl.replace(getFileDirName(oldPath) || '', values.newName));
        }
      });
  }
}

export default RenameFileDirContent;
