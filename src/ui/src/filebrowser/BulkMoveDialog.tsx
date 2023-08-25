import * as React from 'react';
import { moveFileOrFolder } from '@domino/api/dist/Files';
import { getErrorMessage } from '../utils/errorUtil';
import { success, error as errorToast } from '../components/toastr';
import ModalWithButton from '../components/ModalWithButton';
import WaitSpinner from '../components/WaitSpinner';
import FormattedForm, { InputType } from '../components/FormattedForm';
import {
  formatInitialDataAsFileTree,
  openNode,
  closeNode,
  formatNodePathAsBulkTreePath,
  cleanPath,
  getTargetPath,
} from './bulkMoveUtil';
import {
  postMoveEntities,
  getInitialBulkMoveTreeData,
} from './queryUtil';
import {
  BulkMoveTreeNode,
  SelectedEntity,
} from './types';

import BulkMoveTree from './BulkMoveTree';
import nucleusFileBrowserReloader from './nucleusFileBrowserReloader';

const dialogProps = {
  'data-test': 'BulkMoveDialog',
  title: 'Move Files and Directories',
};

const fields = (
    selectNode: (nextPath: string) => void,
    handleNodeOpen: (selectedPath: string) => void,
    handleNodeClose: (path: string) => void,
    tree: BulkMoveTreeNode[],
    selectedPath: string,
  ) => [
  [
    {
      inputType: 'warning' as InputType,
      inputOptions: {
        key: 'warning',
        content: 'Moving files will result in loss of the files\' revision history.'
      },
    },
    {
      inputType: 'custom' as InputType,
      inputOptions: {
        key: 'tree',
        Component: () => (
          <>
            {tree.length ?
              <BulkMoveTree
                selectNode={selectNode}
                onOpen={handleNodeOpen}
                onClose={handleNodeClose}
                tree={tree}
                selectedPath={selectedPath}
              /> : (
                <WaitSpinner>
                  Loading file tree...
                </WaitSpinner>
              )}
          </>
        ),
      },
    }
  ]
];

export type MessageProp = {
  show?: boolean;
  messageType?: string;
  isDismissable?: boolean;
  onDismiss?: () => void;
  isClickable?: boolean;
  shouldDisappear?: boolean;
  message?: {
    primary: string | { content: string };
    secondary?: {
      content: string;
    };
  };
};

export type TriggerButtonProps = {
  id?: string;
  disabled: boolean;
  onClick: () => void;
};

export type Props = {
  isBulkAction: boolean;
  disabled?: boolean;
  CustomButton?: React.FunctionComponent<TriggerButtonProps>;
  btnId?: string;
  ownerUsername: string;
  projectName: string;
  relativePath: string;
  selectedEntities: SelectedEntity[];
};

export type State = {
  submitError?: string;
  selectedPath: string;
  tree: BulkMoveTreeNode[];
};

export type ContentsProps = {
  isBulkAction: boolean;
  onCancel: () => void;
  ownerUsername: string;
  projectName: string;
  relativePath: string;
  selectedEntities: SelectedEntity[];
};

class Contents extends React.PureComponent<ContentsProps, State> {
  state = {
    submitError: '',
    selectedPath: 'none',
    tree: [],
  };

  componentDidMount() {
    const { relativePath } = this.props;
    this.getInitialTreeData(cleanPath(relativePath));
  }

  getInitialTreeData = (relativePath: string) => {
    const {
      ownerUsername,
      projectName,
      selectedEntities,
    } = this.props;
    getInitialBulkMoveTreeData(
      ownerUsername,
      projectName,
      selectedEntities
    )
    .then((data: any) => {
      const tree = formatInitialDataAsFileTree(data, relativePath);
      this.setState({ tree });
    })
    .catch(this.updateErrorMessage);
  }

  updateErrorMessage = (error: any) => {
    let message = 'Something went wrong with your request.';

    if (error.response && error.response.data) {
      message = error.response.data;
    } else if (error.message) {
      message = error.message;
    } else if (error.status) {
      message = `${error.status} - ${error.statusText}`;
    }

    this.setState({
      submitError: message,
    });
  }

