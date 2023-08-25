import * as React from 'react';
import styled from 'styled-components';
import { getPrincipal } from '@domino/api/dist/Auth';
import { error as errorToast } from '../components/toastr';
import { themeHelper } from '../styled/themeUtils';
import { FlexLayout } from '../components/Layouts/FlexLayout';
import Table from '../components/Table/Table';
import XButton from '../components/XButton';
import TagRenderer, { HEAD, COMMIT as COMMITID } from './TagRenderer';
import EditRepoButton from './EditRepoButton';
import { returnUserToGitReposTab,
         filterCredentials,
         AccountSettingsExternalLink,
         WarningBoxHeader } from './gitRepoUtil';
import { RefType, RequestRefType, GitRepo, GitCredential } from './types';
import { ExclamationCircleFilled } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'antd';
import { warningBoxIconFill } from '../styled/colors';
import { ProjectIdContext, GitCredentialsContext, getRepositoryIconByProvider, ProviderName } from './util';
import { archiveGitRepo } from '@domino/api/dist/Projects';
import WarningBox from '../components/WarningBox';
import Link from '../components/Link/Link';
import Select from '../components/Select/Select';
import withStore, { StoreProps } from '../globalStore/withStore';
import { getAppName } from '../utils/whiteLabelUtil';

enum Defaults {
  CREDENTIAL_SELECTOR_CONTAINER_ID = 'git-repo-table'
}

const CredentialsContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 75%;
`;

const selectStyle = { width: '100%' };

const StyledErrorIcon = styled.span`
    margin-left: ${themeHelper('margins.small')};
    path {
      fill: ${warningBoxIconFill};
    }
`;

const AvatarContainer = styled.div`
  padding: ${themeHelper('margins.tiny')};
`;

const DetailsContainer = styled.div`
  display: flex;
  padding: 10px 0px;
  height: 100%;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const getRequestRefType = (refType: RefType): RequestRefType => {
  switch (refType) {
    case 'branch':
      return 'branches';
    case 'tag':
      return 'tags';
    default:
      return refType;
  }
};

export type TableRow = {
  repository: {
    repoName: string;
    uri: string;
    domain: string;
    serviceProvider: string;
  },
  credentials: {
    id: string;
    serviceProvider: string;
  }
  location: string;
  reference: {
    refType: RefType;
    refLabel: string;
  },
  remove: {
    repository: GitRepo;
    refType: RefType;
    refLabel: string;
    repoName: string;
    uri: string;
  },
};

export type Props = {
  areReferencesCustomizable: boolean;
  csrfToken: string;
  ownerUsername: string;
  projectName: string;
  isGitBasedProject: boolean;
  projectId: string;
  gitRepos: GitRepo[];
  onCredentialSelect: (credentialId: string | null, repoId?: string) => void;
} & StoreProps;

export type State = {
  isDisabled: boolean;
  reposWithMissingCredentials: Set<string>;
};

export function getCredentialMenuItems(gitCredentialList: GitCredential[]) {
  const { Option } = Select;
  const gitCredentialOptions = gitCredentialList.map(gitCredential => {
    const credentialNameAndProtocol = gitCredential.name + ' (' + gitCredential.protocol + ')';
    return (
      <Option key={gitCredential.id} value={gitCredential.id}> {credentialNameAndProtocol} </Option>
    );
  });
  gitCredentialOptions.push(<Option key="None" value="None"> None </Option>);
  return gitCredentialOptions;
}

export type CredentialCellProps = {
  gitRepoId: string,
  reposWithMissingCredentials: Set<string>,
  setReposWithMissingCredentials: (repoWithMissingCredentials: Set<string>) => void,
  onCredentialSelect: (credentialId: string | null, repoId?: string) => void,
  serviceProvider: string;
};

