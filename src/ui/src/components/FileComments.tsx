import * as React from 'react';
import * as R from 'ramda';
import { DominoFilesInterfaceComment } from '@domino/api/dist/types';
import { getFileCommentThread, addFileComment, archiveFileComment } from '@domino/api/dist/Files';
import AddComment from './AddComment';
import ListComments from './ListComments';
import WaitSpinner from './WaitSpinner';
import {
  error as showError,
  success as showSuccess
} from './toastr';
import withStore from '../containers/WithStore';

interface AddCommentConfiguration {
  isCommentPreviewEnabled: boolean;
  useSmallStyle: boolean;
}

export interface Comment {
  commentId: string;
  commenter: {
    username: string;
  };
  commentBody: {
    value: string;
  };
  created: number;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
}

export type Props = {
  fileName: string;
  projectId: string;
  commitId: string;
  isCommentPreviewEnabled?: boolean;
  useSmallStyle?: boolean;
};

export interface State {
  comments?: CommentThread;
  loading: boolean;
}

const toFormattedComment = (comment: DominoFilesInterfaceComment) => {
  return {
    commentId: comment.commentId,
    commentBody: {
      value: comment.commentBody
    },
    commenter: {
      username: comment.commentedBy.userName
    },
    created: comment.createdAt
  };
};

export class FileComments extends React.Component<Props, State> {
  static defaultProps = {
    isCommentPreviewEnabled: true,
  };

  state: State = {
    loading: false
  };

  getComments = async () => {
    try {
      this.setState({ loading: true });
      const comments = await getFileCommentThread({
        projectId: this.props.projectId,
        fileName: this.props.fileName,
        commitId: this.props.commitId
      });
      if (comments) {
        this.setState({
          comments: {
            id: comments.id,
            comments: R.map(toFormattedComment, comments.comments)
          },
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    } catch (err) {
      showError('Failed to get comments');
      console.warn(err);
      this.setState({
        loading: false
      });
    }
  }

  archiveComment = async (id: string, threadId: string) => {
    try {
      await archiveFileComment({ body: {
        projectId: this.props.projectId,
        commentThreadId: threadId,
        commentId: id
      }});
      await this.getComments();
      showSuccess('Comment Archived');
    } catch (err) {
      showError('Could not archive comment');
      console.warn(err);
    }
  }

  addComment = async (comment: string) => {
    try {
      await addFileComment({ body: {
        comment: comment,
        projectId: this.props.projectId,
        fileName: this.props.fileName,
        commitId: this.props.commitId
      }});
      await this.getComments();
      showSuccess('New comment added');
    } catch (err) {
      showError('Could not add comment');
      console.warn(err);
    }
  }

  componentDidMount() {
    this.getComments();
  }

  render() {
    return (
      <React.Fragment>
        <AddComment
          submitComment={this.addComment}
          {...R.pick(['isCommentPreviewEnabled', 'useSmallStyle'], this.props) as AddCommentConfiguration}
        />
        {this.state.loading ? <WaitSpinner/> :
          this.state.comments && <ListComments
            commentThread={this.state.comments}
            onArchive={this.archiveComment}
            defaultExpand={true}
          />}
      </React.Fragment>
    );
  }
}

export const FileCommentsWithFlagProvider = withStore(FileComments);
export default FileCommentsWithFlagProvider;
