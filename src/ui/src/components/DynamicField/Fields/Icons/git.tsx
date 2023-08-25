import * as React from 'react';

import BitBucketLogo from '../../../../icons/BitBucketLogoMark';
import GithubLogo from '../../../../icons/Github';
import GitlabLogo from '../../../../icons/GitLabLogoMark';
import { GitServiceProvider } from '../../../../proxied-api/types';

export const gitServiceProvider = (value: string) => {
  switch(value) {
    case GitServiceProvider.bitbucket:
    case GitServiceProvider.bitbucketServer:
      return BitBucketLogo;
    case GitServiceProvider.gitlab:
    case GitServiceProvider.gitlabEnterprise:
      return GitlabLogo;
    case GitServiceProvider.github:
    case GitServiceProvider.githubEnterprise:
      return GithubLogo;
    default:
      return () => <span/>
  }
}
