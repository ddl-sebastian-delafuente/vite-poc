import * as React from 'react';
import styled from 'styled-components';
import NavTabs, { NavTabPane, NavTabsProps } from '../components/NavTabs/NavTabs';
import { atOldFilesVersion } from './filesBrowserUtil';
import { FileBrowserAppContent } from './FileBrowserAppContent';
import { getCurrentUser } from '@domino/api/dist/Users';
import {
  Props as ProjectImportsProps,
  ImportArtifactsFromProjectView
} from './ImportArtifactsFromProjectView/ImportArtifactsFromProjectView';
import FilesBrowserTable, { Props as LocalTabProps } from './FilesBrowserTable';
import { GitRepositoriesView, Props as GitRepositoriesViewProps } from './GitRepositoriesView';
import LearnGraphicIcon from '../icons/LearnGraphicIcon';
import { GitCredential, CredentialRepoMapping, FilesPermissions } from './types';
import {
  DominoCommonUserPerson
} from '@domino/api/dist/types';
import {
  getCreateFolderEndpoint,
  getCreateDatasetFromProjectEndpoint,
  getRevertProjectEndpoint,
  getSuccessfulUploadUrl,
  getSuccessfulFilesRemovalEndpoint,
  getUploadEndpoint,
  getHeadRevisionDirectoryLink,
  getDownloadSelectedEntitiesEndpoint,
  getDownloadProjectFolderAsZipEndpoint,
  getCreateFileEndpoint,
  ProjectIdContext,
  GitCredentialsContext,
  onGitCredentialsChange
} from './util';
import { HELP_PREFIX, SUPPORT_ARTICLE } from '@domino/ui/dist/core/supportUtil';
import HelpLink from '../components/HelpLink';
import { Alert } from 'antd';
import { colors, themeHelper } from '../styled';
import FlexLayout from '../components/Layouts/FlexLayout';
import { DatasetsDeprecationWarning } from '../datasets/DatasetsDeprecationWarning';
import { mixpanel } from '../mixpanel';
import { DatasetsDeprecationWarningDismissEvent, Locations } from '../mixpanel/types';

export enum BrowserTab {
  LocalTab = 'local',
  OtherProjects = 'otherprojects',
  GitRepos = 'gitrepos'
}

export type TabChangeHandler = NavTabsProps['onChange'];

const defaultTableChangeHandler: TabChangeHandler = (focusedKey: string) => {
  window.location.hash = `#${focusedKey}`;
};

export type Props = LocalTabProps & GitRepositoriesViewProps & ProjectImportsProps & {
  focusedTab: BrowserTab;
  handleTabChange?: TabChangeHandler;
  projectId: string;
  projectVisibility: string;
  isGitBasedProject: boolean;
  gitCredentials: GitCredential[];
  allCredentialMappings: CredentialRepoMapping[];
  enableExternalDataVolumes?: boolean;
  permissions: FilesPermissions;
};

const StyledAlert = styled(Alert)`
  &.ant-alert.ant-alert-no-icon {
    background-color: ${colors.riverBed};
    padding: ${themeHelper('paddings.medium')} ${themeHelper('margins.medium')};
    border: none;
    border-radius: 0;
    .anticon-close {
      color: ${colors.coldPurple};
    }
  }
`;
const BannerHeader = styled.div`
  color: ${colors.athensGrey};
  font-size: 18px;
  margin-bottom: 10px;
`;
const BannerText = styled.div`
  color: ${colors.btnGrey};
  font-size: ${themeHelper('fontSizes.medium')};
  margin-bottom: 10px;
`;
const StyledHelpLink = styled(HelpLink)`
  color: ${colors.cornFlower};
`;

const SectionTitle = styled.div`
  height: 24px;
  width: 86px;
  color: #484848;
  font-family: Roboto;
  font-size: 20px;
  letter-spacing: 0.93px;
  line-height: 24px;
  margin-bottom: 20px;
`;

const DeprecationWarningConatiner = styled.div`
  .deprecation-warning {
    margin: 16px 14px;
    width: 96%;
  }
`;

