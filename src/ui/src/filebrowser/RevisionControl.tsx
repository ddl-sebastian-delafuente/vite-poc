import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Col } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { getWorkspaceById as getWorkspaceByExecutionId } from '@domino/api/dist/Workspaces';
import { getCommitsForProject, listBranchesForProject } from '@domino/api/dist/Files';
import { DominoFilesInterfaceCommitInfo } from '@domino/api/dist/types';
import Select from '@domino/ui/dist/components/Select/Select';
import Link from '../components/Link/Link';
import GitCommit from '../icons/GitCommit';
import { RevisionShape } from './types';
import formatDate from './formatDate';
import * as colors from '../styled/colors';
import { browseFilesFullRef, runDashboardRun } from '../core/routes';
import BranchPicker, { BranchState } from '../components/BranchPicker';
import LabelAndValue from '../components/LabelAndValue';
import withStore, { StoreProps } from '../globalStore/withStore';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';

const noop = () => undefined;
const isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty]);
export enum TestIds {
  RevisionControl = 'revision-control',
  RevisionControlDropdown = 'RevisionControlDropdown',
}

interface OptionalSelectProps {
  width?: string;
}

const StyledSelect = styled(Select)<OptionalSelectProps>`
  &&& {
    width: ${({ width }) => R.isNil(width) ? '100%' : width} !important;
    & > div.ant-select-selector {
      padding: 0;
      padding-right: 25px;
      & > .ant-select-selection-item > div {
        align-items: center;
      }
    }
  }
`;

const ClosedToggleLabel = styled.div`
  padding: 0px 8px;
  display: inline-flex;
  font-weight: bold;
  width: 100%;

  svg {
      flex-shrink: 0;
      margin-right: 5px;
  }

  span, a {
      text-align: left;
      display: inline;
      margin-left: 5px;
  }

  span {
    max-width: 50%;
  }
`;

const Username = styled.span`
  font-weight: bold;
  color: ${colors.darkBluishGrey};
`;

const CommitDateSummary = styled.div`
  margin-left: 5px;
  color: ${colors.darkBluishGrey};
  text-overflow: ellipsis;
  font-weight: normal;
`;

const CommitMessage = styled.span`
  color: ${colors.darkBluishGrey};
  white-space: nowrap;
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CommitHash = styled.span`
  color: ${colors.darkBluishGrey};
  font-weight: bold;
`;

const JobLink = styled.span`
    margin: 0 !important;
    color: #4c89d6;
`;

const DropdownWrapper = styled.div`
  width:80%;
  flex-grow: 1;
  ul.dropdown-menu {
    width: 100%
  }
