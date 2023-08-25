// Component to asynchronously load from api and pass to visual layer
import * as React from "react";
import GitCredentialsPanel from './GitCredentialsPanel';
import {
  getGitCredentials,
  getProviderList,
} from '@domino/api/dist/Accounts';
import { currentUser as getCurrentUser } from './../../utils/getUserUtil';
import {
  DominoServerAccountApiGitCredentialAccessorDto,
  DominoCommonUserPerson,
  DominoProjectsApiRepositoriesGitProviderDto as ProjectsGitProvidersDto
} from "@domino/api/dist/types";

const GitCredentialsAPIWrapper = () => {
  const [currentUser, setCurrentUser] = React.useState<DominoCommonUserPerson>();
  const [gitServiceProviders, setGitServiceProviders] = React.useState<ProjectsGitProvidersDto[]>();
  const [gitCredentials, setGitCredentials] = React.useState<DominoServerAccountApiGitCredentialAccessorDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  const addCredential = (newCredential: DominoServerAccountApiGitCredentialAccessorDto) => {
    setGitCredentials((gitCredentials: DominoServerAccountApiGitCredentialAccessorDto[]) =>
      [...gitCredentials, newCredential]);
  };

  const removeCredential = (removedId: string) => {
    setGitCredentials((gitCredentials: DominoServerAccountApiGitCredentialAccessorDto[]) =>
      gitCredentials.filter(c => c.id !== removedId));
  }

  React.useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        if (user) {
          const gitCredentials = await getGitCredentials({userId: user.id});
          const {providers} = await getProviderList({});
          setGitCredentials(gitCredentials);
          setGitServiceProviders(providers);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <GitCredentialsPanel
      currentUser={currentUser}
      gitServiceProviders={gitServiceProviders}
      gitCredentials={gitCredentials}
      loading={loading}
      error={error}
      addCredential={addCredential}
      removeCredential={removeCredential}
    />
  );
};

export default GitCredentialsAPIWrapper;
