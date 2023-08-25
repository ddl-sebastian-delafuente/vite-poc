import * as React from 'react';
import { Tooltip } from 'antd';
import WarningBox from '../../../components/WarningBox';
import { AccountSettingsExternalLink } from '../../../filebrowser/gitRepoUtil';

const missingCredentialWarningText = `You may not have access to the repository due to missing credentials.
  To gain access, add valid credentials in your account settings and associate them with this repository.
  Git credentials are never shared across collaborators. `;

const RepoCredentialsWarning: React.FC = () => (
  <WarningBox className="warning-box">
    <Tooltip placement="rightTop" title={missingCredentialWarningText}>
      <strong> Missing Repository Credentials </strong>
    </Tooltip>
    {AccountSettingsExternalLink}
  </WarningBox>
);
RepoCredentialsWarning.displayName = 'RepoCredentialsWarning';

export default RepoCredentialsWarning;
