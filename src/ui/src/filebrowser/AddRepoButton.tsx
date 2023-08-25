import * as React from 'react';
import { isNil } from 'ramda';
import { getPrincipal } from '@domino/api/dist/Auth';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import AddGitRepoModal from './AddGitRepoModal';
import { returnUserToGitReposTab } from './gitRepoUtil';
import { getErrorMessage } from '@domino/ui/dist/components/renderers/helpers';
import {
  EditRepoValues,
} from '../utils/shared-components/queryUtil';
import { addGitRepo } from '@domino/api/dist/Projects';

export type Props = {
  hideLearnMoreOnFile: boolean;
  ownerUsername: string;
  projectName: string;
  projectId: string;
  isGitBasedProject: boolean;
  areReferencesCustomizable: boolean;
  buttonLabel: string,
  csrfToken: string,
  userIsAllowedToEditProject?: boolean;
};

export type State = {
  isDisabled: boolean;
  hasError: boolean;
  errorMessage?: string;
};

class AddRepoButton extends React.PureComponent<Props, State> {

  static defaultProps = {
    areReferencesCustomizable: false,
  };
  constructor (props: Props) {
    super(props);
    this.state = {
      isDisabled: true,
      hasError: false,
    };
  }

  async componentDidMount () {
    const principal = await getPrincipal({});
    this.setState({isDisabled: principal.isAnonymous});
  }

  onSubmit = (values: EditRepoValues) => {
    const {
      ownerUsername,
      projectName,
      projectId,
      isGitBasedProject,
    } = this.props;
    return addGitRepo({
      projectId,
      body: {
        id: undefined,
        name: values.repoName,
        uri: values.url,
        ref: {
          type: values.defaultref,
          value: values.refdetails
        },
        serviceProvider: values.gitServiceProvider,
        credentialId: values.gitCredential ? values.gitCredential : undefined
      }
    }).then(() => {
      this.setState({
        hasError: false,
      });
      returnUserToGitReposTab(ownerUsername, projectName, isGitBasedProject);
    }).catch(async (err) => {
      const errorMessage = await getErrorMessage(err);
      this.setState({ errorMessage, hasError: true});
      throw(errorMessage);
    });
  }

  onClose = () => {
    this.setState({
      hasError: false,
    });
  }

  render() {
    const {
      buttonLabel,
      areReferencesCustomizable,
      userIsAllowedToEditProject,
      ...rest
    } = this.props;
    const {
      isDisabled,
      hasError,
      errorMessage
    } = this.state;
    const isUserAllowedToAddRepo = !isNil(userIsAllowedToEditProject) && userIsAllowedToEditProject;
    const disabled = isDisabled || !isUserAllowedToAddRepo;
    const AddGitRepoComponent = (
      <AddGitRepoModal
        openButtonLabel={buttonLabel}
        areReferencesCustomizable={areReferencesCustomizable}
        onSubmit={this.onSubmit}
        onClose={this.onClose}
        {...rest}
        isDisabled={disabled}
        hasError={hasError}
        errorMessage={errorMessage}
      />
    );

    return (
      !disabled
        ? AddGitRepoComponent
        : tooltipRenderer('Your role does not allow you to perform this action', <span>{AddGitRepoComponent}</span>)
    );
  }
}

export default AddRepoButton;
