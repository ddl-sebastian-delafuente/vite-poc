import * as React from 'react';
import { fireEvent, render, waitFor } from '@domino/test-utils/dist/testing-library';
import AddGitRepoContent from '../AddGitRepoContent';

const allCredentials = [
  {
    'id': 'id',
    'name': 'github1',
    'gitServiceProvider': 'github',
    'domain': 'github.com',
    'fingerprint': 'string',
    'protocol': 'https'
  },
  {
    'id': 'id2',
    'name': 'github2',
    'gitServiceProvider': 'github',
    'domain': 'github.com',
    'fingerprint': 'string2',
    'protocol': 'ssh'
  },
  {
    'id': 'id3',
    'name': 'other',
    'gitServiceProvider': 'unknown',
    'domain': 'test.com',
    'fingerprint': 'string3',
    'protocol': 'https'
  },
  {
    'id': 'id4',
    'name': 'gitlabserver',
    'gitServiceProvider': 'gitlabEnterprise',
    'domain': 'gitlab.workbench-collaborate-team-sandbox.domino.tech',
    'fingerprint': 'string3',
    'protocol': 'https'
  },
  {
    'id': 'id5',
    'name': 'githubEnterprise',
    'gitServiceProvider': 'githubEnterprise',
    'domain': 'github.com',
    'fingerprint': 'string4',
    'protocol': 'https'
  }
];

describe('<AddGitRepoContent />', () => {
  it('should have no creds error by default', async () => {
    const view = render(
      <AddGitRepoContent
        hideLearnMoreOnFile={false}
        areReferencesCustomizable={false}
        onSubmit={() => Promise.resolve()}
        gitServiceProviders={[]}
        gitCredentials={[]}
        hasError={false}
      />
    );

    await waitFor(() => {
      expect(view.baseElement.querySelector('.git-creds-error')).not.toBeTruthy()
    });
  });

  it('should have creds error', async () => {
    const view = render(
      <AddGitRepoContent
        hideLearnMoreOnFile={false}
        areReferencesCustomizable={false}
        onSubmit={() => Promise.resolve()}
        gitServiceProviders={[]}
        gitCredentials={[]}
        hasError={true}
      />
    );

    await waitFor(() => {
      expect(view.baseElement.querySelector('.git-creds-error')).toBeTruthy()
    });
  });

  it('should display all git credentials based on URI', async () => {
    const view = render(
      <AddGitRepoContent
        hideLearnMoreOnFile={false}
        areReferencesCustomizable={false}
        onSubmit={() => Promise.resolve()}
        gitServiceProviders={[]}
        gitCredentials={allCredentials}
        hasError={false}
      />
    );
    fireEvent.change(view.getByDominoTestId('url-field'),{target: {value: 'https://github.com/cerebrotech/bazel-test-repo'}});
    fireEvent.mouseDown(view.getByDominoTestId('gitCredential-field').firstChild!);
    await waitFor(() => expect(view.getByDominoTestId('gitCredential-field').querySelectorAll('.ant-select-item-option')).toHaveLength(4));
  });

});