const onDismissWarning = () => {
  getCurrentUser({}).then((user: DominoCommonUserPerson) => {
    const { userName } = user;
    mixpanel.track(() =>
    new DatasetsDeprecationWarningDismissEvent({
      user: userName,
      location: Locations.DatasetsDeprecationWarning
    })
  );
  }).catch((err) => console.warn(err));
};

const ProjectFileBrowserView: React.FC<Props> = ({
  projectImportsIsEmpty,
  addDependencyEndpoint,
  runTaggingEnabled,
  importedProjects,
  areReferencesCustomizable,
  csrfToken,
  ownerUsername,
  projectName,
  repositories,
  noRepos,
  projectType,
  hideLearnMoreOnFile,
  focusedTab,
  breadcrumbData,
  areDataProjectsEnabled,
  isAnalyticProject,
  downloadCLIPageEndpoint,
  headCommitCreatedAt,
  previousDirectoryUrl,
  relativePath,
  commitsNonEmpty,
  thisCommitId,
  headCommitId,
  rows,
  allowFolderDownloads,
  projectSizeBytes,
  suggestDatasets,
  runNumberForCommit,
  commitsRunLink,
  selectedRevision,
  showUploadComponentOnStart,
  maxUploadFiles,
  maxUploadFileSizeInMegabytes,
  handleTabChange = defaultTableChangeHandler,
  projectId,
  projectVisibility,
  isGitBasedProject,
  gitCredentials : allCredentials,
  allCredentialMappings,
  enableExternalDataVolumes,
  permissions
}) => {
  const [credentialMapState, setCredentialMapState] = React.useState(
    // turn CredentialRepoMapping[] into a flat object of repoId: credentialId
    allCredentialMappings.reduce((result, {repoId, credentialId}) => {
      result[repoId] = credentialId; return result;
    }, {})
  );

  const getCredentialForRepo = (repoId: string) => credentialMapState[repoId];

  const handleRepoCredentialsChange = (newCredentialsId: string,
                                       repoId: string) => {
    onGitCredentialsChange(newCredentialsId, repoId, projectId, credentialMapState, setCredentialMapState);
  };

  const introBannerPersistenceId = 'hide-artifacts-intro-banner';
  const removeHeader = () => {
    try {
      localStorage.setItem(introBannerPersistenceId, 'true');
    } catch (err) {
      console.error(err);
    }
  };

  const downloadSelectedEntitiesEndpoint = getDownloadSelectedEntitiesEndpoint(ownerUsername, projectName, relativePath, thisCommitId)
  const downloadProjectFolderAsZipEndpoint = getDownloadProjectFolderAsZipEndpoint(ownerUsername, projectName, thisCommitId)

  return (
    <>
      <DeprecationWarningConatiner>
        <DatasetsDeprecationWarning onChangeUserChoice={() => onDismissWarning()} />
      </DeprecationWarningConatiner>
      {
        isGitBasedProject &&
        <div>
          {
            !(localStorage.getItem(introBannerPersistenceId)) && (
              <StyledAlert
                message={(
                  <FlexLayout justifyContent="flex-start" itemSpacing={30} flexWrap="nowrap">
                    <div>
                      <LearnGraphicIcon />
                    </div>
                    <div>
                      <BannerHeader>
                        Introducing Artifacts
                      </BannerHeader>
                      <BannerText>
                      Artifacts are results or products from your research, like plots, charts,
                      serialized models, and reports.
                      </BannerText>
                      <StyledHelpLink
                        text="Learn more at our docs"
                        articlePath={SUPPORT_ARTICLE.GBP__WORKING_WITH_ARTIFACTS}
                        showIcon={false}
                        basePath={HELP_PREFIX}
                      />
                    </div>
                  </FlexLayout>
                )}
                closable={true}
                onClose={removeHeader}
              />
            )
          }
        </div>
      }
      <FileBrowserAppContent atOldFilesVersion={atOldFilesVersion(thisCommitId, headCommitId)}>
        <React.Fragment>
          {isGitBasedProject && <SectionTitle>Artifacts</SectionTitle>}
          <NavTabs defaultActiveKey={focusedTab} onChange={handleTabChange}>
            <NavTabPane
              key={BrowserTab.LocalTab}
              title="Local"
            >
              <FilesBrowserTable
                createFolderEndpoint={
                  getCreateFolderEndpoint(ownerUsername, projectName)
                }
                breadcrumbData={breadcrumbData}
                successfulFilesRemovalEndpoint={
                  getSuccessfulFilesRemovalEndpoint(ownerUsername, projectName, relativePath)
                }
                createDatasetFromProjectEndpoint={
                  getCreateDatasetFromProjectEndpoint(ownerUsername, projectName)
                }
                areDataProjectsEnabled={areDataProjectsEnabled}
                isAnalyticProject={isAnalyticProject}
                userIsAllowedToEditProject={permissions.canEdit}
                createFileEndpoint={
                  getCreateFileEndpoint(ownerUsername, projectName, relativePath)
                }
                downloadSelectedEntitiesEndpoint={downloadSelectedEntitiesEndpoint}
                downloadCLIPageEndpoint={downloadCLIPageEndpoint}
                downloadProjectFolderAsZipEndpoint={downloadProjectFolderAsZipEndpoint}
                headRevisionDirectoryLink={
                  getHeadRevisionDirectoryLink(ownerUsername, projectName, relativePath)
                }
                headCommitCreatedAt={headCommitCreatedAt}
                previousDirectoryUrl={previousDirectoryUrl}
                relativePath={relativePath}
                ownerUsername={ownerUsername}
                projectName={projectName}
                csrfToken={csrfToken}
                commitsNonEmpty={commitsNonEmpty}
                thisCommitId={thisCommitId}
                headCommitId={headCommitId}
                rows={rows}
                allowFolderDownloads={allowFolderDownloads}
                canEdit={permissions.canEdit}
                projectSizeBytes={projectSizeBytes}
                suggestDatasets={suggestDatasets}
                revertProjectEndpoint={getRevertProjectEndpoint(ownerUsername, projectName)}
                runNumberForCommit={runNumberForCommit}
                commitsRunLink={commitsRunLink}
                selectedRevision={selectedRevision}
                showUploadComponentOnStart={showUploadComponentOnStart}
                maxUploadFiles={maxUploadFiles}
                maxUploadFileSizeInMegabytes={maxUploadFileSizeInMegabytes}
                uploadEndpoint={getUploadEndpoint(ownerUsername, projectName, relativePath)}
                successfulUploadUrl={getSuccessfulUploadUrl(ownerUsername, projectName, relativePath)}
                projectId={projectId}
                projectVisibility={projectVisibility}
                isGitBasedProject={isGitBasedProject}
                enableExternalDataVolumes={enableExternalDataVolumes}
              />
            </NavTabPane>
            <NavTabPane
              key={BrowserTab.OtherProjects}
              title="Other Projects"
            >
              <ImportArtifactsFromProjectView
                ownerUsername={ownerUsername}
                projectName={projectName}
                userIsAllowedToChangeProjectSettings={permissions.canChangeProjectSettings}
                projectImportsIsEmpty={projectImportsIsEmpty}
                csrfToken={csrfToken}
                addDependencyEndpoint={addDependencyEndpoint}
                runTaggingEnabled={runTaggingEnabled}
                importedProjects={importedProjects}
              />
            </NavTabPane>
            {
              !isGitBasedProject &&
              <NavTabPane
                key={BrowserTab.GitRepos}
                title="Git Repositories"
              >
                <GitCredentialsContext.Provider value={{ allCredentials, getCredentialForRepo }}>
                  <ProjectIdContext.Provider value={projectId}>
                    <GitRepositoriesView
                      areReferencesCustomizable={areReferencesCustomizable}
                      csrfToken={csrfToken}
                      ownerUsername={ownerUsername}
                      projectName={projectName}
                      isGitBasedProject={isGitBasedProject}
                      repositories={repositories}
                      noRepos={noRepos}
                      projectType={projectType}
                      hideLearnMoreOnFile={hideLearnMoreOnFile}
                      onCredentialSelect={handleRepoCredentialsChange}
                      userIsAllowedToEditProject={permissions.canEdit}
                    />
                  </ProjectIdContext.Provider>
                </GitCredentialsContext.Provider>
              </NavTabPane>
            }
          </NavTabs>
        </React.Fragment>
      </FileBrowserAppContent>
    </>
  );
};

export default ProjectFileBrowserView;
