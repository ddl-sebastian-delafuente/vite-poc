import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import gitUrlParse from 'git-url-parse';
import * as R from 'ramda';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiRepositoriesResponsesGetBranchesApiResponse as GetBranchesResponse,
  DominoRepomanDomainGitRepository as Repository
} from '@domino/api/dist/types';
import { getBrowseFiles, getBranches } from '@domino/api/dist/Projects';
import { themeHelper } from '../styled/themeUtils';
import LabelAndValue, { LabelAndValueProps } from '../components/LabelAndValue';
import FlexLayout from '../components/Layouts/FlexLayout';
import { fontSizes, fontWeights, margins, colors } from '../styled';
import Input from '../components/TextInput/Input';
import BranchPicker, { BranchState } from '../components/BranchPicker';
import WaitSpinner from '../components/WaitSpinner';

const Container = styled.div`
  .ant-select-selection, .ant-legacy-form-item-control span input {
    height: 36px;
  }
  .ant-legacy-form-item-label, .ant-legacy-form-item-label {
    line-height: 1;
    height: ${themeHelper('sizes.medium')};
  }
  .ant-legacy-form-item-label {
    margin-bottom: ${themeHelper('margins.tiny')};
  }
  .ant-legacy-form-item-label > label > span {
    display: inline-block;
  }
  .ant-legacy-form-item {
    margin-bottom: 16px;
  }
  .ant-input {
    padding: 10px;
  }
  .ant-legacy-form-explain {
    margin-top: 0;
  }
  && .ant-legacy-form-item-children-icon {
    display: none;
  }
  .ant-col.ant-legacy-form-item-label {
    height: 17px;
  }
  .ant-input-affix-wrapper {
    border: 1px solid #999999 !important;
  }
`;
const RepositoryName = styled.span`
  margin-right: ${themeHelper('margins.small')};
`;

const StyledLabelAndValue = (props: LabelAndValueProps) => (
  <LabelAndValue
    {...props}
    labelStyles={{
      textTransform: 'none',
      color: colors.lightBlackThree,
      marginBottom: margins.TINY,
      lineHeight: 1,
      fontSize: fontSizes.SMALL,
      fontWeight: fontWeights.THICK
    }}
    valueStyles={{
      lineHeight: 1,
      color: colors.greyishBrown,
      fontSize: '13px',
      width: '100%'
    }}
    wrapperStyles={{
      marginBottom: margins.SMALL
    }}
  />
);

interface CodeStepContentProps {
  projectId: string;
  onChangeBranchName: (name: string) => void;
  branchName?: string;
  onChangeCommitId: (id: string) => void;
  commitId?: string;
  project: Project;
}

export const CodeStepContent: React.FC<CodeStepContentProps> = (props) => {
  const { project, projectId, branchName, onChangeBranchName, commitId, onChangeCommitId } = props;
  const parsedRepo = gitUrlParse(project.mainRepository!.uri);
  const mainRepo = R.find(repo => R.equals(repo.id, project.mainRepository!.id), project.enabledGitRepositories || []);

  const [currentBranchName, setCurrentBranchName] = useState<string>(branchName || '');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBrowseFiles = async (projectId: string, repoId: string) => {
    try {
      const response: any = await getBrowseFiles({ projectId, repositoryId: repoId });
      setCurrentBranchName(response.data.summary.ref.branchName);
    } catch (e) {
      console.warn(e)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId && mainRepo && mainRepo.id && (R.isEmpty(currentBranchName) || R.isNil(currentBranchName))) {
      fetchBrowseFiles(projectId, mainRepo.id);
    } else {
      setLoading(false);
    }
  }, [projectId, mainRepo, currentBranchName]);

  useEffect(() => {
    onChangeBranchName(currentBranchName);
  }, [onChangeBranchName, currentBranchName])

  const listBranches = async (inputPattern: string, repo: Repository) => {
    const { projectId } = props;
    const result = (await getBranches({
      projectId,
      repositoryId: repo.id,
      searchPattern: inputPattern
    }) as any).data as GetBranchesResponse;
    const branchResults: string[] = result.items.map((b: { name: string }) => b.name);
    return {
      branches: branchResults,
      totalItems: result.totalItems
    } as BranchState;
  };

  // do not show branch if commitId specified since it is ignored
  const optionalCommitLabel = commitId ? "" : "(optional)";
  const commitLabel = `Commit ${optionalCommitLabel}`;

  return (
    <Container data-test="gbp-code-content">
      <StyledLabelAndValue
        label="Code Repo"
        value={
          <FlexLayout justifyContent="flex-start">
            {
              parsedRepo &&
              <RepositoryName>{parsedRepo.full_name}</RepositoryName>
            }
          </FlexLayout>}
        testId="code-repo"
      />
      {loading ? <WaitSpinner /> : mainRepo != null && !commitId && <StyledLabelAndValue
        label="Branch"
        value={<BranchPicker
          setBranch={onChangeBranchName}
          currentBranchName={branchName || currentBranchName}
          listBranches={(value) => listBranches(value, mainRepo)}
        />}
        testId="code-repo"
      />}
      <StyledLabelAndValue
        label={commitLabel}
        value={
          <Input
            value={commitId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeCommitId(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
            placeholder="Specify the commit id you want to use"
          />
        }
      />


    </Container>
  )
}

export default CodeStepContent;
