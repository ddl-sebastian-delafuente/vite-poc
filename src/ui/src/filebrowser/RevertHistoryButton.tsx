import * as React from 'react';
import Button from '../components/Button/Button';
import OneClickHTMLFormSubmit from '../components/OneClickHTMLFormSubmit';
import CSRFInputField from './CSRFInputField';
import { atOldFilesVersion } from './filesBrowserUtil';

const revertButtonProps = {
  'data-test': 'RevertFileVersionButton',
};

const RevertButton = (props: any) => <Button {...props} btnType="secondary" />;

export type Props = {
  userIsAllowedToEditProject: boolean;
  thisCommitId: string;
  headCommitId: string;
  formId: string;
  entityToRevert: string;
  csrfToken: string;
  revertEndpoint: string;
};

export const RevertHistoryButton = ({
  revertEndpoint,
  entityToRevert,
  userIsAllowedToEditProject,
  thisCommitId,
  headCommitId,
  formId,
  csrfToken,
}: Props) => (
  userIsAllowedToEditProject && atOldFilesVersion(thisCommitId, headCommitId) ? (
    <form id={formId} className="revert-file" action={revertEndpoint} method="POST">
      <CSRFInputField csrfToken={csrfToken} />
      <input type="hidden" name="targetCommitId" value={thisCommitId} />
      <OneClickHTMLFormSubmit
        buttonProps={revertButtonProps}
        CustomButton={RevertButton}
        submitText="Reverting..."
        preSubmitText={`Revert ${entityToRevert}`}
        formSelector={`#${formId}`}
      />
    </form>
  ) : null
);
