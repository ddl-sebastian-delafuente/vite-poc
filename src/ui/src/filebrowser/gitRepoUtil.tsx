import * as React from 'react';
import * as R from 'ramda';
import parseGitUrl from 'git-url-parse';
import styled from 'styled-components';
import { StyledInfoCircleOutlined as Info } from '@domino/ui/dist/components/Callout/InfoBox';
import {
  forceReload,
  getErrorMessage,
} from '../utils/sharedComponentUtil';
import FormattedForm, { InputType, InputSpec, FormattedFormInputValues } from '../components/FormattedForm';
import HelpLink from '../components/HelpLink';
import { RequestRefType, GitCredential, GitReferenceType } from './types';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import Link from '../components/Link/Link';
import ExternalLink from '../icons/ExternalLink';
import { routes } from '../navbar/routes';
import WarningBox from '../components/WarningBox';

const AccountSettingsExternalLinkContainer = styled.div`
  margin: 0;
  padding: 3px 0 3px 0;
`;

const WarningBoxContainer = styled.div`
  line-height: 1.5;
`;

const WarningBoxHeaderContainer = styled.div`
  color: black;
  font-weight: bold;
`;

const StyledParagraph = styled.div`
    margin: 0;
    padding: 0;
`;

const HEAD = 'head';
const BRANCHES = 'branches';
const TAGS = 'tags';
const COMMITID = 'commitId';
const REF = 'ref';

const references: { value: RequestRefType; label: string }[] = [
  { value: HEAD, label: 'Use default branch' },
  { value: BRANCHES, label: 'Branches' },
  { value: TAGS, label: 'Tags' },
  { value: COMMITID, label: 'Commit ID' },
  { value: REF, label: 'Custom Git Ref' },
];

const GitCommitWarning = styled.div`
  margin-left: 25px;
  margin-bottom: 20px;
  color: red;

  span {
    margin-left: 5px;
    font-size: 13px;
    text-align: left;
    position: absolute;
  }

  a {
    font-weight: bold;
  }
`;

function getRefExplainatoryPlaceholder(showingRef: RequestRefType): string {
  switch (showingRef) {
    case TAGS:
      return 'Specify the tag you want to use';

    case COMMITID:
      return 'Specify the commit id you want to use';

    case REF:
      return 'Specify the custom ref you want to use';

    case BRANCHES:
      return 'Specify the branch you want to use';

    default:
      return '';
  }
}

const emptyCredential = {
  id: '',
  name: 'None',
  gitServiceProvider: '',
  domain: '',
  fingerprint: '',
  protocol: ''
} as GitCredential;

function credentialToSelectOption(gitCredential: GitCredential): any {
  const credentialNameAndProtocol =
    (gitCredential.name !== 'None') ? (`${gitCredential.name} (${gitCredential.protocol})`) : gitCredential.name;
  return {
    value: gitCredential.id,
    key: gitCredential.id,
    label: credentialNameAndProtocol,
    itemType: 'option'
  };
}

export function urlInputField(isEditable: boolean) {
  return [[
    {
      inputType: 'input' as InputType,
      inputOptions: {
        key: 'url',
        className: 'url',
        label: 'URI',
        sublabel: '(https or ssh only)',
        disabled: !isEditable,
        validated: true,
        validators: [
          {
            checker: (value: string) => (!isValidUrl(value)),
            errorCreator: () => 'You must provide a valid uri',
          },
        ]
      },
    }
  ]] as InputSpec[][];
}

export function isValidUrl(value: string): boolean {
  // If the url is invalid the new URL object will throw a typeError
  try {
    const url = new URL(value);
    return !!url;
  } catch {
    try {
      // Attempt to convert ssh uri to https url
      const sshUrl = new URL(parseGitUrl(value).toString('https'));
      return !!sshUrl;
    } catch {
      return false;
    }
  }
}

export const repoNameInputField = [[
  {
    inputType: 'input' as InputType,
    inputOptions: {
      key: 'repoName',
      className: 'repoName',
      label: 'Directory Name',
      sublabel: '(optional, defaults to repository name)',
      validated: true,
      validators: [
        {
          checker: (value: string) => (/\s/.test(value)),
          errorCreator: () => 'Directory name cannot contain spaces',
        },
      ]
    },
  },
]] as InputSpec[][];

export const importedReposErrorBox = (hasError: boolean, errorMessage = '') => {
  if (!hasError) {
    return [];
  } else {
    const content = errorMessage ? errorMessage : "Invalid git credentials provided when retrieving git repo.";

    return [[
      {
        inputType: "error",
        inputOptions: {
          key: "git-creds-error",
          className: "git-creds-error",
          content,
          fullWidth: true,
          alternativeIcon: true
        },
      }
    ]] as InputSpec[][];
  }
}

