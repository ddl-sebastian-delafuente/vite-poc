import * as React from 'react';
import styled from 'styled-components';
import parseGitUrl from 'git-url-parse';
import NavTabs, { NavTabPane } from '../../components/NavTabs/NavTabs';
import { AppContent } from '../../components/Layouts/AppContent';
import { Props as LocalTabProps } from '../../filebrowser/FilesBrowserTable';
import { GitRepositoriesView, Props as GitRepositoriesViewProps } from '../../filebrowser/GitRepositoriesView';
import ProjectGitRepoDetailsGBP from './ProjectGitRepoDetailsGBP';
import {GitCredential, CredentialRepoMapping, RefType, FilesPermissions} from '../../filebrowser/types';
import { ProjectIdContext } from '../../filebrowser/util';
import { BrowserTab, Repository } from '../types/filebrowserTypes';
import RepoDetailsHeader from './RepoDetailsHeader';
import { projectRoutes } from '../../navbar/routes';
import { success as toastrSuccess, error as toastrError } from '../../components/toastr';
import { CodeNavigationContextProvider, useCodeNavigationContext } from './CodeNavigationContext';
import {
  ProjectCodeGitCredentialsContextProvider as GitCredentialsContextProvider,
  LegacyGitCredentialsContextProvider,
  useProjectCodeGitCredentialsContext
} from './ProjectCodeGitCredentialsContextProvider';

const StyledAppContent = styled(AppContent)`
  background: inherit; /* #f9fafc -> from #code-browser-tabs (webapp.css) */
`;

export type Props = LocalTabProps & GitRepositoriesViewProps & {
  projectId: string;
  projectMainRepositoryId: string;
  projectMainRepositoryUri: string;
  projectMainRepositoryDefaultRefType: string;
  projectMainRepositoryDefaultRefValue: string;
  projectMainRepositoryCredentialsId?: string;
  projectMainRepositoryServiceProvider: string;
  gitCredentials: GitCredential[];
  allCredentialMappings: CredentialRepoMapping[];
  permissions: FilesPermissions;
};

/**
 * This component is injected into the page by twirl (code.scala.html).
 * Its job is to provide two tabs, "Project Code Repository" and "Imported Code Repositories",
 * As well as keeping track of the selected credentials for the main repository.
 */
const ProjectCodeView: React.FC<Props> = ({
  areReferencesCustomizable,
  csrfToken,
  ownerUsername,
  projectName,
  repositories,
  noRepos,
  projectType,
  hideLearnMoreOnFile,
  projectId,
  projectMainRepositoryId,
  projectMainRepositoryUri,
  projectMainRepositoryDefaultRefType,
  projectMainRepositoryDefaultRefValue,
  projectMainRepositoryServiceProvider,
  gitCredentials: allCredentials,
  allCredentialMappings,
  permissions
}) => {

  // parse projectMainRepositoryUri into parts
  const parsedRepo = parseGitUrl(projectMainRepositoryUri);
  const mainRepository: Repository = {
    id: projectMainRepositoryId,
    mountDir: '/mnt/code',
    name: parsedRepo.full_name,
    projectId,
    url: parsedRepo.toString('https'),
    refType: projectMainRepositoryDefaultRefType as RefType,
    refLabel: projectMainRepositoryDefaultRefValue
  };

  // absolute link to this page
  const selfLink = projectRoutes.children.CODE.path(ownerUsername, projectName);

  return (
    <StyledAppContent>
      <GitCredentialsContextProvider allCredentials={allCredentials} allCredentialMappings={allCredentialMappings}>
        <CodeNavigationContextProvider selfLink={selfLink}>
          <ProjectCodeNavTabs>
            <NavTabPane key={BrowserTab.MainRepository} title="Project Code Repository">
              <RepoDetailsHeader repository={mainRepository} serviceProvider={projectMainRepositoryServiceProvider}/>
              <ProjectGitRepoDetailsGBP repository={mainRepository} />
            </NavTabPane>
            <NavTabPane key={BrowserTab.ImportedRepositories} title="Imported Code Repositories">
              <ProjectIdContext.Provider value={projectId}>
                <LegacyGitCredentialsContextProvider>
                  <LegacyCredentialsAdapter
                    projectId={projectId}
                    render={handleCredentialsChange =>
                      <GitRepositoriesView
                        areReferencesCustomizable={areReferencesCustomizable}
                        csrfToken={csrfToken}
                        ownerUsername={ownerUsername}
                        projectName={projectName}
                        isGitBasedProject={!!projectMainRepositoryId}
                        repositories={repositories}
                        noRepos={noRepos}
                        projectType={projectType}
                        hideLearnMoreOnFile={hideLearnMoreOnFile}
                        onCredentialSelect={handleCredentialsChange}
                        userIsAllowedToEditProject={permissions.canEdit}
                      />
                    }
                  />
                </LegacyGitCredentialsContextProvider>
              </ProjectIdContext.Provider>
            </NavTabPane>
          </ProjectCodeNavTabs>
        </CodeNavigationContextProvider>
      </GitCredentialsContextProvider>
    </StyledAppContent>
  );
};

// this shim provides a familiar 'handleCredentialsChange' to the GitRepositoriesView component
// we need the shim because in GBP file viewer, we use a different credentials context provider that holds state.
type CredentialsChangeHandler = (credentialId: string | null, repoId?: string) => void;
type RenderPropType = (handleCredentialsChange: CredentialsChangeHandler) => React.ReactElement;
type LegacyCredentialsAdapterProps = { projectId: string, render: RenderPropType };
const LegacyCredentialsAdapter: React.FC<LegacyCredentialsAdapterProps> = ({ projectId, render }) => {
  const { setCredentialForRepo } = useProjectCodeGitCredentialsContext();
  const handleCredentialsChange: CredentialsChangeHandler = async (newCredentialId: string, repoId: string) => {
    try {
      await setCredentialForRepo(projectId, repoId, newCredentialId);
      toastrSuccess(`Git credentials updated.`);
    } catch (e) {
      console.error('Failed to update git credentials.', e);
      toastrError('Failed to update git credentials.');
    }
  };
  return render(handleCredentialsChange);
};

const ProjectCodeNavTabs: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const { activeTab, setActiveTab } = useCodeNavigationContext();
  return (
    <NavTabs defaultActiveKey={BrowserTab.MainRepository} activeKey={activeTab} onChange={setActiveTab}>
      {children}
    </NavTabs>
  );
};

export default ProjectCodeView;