export const CredentialCell: React.FC<CredentialCellProps> = (props) => {
  const {reposWithMissingCredentials,
         serviceProvider,
         gitRepoId,
         setReposWithMissingCredentials,
         onCredentialSelect} = props;

  return (
    <GitCredentialsContext.Consumer>
    {({allCredentials, getCredentialForRepo}) => {
      const filteredCredentials = filterCredentials(serviceProvider, allCredentials);

      const onSelectGitCredential = (newCredentialId: string) => {
        if (reposWithMissingCredentials.has(gitRepoId)) {
          reposWithMissingCredentials.delete(gitRepoId);
          setReposWithMissingCredentials(reposWithMissingCredentials);
        }

        const responseId = newCredentialId === 'None' ? null : newCredentialId;
        onCredentialSelect(responseId, gitRepoId);
      };

      let defaultChosenCredential = 'None';
      const gitRepoCredentialId = getCredentialForRepo(gitRepoId);
      if (gitRepoCredentialId) {
        const chosenGitCredential = allCredentials.find(gitC => gitC.id === gitRepoCredentialId);
        defaultChosenCredential =
          chosenGitCredential ? (`${chosenGitCredential.name} (${chosenGitCredential.protocol})`) : 'None';
      }

      if (filteredCredentials.length === 0 && !reposWithMissingCredentials.has(gitRepoId)) {
        setReposWithMissingCredentials(reposWithMissingCredentials.add(gitRepoId));
      }

      return (
        <Select
          style={selectStyle}
          defaultValue={defaultChosenCredential}
          onSelect={onSelectGitCredential}
          containerId={Defaults.CREDENTIAL_SELECTOR_CONTAINER_ID}
        >
          {getCredentialMenuItems(filteredCredentials)}
        </Select>);
      }}
    </GitCredentialsContext.Consumer>
  );
};

