import * as React from 'react';
import axios from 'axios';
import { has, omit } from 'ramda';
import { ConfirmRedirectToLogin } from '../confirmRedirect/confirmRedirectToLogin';
import Button from '../components/Button/Button';
import { openWorkspaceSession } from './LaunchNotebookUtil';

export interface LaunchNotebookProps {
  csrfToken: string;
  commitId: string;
  filePath: string;
  btnLabel: string;
  submitUrl: string;
  reloginDataStorageKey: string;
  ownerUsername: string;
  projectName: string;
  showButton?: boolean;
  projectId: string;
}

export interface LaunchNotebookState {
  redirectPath?: string;
  reloginPayload?: string;
}

class LaunchNotebook extends React.Component<LaunchNotebookProps, LaunchNotebookState> {
  constructor (props: LaunchNotebookProps) {
    super(props);
    this.state = {
      redirectPath: undefined,
      reloginPayload: undefined
    };
  }

  onClick = () => {
    this.setState({ redirectPath: undefined });
    const { commitId, csrfToken, filePath, submitUrl, ownerUsername, projectName, projectId } = this.props;
    const payload = {
      csrfToken,  
      commitId,
      filePath
    };
    axios.post(
      submitUrl,
      JSON.stringify(payload),
      { 
        headers: {'Content-Type': 'application/json'}
      }
    ).then(res => {
      const result = res.data;
      openWorkspaceSession(ownerUsername, projectName, result.workspaceId);
    }).catch(err => {
      const result = err.response.data;
      if (has('redirectPath', result)) {
        this.setState({
          redirectPath: (result as any).redirectPath,
          reloginPayload: JSON.stringify({...omit(['csrfToken'], payload), submitUrl: submitUrl, projectId: projectId})
        });
      }
    });
  }

  render () {
    const { btnLabel, reloginDataStorageKey, showButton } = this.props;
    const { redirectPath, reloginPayload } = this.state;
    return (
      <>
        {
          !!showButton ?
          <Button onClick={this.onClick}>{btnLabel}</Button> :
          <span onClick={this.onClick}>{btnLabel}</span>
        }
        {
          !!redirectPath &&
          <ConfirmRedirectToLogin
            redirectUri={redirectPath}
            storageKey={reloginDataStorageKey}
            value={reloginPayload}
          />
        }
      </>);
  }
}

export default LaunchNotebook;
