import {
  DominoFeaturestoreApiFeatureStoreDto as FeatureStoreDto,
  DominoWorkspacesApiDependentRepository as DependentRepository,
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import InfoBox from '../../../components/Callout/InfoBox';
import {
  gitServiceProvider as gitServiceProviderIconMapper,
  offlineStoreType as offlineStoreTypeIconMapper,
  onlineStoreType as onlineStoreTypeIconMapper,
} from '../../../components/DynamicField/Fields/Icons';
import LabelAndValue from '../../../components/LabelAndValue';
import HelpLink from '../../../components/HelpLink'
import Link from '../../../components/Link/Link';
import { SUPPORT_ARTICLE } from '../../../core/supportUtil';
import ExternalLink from '../../../icons/ExternalLink';
import * as colors from '../../../styled/colors';
import * as fontSize from '../../../styled/fontSizes';
import { themeHelper } from '../../../styled/themeUtils';
import { Bold } from '../commonStyledComponents';
import { CopyCodeSnippetWithState } from './CopyCodeSnippet';

export interface WorkspaceFeatureStoreDetailsProps {
  featureStoreRepositoryDetails?: DependentRepository,
  featureStore?: FeatureStoreDto;
  projectMount?: string;
}

const LABEL_STYLES = {
  color: colors.semiBlack,
}

const VALUE_STYLES = {
  width: '100%',
}

const HeaderTitle = styled.span`
  font-size: ${fontSize.MEDIUM};
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${themeHelper('margins.small')};
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-right: 5px;
`;

const ValueWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ValueIconText = styled.div`
  align-items: center;
  display: flex;
`

const Wrapper = styled.div`
  background: ${colors.antgrey4};
  border-top: 1px solid ${colors.lightGreyCardBorderColor};
  padding: ${themeHelper('paddings.medium')};
`;

export const WorkspaceFeatureStoreDetails = ({
  featureStore,
  projectMount,
}: WorkspaceFeatureStoreDetailsProps) => {
  const GitServiceProviderIcon = gitServiceProviderIconMapper(featureStore?.gitServiceProvider || '');
  const OfflineStoreIcon = offlineStoreTypeIconMapper(featureStore?.offlineStoreType || '');
  const OnlineStoreIcon = onlineStoreTypeIconMapper(featureStore?.onlineStoreType || '');

  const repoDisplayUrl = React.useMemo(() => {
    if (!featureStore || !featureStore.gitRepo) {
      return '';
    }

    const url = new URL(featureStore.gitRepo);
    return url.pathname.slice(1);
  }, [featureStore])

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Publishing Feature Views</HeaderTitle>
        <HelpLink articlePath={SUPPORT_ARTICLE.FEATURE_STORE_LINK} text="Visit our docs"/>
      </Header>
      <div>
        <LabelAndValue
          labelStyles={LABEL_STYLES}
          label="Feature Views definition code location"
          value={projectMount || '--'}
        />
        <LabelAndValue
          labelStyles={LABEL_STYLES}
          label="Feature Views definition code repo"
          value={repoDisplayUrl ?  (
            <ValueWrapper>
              <IconWrapper><GitServiceProviderIcon height="16" width="16"/></IconWrapper>
              <Link type="icon-link-end" icon={<ExternalLink height="12" width="12"/>} href={featureStore?.gitRepo}>{repoDisplayUrl}</Link>
            </ValueWrapper>
          ) : '--'}
        />
        <LabelAndValue
          labelStyles={LABEL_STYLES}
          label="Feature Store offline data source"
          valueStyles={VALUE_STYLES}
          value={(
            <ValueWrapper>
              <ValueIconText>
                <IconWrapper><OfflineStoreIcon height="16" width="16"/></IconWrapper>
                {featureStore?.offlineStoreType}
              </ValueIconText>
              <CopyCodeSnippetWithState offlineStoreType={featureStore?.offlineStoreType} />
            </ValueWrapper>
          )}
        />
        <LabelAndValue
          labelStyles={LABEL_STYLES}
          label="Feature Store online data source"
          valueStyles={VALUE_STYLES}
          value={(
            <ValueWrapper>
              <ValueIconText>
                <IconWrapper><OnlineStoreIcon height="16" width="16"/></IconWrapper>
                {featureStore?.onlineStoreType}
              </ValueIconText>
            </ValueWrapper>
          )}
        />
      </div>
      <InfoBox>
        Publish feature views in the feature store code location using the <Bold>Imported Panel section</Bold> on <Bold>File Changes</Bold> panel of the Workspace.
      </InfoBox>
    </Wrapper>
  )
}
