import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../styled';
import { isNil } from 'ramda';
import { LoadingOutlined } from '@ant-design/icons';
import FlexLayout from '../../components/Layouts/FlexLayout';
import { themeHelper } from '../../styled/themeUtils';
import DominoLogo from '../../icons/DominoLogo';
import Error403 from '../../icons/Error403';
import Error404 from '../../icons/Error404';
import Error500 from '../../icons/Error500';
import Link from '../../components/Link/Link';
import { routes } from '../../navbar';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';

export type ApiErrorBody = {
  code: number;
  key: string;
  message: string;
};

const ErrorIconWrapper = styled.div`
  margin: 68px;
  padding: 30px 60px 40px;
  border-right: 1px solid ${colors.btnGrey};
`;

const ErrorCode = styled.h1`
  font-size: ${themeHelper('errorPage.status.fontSize')};
  font-weight: ${themeHelper('fontWeights.bold')};
  color: ${colors.btnGrey};
  margin-bottom: 0;
`;

const ErrorMsg = styled.h5`
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.bold')};
  color: ${colors.btnGrey};
`;

const ErrorDetails = styled.div`
  margin-top: 70px;
`;

const Exclamation = styled.div`
  &, a {
    font-size: ${themeHelper('fontSizes.large')};
  }
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const SlowSpinningDominoLogo = styled(DominoLogo).attrs({
  primaryColor: colors.btnGrey,
  height: 160,
  width: 160
})`
  transform-origin: center center;
  animation: 6s slow-spin ease-in infinite 5s;
  @keyframes slow-spin {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform:rotate(360deg);
    }
    100% {
      transform:rotate(360deg);
    }
  }
`;

const SlowSpinningLoadingOutlined = styled(LoadingOutlined)`
  transform-origin: center center;
  animation: 6s slow-spin ease-in infinite 5s;
  @keyframes slow-spin {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform:rotate(360deg);
    }
    100% {
      transform:rotate(360deg);
    }
  }
`;

const ErrorIcon: React.FC<{ iconName: ErrorIcon }> = ({ iconName }) => {
  const { whiteLabelSettings } = useStore();
  switch (iconName) {
    case 'SlowSpinningDominoLogo': return isNil(whiteLabelSettings) ? <div /> : isNil(whiteLabelSettings?.appLogo) ?
      <SlowSpinningDominoLogo /> : <SlowSpinningLoadingOutlined style={{ fontSize: 160 }} />;
    case 'Error403': return <Error403 />;
    case 'Error404': return <Error404 />;
    case 'Error500': return <Error500 />;
    default: return <Error500 />;
  }
};

export type ErrorIcon =
  'SlowSpinningDominoLogo' | 'Error403' | 'Error404' | 'Error500';

export interface FileBrowserErrorProps {
  icon: ErrorIcon;
  errorCode: number | string;
  errorMessage?: string;
  exclamation: React.ReactNode;
  children?: React.ReactNode;
}

export const FileBrowserError: React.FC<FileBrowserErrorProps> = ({
  icon,
  errorCode,
  errorMessage,
  exclamation,
  children
}) => {
  return (
  <FlexLayout flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start" padding="0 0 0 2rem">
    <ErrorIconWrapper>
      <ErrorIcon iconName={icon} />
    </ErrorIconWrapper>
    <ErrorDetails>
      <ErrorCode>{errorCode}</ErrorCode>
      {errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}
      <Exclamation>{exclamation}</Exclamation>
      {children}
    </ErrorDetails>
  </FlexLayout>
  );
};

export const FileBrowserPending = ({appName}: {appName: string}) => (
  <FileBrowserError
    icon="SlowSpinningDominoLogo"
    errorCode="Pending"
    exclamation="It's taking a little longer than expected to retrieve your files."
  >
    <p>
      {appName} is fetching data. Depending on the size of your git repository,
      this could take anywhere from a few seconds to a few minutes.
    </p>
    <p>This page will automatically refresh when your data is ready.</p>
  </FileBrowserError>
);

export const FileBrowserApiError: React.FC<{apiError: ApiErrorBody; children?: React.ReactNode}> = ({apiError, children}) => {
  const {formattedPrincipal, whiteLabelSettings} = useStore();
  const enableGitCredentialFlowForCollaborators = formattedPrincipal?.enableGitCredentialFlowForCollaborators;
  const appName = getAppName(whiteLabelSettings);

  const getNoAccessMessage = () => (
    <>
      {`${appName} can’t fetch this repo with your credentials. Use a different credential or add a new `}
      <Link href={`${routes.LAB.children.ACCOUNT_SETTINGS.path()}#gitIntegration`}>Git credential</Link>
      {' under Account Settings.'}
    </>
  );

  if (typeof apiError === 'string') {
    // sometimes, we can't control the API just sending us a plain string error
    return (
    <FileBrowserError
      icon="Error500"
      errorCode="Error"
      exclamation={apiError}
    >
      {children}
    </FileBrowserError>
    );
  } else if (apiError.code === 201) {
    // Invalid upstream credentials
    return (
    <FileBrowserError
      icon="Error403"
      errorCode={enableGitCredentialFlowForCollaborators ? 'No access' : 'Error'}
      exclamation={ enableGitCredentialFlowForCollaborators ? getNoAccessMessage() : apiError.message
      }
    >
      {enableGitCredentialFlowForCollaborators ? (<p>Error {apiError.code}: {apiError.key}</p>) :
        <p>
          {appName} can't fetch this git repository with your credentials.<br/>
          Please double-check the repo credentials you provided above.<br/>
          (Error {apiError.code}: {apiError.key})
        </p>
      }
      {children}
    </FileBrowserError>
    );
  } else if (apiError.code === 203) {
    // Ref not found
    return (
      <FileBrowserError
        icon="Error404"
        errorCode={enableGitCredentialFlowForCollaborators ? 'Repository not found' : 'Error'}
        exclamation={apiError.message}
      >
        <p>
          {appName} can't find this repository or ref (branch/tag/commit).<br />
          It might have been deleted outside of {appName},
          or the repo credentials you provided above may be incorrect.<br />
          (Error {apiError.code}: {apiError.key})
        </p>
        {children}
      </FileBrowserError>
    );
  } else if (apiError.code === 238) {
    // Uninitialized repository
    return (
      <FileBrowserError
        errorCode="Uninitialized"
        icon="Error403"
        exclamation="No content to show"
      >
        <p>
          This repository exists but doesn't have any commits yet, so there's nothing to display.<br />
          Start a workspace to add some files to your repository and try again.
        </p>
        <p>(Message {apiError.code}: {apiError.key})</p>
      </FileBrowserError >
    );
  } else {
    // default case
    return (
    <FileBrowserError
      icon="Error500"
      errorCode="Error"
      exclamation="An unexpected error occurred."
    >
      <p>
        {apiError.message && <>{apiError.message}<br /></>}
        If this problem persists, contact your system administrator.<br />
        {apiError.code && <>(Error {apiError.code}: {apiError.key})</>}
      </p>
      {children}
    </FileBrowserError>
    );
  }
};
