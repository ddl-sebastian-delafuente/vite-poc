import * as React from 'react';
import ImportArtifactsFromProjectView from '../../src/filebrowser/ImportArtifactsFromProjectView/ImportArtifactsFromProjectView';
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files'), module);

const testImportedProjects = [
  {
    availableReleases: [
      {
        releaseId: "1",
        runNumber: 1,
        runHeading: "run1",
        createdAt: "",
        isSelected: true
      }
    ],
    id: "3",
    projects: ["fork1", "fork2"],
    isReleaseOptionSelected: true,
    ownerUsername: "me",
    projectName: "project",
    isActive: true,
    mountPath: "mnt/imported/artifacts/project",
    isArchived: false,
    filesAvailable: true,
    packageAvailable: true,
    variablesAvailable: false
  },
  {
    availableReleases: [
      {
        releaseId: "2",
        runNumber: 2,
        runHeading: "run2",
        createdAt: "",
        isSelected: true
      },
      {
        releaseId: "4",
        runNumber: 4,
        runHeading: "run4",
        createdAt: "",
        isSelected: false
      }
    ],
    id: "6",
    projects: ["fork8", "fork10"],
    isReleaseOptionSelected: false,
    ownerUsername: "me",
    projectName: "project2",
    isActive: true,
    mountPath: "mnt/imported/artifacts/project2_custom",
    isArchived: false,
    filesAvailable: false,
    packageAvailable: false,
    variablesAvailable: false
  }
]

stories.add('ImportArtifactsFromProjectView', () => (
  <ImportArtifactsFromProjectView
    ownerUsername="testUser"
    projectName="testProject"
    csrfToken=""
    addDependencyEndpoint=""
    runTaggingEnabled={true}
    userIsAllowedToChangeProjectSettings={true}
    projectImportsIsEmpty={false}
    importedProjects={testImportedProjects}
  />
));
