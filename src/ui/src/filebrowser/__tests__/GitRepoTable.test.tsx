/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import { CredentialCell } from '../GitRepoTable';
import { GitCredentialsContext } from '../util';
import { GitRepo, GitCredential, RefType } from '../types';

const gitCredentials = [
  {
    name: 'credential_name_1',
    id: 'credential_id_1',
    gitServiceProvider: 'github',
    domain: 'github.com',
    protocol: 'https',
    fingerprint: 'fingerprint',
  },
  {
    name: 'credential_name_2',
    id: 'credential_id_2',
    gitServiceProvider: 'githubEnterprise',
    domain: 'github.com',
    protocol: 'ssh',
    fingerprint: 'fingerprint',
  },
  {
    name: 'credential_name_3',
    id: 'credential_id_3',
    gitServiceProvider: 'should not match',
    domain: 'should not match',
    protocol: 'https',
    fingerprint: 'fingerprint',
  }
] as GitCredential[];

const gitRepo1 = {
    id: "dummyId1",
    location: "location",
    repoName: "repoName1",
    domain: "github.com",
    uri: "https://github.com/awesome/awesome-stuff.git",
    refLabel: "refLabel",
    refType: "branch" as RefType,
    serviceProvider: 'github'
  } as GitRepo

const gitRepo2 = {
    id: "dummyId",
    location: "location",
    repoName: "repoName",
    uri: "https://github.com/awesome/awesome-stuff.git",
    refLabel: "refLabel",
    refType: "branch" as RefType,
    serviceProvider: 'githubEnterprise'
  } as GitRepo

const repoCredentialsSet = new Set<string>(["None"]);

const defaultProps = {
  serviceProvider:gitRepo1.serviceProvider,
  gitRepoId:gitRepo1.id,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCredentialSelect: () => {},
  reposWithMissingCredentials: repoCredentialsSet,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setReposWithMissingCredentials: (repoMissingCredentialsId: Set<string>) => {},
};

describe('GitRepoTable Credential Cell', () => {

  it('should filter all the credentials based on service provider', async () => {
    const view = render(
      <GitCredentialsContext.Provider
        value={{
          allCredentials: gitCredentials,
          getCredentialForRepo: () => undefined
        }}
      >
        <CredentialCell {...defaultProps} />
      </GitCredentialsContext.Provider>);
    await userEvent.click(view.getByText('None'));
    expect(view.baseElement.querySelectorAll('.ant-select-item-option')).toHaveLength(2);
  });

  it(`if gitCredential exists in repo, the default value for dropdown should be set to that credential 
    with valid https protocol in parenthesis`, () => {
    const view = render(
      <GitCredentialsContext.Provider
        value={{
          allCredentials: gitCredentials,
          getCredentialForRepo: () => 'credential_id_1'
        }}
      >
        <CredentialCell {...defaultProps}/>
      </GitCredentialsContext.Provider>
    );
    expect(view.baseElement.querySelector('.ant-select-selection-item')?.textContent).toContain('credential_name_1 (https)');
  });

  it(`if gitCredential exists in repo, the default value for dropdown should be set to that credential 
    with valid ssh protocol in parenthesis`, () => {
    const view = render(
      <GitCredentialsContext.Provider
        value={{
          allCredentials: gitCredentials,
          getCredentialForRepo: () => 'credential_id_2'
        }}
      >
        <CredentialCell {...defaultProps}/>
      </GitCredentialsContext.Provider>
    );
    expect(view.baseElement.querySelector('.ant-select-selection-item')?.textContent).toContain('credential_name_2 (ssh)');
  });

  it(`if gitCredential does not exist in repo, the default value for dropdown should be set to None 
    without a protocol in parenthesis`, () => {
    const view = render(
      <GitCredentialsContext.Provider
        value={{
          allCredentials: gitCredentials,
          getCredentialForRepo: () => undefined
        }}
      >
        <CredentialCell {...defaultProps}/>
      </GitCredentialsContext.Provider>
    );
    expect(view.baseElement.querySelector('.ant-select-selection-item')?.textContent?.trim()).toEqual('None');
  });

  it(`should show only ${gitRepo2.serviceProvider} credentials when there is a gitRepo with serviceProvider as ${gitRepo2.serviceProvider}`, async () => {
    const view = render(
      <GitCredentialsContext.Provider
        value={{
          allCredentials: gitCredentials,
          getCredentialForRepo: () => undefined
        }}
      >
        <CredentialCell {...defaultProps} serviceProvider={gitRepo2.serviceProvider}/>
      </GitCredentialsContext.Provider>
    );    
    await userEvent.click(view.getByText('None'));
    expect(view.baseElement.querySelectorAll('.ant-select-item-option')).toHaveLength(2);
  });

  it('if there are no credentials, setIsMissingCredentials should be called', async () => {
    const mockSetMissingCredentials = jest.fn();
    const view = render(
      <GitCredentialsContext.Provider
        value={{
          allCredentials: [],
          getCredentialForRepo: () => undefined
        }}
      >
        <CredentialCell {...defaultProps} setReposWithMissingCredentials={mockSetMissingCredentials}/>
      </GitCredentialsContext.Provider>
    );
    await userEvent.click(view.getByText('None'));
    expect(view.baseElement.querySelectorAll('.ant-select-item-option')).toHaveLength(1);
    expect(mockSetMissingCredentials.mock.calls.length).toEqual(1);
  });

});
