import * as React from 'react';
import axios, { AxiosPromise } from 'axios';
import styled from 'styled-components';
import { EyeFilled } from '@ant-design/icons';
import Table, { ColumnConfiguration, TableProps } from '../components/Table/Table';
import { projectOverviewPage, browseFilesHead } from '../core/routes';
import { removeProjectDependencyUrl } from '../core/legacyApiEndpoints';
import { FlexLayout } from '../components/Layouts/FlexLayout';
import MinimalSelect from '../components/MinimalSelect';
import { AntIconButton } from '../components/IconButton';
import RemoveProjectButton from './RemoveProjectButton';
import ProjectDropdown from './ProjectDropdown';
import { AvailableRelease, ImportedProject } from './types';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import { objectToURLSearchString } from '../utils/searchUtils';

const renderLabel = (label: string) => tooltipRenderer(label, <span>{label}</span>);

export function removeProjectDependency(
  projectUser: string,
  importedProjectName: string,
  csrfToken: string,
  dependencyName: string,
  dependencyId: string,
): AxiosPromise<any> {
  const url = removeProjectDependencyUrl(projectUser, importedProjectName);

  return axios(url, {
    method: 'POST',
    data: objectToURLSearchString({
      csrfToken,
      dependencyName,
      dependencyId,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

const CenteringContainer = ({ children }: { children: React.ReactNode }) => (
  <Centerer>
    <span>
      {children}
    </span>
  </Centerer>
);

const getReleaseOption = (value = '', label: React.ReactNode = 'Latest') => ({
  value,
  label
});

type ReleaseSelectorFormProps = {
  ownerUsername: string;
  projectName: string;
  csrfToken: string;
  row: {
    ownerUsername: string;
    projectName: string;
    availableReleases: AvailableRelease[];
  };
};

const ReleaseSelectorForm = ({
    ownerUsername,
    projectName,
    csrfToken,
    row,
  }: ReleaseSelectorFormProps) => {
  const {
    availableReleases,
  } = row;
  const projectUser = row.ownerUsername;
  const importedProjectName = row.projectName;
  const depName = `${projectUser}/${importedProjectName}`;
  const actionUrl = `/u/${ownerUsername}/${projectName}/dependencies/selectRelease`;
  let defaultValue = '';

  const options = [getReleaseOption('', renderLabel('Latest'))].concat(
  availableReleases.map(({
    releaseId,
    runNumber,
    createdAt,
    runHeading,
    isSelected,
  }) => {
    if (isSelected) {
      defaultValue = releaseId;
    }
    return getReleaseOption(releaseId, renderLabel(`#${runNumber} ${runHeading} ${createdAt}`));
  }));

  const formRef: React.RefObject<HTMLFormElement> = React.createRef();
  const onReleaseSelect = () => {
    if (formRef && formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <form
      action={actionUrl}
      method="POST"
      ref={formRef}
    >
      <input type="hidden" name="dependencyName" value={depName} />
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <MinimalSelect
        name="importedRelease"
        shouldSubmitOnSelect={true}
        noToggleBorder={true}
        defaultValue={defaultValue}
        onChange={onReleaseSelect}
        style={{ width: '100%' }}
      >
        {options}
      </MinimalSelect>
    </form>
  );
};

type ProjectDetails = {
  projects: string[];
  ownerUsername: string;
  projectName: string;
};

type ImportsDetails = {
  isArchived: boolean;
  filesAvailable: boolean;
  packageAvailable: boolean;
  variablesAvailable: boolean;
  isActive: boolean;
};

type ReleaseDetails = {
  ownerUsername: string;
  projectName: string;
  availableReleases: AvailableRelease[];
};

type TableRow = {
  project: ProjectDetails;
  location: string;
  release: ReleaseDetails;
  imports: ImportsDetails;
  remove: {
    isArchived: boolean;
    viewUrl: string;
    ownerUsername: string;
    projectName: string;
    id: string;
  },
};

const getHeaders = (
    runTaggingEnabled: boolean,
    userIsAllowedToChangeProjectSettings: boolean,
    ownerUsername: string,
    projectName: string,
    csrfToken: string,
    handleRemove: (depName: string, id: string) => () => void,
  ): ColumnConfiguration<ProjectDetails>[] => {
  const headers: ColumnConfiguration<ProjectDetails>[] = [{
    title: 'Project',
    key: 'project',
    dataIndex: 'project',
    render: (projectDetails: ProjectDetails) => (
      <ProjectDropdown
        row={projectDetails}
        ownerUsername={ownerUsername}
        projectName={projectName}
        csrfToken={csrfToken}
      />
    ),
    sorter: (a: ProjectDetails, b: ProjectDetails) => {
      const A = `${a.ownerUsername}${a.projectName}`.toLowerCase();
      const B = `${b.ownerUsername}${b.projectName}`.toLowerCase();
      if (A > B) {
        return 1;
      }
      return -1;
    },
  }, {
    title: 'Location',
    key: 'location',
    dataIndex: 'location',
    sorter: false,
    render: (location: string) => (
      <CenteringContainer>
        {location}
      </CenteringContainer>
    ),
  }];

  if (runTaggingEnabled) {
    headers.push({
      title: 'Release',
      key: 'release',
      dataIndex: 'release',
      sorter: false,
      render: (row: ReleaseDetails) => (
        <ReleaseSelectorForm
          row={row}
          ownerUsername={ownerUsername}
          projectName={projectName}
          csrfToken={csrfToken}
        />
      ),
      width: 300,
    });
  }

  headers.push({
    title: 'Imports',
    key: 'imports',
    dataIndex: 'imports',
    sorter: false,
    render: (row: ImportsDetails) => {
      const {
        isArchived,
        filesAvailable,
        packageAvailable,

        variablesAvailable,
        isActive,
      } = row;

      if (isArchived) {
        return (
          <CenteringContainer>
            <div>Archived</div>
          </CenteringContainer>
        );
      } else {
        const imports: React.ReactNodeArray = [];

        if (variablesAvailable) {
          // @ts-ignore
          imports.push(<div key="envvars">Environment variables</div>);
        }

        if (filesAvailable) {
          // @ts-ignore
          imports.push(<div key="files">Files</div>);
        }

        if (packageAvailable) {
          // @ts-ignore
          imports.push(<div key="codepkgs">Code Package</div>);
        }

        if (!isActive) {
          // @ts-ignore
          imports.push(
            <div
              key="notauth"
              className="unauthorized-imports"
            >
              Unauthorized or project has no exports
            </div>
          );
        }

        return (
          <CenteringContainer>
            {imports}
          </CenteringContainer>
        );
      }
    },

  });

  if (userIsAllowedToChangeProjectSettings) {
    headers.push({
      title: '',
      key: 'remove',
      dataIndex: 'remove',
      width: 120,
      sorter: false,
      render: ({ viewUrl, isArchived, ...removeDetails }: any) => (
        <FlexLayout>
          {!isArchived &&
            <AntIconButton data-test="ViewSelectedProjectLink" target="_blank" href={viewUrl}>
              <EyeFilled style={{fontSize: '18px'}} />
            </AntIconButton>
          }
          <RemoveProjectButton
            id={removeDetails.id}
            projectUser={removeDetails.ownerUsername}
            importedProjectName={removeDetails.projectName}
            handleRemove={handleRemove}
          />
        </FlexLayout>
      ),
    });
  }

  return headers;
};

const formatRows = (importedProjects: ImportedProject[]): TableRow[] =>
  importedProjects.map(({
    id,
    projects,
    ownerUsername,
    projectName,
    isActive,
    mountPath,
    isArchived,
    filesAvailable,
    packageAvailable,
    variablesAvailable,
    availableReleases,
  }) => {
    const projectUser = ownerUsername;
    const importedProjectName = projectName;
    const viewUrl = projectOverviewPage(projectUser, importedProjectName);

    return {
      project: {
        ownerUsername,
        projectName,
        projects,
      },
      location: mountPath,
      release: {
        ownerUsername,
        projectName,
        availableReleases,
      },
      imports: {
        isArchived,
        filesAvailable,
        packageAvailable,
        variablesAvailable,
        isActive,
      },
      remove: {
        viewUrl,
        isArchived,
        ownerUsername,
        projectName,
        id,
      },
    };
  });

const getRowClassname = (record: TableRow): string =>
  !record.imports.isActive ? 'inactive-import-row' : '';

const WithImportRowStyles = styled(Table)<TableProps<TableRow>>`
  .inactive-import-row {
    background: #FFFBF2;

    .unauthorized-imports {
        color: #736000;
    }
  }
`;

const Centerer = styled.div`
  padding: 10px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export type Props = {
  ownerUsername: string;
  csrfToken: string;
  userIsAllowedToChangeProjectSettings: boolean;
  runTaggingEnabled: boolean;
  projectName: string;
  importedProjects: ImportedProject[];
};

class OtherProjectsTable extends React.PureComponent<Props> {
  handleRemove = (depName: string, depId: string) => {
    return () => {
      const {
        csrfToken,
        ownerUsername,
        projectName,
      } = this.props;

      removeProjectDependency(
        ownerUsername,
        projectName,
        csrfToken,
        depName,
        depId
      )
        .then(() => {
          const pathWHash = `${browseFilesHead(ownerUsername, projectName)}#otherprojects`;
          const loc = window.location;
          if (`${loc.pathname}${loc.hash}` === pathWHash) {
            loc.reload();
          } else {
            loc.href = pathWHash;
          }
        })
        .catch(error => console.error(error));
    };
  }

  render() {
    const {
      importedProjects,
      runTaggingEnabled,
      userIsAllowedToChangeProjectSettings,
      ownerUsername,
      projectName,
      csrfToken,
    } = this.props;
    return (
      <WithImportRowStyles
        data-test="OtherProjectsTable"
        rowClassName={getRowClassname}
        showPagination={false}
        showSearch={false}
        dataSource={formatRows(importedProjects)}
        columns={getHeaders(
          runTaggingEnabled,
          userIsAllowedToChangeProjectSettings,
          ownerUsername,
          projectName,
          csrfToken,
          this.handleRemove,
        ) as ColumnConfiguration<any>[]}
        hideRowSelection={true}
      />
    );
  }
}

export default OtherProjectsTable;