export const importedReposInfoBox = [[
  {
    inputType: "info",
    inputOptions: {
      key: "info",
      content: "New repos can only be accessed in new workspaces.",
      fullWidth: true,
      alternativeIcon: true
    },
  }
]] as InputSpec[][];

export function gitCredentialInputFields(
  gitCredentials: GitCredential[], gitServiceProviders: any[]
) {
  const allCredentials = [emptyCredential].concat(gitCredentials);
  return [
    [
      {
        inputType: 'select' as InputType,
        inputOptions: {
          key: 'gitCredential',
          className: 'gitCredential',
          label: 'Git Credentials',
          getContainer: (trigger: HTMLElement) => trigger.parentElement || document.body,
          options: allCredentials.map(credentialToSelectOption),
          onValuesUpdate: (value: any, context: any, values: any) => {
            if (isValidUrl(values.url)) {
              const url = parseGitUrl(values.url);
              const credentials = [emptyCredential].concat(filterCredentialsByDomain(url.resource, gitCredentials));
              return {
                options: credentials.map(credentialToSelectOption)
              };
            } else {
              return {
                options: allCredentials.map(credentialToSelectOption)
              };
            }
          }
        }
      }
    ], [
      {
        inputType: 'select' as InputType,
        inputOptions: {
          key: 'gitServiceProvider',
          className: 'gitServiceProvider',
          label: 'Git Service Provider',
          ariaLabel: 'Git Service Provider',
          getContainer: (trigger: HTMLElement) => trigger.parentElement || document.body,
          validated: true,
          validators: [
            {
              checker: (value: any) => {
                return !value;
              },
              errorCreator: () => 'Please select a git service provider',
            }
          ],
          options: gitServiceProviders.map(gitServiceProvider => (
            {
              value: gitServiceProvider.value,
              key: gitServiceProvider.value,
              label: gitServiceProvider.label,
              itemType: 'option'
            }
          )),
          onValuesUpdate: (value: any, context: any, values: any) => {
            const service = gitCredentials.find(credential => credential.id === values.gitCredential);
            if (!values.gitCredential || !service || service.gitServiceProvider === 'unknown') {
              return {
                disabled: false,
              };
            } else {
              if (value !== service.gitServiceProvider) {
                context.updateWithNewValues({ gitServiceProvider: service.gitServiceProvider }, false);
              }
              return {
                disabled: true,
                value: service.gitServiceProvider
              };
            }
          }
        },
      }
    ], [
      {
        inputType: 'custom' as InputType,
        inputOptions: {
          key: 'gitCredentialWarning',
          Component: () => (
            <WarningBoxContainer>
              <WarningBox>
                {WarningBoxHeader}
                <StyledParagraph>
                  You may not have access to the repository due to missing credentials.
                  To gain access to a private Git repository, add valid credentials in your account settings
                  and associate them with this repository.
                </StyledParagraph>
                {AccountSettingsExternalLink}
                <span> Git credentials are never shared across collaborators. </span>
              </WarningBox>
            </WarningBoxContainer>
          ),
          onValuesUpdate: (value: any, context: any, values: any) => {
            if (isValidUrl(values.url)) {
              if (gitCredentials.length === 0) {
                return {
                  formGroupStyle: {
                    display: ''
                  }
                };
              }
              const url = parseGitUrl(values.url);
              const credentials = filterCredentialsByDomain(url.resource, gitCredentials);
              return {
                formGroupStyle: {
                  display: (credentials.length === 0) ? '' : 'none'
                }
              };
            } else {
              return {
                formGroupStyle: {
                  display: 'none'
                }
              };
            }
          }
        },
      }
    ]] as InputSpec[][];
}

export const AccountSettingsExternalLink =
  (
    <AccountSettingsExternalLinkContainer>
      <Link
        href={`${routes.LAB.children.ACCOUNT_SETTINGS.path()}#gitIntegration`}
        type="icon-link-end"
        openInNewTab={true}
        icon={<ExternalLink />}
      >
        Account Settings {'>'} Git Credentials
      </Link>
    </AccountSettingsExternalLinkContainer>
  );

export const WarningBoxHeader = <WarningBoxHeaderContainer> Missing Repository Credentials </WarningBoxHeaderContainer>;

