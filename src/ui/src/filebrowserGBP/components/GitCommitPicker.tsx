import * as React from 'react';
import Select from '@domino/ui/dist/components/Select';
import { getCommits as getCommits_ } from '@domino/api/dist/Projects';
import { Repository } from '../types/filebrowserTypes';
import { DominoProjectsApiRepositoriesResponsesBrowseCommitShortDto as CommitDto } from '@domino/api/dist/types';
import { useCodeNavigationContext } from './CodeNavigationContext';
import WaitSpinner from '@domino/ui/dist/components/WaitSpinner';
import formatDate from '../../filebrowser/formatDate';
import moment from 'moment';
import styled from 'styled-components';
import { error as toastrError } from '../../components/toastr';
import { fontSizes } from '../..';

export type GitCommitPickerProps = {
  repository: Repository;
  branchName: string;
  selected: CommitDto;
  style?: React.CSSProperties;
};

async function getCommits(projectId: string, repositoryId: string, branch: string | null): Promise<CommitDto[]> {
  const result = await getCommits_({projectId, repositoryId, branch: branch || undefined}) as any;
  const commits = result.data.items as CommitDto[];
  return commits;
}

const GitCommitPicker: React.FC<GitCommitPickerProps> = ({repository, branchName, selected, style}: GitCommitPickerProps) => {
  const {setCommit, clearCommit} = useCodeNavigationContext();

  const [data, setData] = React.useState<CommitDto[]>([]);
  React.useEffect(() => setData([selected]), [selected]);

  const commitsHeaderLabel = `Showing ${data.length} most recent commits on ${branchName}`;

  const handleOpenDropdown = async () => {
    setData([]);
    const {projectId, id: repositoryId} = repository;
    try {
      const commits = await getCommits(projectId, repositoryId, branchName);
      setData(commits);
    } catch (e) {
      console.error('Failed to fetch commits', e);
      toastrError('Failed to fetch commits.');
      setData([selected]);
    }
  };

  const handleSelect = (newSelected: string) => {
    if (newSelected === selected.sha) {
      clearCommit();
    } else {
      setCommit(branchName, newSelected);
    }
  };

  return (
    <Select
      value={selected.sha}
      onDropdownVisibleChange={handleOpenDropdown}
      onSelect={handleSelect}
      optionLabelProp="data-summary"
      notFoundContent={<WaitSpinner />}
      disabled={!branchName}
      style={style}
    >
      <Select.OptGroup label={commitsHeaderLabel}>
      {data.map(commit => (
        <Select.Option
          key={commit.sha}
          title={`${commit.author.name} - ${formatCommitDate(commit)}\n\n${commit.message}`}
          data-summary={(<CommitSummaryStyled commit={commit} />)}
        >
          <CommitEntryStyled commit={commit} />
        </Select.Option>
      ))}
      </Select.OptGroup>
    </Select >
  );
};
GitCommitPicker.displayName = 'GitCommitPicker';

export default GitCommitPicker;

// returns the first 7 characters of a sha-256 string
const formatShort = (sha: string) => sha.substr(0, 7);

const formatCommitDate = (commit: CommitDto) => {
  return moment(new Date(commit.author.date as number)).format('MM/DD/YYYY [at] h:mm A');
};

const CommitSummary: React.FC<{className: string, commit: CommitDto}> = ({className, commit}) => {
  return (
    <div className={className}>
      <span className="author">{commit.author.name} - {formatCommitDate(commit)}</span>
      <span className="sha">{commit.sha.slice(0, 7)}</span>
    </div>
  );
};
const CommitSummaryStyled = styled(CommitSummary).attrs({className: 'blur-on-fetch'})`
display: flex;
.author {
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
}

.sha {
  flex: 0 0 6.5rem;
  padding-left: 1rem;
}`;

const CommitEntry: React.FC<{className?: string, commit: CommitDto}> = ({className, commit}) => (
  <div className={className}>
    <div className="messageContainer">
      <div className="message">{commit.message}</div>
      <div className="sha">{formatShort(commit.sha)}</div>
    </div>
    <div className="authorContainer">
      <div className="authorName">{commit.author.name}</div>
      <div className="authorDate">{formatDate(commit.author.date as number, true)}</div>
    </div>
  </div>
);
export const CommitEntryStyled = styled(CommitEntry)`
  .messageContainer {
    display: flex;
    font-size: ${fontSizes.SMALL};
    line-height: ${fontSizes.MEDIUM};
  }

  .message {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .sha {
    flex: 0 0 6.5rem;
    padding-left: 1rem;
  }

  .authorContainer {
    display: flex;
    font-size: ${fontSizes.TINY};
    line-height: ${fontSizes.SMALL};
    color: #7D7D7D;
  }

  .authorDate::before {
    content: "-";
    margin: 0 0.4rem;
  }
`;
