import * as React from 'react';
import { getPrincipal } from '@domino/api/dist/Auth';
import HelpLink from '../components/HelpLink';
import InfoBox from '../components/Callout/InfoBox';
import HelpTextPanel from '../components/HelperTextPanel';
import { FlexLayout } from '../components/Layouts/FlexLayout';
import { GitRepo } from './types';
import AddRepoButton from './AddRepoButton';
import GitRepoTable from './GitRepoTable';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import { ProjectIdContext } from './util';

export type Props = {
  areReferencesCustomizable: boolean;
  csrfToken: string;
  ownerUsername: string;
  projectName: string;
  isGitBasedProject: boolean;
  repositories: GitRepo[];
  noRepos: boolean;
  projectType: string;
  hideLearnMoreOnFile: boolean;
  userIsAllowedToEditProject?: boolean;
  onCredentialSelect: (credentialId: string | null, repoId?: string) => void;
};

export const GitRepositoriesView: React.FC<Props> = ({
  noRepos,
  areReferencesCustomizable,
  csrfToken,
  ownerUsername,
  projectName,
  isGitBasedProject,
  repositories,
  hideLearnMoreOnFile,
  onCredentialSelect,
  userIsAllowedToEditProject
}) => {

  const [isRestartableWorkspacesEnabled, setIsRestartableWorkspacesEnabled] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      const principal = await getPrincipal({});
      setIsRestartableWorkspacesEnabled(principal.featureFlags.indexOf('ShortLived.EnableRestartableWorkspaces') > -1);
    })();
  }, []);

  return (
    <>
      <FlexLayout flexWrap="unset" justifyContent="space-between" data-test="ProjectFileBrowserGitRepositoriesView">
        <HelpTextPanel>
          <label>
            Import from external Git repositories
          </label>
          <div data-test="import-from-external-git-repos-info">
            This project can import files from external Git repositories hosted by services like GitHub.
            Newly added or edited repositories will only be reflected in new workspaces to ensure reproducibility. 
            Create a new workspace to access them.
            <HelpLink
              iconAfter={true}
              text="Learn more about repositories."
              articlePath={SUPPORT_ARTICLE.GIT_REPOSITORIES}
            />
          </div>
        </HelpTextPanel>
        <div>
          <ProjectIdContext.Consumer>
            {value =>
              <AddRepoButton
                hideLearnMoreOnFile={hideLearnMoreOnFile}
                ownerUsername={ownerUsername}
                projectName={projectName}
                projectId={value}
                isGitBasedProject={isGitBasedProject}
                csrfToken={csrfToken}
                areReferencesCustomizable={areReferencesCustomizable}
                buttonLabel="Add a New Repository"
                userIsAllowedToEditProject={userIsAllowedToEditProject}
              />
            }
          </ProjectIdContext.Consumer>
        </div>
      </FlexLayout>
      <div>
        {
          isRestartableWorkspacesEnabled ? (
            <InfoBox fullWidth={true}>
              Repositories added or removed will only reflect in workspaces
              created from this point forward.
            </InfoBox>
          ) : null
        }

        {noRepos || !repositories.length ? (
            <FlexLayout>
              <p>Not importing any repositories.</p>
            </FlexLayout>
          ) : (
            <ProjectIdContext.Consumer>
              {value =>
                <GitRepoTable
                  areReferencesCustomizable={areReferencesCustomizable}
                  gitRepos={repositories}
                  ownerUsername={ownerUsername}
                  projectName={projectName}
                  projectId={value}
                  isGitBasedProject={isGitBasedProject}
                  csrfToken={csrfToken}
                  onCredentialSelect={onCredentialSelect}
                />
              }
            </ProjectIdContext.Consumer>
          )
        }
      </div>
    </>
    );
}
;
