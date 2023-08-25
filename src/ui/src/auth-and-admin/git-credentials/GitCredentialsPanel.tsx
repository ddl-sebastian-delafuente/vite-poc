import * as React from "react";
import { sortBy, prop } from 'ramda';
import styled from 'styled-components';
import { addGitCredential, deleteGitCredential } from '@domino/api/dist/Accounts';
import AddGitCredentialsModal from "./AddGitCredentialsModal";
import GitCredentialsSummaryTable from "./GitCredentialsSummaryTable";
import Panel from '../components/Panel';
import HelpLink from '../../components/HelpLink';
import { error as ToastError } from '../../components/toastr';
import { getErrorMessage } from '../../components/renderers/helpers';
import {SUPPORT_ARTICLE} from "../../core/supportUtil";
import useStore from "../../globalStore/useStore";
import { getAppName } from "../../utils/whiteLabelUtil";

const sortByName = sortBy(prop('name'));

const StyledPanel = styled(Panel)`
  .panel: {
    border: none
  };
  .panel-body: {
    padding-bottom: 0px;
  };
`;


const submitCreds = async (userId: any, data: any, addGitCredentialToState: any) => {
  const body = {...data};
  if (
    body.accessType ===  "key"
  ) {
    body.type = "SshGitCredentialDto"
  } else if (body.accessType ===  "password") {
    body.type = "PasswordGitCredentialDto"
  } else {
    body.type = "TokenGitCredentialDto"
  }

  try {
    const results = await addGitCredential({userId, body});
    addGitCredentialToState(results);
  }
  catch (e) {
    console.warn(e);
    ToastError(await getErrorMessage(e, 'Could not add git credential'));
  }
}

const deleteCred  = async (userId: any, credentialId: any, removeCredentialFromState: any) => {
  const deleteTarget = {userId, credentialId, id: credentialId}
  try {
    await deleteGitCredential(deleteTarget);
    removeCredentialFromState(credentialId);
  }
  catch (e) {
    if (e.status === 404) { // the credential was already deleted
      removeCredentialFromState(credentialId);
    }
    console.warn(e);
    ToastError(await getErrorMessage(e, 'Could not delete git credential'));
  }
}

const GitCredentialsPanel = ({
  gitServiceProviders,
  gitCredentials,
  currentUser,
  addCredential: addCredentialToState,
  removeCredential: removeCredentialFromState
}: any) => {
  const { whiteLabelSettings } = useStore();
  const appName = getAppName(whiteLabelSettings);
  return (
    <StyledPanel header="Git Credentials">
      <p className={'header-explanation'}>
        {`Authenticate ${appName} for access to your Git repositories.`}
      </p>
      <p className={'header-help-link'}>
        <HelpLink
          text={`Learn more about working with ${appName} and Git.`}
          articlePath={SUPPORT_ARTICLE.GIT_CREDENTIALS}
          showIcon={false}
        />
      </p>
      {(gitCredentials && gitCredentials.length) ? (
        <GitCredentialsSummaryTable
          credentials={sortByName(gitCredentials)}
          onDelete={(userID: any, credID: any)=>deleteCred(userID, credID, removeCredentialFromState)}
          user={currentUser}
        />
      ) : null}
      <AddGitCredentialsModal
        hideLearnMoreOnFile={false}
        areReferencesCustomizable={true}
        gitServiceProviders={gitServiceProviders}
        onSubmit={(data: any)=>{
          submitCreds(currentUser.id, data, addCredentialToState)
          return true
        }
        }
        isDisabled={false}
        user={currentUser}
      />
    </StyledPanel>
  );
};

export default GitCredentialsPanel;
