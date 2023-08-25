import * as React from 'react';
import styled from 'styled-components';
import { isUserAuthenticated, unlinkProjectManagement } from '@domino/api/dist/ProjectManagement';
import Button from './Button/Button';
import { colors, themeHelper } from '../styled/index';
import { error, success } from './toastr';
import { NETWORK_ERROR_600 } from '@domino/api/dist/httpRequest';

const Wrapper = styled.div`
  .button, .ant-btn-group, .ant-btn {
    width: 100%;
    height: auto;
  }
  .ant-btn {
    background-color: ${colors.clickableBlue};
    border-color: ${colors.info};
    display: block;
    font-weight: ${themeHelper('fontWeights.normal')};
    padding: 12px 20px;
    height: auto;
    font-size: ${themeHelper('fontSizes.small')};
  }
  .ant-btn:hover {
    background-color: ${colors.info};
  }
`;

export interface State {
  isUserAuthenticated: boolean;
}

class JiraCredentials extends React.PureComponent<{}, State> {
  state: State = {
    isUserAuthenticated: false
  }

  fetchIsUserAuthenticated = async () => {
    try {
      const isAuthenticated = await isUserAuthenticated({});
      this.setState({
        isUserAuthenticated: !!isAuthenticated,
      });
    } catch (e) {
      if (e.status !== NETWORK_ERROR_600) {
        console.warn(e);
        error('Failed to get user authentication details');
      }
    }
  }

  authenticateJira = () => {
    window.location.href = window.location.origin + '/v4/projectManagement/jiraOAuth?dominoRedirectionUrl=' +
    encodeURIComponent(window.location.href);
  }

  unlinkProjectManagement = async () => {
    try {
      const response = await unlinkProjectManagement({});
      this.setState({
        isUserAuthenticated: false
      });
      success(response.message);
    } catch (e) {
      console.warn(e);
      error('Failed to unlink Jira credentials');
    }
  }

  componentDidMount() {
    this.fetchIsUserAuthenticated();
  }

  render() {
    return (
      <Wrapper>
        {
          this.state.isUserAuthenticated
            ? <Button btnType="primary" onClick={this.unlinkProjectManagement}>Unlink Credentials</Button>
            : <Button btnType="primary" onClick={this.authenticateJira}>Add Credentials</Button>
        }
      </Wrapper>
    );
  }
}

export default JiraCredentials;
