import * as React from 'react';
import * as R from 'ramda';
import { Form } from '@ant-design/compatible';
import { InfoCircleFilled } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { connect } from 'react-redux';
import { FormWrappedProps } from '@ant-design/compatible/lib/form/interface';
import { FormComponentProps, RcBaseFormProps } from '@ant-design/compatible/lib/form/Form';
import { ForkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { colors } from '../styled';
import DataFetcher from '../utils/DataFetcher';
import { UnauthedWarningContent } from './messages/UnauthedWarningContent';
import { projectRoutes } from '../navbar/routes';

import { ExtendedButtonProps } from './Button/Button';
import { sharedFileViewPath } from '../core/routes';
import { RootState } from '../core/reducers/rootReducer';
import { error, success, warning } from './toastr';
import { getPrincipal } from '@domino/api/dist/Auth';
import { forkProject } from '@domino/api/dist/Projects';
import { findProjectByOwnerAndName } from '@domino/api/dist/Gateway';
import { getCurrentUser } from '@domino/api/dist/Users';
import { getErrorMessage } from '../utils/errorUtil';
import {
  DominoCommonUserPerson as User,
  DominoNucleusProjectModelsForkOrCopyProject,
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings
} from '@domino/api/dist/types';
import { isLiteUser } from '@domino/api/dist/Users';
import ModalWithButton from './ModalWithButton';
import Button from './Button/Button';
import tooltipRenderer from './renderers/TooltipRenderer';

// @ts-ignore
import { Omit } from 'antd/lib/_util/type';

export const FORK_DISABLED_MESSAGE = 'Forking is disabled';

const getUserName = (currentUser?: User): string => R.pathOr('', ['userName'], currentUser);

const getUserId = (currentUser?: User): string | undefined => R.pathOr(undefined, ['id'], currentUser);

export const projectPath = (
  ownerName = ':ownerName',
  projectName = ':projectName',
) => {
  return `${projectRoutes.children.OVERVIEW.path(ownerName, projectName)}`;
};

const getSharedFileViewUrl = (filePath: string) => (userName: string, projectName: string): string =>
  sharedFileViewPath(userName, projectName, filePath);

const handleNavigation = {
  push: (route: string) => {
    // navigate using the window
    window.location.assign(route);
  },
};

const withSpan = (component: React.ReactNode) => <span>{component}</span>;

const ForkIcon = styled(ForkOutlined)`
  margin-right: 5px;
`;

const BigSecondaryForkButton = (props: ExtendedButtonProps) => (
  <button
    className="btn btn-default btn-sm"
    disabled={props.disabled}
    onClick={props.onClick}
  >
    <ForkIcon />
    Fork
  </button>
);

export enum ModalType {
  FORK,
  COPY,
  ARCHIVE,
  NONE
}

const ModalTitle = styled.span`
   > * {
    padding-right: 12px;
  }
  .anticon.anticon-warning {
    color: ${colors.rejectRedColor};
  }
`;

const HighlightedProjectName = styled.code`
  color: ${colors.secondaryWarningRed};
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0;
  flex-direction: column;
  .ant-legacy-form-item-label {
    line-height: unset; /* parent's line-height of 1.5715 (22.001px) is applied */
  }
`;

export type Props = {
  forkSubmitButtonLabel?: React.ReactNode;
  onForkSuccess?: (forkName: string) => void;
  defaultModalType?: ModalType;
  ForkButton?: React.ComponentClass<ExtendedButtonProps> | React.FunctionComponent<ExtendedButtonProps>;
  getOnForkSuccessRedirectUrl?: (ownerUsername: string, forkedProjectName: string) => string;
  showForkButton?: boolean;
  project: Project;
  currentUser?: User;
  isAnonymous: boolean;
  history: {
    push: (route: string) => void;
  };
  enablePinProjects?: boolean;
} & FormComponentProps;
type StateProps = {
  displayingModalType: boolean;
  confirmLoading: boolean;
  setDisplayingModalType: (value: boolean) => void;
  setConfirmLoading: (value: boolean) => void;
  whiteLabelSettings?: WhiteLabelSettings;
};

type EnhancedViewProps = Props & StateProps;
const getForkModalAttrs = (newProjName: string, newOwnerId: string | undefined, baseProj: Project) => {
  // Retaining existing functionality
  const requestBody = {
    name: newProjName,
    visibility: 'Private',
    description: baseProj.description,
    ownerId: newOwnerId,
    collaborators: [],
    tags: {
      tagNames: baseProj.tags.map(t => t.name)
    }
  } as DominoNucleusProjectModelsForkOrCopyProject;

  return {
    title: 'Fork',
    actionName: 'forked',
    icon: 'fork',
    action: () => forkProject({ projectToForkId: baseProj.id, body: requestBody }),
    helpText: ' Forking this project will create a copy of it under your account, so you can modify it as you wish. Your new project will contain the same files as the original project, but it will have none of the execution history. If you have access to the original product\'s compute environment, hardware tier, and environment variables, then your forked project will use those also.'
  }
};

type ValidationResult = {
  projectName: string,
  currentUserName: string;
  actionName: string;
  action: () => Promise<any>;
};

const handleSubmitError = (isAnonymous: boolean, err: any) => {
  if (isAnonymous) {
    warning(<UnauthedWarningContent />, '', 0);
  } else {
    getErrorMessage(err)
      .then(message => error(message))
      .catch(e => console.error(e.message));
  }
};

const _Actions = (props: EnhancedViewProps) => {
  const { project, form, currentUser, onForkSuccess } = props;
  const { getFieldDecorator } = form;
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [liteUser, setLiteUser] = React.useState(true);

  const { helpText } =
    getForkModalAttrs(
      form.getFieldValue('name'),
      getUserId(currentUser),
      project
    ) || { title: '', icon: '', helpText: '' };

  const handleForkButton = async ({
    getOnForkSuccessRedirectUrl,
    form, project, currentUser,
    history, isAnonymous,
  }: EnhancedViewProps) => {
    if (!confirmLoading) {
      const formValidation: Promise<ValidationResult> = new Promise((resolve, reject) => {
        form.validateFields(async (err: any, formObj: any) => {
          if (!err) {
            const projectName = formObj.name;
            const { actionName, action } = getForkModalAttrs(
              projectName,
              getUserId(currentUser),
              project,
            );

            if (currentUser) {
              resolve({
                projectName,
                currentUserName: currentUser.userName,
                actionName,
                action,
              });
            } else {
              reject('Couldn\'t fork project because user is anonymous.');
            }
          } else {
            reject(err);
          }
        });
      });

      const {
        action,
        actionName,
        currentUserName,
        projectName,
      } = await formValidation;
      setConfirmLoading(true);
      return action().then(() => {
        success(`Successfully ${actionName} the project.`);

        if (getOnForkSuccessRedirectUrl) {
          history.push(getOnForkSuccessRedirectUrl(currentUserName, projectName));
        }
        form.resetFields(['name']);
        if (onForkSuccess) {
          onForkSuccess(projectName);
        }
        setConfirmLoading(false);
      }).catch((err) => {
        console.warn('testing', err);
        handleSubmitError(isAnonymous, err);
        setConfirmLoading(false);
      });
    }
  };

  const checkIfUserRoleisliteUser = async () => {
    try {
      const isLiteUserResponse = await isLiteUser({});
      setLiteUser(isLiteUserResponse.isLiteUser);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    checkIfUserRoleisliteUser();
  }, []);

  const isForkDisabled = liteUser;

  return tooltipRenderer(
    isForkDisabled ? FORK_DISABLED_MESSAGE : null,
    withSpan(<ModalWithButton
      ModalButton={Button}
      openButtonProps={{
        isIconOnlyButton: true,
        icon: <ForkOutlined />,
        btnType: "secondary",
        title: 'Fork this Project'
      }}
      modalProps={{
        title: (<ModalTitle>
          <ForkOutlined />
          <span>Fork</span>
          <HighlightedProjectName>{`${project.owner.userName}/${project.name}`}</HighlightedProjectName>
        </ModalTitle>),
        useLoadingButton: true,
        confirmLoading: confirmLoading,
        destroyOnClose: true
      }}
      modalSubmitButtonLabel="Fork"
      modalCancelButtonLabel="Cancel"
      testId="fork-model-button"
      closable={true}
      handleFailableSubmit={() => handleForkButton(props)}
      disabled={isForkDisabled}
    >
      <div>
        <p>
          <InfoCircleFilled />
          {helpText}
        </p>
        <StyledFormItem colon={false} labelAlign="left" label="Name of new project">
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: 'Project name is required.'
            }, {
              pattern: new RegExp(/^\S*$/),
              message: 'Project name cannot have whitespace.'
            }]
          })(
            <Input addonBefore={getUserName(currentUser)} placeholder="Enter a new project name" />
          )}
        </StyledFormItem>
      </div>
    </ModalWithButton>)
  );
}