export function defaultRefComponents(
  areReferencesCustomizable: boolean,
  defaultMessage?: string,
  onChange?: (gitReferenceDetails: GitReferenceType) => void
) {
  let refComponentDetails: GitReferenceType = {};
  const cantCustomizeRefMessage = defaultMessage || '';
  if (areReferencesCustomizable) {
    return [[
      {
        inputType: 'select',
        inputOptions: {
          key: 'defaultref',
          className: 'defaultref',
          label: 'Git Reference',
          options: references,
          getContainer: (trigger: Element) => trigger.parentElement || trigger.parentNode || document.body,
          onValuesUpdate: (value: string, context: any, values: any) => {
            const refValues = Object.assign({}, context.state.refValues);
            if (value !== context.state.refType && context.state.refValues) {
              values.refdetails = refValues[value];
            }
            refValues[value] = values.refdetails;
            if (context.state.refType !== value) {
              context.setState({ refType: value });
            }
            if (!context.state.refValues || (context.state.refValues[value] !== values.refdetails)) {
              context.setState({ refValues });
            }
            if (value === 'commitId') {
              context.setState({ showAfterFormMessage: true });
            } else {
              context.setState({ showAfterFormMessage: false });
            }
            if (!R.isNil(onChange)) {
              refComponentDetails = {
                ...refComponentDetails,
                defaultRef: values.defaultref,
                refDetails: values.refdetails
              };
              onChange(refComponentDetails);
            }
            return {};
          },
        },
      },
      {
        inputType: 'input',
        inputOptions: {
          key: 'refdetails',
          className: 'refdetails',
          validated: true,
          validators: [
            {
              checker: (value: string, props: any, values: any) => {
                // check if should exist
                if (values.defaultref && values.defaultref !== HEAD) {
                  return !value;
                }
                return false;
              },
              errorCreator: () => 'You must specify a reference',
            },
          ],
          onValuesUpdate: (value: any, context: any, values: any) => {
            if (values.defaultref && values.defaultref !== HEAD) {
              return {
                placeholder: getRefExplainatoryPlaceholder(values.defaultref),
                formGroupStyle: { marginTop: '22px' },
              };
            }

            return {
              formGroupStyle: { display: 'none' },
            };
          },
        },
      },
    ]] as InputSpec[][];
  } else if (cantCustomizeRefMessage) {
    return [[
      {
        inputType: 'text',
        inputOptions: (
          <div className="uncustomizable-refs">
            {cantCustomizeRefMessage}
          </div>
        ),
      }
    ]] as InputSpec[][];
  }

  return [];
}

export const RefStyleWrapper = styled.div`
.row-group {
  display: flex;
  flex-direction: row;
}

.col-group {
  flex-grow: 1;
  align-self: flex-end;
}

.col-group.defaultref {
  flex-basis: 174px;
  flex-grow: 0;
}
`;

export class GitRepoModifyForm extends FormattedForm {

  // Message to be displayed on a 403 forbidden response
  forbiddenMessage = 'Collaborators do not have permissions to change git repo settings on a project';

  afterFormMessage() {
    return (
      <GitCommitWarning>
        <Info style={{ fontSize: '13px' }} />
        <span>
          Warning - Git does not support pushing changes when you checkout a specific commit ID.
          <HelpLink
            articlePath={SUPPORT_ARTICLE.WORKING_FROM_COMMIT_ID}
            text="Learn More"
          />
        </span>
      </GitCommitWarning>
    );
  }

  getErrorMessage(error: any) {
    if (error.response.status === 403) {
      return this.forbiddenMessage;
    } else {
      return getErrorMessage(error);
    }
  }

  validate = (values: FormattedFormInputValues, ignoreNils = true) => {
    // ensure 'refdetails' is present on `values` (even if it's hidden on the form),
    // so that any error state from that field will be properly cleared. DOM-23985
    // eslint-disable-next-line no-prototype-builtins
    if (!values.hasOwnProperty('refdetails')) {
      values.refdetails = null;
    }
    return this.validateAll(values, ignoreNils) as React.ReactNode[];
  }

}

export function returnUserToGitReposTab(ownerUsername: string, projectName: string, isGitBasedProject: boolean) {
  const nextHrefGitBased = `/u/${ownerUsername}/${projectName}/code/imported`;
  const nextHrefLegacy = `/u/${ownerUsername}/${projectName}/browse#gitrepos`;
  if (isGitBasedProject) {
    forceReload(nextHrefGitBased);
  } else {
    forceReload(nextHrefLegacy);
  }
}

export function filterCredentials(serviceProvider: string, gitCredentialList: GitCredential[]) {
  if (serviceProvider === undefined || gitCredentialList === undefined) {
    return gitCredentialList;
  }

  return gitCredentialList.filter(gitC => (gitC.gitServiceProvider === serviceProvider));
}

export function filterCredentialsByDomain(gitRepoDomain: string, gitCredentialList: GitCredential[]) {
  // Note since these credentials are git credentials, if either the gitRepoDomain or gitRepoProtocol are undefined
  // then this means this repo's domain or protocol might be from a git provider with strange formatting of the git
  // repository url, and thus we do not want to filter this out as an option
  if (gitRepoDomain === undefined || gitCredentialList === undefined) {
    return gitCredentialList;
  }
  return gitCredentialList.filter(gitC => (gitC.domain === gitRepoDomain));
}
