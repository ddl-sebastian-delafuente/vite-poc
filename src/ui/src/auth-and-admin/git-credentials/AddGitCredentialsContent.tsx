import * as React from 'react';
import {
  getErrorMessage,
} from '../../utils/sharedComponentUtil';
import FormattedForm, { InputSpec, FormattedFormInputValues } from '../../components/FormattedForm';
import {
  equals,
  union
} from 'ramda';
import styled from 'styled-components';

const defaultAccessTypes: { value: any; label: string }[] = [
  { value: 'key', label: 'Private SSH Key (RSA, DSA, or ECDSA)' }
];

const StyledLabel = styled.div`
  line-height: 16px;
  font-weight: bold;
`;

export class GitCredentialsModifyForm extends FormattedForm {
  validate = (values: FormattedFormInputValues, _ignoreNils = false) => {
    if (!values.hasOwnProperty('refdetails')) {
      values.refdetails = null;
    }
    return this.validateAll(values, false) as React.ReactNode[];
  }

  getErrorMessage(error: any) {
      return getErrorMessage(error);
  }
}

export type Props = {
  onSubmit?: any;
  onClose?: () => void;
  repoName?: string;
  url?: string;
  defaultReference?: string;
  user: any;
  gitServiceProviders?: any;
};

const AddGitCredentialsContent = ({
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user,
  gitServiceProviders,
  ...rest
}: Props) => {
  const [accessTypes, setAccessTypes] = React.useState(defaultAccessTypes);

  const baseFields = [
    [{
      inputType: 'input',
      inputOptions: {
        key: 'name',
        className: 'nickname',
        label: "Nickname",
        name: 'nickname',
        ariaLabel: 'Nickname',
        validated: true,
        validators: [
          {
            checker: (value?: string) => !value,
            errorCreator: () => "Please input a nickname.",
          }
        ],
      },
    }],
    [{
      inputType: 'select',
      inputOptions: {
        key: 'gitServiceProvider',
        className: 'gitServiceProvider',
        label: 'Git Service Provider',
        name: 'gitServiceProvider',
        ariaLabel: 'Git Service Provider',
        options: gitServiceProviders,
        validated: true,
        validators: [
          {
            checker: (value?: string) => !value,
            errorCreator: () => "Please input a git service provider.",
          }
        ],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onValuesUpdate: (value: any, context: any, values: any) => {
          const tokenGitHubAccessTypes: { value: any; label: string }[] = [
            { value: 'token', label: 'Personal Access Token' },
            { value: 'key', label: 'Private SSH Key (RSA, DSA, or ECDSA)' }
          ];

          const passwordAccessTypes: { value: any; label: string }[] = [
            { value: 'password', label: 'App Password' },
            { value: 'key', label: 'Private SSH Key (RSA, DSA, or ECDSA)' }
          ];

          const usernamePatAccessTypes: {value: any; label: string }[] = [
            { value: 'password', label: 'Personal Access Token' },
            { value: 'key', label: 'Private SSH Key (RSA, DSA, or ECDSA)' }
          ]

          const allAccessTypes: { value: any; label: string }[] = union(tokenGitHubAccessTypes, passwordAccessTypes);

          if (
            (
              value === "github" ||
              value === "githubEnterprise" ||
              value === "gitlab" ||
              value === "gitlabEnterprise"
            )  &&
            !equals(
              JSON.stringify(accessTypes), JSON.stringify(tokenGitHubAccessTypes)
            )
          ) {
            if (value === "githubEnterprise" || value === "gitlabEnterprise") {
              context.updateWithNewValues({accessType: "", domain: ""}, false)
            } else {
              context.updateWithNewValues({accessType: ""}, false)
            }
            setAccessTypes(tokenGitHubAccessTypes)
          } else if (
            (
              value === "bitbucket"
            ) &&
            !equals(
              JSON.stringify(accessTypes), JSON.stringify(passwordAccessTypes)
            )
          ) {
            context.updateWithNewValues({accessType: ""}, false)
            setAccessTypes(passwordAccessTypes)
          } else if (
            (
              value === "bitbucketServer"
            ) &&
            !equals(
              JSON.stringify(accessTypes), JSON.stringify(usernamePatAccessTypes)
            )
          ) {
            context.updateWithNewValues({accessType: "", domain: ""}, false)
            setAccessTypes(usernamePatAccessTypes)
          } else if (
            (
              value === "unknown"
            ) &&
            !equals(
              JSON.stringify(accessTypes), JSON.stringify(allAccessTypes)
            )
          ) {
            context.updateWithNewValues({accessType: "", domain: ""}, false)
            setAccessTypes(allAccessTypes)
          }
          return {
            formGroupStyle: {}
          };
        },
      },
    },
    {
      inputType: 'input',
      inputOptions: {
        key: 'domain',
        className: 'domain',
        label: 'Domain',
        name: 'domain',
        ariaLabel: 'Domain',
        validated: true,
        validators: [
          {
            checker: (value: string, context: any, values: any) =>
            {
              if (
                values.gitServiceProvider &&
                (
                  values.gitServiceProvider === 'githubEnterprise' ||
                  values.gitServiceProvider === 'gitlabEnterprise' ||
                  values.gitServiceProvider === 'bitbucketServer' ||
                  values.gitServiceProvider === 'unknown'
                )
              ) {
                return !value;
              } else {
                return false;
              }
            },
            errorCreator: () => "Please input a domain.",
          }
        ],
        onValuesUpdate: (value: any, context: any, values: any) => {
          if (
            values.gitServiceProvider &&
            (
              values.gitServiceProvider === 'githubEnterprise' ||
              values.gitServiceProvider === 'gitlabEnterprise' ||
              values.gitServiceProvider === 'bitbucketServer' ||
              values.gitServiceProvider === 'unknown'
            )
          ) {
            return {
              formGroupStyle: { display: '' },
            };
          } else {
            return {
              formGroupStyle: { display: 'none' },
            };
          }
        },
      },
    }],
    [{
      inputType: 'select',
      inputOptions: {
        key: 'accessType',
        className: 'accessType',
        label: 'Access Type',
        name: 'accessType',
        ariaLabel: 'Access Type',
        options: accessTypes,
        validated: true,
        validators: [
          {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            checker: (value: any, context: any, values: any) => !value,
            errorCreator: () => "Please input an access type.",
          }
        ],
      },
    },
    {
      inputType: 'input',
      inputOptions: {
        key: 'token',
        className: 'token',
        label: 'Personal Access Token',
        name: 'token',
        ariaLabel: 'Personal Access Token',
        validated: true,
        validators: [
          {
            checker: (value: any, context: any, values: any) =>
            {
              if (
                values.accessType &&
                values.accessType === 'token'
              ) {
                return !value;
              } else {
                return false;
              }
            },
            errorCreator: () => "Please input a personal access token.",
          }
        ],
        onValuesUpdate: (value: any, context: any, values: any) => {
          if (
            values.accessType &&
            values.accessType === 'token'
          ) {
            return {
              formGroupStyle: {}
            };
          } else {
            return {
              formGroupStyle: { display: 'none' },
            };
          }

        },
      },
    },
    {
      inputType: 'input',
      inputOptions: {
        key: 'username',
        className: 'username',
        label: 'Username',
        name: 'username',
        ariaLabel: 'Username',
        validated: true,
        validators: [
          {
            checker: (value: any, context: any, values: any) =>
            {
              if (
                values.accessType &&
                values.accessType === 'password'
              ) {
                return !value;
              } else {
                return false;
              }
            },
            errorCreator: () => "Please input a username.",
          }
        ],
        onValuesUpdate: (value: any, context: any, values: any) => {
          if (
            values.accessType &&
            values.accessType === 'password'
          ) {
            return {
              formGroupStyle: {}
            };
          } else {
            return {
              formGroupStyle: { display: 'none' },
            };
          }
        },
      },
    },
    {
      inputType: 'input',
      inputOptions: {
        key: 'password',
        className: 'password',
        label: 'Password',
        name: 'password',
        ariaLabel: 'Password',
        validated: true,
        validators: [
          {
            checker: (value: string, context: any, values: any) =>
            {
              if (
                values.accessType &&
                values.accessType === 'password'
              ) {
                return !value;
              } else {
                return false;
              }
            },
            errorCreator: () => "Please input a password.",
          }
        ],
        onValuesUpdate: (value: any, context: any, values: any) => {
          const labelValue = values.gitServiceProvider == "bitbucketServer" ? "Personal Access Token" : "Password";
          const label = <StyledLabel>{labelValue}</StyledLabel>;
          if (
            values.accessType &&
            values.accessType === 'password'
          ) {
            return {
              label,
              formGroupStyle: {}
            };
          } else {
            return {
              label,
              formGroupStyle: { display: 'none' },
            };
          }

        },
      },
    },
    {
      inputType: 'textField',
      inputOptions: {
        key: 'key',
        className: 'key',
        label: 'Private SSH Key',
        validated: true,
        name: 'privateSSHKey',
        ariaLabel: 'Private SSH Key',
        validators: [
          {
            checker: (value: string, context: any, values: any) =>
            {
              if (
                values.accessType &&
                values.accessType === 'key'
              ) {
                return !value;
              } else {
                return false;
              }
            },
            errorCreator: () => "Please input a private ssh key.",
          }
        ],
        placeholder: 'The contents of your private key (usually named id_rsa)',
        onValuesUpdate: (value: any, context: any, values: any) => {
          if (
            values.accessType &&
            values.accessType === 'key'
          ) {
            return {
              formGroupStyle: {}
            };
          } else {
            return {
              formGroupStyle: { display: 'none' },
            };
          }

        },
      },
    },
    {
      inputType: 'input',
      inputOptions: {
        key: 'passphrase',
        className: 'passphrase',
        label: 'Passphrase',
        name: 'passphrase',
        ariaLabel: 'Passphrase',
        sublabel: '(optional)',
        validated: false,
        onValuesUpdate: (value: any, context: any, values: any) => {
          if (
            values.accessType &&
            values.accessType === 'key'
          ) {
            return {
              formGroupStyle: {}
            };
          } else {
            return {
              formGroupStyle: { display: 'none' },
            };
          }

        },
      },
    }],
  ] as InputSpec[][];

  return (
    <GitCredentialsModifyForm
      asModal={true}
      fieldMatrix={baseFields}
      onCancel={onClose}
      submitLabel="Save"
      {...rest}
    />
  );
};

export default AddGitCredentialsContent;