export {
  RcBaseFormProps,
  FormComponentProps,
};

type ReduxlessPropsWithoutFormProps = Props & { whiteLabelSettings?: WhiteLabelSettings; };
type ReduxlessPropsWithFormProps = FormWrappedProps<any> & ReduxlessPropsWithoutFormProps;

export const Reduxless = (props: ReduxlessPropsWithoutFormProps) => {
  const [displayingModalType, setDisplayingModalType] = React.useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);

  return (
    <_Actions
      {...props}
      displayingModalType={displayingModalType}
      confirmLoading={confirmLoading}
      setDisplayingModalType={setDisplayingModalType}
      setConfirmLoading={setConfirmLoading}
      whiteLabelSettings={props.whiteLabelSettings}
    />
  );
};

type FetcherProps = {
  projectName: string;
  ownerUsername: string;
};
type FetchResult = {
  authorized: boolean;
  project?: Project;
  user?: User;
};
const Fetcher: new () => DataFetcher<FetcherProps, FetchResult> = DataFetcher as any;
const fetchData = async ({
  projectName,
  ownerUsername,
}: FetcherProps): Promise<FetchResult> => {
  const gettingPrincipal = getPrincipal({});
  const gettingProject = findProjectByOwnerAndName({
    ownerName: ownerUsername,
    projectName,
  });
  const gettingUser = getCurrentUser({});

  let principal;
  let project;
  let user;
  try {
    // eslint-disable-next-line
    principal = await gettingPrincipal;
    // eslint-disable-next-line
    project = await gettingProject;
    // eslint-disable-next-line
    user = await gettingUser;
  } catch (error) {
    console.error('Couldn\'t get all data', error);
    if (R.isNil(principal) || R.isNil(project)) {
      warning('Couldn\'t get all data for this page.');
    }
    // eslint-disable-next-line
  } finally {
    const authorized = principal ? !principal.isAnonymous : false;
    // eslint-disable-next-line
    return {
      user,
      project,
      authorized,
    };
  }

};

