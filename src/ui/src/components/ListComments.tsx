import * as React from 'react';
import { formatCommentDate } from './renderers/helpers';
import * as R from 'ramda';
import styled from 'styled-components';
import pluralize from 'pluralize';
import {
  colors,
  sizes
} from '../styled';
import DefaultAvatarIcon from '../icons/DefaultAvatarIcon';
import Markdown from './Markdown';
import ArchiveComment from './ArchiveComment';

const SyledCommentsSummary = styled.div`
  padding-top: 5px;
  text-align: right;
`;

const Comment = styled.div`
  padding: 10px 0;
  display: flex;
`;

const AvatarCol = styled.div`
  padding: 0 10px;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: ${sizes.SMALL};
  color: ${colors.downRiver};
`;

const CommentBody = styled.div`
  white-space: pre-line;
  p {
    margin: 0;
  }
`;

const DateDisplay = styled.div`
  color: ${colors.darkGrey};
`;

const DateWithArchive = styled.div`
  display: flex;
`;

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

export interface Props {
  commentThread: CommentThread;
  onArchive?: (id: string, threadId: string) => void;
  defaultExpand?: boolean;
}

export const ListComments: React.FC<Props> = props => {
  const [expand, setExpand] = React.useState<boolean>(Boolean(props.defaultExpand));
  
  const onExpand = React.useCallback(() => setExpand(!expand), [expand]);
  
  if (R.isNil(props.commentThread) || R.isNil(props.commentThread.comments)) {
    return <div>No Comments</div>;
  }

  const numOfComments = R.length(props.commentThread.comments);
  const sortCommentsByCreatedAt: Comment[] = R.sortBy(R.prop('created'), props.commentThread.comments);
  const sortedComments = R.reverse(sortCommentsByCreatedAt);
  return (
    <div>
      <SyledCommentsSummary>
        <a onClick={onExpand}>
          {expand ? 'Hide' : 'View'}
          {' '}
          {numOfComments > 1 ? 'all ' : ''}
          {numOfComments} {pluralize('comment', numOfComments)}
        </a>
      </SyledCommentsSummary>
      {
        expand && R.map<Comment, JSX.Element>(c =>
          <Comment key={c.commentId}>
            <AvatarCol>
              <DefaultAvatarIcon primaryColor={colors.secondaryBackground} />
            </AvatarCol>
            <div>
              <Header>{c.commenter.username}</Header>
              <CommentBody>
                <Markdown dataTest={`${c.commentId}-comment`}>
                  {c.commentBody.value}
                </Markdown>
              </CommentBody>
              <DateWithArchive>
                <DateDisplay>{formatCommentDate(c.created)}</DateDisplay>
                {
                  props.onArchive &&
                  <ArchiveComment
                    id={c.commentId.toString()}
                    threadId={props.commentThread.id}
                    onArchive={props.onArchive}
                  />
                }
              </DateWithArchive>
            </div>
          </Comment>, sortedComments)
        }
    </div>
  );
};

export default ListComments;
