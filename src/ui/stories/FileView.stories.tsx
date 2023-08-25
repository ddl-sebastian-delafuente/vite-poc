import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ProjectVisibility } from '../src/filebrowser/types';
import { View } from '../src/filebrowser/FileView';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files'), module);

stories.add('File View', () => (
  <View
    lastExistingCommitCreatedAt={5}
    userIsAllowedToEditProject={true}
    revertFileEndpoint='file endpoint'
    runNumberForCommit="job #5"
    commitsRunLink='commits link'
    selectedRevision= { {
      runId: 5,
      sha: 'sha',
      message: 'message',
      timestamp: 5,
      url: 'url',
      author: { username: 'username'},
      runNumberStr: '5',
      runLink: 'runLink'
    } }
    availableRevisions= {[]}
    commitId= 'commitId'
    projectId= 'projectId'
    path= 'path'
    csrfToken= 'token'
    isFileRunnableAsApp= {true}
    isFileRunnableFromView= {true}
    isFileLaunchableAsNotebook= {true}
    publishAppEndpoint= 'endpoint'
    action= 'action'
    locationUrl= 'url'
    ownerUsername= 'username'
    projectName= 'projectName'
    filename= 'filename'
    breadCrumbs= {[{ url: 'url', label: 'label' }] }
    headRevisionDirectoryLink= 'dirlink'
    isCommentPreviewEnabled= {true}
    toolbarLinks= { {
      editFileLink: 'editlink',
      compareRevisionsLink: 'comparelink',
      downloadFileLink: 'downloadlink',
      viewRawFileLink: 'rawlink',
      sharedFileViewLink: 'sharedlink',
    } }
    projectVisibility={ProjectVisibility.Private}
    renderedFile= 'renderedFile'
    userCanEditProjectFiles= {true}
    isFullDeleted= {false}
    userIsAllowedToFullDelete={true}
    userCanStartRuns={true}
  />
));