export type SingletonForkProjectActionsProps = {
  path: string;
  project: Project;
  user?: User;
  authorized: boolean;
  disabled?: boolean;
  onForkSuccess?: (forkName: string) => void;
  defaultModalType?: ModalType;
  forkSubmitButtonLabel?: React.ReactNode;
  getRedirectSuccessUrl?: (path: string) => (userName: string, projectName: string) => string;
  ForkButton: React.ComponentClass<ExtendedButtonProps> | React.FunctionComponent<ExtendedButtonProps>;
  showForkButton: boolean;
};
export const SingletonForkProjectActions = ({
  path,
  project,
  user,
  authorized,
  getRedirectSuccessUrl,
  ForkButton,
  showForkButton,
  onForkSuccess,
  defaultModalType,
  forkSubmitButtonLabel,
}: SingletonForkProjectActionsProps) => {
  return (
    <ReduxlessWithForm
      ForkButton={ForkButton}
      getOnForkSuccessRedirectUrl={
        getRedirectSuccessUrl ?
          getRedirectSuccessUrl(path) :
          undefined
      }
      showForkButton={showForkButton}
      project={project}
      currentUser={user}
      isAnonymous={!authorized}
      history={handleNavigation}
      onForkSuccess={onForkSuccess}
      defaultModalType={defaultModalType}
      forkSubmitButtonLabel={forkSubmitButtonLabel}
    />
  );
};

export type ForkProjectActionsWithStateProps = {
  projectName: string;
  ownerUsername: string;
  path: string;
  getRedirectSuccessUrl: (path: string) => (userName: string, projectName: string) => string;
  ForkButton: React.ComponentClass<ExtendedButtonProps> | React.FunctionComponent<ExtendedButtonProps>;
  showForkButton: boolean;
};

export type SingletonForkActionComponent =
  React.ComponentClass<SingletonForkProjectActionsProps> |
  React.FunctionComponent<SingletonForkProjectActionsProps>;

export function withForkActionState(
  ActionComponent: SingletonForkActionComponent
): React.FunctionComponent<ForkProjectActionsWithStateProps> {
  return (props: ForkProjectActionsWithStateProps) => (
    <Fetcher
      initialChildState={{
        authorized: false
      }}
      fetchData={fetchData}
      {...props}
    >
      {({ project, authorized, user }: FetchResult, loading: boolean) => {
        if (!project) {
          return null;
        } else {
          return (
            <ActionComponent
              disabled={loading}
              {...props}
              project={project}
              authorized={authorized}
              user={user}
            />
          );
        }
      }}
    </Fetcher>
  );
}

export const ForkProjectActionsWithState =
  withForkActionState(SingletonForkProjectActions);

export type StatefulForkActionsOuterProps = {
  projectName: string;
  ownerUsername: string;
  path: string;
  getRedirectSuccessUrl?: (path: string) => (userName: string, projectName: string) => string;
};

export const SharedFileViewForkButton = ({
  visible,
  ...props
}: StatefulForkActionsOuterProps & { visible: boolean }) => visible ? (
  <ForkProjectActionsWithState
    {...props}
    ForkButton={BigSecondaryForkButton}
    showForkButton={true}
    getRedirectSuccessUrl={getSharedFileViewUrl}
  />
) : null;

function mapStateToProps(state: RootState) {
  return {
    whiteLabelSettings: state.core.whiteLabelSettings
  };
}

export const ReduxlessWithForm: any = Form.create<ReduxlessPropsWithFormProps>()(Reduxless);

export default Form.create<ReduxlessPropsWithFormProps>()(
  connect<any, any, ReduxlessPropsWithoutFormProps>(mapStateToProps)(Reduxless)
);
