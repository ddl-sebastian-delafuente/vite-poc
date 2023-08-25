import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { DDFormItem } from '../../components/ValidatedForm';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import AutoCompleteWithFileSearch from '../../components/AutoCompleteWithFileSearch';
import Link from '../../components/Link/Link';
import ExternalLink from '../../icons/ExternalLink';
import { getRepoName } from '../../utils/common';
import FlexLayout from '../../components/Layouts/FlexLayout';
import { SCHEDULED_JOB_FILE_NAME_HELP_TEXT, JOBS_FILE_NAME_HELP_TEXT } from '../../constants';
import { themeHelper } from '../../styled/themeUtils';
import Select from '../../components/Select/Select';
import { DominoRepomanDomainGitRepository } from '@domino/api/dist/types';

export const MISSING_FILE_OR_COMMAND_MESSAGE =
  'Please input a file name or command for the job (include any required command line arguments).';

const FileNameInputLabel = "File Name or Command"
const FileInputPlaceholder = "eg: train.py --with --args | cmd --with --args"

const FileNameInputLabelWrapper = styled.span`
  border-bottom: 1px dashed #525252;
`;

const FileNameInputWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  height: 32px; // or 2rem
`;

const StyledInput = styled(Input)<InputProps>`
  &.ant-input {
    &::-webkit-input-placeholder {
      font-style: normal;
    }
    border-radius: ${themeHelper('borderRadius.right')}; !important;
  }
`;
const StyledDDFormItem = styled(DDFormItem)`
  margin-bottom: 10px;
  && span.ant-legacy-form-item-children-icon {
    display: none;
  }
  &.git-based-project > .ant-legacy-form-item-label {
    width: 100%;
    line-height: 14px;
  }
  &.git-based-project{
    margin-top: 24px;
    margin-bottom: 20px;
  }
`;

const StyledGitRepoUri = styled.span`
  width: 230px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: end;
`;

const Label: React.FC<{ gitRepoUri?: string, tooltip?: string }> = ({ gitRepoUri, tooltip }) => {
  const [showRepoNameTooltip, setShowRepoNameTooltip] = React.useState<boolean>(false);
  const repoUriRef: React.RefObject<HTMLSpanElement> = React.useRef(null);

  React.useEffect(() => {
    const element = repoUriRef.current;
    if (element) {
      if (element.offsetWidth < element.scrollWidth) {
        setShowRepoNameTooltip(true);
      }
    }
  }, []);

  return (
    <FlexLayout justifyContent="space-between">
      {tooltipRenderer(
        tooltip,
        <FileNameInputLabelWrapper>{FileNameInputLabel}</FileNameInputLabelWrapper>,
        'topLeft'
      )}
      { !R.isNil(gitRepoUri) && Boolean(gitRepoUri)
        && <Link href={gitRepoUri}
          type="icon-link-end"
          icon={<ExternalLink />}
          openInNewTab={true}
        >
          {tooltipRenderer(
            showRepoNameTooltip ? getRepoName(gitRepoUri): '',
            <StyledGitRepoUri ref={repoUriRef}>{getRepoName(gitRepoUri)}</StyledGitRepoUri>)}
        </Link>
      }
    </FlexLayout>
  );
}

export type FileNameInputFormItemProps = {
  projectId: string;
  gitRepoUri?: string;
  enabledGitRepos?: Array<DominoRepomanDomainGitRepository>;
  commandToRun?: string;
  isGitBasedProject?: boolean;
  setCommandToRun: (command: string) => void;
  setCommandToRunPrefix: (data: string) => void;
  onChange?: (data: any) => void;
  ref?: React.RefObject<HTMLDivElement>;
  error?: string;
};

const getOptions = (enabledGitRepos?: DominoRepomanDomainGitRepository[]) => {
  let options: { value: string; label: string; }[] = [];
  options.push({
    value: '',
    label: '/mnt/code'
  });
  enabledGitRepos && enabledGitRepos.slice(0, enabledGitRepos.length - 1).map(repo => {
    options.push({
      value: '/mnt/imported/code/' + repo.name + '/',
      label: '/mnt/imported/code/' + repo.name + '/'
    })
  })
  return options;
}

export const FileNameInputFormItem: React.FC<FileNameInputFormItemProps> = ({
  projectId,
  gitRepoUri,
  enabledGitRepos,
  commandToRun,
  isGitBasedProject,
  ref,
  setCommandToRun,
  setCommandToRunPrefix,
  error,
}) => (
    <StyledDDFormItem
      label={isGitBasedProject ? <Label gitRepoUri={gitRepoUri} tooltip={JOBS_FILE_NAME_HELP_TEXT} /> : FileNameInputLabel}
      error={error}
      className={isGitBasedProject ? "git-based-project" : undefined}
      tooltip={SCHEDULED_JOB_FILE_NAME_HELP_TEXT}
      dashedUnderline={true}
      htmlFor="file_name_or_command_to_run"
    >
      {!R.isNil(isGitBasedProject) && Boolean(isGitBasedProject) ? (
        <>
          <FileNameInputWrapper>
            <Select options={getOptions(enabledGitRepos)}
              defaultValue=""
              style={{ width: '120px' }}
              onChange={data => setCommandToRunPrefix(data)}
              dropdownMatchSelectWidth={300}
            />
            <StyledInput
              placeholder={FileInputPlaceholder}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCommandToRun(event.target.value);
              }}
              data-test="command-to-run-gbp"
              id="file_name_or_command_to_run"
            />
          </FileNameInputWrapper>
        </>
      ) : (
          <AutoCompleteWithFileSearch
            testId="command-to-run"
            projectId={projectId}
            onFieldChange={setCommandToRun}
            defaultValue={commandToRun}
            placeholder={FileInputPlaceholder}
            container={() => ref && ref.current}
            className="auto-complete-file-search"
            customStyleProperties={{ width: '100%', height: '32px' }}
            id="file_name_or_command_to_run"
          />
        )
      }
    </StyledDDFormItem>
  );

export default FileNameInputFormItem;
