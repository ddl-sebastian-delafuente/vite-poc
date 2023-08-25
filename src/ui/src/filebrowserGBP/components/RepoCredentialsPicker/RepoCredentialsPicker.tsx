import * as React from 'react';
import styled from 'styled-components';
import { WarningFilled } from '@ant-design/icons';
import useStore from '@domino/ui/dist/globalStore/useStore';
import Select from '@domino/ui/dist/components/Select';
import { filterCredentials } from '../../../filebrowser/gitRepoUtil';
import RepoCredentialsWarning from './RepoCredentialsWarning';
import { useProjectCodeGitCredentialsContext } from '../ProjectCodeGitCredentialsContextProvider';
import { colors, fontSizes,themeHelper } from '../../../styled';
import tooltipRenderer from '../../../components/renderers/TooltipRenderer';

const StyledWarningFilled = styled(WarningFilled)`
  margin-left: ${themeHelper('margins.tiny')};
`;

export type OnSelectFn = (credentialId: string | null) => void;
export type RepoCredentialsPickerProps = {
  repoId: string;
  serviceProvider: string;
  onSelect?: OnSelectFn;
};

const RepoCredentialsPicker: React.FC<RepoCredentialsPickerProps> = ({repoId, serviceProvider, onSelect}) => {
  const {allCredentials, getCredentialForRepo} = useProjectCodeGitCredentialsContext();
  const {formattedPrincipal} = useStore();

  const validCredentials = filterCredentials(serviceProvider, allCredentials);

  if (!formattedPrincipal?.enableGitCredentialFlowForCollaborators &&
    (!validCredentials || validCredentials.length === 0)) { return <RepoCredentialsWarning />; }

  const onSelectWrapped = (newCredentialId: string) => {
    // return null when '_none' is selected. '_none' is a placeholder for react to have a non-null key.
    const responseId = newCredentialId === '_none' ? null : newCredentialId;
    if (typeof onSelect === 'function') { onSelect(responseId); }
  };

  const selectStyle  = {'minWidth': '135px'};
  const selectedRepoId = getCredentialForRepo(repoId);
  return (
    <>
      <Select
        defaultValue={selectedRepoId || '_none'}
        onSelect={onSelectWrapped}
        style={selectStyle}
        className="credentials-picker-dropdown"
        size="small"
      >
        <Select.Option key={'_none'}>None</Select.Option>
        {validCredentials.map(credential => {
          const credentialNameAndProtocol = `${credential.name} (${credential.protocol})`;
          return (
            <Select.Option key={credential.id} value={credential.id} >
              {credentialNameAndProtocol}
            </Select.Option>
          );
        })
        }
      </Select>
      { !selectedRepoId && formattedPrincipal?.enableGitCredentialFlowForCollaborators &&
        tooltipRenderer(
          'Your Git credentials are needed to access this repo. Set up your credentials under Account Settings.',
          <StyledWarningFilled style={{color: colors.tulipTree, fontSize: fontSizes.MEDIUM}}/>
        )}
    </>
  );
};
RepoCredentialsPicker.displayName = 'RepoCredentialsPicker';

export default RepoCredentialsPicker;