  onSubmit = () => {
    const {
      isBulkAction,
      ownerUsername,
      projectName,
      selectedEntities,
    } = this.props;
    const {
      selectedPath,
    } = this.state;
    const targetPath = cleanPath(selectedPath);

    if (selectedPath !== 'none' && selectedEntities.length) {

      this.setState({ submitError: '' }, () => {
        const handleRequest = (
          getMessageFromError: (err: any) => Promise<string>,
          executingRequest: Promise<any>
        ): Promise<any> =>
          executingRequest.then(() => {
            success('Move successful');
            nucleusFileBrowserReloader();
          })
          .catch(error => {
            const baseErrorMessage = 'Move failed - Please try again';
            getMessageFromError(error).then((submitError: string) => {
              errorToast(baseErrorMessage, submitError);
              this.setState({ submitError });
            }).catch(() => {
              errorToast(baseErrorMessage, error);
              this.setState({ submitError: baseErrorMessage });
            });
            console.warn(error);
          });

        if (isBulkAction) {
          const toMove = selectedEntities.reduce(
            (acc: { files: string[]; directories: string[]; targetPath: string }, next: SelectedEntity) => {
            if (next.isDir) {
              acc.directories.push(next.path);
            } else {
              acc.files.push(next.path);
            }
            return acc;
          }, {
            files: [],
            directories: [],
            targetPath,
          });

          handleRequest(
            async (error: any) => error.response.data.message ? error.response.data.message : error.response.data,
            postMoveEntities(projectName, ownerUsername, toMove)
          );
        } else if (selectedEntities.length === 1) {
          const { path, isDir } = selectedEntities[0];
          handleRequest(
            (error: any) => getErrorMessage(error),
            moveFileOrFolder({
              body: {
                originPath: path,
                targetPath: getTargetPath(path, selectedPath),
                isDirectory: isDir,
                ownerUsername,
                projectName,
              },
          }));
        }
      });
    }
  }

  handleNodeClose = (path: string) => {
    const newPath = formatNodePathAsBulkTreePath(path);
    this.setState({ tree: closeNode(newPath, this.state.tree) });
  }

  handleNodeOpen = (selectedPath: string) => {
    const path = !selectedPath ?
      selectedPath.split('/') :
      [''].concat(selectedPath.split('/'));

    this.setState({
      tree: openNode(path, this.state.tree),
    });
  }

  selectNode = (nextPath: string) => {
    const {
      selectedPath,
    } = this.state;
    const {
      selectedEntities,
    } = this.props;
    const isASelectedEntity = !!selectedEntities.find(e => e.path === nextPath);

    if (nextPath !== selectedPath && !isASelectedEntity) {
      this.setState({ selectedPath: nextPath });
    } else {
      this.setState({ selectedPath: 'none' });
    }
  }

  render() {
    const {
      tree,
      selectedPath,
      submitError,
    } = this.state;
    const { onCancel } = this.props;
    return (
      <FormattedForm
        asModal={true}
        defaultSubmitError={submitError}
        onCancel={onCancel}
        onSubmit={this.onSubmit}
        submitLabel="Move"
        fieldMatrix={fields(
          this.selectNode,
          this.handleNodeOpen,
          this.handleNodeClose,
          tree,
          selectedPath,
        )}
      />
    );
  }
}

const Dialog = ({ disabled, btnId, CustomButton, ...props }: Props) => (
  <ModalWithButton
    disabled={disabled}
    openButtonProps={{ 'data-test': 'BulkMoveDialogButton', id: btnId }}
    ModalButton={CustomButton}
    openButtonLabel="Move"
    modalProps={dialogProps}
    showFooter={false}
  >
    {(modalCtx: ModalWithButton) => (
      <Contents
        onCancel={modalCtx.handleCancel}
        {...props}
      />
    )}
  </ModalWithButton>
);

export default Dialog;
