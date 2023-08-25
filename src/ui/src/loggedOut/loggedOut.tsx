import * as React from 'react';
import styled from 'styled-components';
import Card from '@domino/ui/dist/components/Card';
import { themeHelper } from '../styled/themeUtils';
import { btnGrey, warmGrey } from '../styled/colors';
import FlexLayout from '../components/Layouts/FlexLayout';
import Button from '../components/Button/Button';
import Link from '../components/Link/Link';
import LogoutIcon from '../icons/Logout';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const StyledCard = styled(Card)`
  padding: 60px 0;
  margin-top: ${themeHelper('margins.medium')};
`;

const IconWrap = styled(FlexLayout)`
  border-right: 1px solid ${btnGrey};
  padding: 34px 68px 34px 0;
`;

const Header = styled.h1`
  font-size: ${themeHelper('errorPage.status.fontSize')};
  font-weight: ${themeHelper('fontWeights.bold')};
  color: ${btnGrey};
`;

const Details = styled.div`
  margin-left: ${themeHelper('margins.extraLarge')};
`;

const Message = styled.div`
  color: ${warmGrey};
`;

const ButtonWrap = styled.div`
  margin-top: ${themeHelper('margins.medium')};
  .ant-btn {
    width: 90px;
    justify-content: center;
  }
`;

const LoggedOut = () => {
  const { whiteLabelSettings } = useStore();
  return (
  <StyledCard width="100%">
    <FlexLayout
      justifyContent="flex-start"
      itemSpacing={0}
    >
      <IconWrap>
        <LogoutIcon
          primaryColor={btnGrey}
        />
      </IconWrap>
      <Details>
        <Header>Logged out</Header>
        <Message>
          You have been logged out of {getAppName(whiteLabelSettings)}.
        </Message>
        <ButtonWrap>
          <Link href="/">
            <Button btnType="primary">
              Login
            </Button>
          </Link>
        </ButtonWrap>
      </Details>
    </FlexLayout>
  </StyledCard>);
}
export default LoggedOut;
