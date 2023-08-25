import * as React from 'react';
import HelperTextPanel from '../components/HelperTextPanel';
import { Props as FileCommentProps, FileCommentsWithFlagProvider } from '../components/FileComments';

export type Props = FileCommentProps;

const FileViewDiscussionSection = (props: Props) => (
  <HelperTextPanel>
    <h3>Discussion</h3>
    <FileCommentsWithFlagProvider {...props} />
  </HelperTextPanel>
);

export default FileViewDiscussionSection;
