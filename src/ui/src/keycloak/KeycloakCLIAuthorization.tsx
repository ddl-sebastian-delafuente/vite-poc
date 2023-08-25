import * as React from 'react';
import styled from 'styled-components';
import { lowerCase } from 'lodash';
import CopyToClipBoard from '../components/CopyToClipBoard';
import SuccessButton from '../components/SuccessButton';
import Terminal from '../components/Terminal';
import MainContentLayout from '../components/MainContentLayout';
import WarningBox from '../components/WarningBox';
import { themeHelper } from '../styled/themeUtils';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const elementWidth = '545px';

const Title = styled.h1`
  font-size: ${themeHelper('fontSizes.large')};
`;

const StartCliInstruction = styled.div`
  margin: 28px 0 0;
`;

const TerminalWrap = styled.div`
  width: ${elementWidth};
`;

const AuthCodeWrap = styled.div`
  width: ${elementWidth};
  position: relative;
  .text-container {
    white-space: pre-line;
    height: auto;
  }
`;

const AuthCodeHint = styled.div`
  margin-bottom: 20px;
`;

const SuccessButtonWrap = styled.div`
  margin-top: 30px;
`;

export type Props = {
  hostString: string;
  code: string;
  authorizeCliLink: string;
  error?: string;
};

const KeycloakCLIAuthorization = ({
    hostString,
    code,
    authorizeCliLink,
    error,
}: Props) => {
  const { whiteLabelSettings } = useStore();
  const appName = getAppName(whiteLabelSettings);
  return (
  <MainContentLayout>
    <Title>{`${appName} CLI Authorization Code`}</Title>
    {
      error ?
      <WarningBox>
        {error}
      </WarningBox> :
      <>
        <div>
          {`Use the following code to authorize your ${appName} CLI.`}
        </div>
        <StartCliInstruction>
          {`Initiate ${appName} CLI login with the following command, if you have not done so already.`}
          <TerminalWrap>
            <Terminal width={elementWidth} marginTop={'8px'}>
              <div>
                {`$ ${lowerCase(appName)} login ${hostString}`}
              </div>
              <div>
                Enter the authorization code:
              </div>
            </Terminal>
          </TerminalWrap>
        </StartCliInstruction>
        <AuthCodeWrap>
          <AuthCodeHint>
            When prompted paste the authorization code below.
          </AuthCodeHint>
          { code && <CopyToClipBoard text={code} />}
        </AuthCodeWrap>
      </>
    }
    <SuccessButtonWrap>
      <SuccessButton href={authorizeCliLink}>Re-request code</SuccessButton>
    </SuccessButtonWrap>
  </MainContentLayout>);
};

export default KeycloakCLIAuthorization;
