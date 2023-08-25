import * as React from 'react';
import { deleteCredentialMapping, setCredentialMapping } from '@domino/api/dist/Projects';
import { CredentialRepoMapping, GitCredential } from '../../filebrowser/types';
import { GitCredentialsContext } from '../../filebrowser/util';

// this component decouples GBP file viewer from the classic project file viewer.
// it exposes LegacyGitCredentialsContextProvider for compatibility with shared components (imported repo list).

export interface ProjectCodeGitCredentialsHelpers {
  isLoading: boolean;
  allCredentials: GitCredential[];
  getCredentialForRepo: (repoId: string) => string | undefined;
  setCredentialForRepo: (projectId: string, repoId: string, newCredentialsId: string) => Promise<void>;
}
const ProjectCodeGitCredentialsContext = React.createContext<ProjectCodeGitCredentialsHelpers>({
  isLoading: false,
  getCredentialForRepo() { throw Error('getCredentialForRepo must be implemented by a Provider'); },
  setCredentialForRepo() { throw Error('setCredentialForRepo must be implemented by a Provider'); },
  allCredentials: []
});

type Props = {
  allCredentials: GitCredential[];
  allCredentialMappings: CredentialRepoMapping[];
  children?: React.ReactNode;
};
const GitCredentialsContextProvider: React.FC<Props> = ({allCredentials, allCredentialMappings, children}) => {
  const [credentialMapState, setCredentialMapState] = React.useState(
    // turn CredentialRepoMapping[] into a flat object of repoId: credentialId
    allCredentialMappings.reduce((result, {repoId, credentialId}) => {
      result[repoId] = credentialId; return result;
    }, {})
  );
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const getCredentialForRepo = (repoId: string) => credentialMapState[repoId];
  const setCredentialForRepo = async (projectId: string, repoId: string, newCredentialId: string) => {
    const oldCredentialsId = getCredentialForRepo(repoId);
    if (newCredentialId === oldCredentialsId) { return; }
    setLoading(true);
    if (newCredentialId) {
      await setCredentialMapping({ projectId, repoId, body: { credentialId: newCredentialId } });
    } else {
      await deleteCredentialMapping({ projectId, repoId });
    }
    setCredentialMapState({...credentialMapState, [repoId]: newCredentialId});
    setLoading(false);
  };

  const value = {isLoading, getCredentialForRepo, setCredentialForRepo, allCredentials};
  return (
    <ProjectCodeGitCredentialsContext.Provider value={value}>
      {children}
    </ProjectCodeGitCredentialsContext.Provider>
  );
};

const useProjectCodeGitCredentialsContext: () => ProjectCodeGitCredentialsHelpers = () => {
  const context = React.useContext(ProjectCodeGitCredentialsContext);
  if (context === undefined) {
    throw new Error('useProjectCodeGitCredentialsContext must have a ProjectCodeGitCredentialsProvider ancestor.');

  }
  return context;
};

const LegacyGitCredentialsContextProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { allCredentials, getCredentialForRepo } = useProjectCodeGitCredentialsContext();
  return (
    <GitCredentialsContext.Provider value={{allCredentials, getCredentialForRepo}}>
      {children}
    </GitCredentialsContext.Provider>
  );
};

export {
  Props as ProjectCodeGitCredentialsProviderProps,
  GitCredentialsContextProvider as ProjectCodeGitCredentialsContextProvider,
  LegacyGitCredentialsContextProvider,
  useProjectCodeGitCredentialsContext
};
