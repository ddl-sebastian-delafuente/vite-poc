import * as React from 'react';
import styled from 'styled-components';
import Button from './Button/Button';
import * as R from 'ramda';
import { requestForTrialPeriodExtension, getCurrentUserTrialStatus } from '@domino/api/dist/Users';
import { success as successToast } from './toastr';
import FlexLayout from './Layouts/FlexLayout';
import { currentUser } from '../utils/getUserUtil';
import { themeHelper } from '../styled/themeUtils';
import { cinderella } from '../styled/colors';
import { getPrincipal } from '@domino/api/dist/Auth';
import withStore, { StoreProps } from '../globalStore/withStore';
import { getAppName } from '../utils/whiteLabelUtil';

export type TrialStatusType = 'Initial' | 'Extended' | 'Expired';

export interface TrialBannerProps extends StoreProps {
  enabled?: boolean;
}

interface TrialBannerState {
    status: TrialStatusType;
    userName: string;
    visible: boolean;
}

interface ResponseType {
    message: string;
}

const StyledDiv = styled(FlexLayout)`
  padding: 5px 20px;
  background: ${cinderella};
  justify-content: initial;

  .ant-btn {
    background: blue;
    border: blue;
    color: white;
  }
`;

const StyledSpan = styled.span`
  font-size: ${themeHelper('fontSizes.tiny')};
`;

class TrialBanner extends React.PureComponent<TrialBannerProps, TrialBannerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            status: 'Initial',
            userName: '',
            visible: false
        };
    }

    async componentDidMount() {
        // TODO: Need to pass username, LockOutTrialEnabled FF value from scala pages,
        // then remove the call to getPrincipal
        try {
            const [
                user,
                trialStatus,
            ] = await Promise.all([currentUser(), getCurrentUserTrialStatus({})]);
            const visible = ('enabled' in this.props) ? this.props.enabled! : (
                (await getPrincipal({})).featureFlags.indexOf('LockOutTrialEnabled') > -1
            );
            if (!R.isEmpty(user)) {
                const userName = user.userName;
                this.setState({
                    status: trialStatus.trialStatus,
                    userName,
                    visible
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    onExtend = () => {
        try {
            requestForTrialPeriodExtension({})
            .then((response: ResponseType) => {
                this.setState({
                    status: 'Extended'
                });
                successToast(response.message);
            });
        } catch (error) {
            console.warn(error);
        }
    }
    render() {
      return (
            (this.state.visible && R.equals(this.state.status, 'Expired') && !R.isEmpty(this.state.userName)) ? (
                <StyledDiv>
                    <StyledSpan>
                        {`${this.state.userName}, some features might not work, as your ${getAppName(this.props.whiteLabelSettings)} trial has expired!`}
                    </StyledSpan>
                    <Button
                      btnType={'small'}
                      onClick={this.onExtend}
                    >
                        Extend Trial
                    </Button>
                </StyledDiv>
            ) : null
        );
    }
}

export default withStore<TrialBannerProps>(TrialBanner);

export { TrialBannerState };
