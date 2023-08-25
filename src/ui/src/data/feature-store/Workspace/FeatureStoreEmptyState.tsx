import {
  DominoFeaturestoreApiFeatureViewDto as FeatureViewDto,
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import FlexLayout from '../../../components/Layouts/FlexLayout';
import InfoBox from '../../../components/Callout/InfoBox';
import HelpLink from '../../../components/HelpLink'
import Link from '../../../components/Link/Link';
import {getProjectDataSourcePath} from '../../../core/routes';
import { SUPPORT_ARTICLE } from '../../../core/supportUtil';
import { themeHelper } from '../../../styled/themeUtils';
import * as colors from '../../../styled/colors';
import { Bold } from '../commonStyledComponents';

const FEATURE_STORE_DESCRIPTION_TEXT = 'Feature Store is a centralized repository of features. It enables feature ' +
  'sharing and discovery across your organization and also ensures that the same feature computation code is used for ' +
  'model training and inference.\n';

const EmptyStateText = styled.div`
  color: ${colors.semiBlack};
  margin: ${themeHelper('margins.small')} 0;
  text-align: left;
`;

const InfoBoxContainer = styled(InfoBox)`
  margin: ${themeHelper('paddings.medium')} 0;
  width: 100%;
`;

const EmptyBlock = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 70px;
  width: 100%;
`

const getProjectFeatureStorePath = (props: FeatureStoreEmptyStateProps) => getProjectDataSourcePath(props.ownerName, props.projectName) + '?tab=featurestore';

interface FeatureStoreEmptyStateProps {
  featureViews: FeatureViewDto[];
  isFeatureStoreEnabledForProject: boolean;
  ownerName: string;
  projectName: string;
}


export const FeatureStoreEmptyState = (props: FeatureStoreEmptyStateProps) => {
  return (
    <FlexLayout padding={'0px 0px'} margin={'0 0 10px 0'} alignItems="flex-start" justifyContent="flex-start" flexDirection="column" data-test="datasource-empty-state">
      {props.isFeatureStoreEnabledForProject ? (
        <>
          <EmptyBlock>No Feature Views are attached to this project</EmptyBlock>
          <div>Explore & attach available Feature Views from the <Bold>Data menu</Bold> of the global navigation</div>
          <div><HelpLink articlePath={SUPPORT_ARTICLE.FEATURE_STORE_LINK} text="Visit our docs to learn more about the Feature Store"/></div>
        </>
      ) : (
        <>
          <EmptyStateText>{FEATURE_STORE_DESCRIPTION_TEXT}</EmptyStateText>
          <InfoBoxContainer data-test="enable-feature-store">
            To enable feature store for your project, go to <Link href={getProjectFeatureStorePath(props)} openInNewTab={true}>Data {'>'} Feature Store</Link>.
            You will need to create and use a new workspace.
          </InfoBoxContainer>
        </>
      )}
    </FlexLayout>
  );
};
