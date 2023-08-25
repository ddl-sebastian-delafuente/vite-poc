import * as React from 'react';
import { ForkOutlined } from '@ant-design/icons';
import { warning, error as errorToast } from '../../components/toastr';
import { UnauthedWarningContent } from '../../components/messages/UnauthedWarningContent';
import { ExtendedButtonProps } from '../../components/Button/Button';
import {
  SingletonForkProjectActionsProps,
  withForkActionState,
  ModalType,
  SingletonForkProjectActions,
} from '../../components/ForkActions';
import { createFormPost } from '../queryUtil';
import unblockableWindow from '../../utils/unblockableWindow';
import { launchFileInNotebookEndpoint } from '../../core/legacyApiEndpoints';

const getForkButton = (authorized: boolean)  => (props: ExtendedButtonProps) => (
  <button
    className="btn btn-default btn-sm"
    onClick={() => {
      if (authorized) {
        props.onClick!();
      } else {
        const { location } = window;
        const search = `${location.search ? `${location.search}&` : '?'}forkModalOpen=true`;
        const redirectPath = `${location.pathname}${search}`;
        warning(<UnauthedWarningContent customRedirectUrl={redirectPath} />);
      }
    }}
  >
    <ForkOutlined /> Fork and Launch
  </button>
);

export type Props = {
  isOpen: boolean;
  projectName: string;
  ownerUsername: string;
  path: string;
  isFileRunnableAsNotebook: boolean;
  csrfToken: string;
  launchAction: string;
  commitId: string;
  allowPublicRunExecution: boolean;
} & SingletonForkProjectActionsProps;

export class ForkAndLaunch extends React.PureComponent<Props> {
  getForkedProjectOwnerName = (): string | undefined => {
    const { user, allowPublicRunExecution, ownerUsername } = this.props;
    return !user && allowPublicRunExecution ? ownerUsername : (user ? user.userName : undefined);
  }

  handleForkSuccess = (newProjectName: string) => {
    const openWindow = window.open(unblockableWindow.EMPTY_WINDOW_URL);
    const { csrfToken, path, commitId } = this.props;
    const projectOwnerName = this.getForkedProjectOwnerName();
    if (projectOwnerName) {
      createFormPost<{ url: string }>({
          csrfToken,
          filePath: path,
          commitId,
        },
        launchFileInNotebookEndpoint(projectOwnerName, newProjectName),
        true
      ).then(({ url }) => {
        try {
          unblockableWindow.new(url, openWindow);
        } catch (error) {
          unblockableWindow.close(openWindow);
          errorToast('Unable to launch notebook window.');
          console.error(error);
        }
      })
      .catch((error: any) => {
        console.error(error);
        errorToast('Failed to launch notebook.');
        unblockableWindow.close(openWindow);
      });
    } else {
      const warningMessage = 'Couldn\'t launch notebook because couldn\'t determine project owner name';
      warning(warningMessage);
    }
  }

  render() {
    const {
      isOpen,
      isFileRunnableAsNotebook,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      launchAction,
      ...rest
    } = this.props;

    return isFileRunnableAsNotebook ? (
      <SingletonForkProjectActions
        {...rest}
        forkSubmitButtonLabel="Fork and Launch"
        onForkSuccess={this.handleForkSuccess}
        defaultModalType={isOpen && rest.authorized ? ModalType.FORK : undefined}
        ForkButton={getForkButton(rest.authorized)}
        showForkButton={true}
      />
    ) : null;
  }
}

export const ForkAndLaunchWithState = withForkActionState(ForkAndLaunch);
