import * as React from 'react';
import styled from 'styled-components';
import { isLiteUser } from '@domino/api/dist/Users';
import FlexLayout from './Layouts/FlexLayout';
import { borderTableGrey, doveGray } from '../styled/colors';
import { themeHelper } from '../styled';
import HelpLink from './HelpLink';
import { ADMIN_HELP_PREFIX, SUPPORT_ARTICLE } from '../core/supportUtil';
import withStore, { StoreProps } from '../globalStore/withStore';
import { getAppName } from '../utils/whiteLabelUtil';

export interface LicenseBannerState {
  isLiteUser: boolean;
}

const StyledDiv = styled(FlexLayout)`
  padding: 5px ${themeHelper('margins.medium')};
  margin: 10px;
  justify-content: initial;
  border: solid 1px ${borderTableGrey};
  border-radius: ${themeHelper('card.container.borderRadius')};
`;

const StyledSpanTitle = styled.span`
    font-size: ${themeHelper('fontSize.medium')};
    color: ${doveGray};
    font-weight: bold;
`;
const StyledSpan = styled.span`
    font-size: ${themeHelper('fontSize.small')};
`;

class LiteUserLimitedAccessBanner extends React.PureComponent<StoreProps, LicenseBannerState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLiteUser: false
    };
  }

  async componentDidMount() {
    try {
      const isLiteUserResponse = await isLiteUser({});
      this.setState({
        isLiteUser: isLiteUserResponse.isLiteUser
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      (this.state.isLiteUser) && (
        <StyledDiv data-test="lite-user-banner">
          <StyledSpanTitle id="results_consumer_mode">
            Results Consumer Mode
          </StyledSpanTitle>
          <StyledSpan>
            Consult your {getAppName(this.props.whiteLabelSettings)} Admin if you need more than limited access.
          </StyledSpan>
          <HelpLink
            text="Learn more"
            articlePath={SUPPORT_ARTICLE.USER_MANAGEMENT_ADMIN_ROLES}
            showIcon={false}
            basePath={ADMIN_HELP_PREFIX}
          />
        </StyledDiv>
      )
    );
  }
}

export default withStore(LiteUserLimitedAccessBanner);