`;

const labelStyles: React.CSSProperties = {marginBottom: '4px'};

export type Props = {
  width?: string;
  asMessage?: boolean;
  runNumber?: string;
  runLink?: string;
  revision: RevisionShape;
  revisions?: RevisionShape[];
  onChange?: (selection?: RevisionShape) => void;
  id?: string;
  projectId?: string;
  ownerUsername?: string;
  projectName?: string;
  relativePath?: string;
  showBranchPicker: boolean;
} & StoreProps;

export type State = {
  revisions: Array<RevisionShape>;
  loadingRevisions: boolean;
  branch: string;
  branchMap: {[branchName: string]: string};
  runLinkTitle?: string;
};

class RevisionControl extends React.Component<Props, State> {

  static defaultProps = {
    onChange: noop,
    asMessage: false,
    id: TestIds.RevisionControl
  };

  state = {
    revisions: [] as Array<RevisionShape>,
    loadingRevisions: false,
    branch: (new URLSearchParams(window.location.search).get('branch')) || 'master',
    branchMap: {},
    runLinkTitle: undefined
  };

  componentDidMount() {
    const { runLink, runNumber: sourceTypeAndRunNumber, projectId } = this.props;
    if (!R.isNil(sourceTypeAndRunNumber)) {
      if (sourceTypeAndRunNumber.includes('workspace')) {
        if (R.isNil(this.state.runLinkTitle) && !R.isNil(runLink) && !R.isNil(projectId)) {
          const executionId = R.last(R.split('/', runLink)) as string;
          getWorkspaceByExecutionId({ projectId, workspaceId: executionId })
            .then(workspace => this.setState({ runLinkTitle: workspace.title }))
            .catch(err => console.error(`Something went wrong with 'getWorkspaceById' API.`, err.name, err.message));
        }
      } else {
        this.setState({ runLinkTitle: sourceTypeAndRunNumber });
      }
    }

    this.setState({ loadingRevisions: true }, async () => {
      // If revisions are not present in scala templates then fetch them
      if (R.and(isNilOrEmpty(this.state.revisions), R.isNil(this.props.revisions))) {
        try {
          const allRevisions = await this.fetchCommits(this.state.branch);
            this.setState({ revisions: allRevisions });
          } catch (e: any) {
            console.error(e);
          } finally {
            this.setState({ loadingRevisions: false });
          }
      } else if (!R.isNil(this.props.revisions)) { 
        // If revisions are present in scala templates then set the state from props
        this.setState({ revisions: this.props.revisions, loadingRevisions: false });
      }
    });
  }

  setBranchHandler = async (newBranchName: string | null) => {
    if (newBranchName) {
      window.location.href = browseFilesFullRef(
        this.props.ownerUsername!,
        this.props.projectName!,
        newBranchName,
        this.state.branchMap[newBranchName],
        this.props.relativePath
      );
    }
  }

  listBranchesHandler = async (inputPattern: string) => {
    try {
      const branches = await listBranchesForProject({
        projectId: this.props.projectId!,
        query: inputPattern
      });
      const newBranchMap: {[branchName: string]: string} = {};
      branches.forEach(branch => {
        newBranchMap[branch.branchName] = branch.commitId;
      });
      this.setState({
        branchMap: newBranchMap
      });
      return {
        branches: branches.slice(0, 10).map(branch => branch.branchName),
        totalItems: branches.length,
      } as BranchState;
    } catch (e) {
      console.error(e);
      throw 'Error listing branches';
    }
  };

  // Today one half of data is coming through scala template and gitCommits is coming though api
  // so serializing to revisionShape
  serializeToRevisionShape = (branchName: string) => ((commitInfo: DominoFilesInterfaceCommitInfo): RevisionShape => {
    return ({
      runId: commitInfo.commitSourceInfo ? commitInfo.commitSourceInfo.sourceId : '',
      sha: commitInfo.commitId,
      message: commitInfo.commitShortMessage,
      timestamp: commitInfo.commitTime * 1000, // This is epoch, so converting to timestamp
      url: browseFilesFullRef(this.props.ownerUsername!, this.props.projectName!, branchName,
        commitInfo.commitId, this.props.relativePath),
      author: {
        username: commitInfo.committedBy,
      },
      runNumberStr: commitInfo.commitSourceInfo ?
        `${commitInfo.commitSourceInfo.sourceType} #${commitInfo.commitSourceInfo.sourceNumber}` : '',
      runLink: runDashboardRun(commitInfo.commitSourceInfo ? commitInfo.commitSourceInfo.sourceId : '' )(this.props.ownerUsername!, this.props.projectName!),
    });
  })

  fetchCommits = async (branch: string) => {
    const commitInfos = await getCommitsForProject({
      projectId: this.props.projectId!,
      branchName: branch
    });
    const revisions = R.map(this.serializeToRevisionShape(branch), commitInfos);
    return revisions;
  }

  replaceTextWithWhiteLabelledAppName = (replaceString: string) => {
    return replaceWithWhiteLabelling(getAppName(this.props.whiteLabelSettings))(replaceString, false);
  }

  getRevisionMessageLabel(useIconAndLink: boolean, rev?: RevisionShape, runHref?: string) {
    const revision = rev || this.props.revision;
    const runLink = runHref || this.props.runLink;
    const { runLinkTitle } = this.state;
    const selectedRevisionsCommitter = revision.author.username;
    const shortSha = revision.sha.substring(0, 7);
    const formattedDate = formatDate(revision.timestamp);
    const commitMessage = revision.message;
    return (
      <ClosedToggleLabel>
        {useIconAndLink &&
          <GitCommit width={11} height={15} primaryColor={`${colors.clickableBlue}`} />}
        <Username>
          {this.replaceTextWithWhiteLabelledAppName(selectedRevisionsCommitter)}
        </Username>
        <CommitMessage>{` committed `}</CommitMessage>
        <CommitHash title={revision.sha}>{`${shortSha} `}</CommitHash>
        <CommitMessage title={commitMessage}>
          {`"${commitMessage}" `}
        </CommitMessage>
        {useIconAndLink && runLinkTitle && <JobLink>
          <Link href={runLink} openInNewTab={true} title={runLinkTitle}>{runLinkTitle}</Link>
        </JobLink>}
        <CommitDateSummary>
          {`on ${formattedDate}`}
        </CommitDateSummary>
      </ClosedToggleLabel>
    );
  }

  handleSelect = (selection?: RevisionShape) => {
    const { onChange } = this.props;
    if (!R.isNil(onChange)) {
      onChange(selection);
    }
  }

  handleRevisionSelect = (option: DefaultOptionType) => {
    const revision = R.find(revision => R.equals(revision.sha, option.value), this.state.revisions);
    this.handleSelect(revision);
    if (!R.isNil(revision) && !R.equals(this.props.revision, revision)) {
      window.open(revision.url, '_self');
    }
  }

  getRevisionOptions = () => R.map(revision => ({
    value: revision.sha,
    label: this.getRevisionMessageLabel(false, revision)
  }), this.state.revisions);

  render() {
    const {
      id,
      asMessage,
      width,
      showBranchPicker,
      revision
    } = this.props;
    const {
      branch
    } = this.state;

    const value = {
      value: revision.sha,
      label: this.getRevisionMessageLabel(true, revision)
    };

    return (
      <Col
        style={{width: '100%'}}
      >
        {showBranchPicker &&
          <LabelAndValue
            label={'BRANCH'}
            labelStyles={labelStyles}
            value={
              <BranchPicker
                style={{width: 380}}
                currentBranchName={branch}
                setBranch={this.setBranchHandler}
                listBranches={this.listBranchesHandler}
              />
            }
          />
        }
        <LabelAndValue
          label={'COMMIT'}
          labelStyles={labelStyles}
          valueStyles={{
            width: '100%',
            display: 'flex'
          }}
          value={
            <DropdownWrapper data-test={TestIds.RevisionControlDropdown}>
              <StyledSelect
                id={id}
                width={width}
                showArrow={!asMessage}
                showSearch={!asMessage}
                className={TestIds.RevisionControl}
                loading={this.state.loadingRevisions}
                disabled={asMessage || this.state.loadingRevisions}
                onSelect={this.handleRevisionSelect}
                labelInValue={true}
                value={value}
                options={this.getRevisionOptions()}
                getPopupContainer={(trigger: HTMLElement) => trigger.parentElement || document.body}
              />
            </DropdownWrapper>
          }
        />
      </Col>
    );
  }
}

export default withStore(RevisionControl);
