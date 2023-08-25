import * as React from 'react';
import styled from 'styled-components';
import { InfoCircleOutlined } from '@ant-design/icons';
import { HwTierMessageType } from './types';
import { themeHelper } from '../styled/themeUtils';
import { colors, fontSizes } from '../styled';
import FlexLayout from '../components/Layouts/FlexLayout';
import HelpLink from '../components/HelpLink';
import { ADMIN_HELP_PREFIX, SUPPORT_ARTICLE } from '../core/supportUtil';

const Wrapper = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const Error = styled.span`
  color: ${colors.torchRed};
`;

const Info = styled.span`
  color: ${colors.boulder};
  width: calc(100% - 35px);
  margin-left: ${themeHelper('margins.tiny')};
  line-height: 14px;
`;

const StyledHelpLink = styled(HelpLink)`
  margin-left: 4px;
  font-size: inherit;
`;

export interface Props {
  hwTierMessage?: HwTierMessageType;
}

const HwtierError: React.FC<Props> = ({ hwTierMessage }) => (
  <Wrapper>
    {
      Boolean(hwTierMessage) && Boolean(hwTierMessage!.err) &&
      <Error>{hwTierMessage!.err}</Error> 
    }
    {
      Boolean(hwTierMessage) && Boolean(hwTierMessage!.info) &&
      <FlexLayout justifyContent="flex-start" alignItems="flex-start" flexDirection="row">
        <InfoCircleOutlined
          style={{
            fontSize: fontSizes.MEDIUM,
            color: colors.boulder,
            marginRight: 0
          }} />
        <Info>
          {hwTierMessage!.info}
          <StyledHelpLink
            text="Read more"
            basePath={ADMIN_HELP_PREFIX}
            articlePath={SUPPORT_ARTICLE.COMPUTE_CLUSTER_MAX_EXECUTORS}
            showIcon={false}
          />
        </Info>
      </FlexLayout> 
    }
  </Wrapper>
);

export default HwtierError;