class GitRepoTable extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      isDisabled: true,
      reposWithMissingCredentials: new Set<string>()
    };
  }

  async componentDidMount () {
    const principal = await getPrincipal({});

    this.setState({isDisabled: principal.isAnonymous});
  }

  renderRepoCell = (repositoryRow: TableRow['repository']) => {
    const {repoName,
           uri,
           serviceProvider} = repositoryRow;
    const RepoIcon = getRepositoryIconByProvider(serviceProvider as ProviderName);
    return (
      <FlexLayout justifyContent="flex-start">
        <AvatarContainer>
          <RepoIcon height={12} width={12}/>
        </AvatarContainer>
        <Tooltip title={uri}>
          <Link
            href={uri}
            isBold={true}
            shouldTruncateAt="60%"
            openInNewTab={true}
          >
            {repoName}
          </Link>
        </Tooltip>
      </FlexLayout>
    );
  }

  renderRefCell = (value: GitRepo) => {
    if (value.refType === HEAD || value.refType === COMMITID) {
      return (
        <DetailsContainer>
          <TagRenderer
            label={value.refLabel}
            tagType="commitId"
          />
        </DetailsContainer>
      );
    }

    return (
      <DetailsContainer>
        <TagRenderer
          label={value.refLabel}
          tagType={value.refType}
        />
      </DetailsContainer>
    );
  }

  archiveRepo = (repository: GitRepo) => {
    const {
      whiteLabelSettings,
      ownerUsername,
      projectName,
      projectId,
      isGitBasedProject
    } = this.props;

    archiveGitRepo({
      projectId,
      repositoryId: repository.id
    }).then(() => {
        returnUserToGitReposTab(ownerUsername, projectName, isGitBasedProject);
      })
      .catch((error: any) => {
        errorToast(
          `${getAppName(whiteLabelSettings)} was unable to archive ${repository.repoName}`,
          this.getErrorMessage(error),
        );
      });
  }

  getErrorMessage(error: any) {
    let message = 'Something went wrong with your request.';

    if (error.message) {
      message = error.message;
    } else if (error.response && error.response.data) {
      message = error.response.data;
    } else if (error.status) {
      message = `${error.status} - ${error.statusText}`;
    }

    return message;
  }

  renderLocationCell = (row: string) => {
    return (
      <DetailsContainer>
        <Location>
          <span>{row}</span>
        </Location>
      </DetailsContainer>
    );
  }

  setReposWithMissingCredentials = (reposWithMissingCredentials: Set<string> ) => {
    this.setState({reposWithMissingCredentials: reposWithMissingCredentials});
  }

  renderCredentialsCell = (credentialRow: TableRow['credentials']) => {
    const {id, serviceProvider} = credentialRow;
    return (
      <CredentialsContainer>
       <CredentialCell
        reposWithMissingCredentials={this.state.reposWithMissingCredentials}
        setReposWithMissingCredentials={this.setReposWithMissingCredentials}
        gitRepoId={id}
        onCredentialSelect={this.props.onCredentialSelect}
        serviceProvider={serviceProvider}
       />
       {this.state.reposWithMissingCredentials.has(id) &&
         <StyledErrorIcon>
           <ExclamationCircleFilled className="warning-box-icon" />
       </StyledErrorIcon>}
      </CredentialsContainer>
    );
  }

  renderRemoveCell = (
    {
      repository,
      refLabel,
      refType,
      uri,
      repoName,
    }: TableRow['remove']
  ) => {
    const {
      areReferencesCustomizable,
      csrfToken,
      ownerUsername,
      projectName,
      isGitBasedProject,
    } = this.props;
    return (
      <FlexLayout>
        {areReferencesCustomizable &&
          <ProjectIdContext.Consumer>
            {value =>
              <EditRepoButton
                defaultRefLabel={refLabel}
                defaultReference={getRequestRefType(refType)}
                url={uri}
                repoName={repoName}
                repoId={repository.id}
                currentGitServiceProvider={repository.serviceProvider}
                csrfToken={csrfToken}
                ownerUsername={ownerUsername}
                projectName={projectName}
                projectId={value}
                isGitBasedProject={isGitBasedProject}
                areReferencesCustomizable={areReferencesCustomizable}
                isDisabled={this.state.isDisabled}
              />
            }
          </ProjectIdContext.Consumer>
        }
        <XButton
          data-test={`Archive${repository.repoName}Button`}
          title="Archive this repo"
          onClick={this.archiveRepo.bind(this, repository)}
          disabled={this.state.isDisabled}
        />
      </FlexLayout>
    );
  }

  getHeaders() {
    return [
      {
        title: 'Repository',
        key: 'repository',
        dataIndex: 'repository',
        render: this.renderRepoCell,
        sorterDataIndex: ['repository', 'repoName']
      },
      {
        title: 'Credentials',
        key: 'credentials',
        dataIndex: 'credentials',
        sorter: false,
        render: this.renderCredentialsCell,
        width: 300,
      },
      {
        title: 'Location',
        key: 'location',
        dataIndex: 'location',
        sorter: false,
        render: this.renderLocationCell,
        width: 400,
      },
      {
        title: 'Reference',
        key: 'reference',
        dataIndex: 'reference',
        render: this.renderRefCell,
        sorterDataIndex: ['reference', 'refLabel'],
      },
      {
        title: '',
        key: 'remove',
        dataIndex: 'remove',
        hideFilter: true,
        sorter: false,
        render: this.renderRemoveCell,
        width: 150,
      },
    ];
  }

  formatRows(): TableRow[] {
    const {
      gitRepos,
    } = this.props;

    return gitRepos.map((repository: GitRepo) => {
      const {
        repoName,
        uri,
        refLabel,
        refType,
        location,
        id,
        domain,
        serviceProvider
      } = repository;

      return {
        repository: {
          repoName,
          uri,
          domain,
          serviceProvider
        },
        credentials: {
          id,
          domain,
          serviceProvider
        },
        location,
        reference: {
          refType,
          refLabel
        },
        remove: {
          refType,
          refLabel,
          repoName,
          uri,
          repository,
          id
        },
      };
    });
  }

  render() {
    return (
    <div>
      {this.state.reposWithMissingCredentials.size > 0 && (
          <WarningBox fullWidth={true}>
            {WarningBoxHeader}
            <span>
              You may not have access to one or more repositories due to missing credentials.
              To gain access, add valid credentials in your account settings and associate them with the
              appropriate repositories.
            </span>
            {AccountSettingsExternalLink}
            <span> Git credentials are never shared across collaborators. </span>
          </WarningBox>
        )
      }
      <Table
        id={Defaults.CREDENTIAL_SELECTOR_CONTAINER_ID}
        data-test="ImportedGitReposTable"
        showSearch={false}
        showPagination={false}
        columns={this.getHeaders()}
        dataSource={this.formatRows()}
        hideRowSelection={true}
        alwaysShowColumns={['repository']}
      />
      </div>
    );
  }
}

export default withStore(GitRepoTable);
