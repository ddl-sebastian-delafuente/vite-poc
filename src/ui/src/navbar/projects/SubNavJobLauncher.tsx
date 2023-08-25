import * as React from 'react';
import * as R from 'ramda';
import { PlusOutlined } from '@ant-design/icons';
import { mixpanel, types as mixpanelTypes } from '../../mixpanel';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project
} from '@domino/api/dist/types';
import RunJobButton from '../../runs/RunJobButton';
import { success, warning } from '../../components/toastr';
import { getStyledIcon } from './styleUtil';
import {
  getPreviouslySelectedValue,
  previousDataStorageKeys,
  clearPreviousDataStorage,
} from '../../confirmRedirect/confirmRedirectToLogin';
import { startJob } from '@domino/api/dist/Jobs';
import { getGitCredentials } from '@domino/api/dist/Accounts';
import { withTheme } from 'styled-components';

export const RELOGIN_JOB_START_FAIL = 'Failed to start the job, as credentials have not been successfully acquired after relogin';

export interface SubNavJobLauncherProps {
  project: Project;
  userId?: string;
  enableGitCredentialFlowForCollaborators?: boolean;
  theme?: any;
}

export interface SubNavJobLauncherState {
  showRunModal: boolean;
  loading: boolean;
  hasGitCredentials: boolean;
}

class SubNavJobLauncher extends React.PureComponent<SubNavJobLauncherProps, SubNavJobLauncherState> {

  constructor(props: SubNavJobLauncherProps) {
    super(props);
    this.state = {
      showRunModal: false,
      loading: true,
      hasGitCredentials: false
    };
  }

  async componentDidMount() {
    this.checkAndSubmitPreviousStartJobForm();
    this.fetchGitCredentials();
  }

  componentDidUpdate(prevProps: SubNavJobLauncherProps) {
    if (!R.equals(
      prevProps.enableGitCredentialFlowForCollaborators,
      this.props.enableGitCredentialFlowForCollaborators
    ) || !R.equals(prevProps.userId, this.props.userId)) {
      this.fetchGitCredentials();
    }
  }

  fetchGitCredentials = async () => {
    try {
      this.setState({loading: true});
      const { project, userId, enableGitCredentialFlowForCollaborators } = this.props;
      if (project.mainRepository?.uri && enableGitCredentialFlowForCollaborators && userId) {
        const credentials = await getGitCredentials({userId});
        this.setState({hasGitCredentials: !R.isEmpty(credentials)});
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({loading: false});
    }
  }

  checkAndSubmitPreviousStartJobForm = () => {
    try {
      const previousUserId = getPreviouslySelectedValue(previousDataStorageKeys.credPropInitiator);
      if (R.equals(previousUserId, this.props.userId!)) {
        const previousData = getPreviouslySelectedValue(previousDataStorageKeys.startJobFromQuickStart);
        if (!R.isNil(previousData)) {
          const payload = JSON.parse(previousData);
          if (R.equals(payload.projectId, this.props.project.id)) {
            startJob({ body: payload })
              .then(result => {
                if (R.has('redirectPath', result)) {
                  warning(RELOGIN_JOB_START_FAIL, '', 0);
                } else {
                  this.handleJobStartSuccess();
                }
              });
            clearPreviousDataStorage(previousDataStorageKeys.startJobFromQuickStart);
          }
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  handleJobStartSuccess = () => {
    success('Job started successfully.');
  }

  onPlusClick = () => {
    const { project } = this.props;
    mixpanel.track(() =>
      new mixpanelTypes.CreateJobClick({
        projectId: project.id,
        location: mixpanelTypes.Locations.CreateJobClick
      })
    );
    this.setState({
      showRunModal: true
    });
  }

  handleSubmit = (isJobLaunched: boolean) => {
    this.setState({
      showRunModal: false
    });
    if (isJobLaunched) {
      this.handleJobStartSuccess();
    }
  }

  handleCancel = () => {
    this.setState({
      showRunModal: false
    });
    clearPreviousDataStorage(previousDataStorageKeys.startJobFromQuickStart);
  }

  render() {
    const {
      project,
      theme
    } = this.props;
    const { showRunModal, loading, hasGitCredentials } = this.state;

    const canStartRun = R.contains('Run', project.allowedOperations);
    const StyledPlusIcon = getStyledIcon(PlusOutlined, !canStartRun);

    return (
      <>
        <StyledPlusIcon
          style={{ fontSize: '14px', color: theme.nav.secondary.background }}
          height={14}
          width={14}
          primaryColor={theme.nav.secondary.background}
          onClick={canStartRun && !loading && this.onPlusClick}
          data-test="jobLaunchIcon"
        />
        <RunJobButton
          projectId={project.id}
          withJobsDashboardRouting={false}
          visible={showRunModal}
          project={project}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
          previousValuesStorageKey={previousDataStorageKeys.startJobFromQuickStart}
          hasGitCredentials={hasGitCredentials}
        />
      </>
    );
  }
}

export default withTheme(SubNavJobLauncher);
