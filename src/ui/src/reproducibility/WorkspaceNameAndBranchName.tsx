import * as React from 'react';
import { isNil, isEmpty } from 'ramda';
import { replaceNonAlphaNumerics } from '../utils/common';

const defaultValueOfIsBranchNameModified = false;
const validateGitBranchName = require('is-git-branch-name-valid');

const useWorkspaceNameAndBranchName: (wsName?: string) => [
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
  (ev: React.ChangeEvent<HTMLInputElement>) => void,
  (ev: React.ChangeEvent<HTMLInputElement>) => void,
  () => boolean,
] = (wsName) => {
  const [workspaceName, setWorkspaceName] = React.useState<string>();
  const [branchName, setBranchName] = React.useState<string>();
  const [isBranchNameModified, setIsBranchNameModified] = React.useState<boolean>(defaultValueOfIsBranchNameModified);
  const [branchNameError, setBranchNameError] = React.useState<string>();
  const [workspaceNameError, setWorkspaceNameError] = React.useState<string>();

  const setWorkspaceNameAndBranchName = (workspaceNm?: string, isBranchNameModifiedDefaultVal?: boolean) => {
    const isBranchNameValueModified = isBranchNameModifiedDefaultVal ?? isBranchNameModified;
    setWorkspaceName(workspaceNm);
    if (!isBranchNameValueModified && !isNil(workspaceNm) && !isEmpty(workspaceNm)) {
      const alphaNumHyphBranchName = replaceNonAlphaNumerics(workspaceNm);
      const normalizedBranchName = alphaNumHyphBranchName.replace(/^-|-$/g, '');

      setBranchName(normalizedBranchName);
      validateBranchName(normalizedBranchName);
    } else if (!isBranchNameValueModified) {
      setBranchName(undefined);
      validateBranchName(undefined);
    }
  };

  React.useEffect(() => {
    if (!isNil(wsName)) {
      setWorkspaceNameAndBranchName(wsName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateBranchName = (branchNameText?: string) => {
    if (isNil(branchNameText) || isEmpty(branchNameText)) {
      setBranchNameError('Please enter branch name');
      return false;
    } else {
      const isBranchNameValid = validateGitBranchName(branchNameText);
      if (!isBranchNameValid) {
        setBranchNameError('Invalid branch name');
        return false;
      } else {
        setBranchNameError(undefined);
        return true;
      }
    }
  };

  const validateWorkspaceName = (workspaceNameText?: string) => {
    if (isNil(workspaceNameText) || isEmpty(workspaceNameText)) {
      setWorkspaceNameError('Please enter Workspace name');
      return false;
    } else {
      setWorkspaceNameError(undefined);
      return true;
    }
  };

  const onBranchNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsBranchNameModified(true);
    setBranchName(ev.target.value);
    validateBranchName(ev.target.value);
  };

  const onWorkspaceNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceNameAndBranchName(ev.target.value);
    validateWorkspaceName(ev.target.value);
  };

  const validateWorkspaceNameAndBranchName = () => {
    const isBranchNameValid = validateBranchName(branchName);
    const isWorkspaceNameValid = validateWorkspaceName(workspaceName);
    return isBranchNameValid && isWorkspaceNameValid;
  };

  return [workspaceName, branchName, branchNameError, workspaceNameError,
     onWorkspaceNameChange, onBranchNameChange, validateWorkspaceNameAndBranchName];
};

export default useWorkspaceNameAndBranchName;
