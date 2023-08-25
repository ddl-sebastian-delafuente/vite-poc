import * as React from 'react';
import styled from 'styled-components';

import Button from '../components/Button/Button';
import Link from '../components/Link/Link';
import { getLoginUrl } from '../components/utils/util';
import EmptyDatabase from '../icons/EmptyDatabase';
import { colors, themeHelper } from '../styled';
import { getAppName } from '../utils/whiteLabelUtil';
import useStore from '../globalStore/useStore';

const Container = styled.div`
  align-items: center;
  background-color: ${colors.white};
  border-radius: ${themeHelper('borderRadius.standard')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 218px;
  padding-top: 150px;
`;

const ButtonWrapper = styled.div`
  a:not(:first-child) {
    margin-left: ${themeHelper('margins.small')};
  }
`;

const Message = styled.div`
  margin-top: ${themeHelper('margins.small')};
  margin-bottom: ${themeHelper('margins.small')};
  text-align: center;
  width: 326px;
`;

export interface LoginInterstitialProps {
  appName?: string;
  isSignupEnabled?: boolean;
}

export const LoginInterstitial = ({ isSignupEnabled = false, ...props }: LoginInterstitialProps) => {
  const { whiteLabelSettings } = useStore();

  const appName = React.useMemo(() => {
    if (props.appName) {
      return props.appName;
    }

    return getAppName(whiteLabelSettings);
  }, [props.appName, whiteLabelSettings]);

  return (
    <Container>
      <div>
        <EmptyDatabase/>
      </div>
      <Message>{`${isSignupEnabled ? 'Log in or Signup for a' : 'Log in to your'} ${appName} account to view the data sources associated with this project`}</Message>
      <ButtonWrapper>
        <Link href={getLoginUrl()}>
          <Button btnType="primary" testId="login">
            {isSignupEnabled ? 'Login' : `Log in to ${appName}`}
          </Button>
        </Link>
        {isSignupEnabled && (
          <Link href="/">
            <Button btnType="secondary" testId="signup">
              Sign Up
            </Button>
          </Link>
        )}
      </ButtonWrapper>
    </Container>
  );
}
