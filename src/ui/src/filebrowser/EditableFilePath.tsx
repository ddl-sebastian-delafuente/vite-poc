import * as React from 'react';
import styled from 'styled-components';
import FilePathBreadCrumbs, { Props as BreadCrumbProps } from './FilePathBreadCrumbs';
import FileNameEditor, { FileNamEditorProps } from './FileNameEditor';

export type BreadCrumbsProp = {
  breadCrumbs: BreadCrumbProps['breadCrumbs'];
};

const FilePathContainer = styled.div`
  li {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &:last-of-type {
      flex-grow: 1;
      > span {
        width: 100%;
      }
    }
  }
`;

const EditorContainer = styled.div`
  width: 100%;
  > form {
    width: 100%;
    > div {
      width: 100%;
    }
  }
`;

const Input: React.FC<Props> = props => (
  <EditorContainer>
    <FileNameEditor
      {...props}
      formProps={{
        target: props.isFileLaunchableAsNotebook ? '_blank' : undefined,
        method: 'POST',
        id: 'file-view-editable-file-path',
      }}
    />
  </EditorContainer>
);

export type Props = BreadCrumbsProp & FileNamEditorProps;

const EditableFilePath: React.FC<Props> = props => (
  <FilePathContainer>
    <FilePathBreadCrumbs {...props}>
      {Input}
    </FilePathBreadCrumbs>
  </FilePathContainer>
);

export default EditableFilePath;
