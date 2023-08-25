import * as React from 'react';
import MarkdownWithMentions, { formatMentions } from './MarkdownWithMentions';

export interface Props {
  isCommentPreviewEnabled?: boolean;
  useSmallStyle?: boolean;
  submitComment: (comment: string) => void;
  comment?: string;
}

export const AddComment: React.FC<Props> = props => {
  const [comment, setComment] = React.useState<string>(props.comment || '');
  const [working, setWorking] = React.useState<boolean>(false);

  const addComment = React.useCallback(async () => {
    setWorking(true);
    await props.submitComment(formatMentions(comment));
    setComment(''); // Clear the text box after submitting
    setWorking(false);
  }, [props.submitComment, comment]);

  const onCommentChange =
    React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value), []);

  return (
    <MarkdownWithMentions
      isPreviewEnabled={props.isCommentPreviewEnabled}
      useSmallStyle={props.useSmallStyle}
      submitHandler={addComment}
      text={comment}
      changeHandler={onCommentChange}
      working={working}
      placeholder={'Add a new comment'}
    />
  );
};

export default AddComment;
