import * as React from 'react';
import { getPrincipal } from '@domino/api/dist/Auth';
import { FlexLayout } from '../../components/Layouts/FlexLayout';
import ModalWithButton from '../../components/ModalWithButton';
import InfoBox from '../../components/Callout/InfoBox';
import styled from 'styled-components';
import ImportArtifactsFromProjectForm from './ImportArtifactsFromProjectForm';
import { SUPPORT_ARTICLE } from '../../core/supportUtil';
import { ImportedProject } from '../types';
import OtherProjectsTable from '../OtherProjectsTable';
import axios, { AxiosPromise } from 'axios';
import { error } from '../../components/toastr';
import { browseFilesHead } from '../../core/routes';
import { forceReload } from '../../utils/sharedComponentUtil';
import HelpLink from '../../components/HelpLink';
import { objectToURLSearchString } from '../../utils/searchUtils';

export function addDependency(
  addDependencyUrl: string,
  data: {
    dependencyName: string,
    directoryName?: string,
    csrfToken: string
  }
): AxiosPromise<any> {
  return axios(addDependencyUrl, {
    method: 'POST',
    data: objectToURLSearchString(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

const StyledFlexLayout = styled(FlexLayout)`
  width: 100%;
  flex: 1;
  & > div {
    width: 100%
  }
`;

const PaddedStyledFlexLayout = styled(StyledFlexLayout)`
  padding: 0px 20px 20px 0px;
  & > div:first-child {
    font-weight: bold;
    padding-bottom: 6px;
  }
  & > div {
    margin-left: 0px;
  }
`;

export type Props = {
  ownerUsername: string;
  projectName: string;
  userIsAllowedToChangeProjectSettings: boolean;
  projectImportsIsEmpty: boolean;
  csrfToken: string;
  addDependencyEndpoint: string;
  runTaggingEnabled: boolean;
  importedProjects: ImportedProject[];
};

const modalProps = {
  closable: true,
  titleIconName: 'FolderOpenFilled',
  titleText: 'Import a Project',
};

export const ImportArtifactsFromProjectView = ({
    ownerUsername,
    userIsAllowedToChangeProjectSettings,
    projectImportsIsEmpty,
    csrfToken,
    addDependencyEndpoint,
    runTaggingEnabled,
    projectName,
    importedProjects,
  }: Props) => {
  // forceClose is used to tie the cancel button's state in the validated form's footer to the modal state
  const [forceClose, setForceClose] = React.useState(false);
  const [projects, setProjects] = React.useState<ImportedProject[]>([]);
  const [isRestartableWorkspacesEnabled, setIsRestartableWorkspacesEnabled] = React.useState<boolean>(false);

  const handleSubmit = (formData: any) => {
    addDependency(
      addDependencyEndpoint,
      formData
    )
    .then(() => {
      const pathWHash = `${browseFilesHead(ownerUsername, projectName)}#otherprojects`;
      forceReload(pathWHash);
      closeModal();
      // Toast does not appear when page is reloaded
    })
    .catch((e) => {
      closeModal();
      error(e.response.data);
    });
  };
  const closeModal = () => setForceClose(true);
  const resetForceClose = () => setForceClose(false);

  // Resets forceClose so that it can be used again
  React.useEffect(() => {
    if (forceClose) {
      resetForceClose();
    }
  }, [forceClose]);

  React.useEffect(() => {
    setProjects(importedProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      const principal = await getPrincipal({});
      setIsRestartableWorkspacesEnabled(principal.featureFlags.indexOf('ShortLived.EnableRestartableWorkspaces') > -1);
    })();
  }, []);

  return (
    <>
      <FlexLayout
        alignItems="flex-start"
        flexDirection="column"
        data-test="ImportArtifactsFromProjectView"
      >
        <StyledFlexLayout>
          <PaddedStyledFlexLayout
            alignItems="flex-start"
            flexDirection="column"
          >
            <div>
              Import artifacts from other projects
            </div>
            <div>
              This project can view and use files, Environment Variables, and Code Packages from other projects.
              The files are linked from other projects and are read-only.
              You are able to link to different releases using the project dropdown.&nbsp;
              <HelpLink
                text="Learn more about linking projects"
                articlePath={SUPPORT_ARTICLE.PROJECT_DEPENDENCIES}
                showIcon={true}
                iconAfter={true}
              />
            </div>
          </PaddedStyledFlexLayout>
          <ModalWithButton
            showFooter={false}
            openButtonLabel="Import a Project"
            modalProps={modalProps}
            handleCancel={resetForceClose}
            forceClose={forceClose}
            disabled={!projects}
          >
            {() => (
              <ImportArtifactsFromProjectForm
                csrfToken={csrfToken}
                onClose={closeModal}
                handleSubmit={handleSubmit}
              />
            )}
          </ModalWithButton>
        </StyledFlexLayout>
      </FlexLayout>
      {
        isRestartableWorkspacesEnabled ? (
          <InfoBox fullWidth={true}>
            Projects added or removed will only reflect in workspaces
            created from this point forward.
          </InfoBox>
        ) : null
      }
      <FlexLayout>
        <StyledFlexLayout>
        {projectImportsIsEmpty ? (
          <p>Not importing any other projects.</p>
        ) : (
          <OtherProjectsTable
            ownerUsername={ownerUsername}
            csrfToken={csrfToken}
            userIsAllowedToChangeProjectSettings={userIsAllowedToChangeProjectSettings}
            runTaggingEnabled={runTaggingEnabled}
            projectName={projectName}
            importedProjects={projects}
          />
        )}
        </StyledFlexLayout>
      </FlexLayout>
    </>
  );
};

export default ImportArtifactsFromProjectView;
