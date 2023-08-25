import {
  getFeatureView
} from '@domino/api/dist/Featurestore'
import {
  DominoFeaturestoreApiFeatureViewDto as FeatureView,
} from '@domino/api/dist/types';
import { useParams } from 'react-router-dom';
import * as React from 'react';
import styled from 'styled-components';

import Card from '../../../components/Card';
import RouteLink from '../../../components/Link/RouteLink';
import Table from '../../../components/Table/Table';
import {
  dataIndexPath,
  projectDataIndexPath,
} from '../../../core/routes';
import { initialFeatureView } from '../../../proxied-api/initializers';
import { themeHelper } from '../../../styled/themeUtils';
import { useRemoteData } from '../../../utils/useRemoteData';
import { KeyValueTags } from '../../KeyValueTags';
import { LoginInterstitial } from '../../LoginInterstitial';
import { searchObject } from '../../search.utils';
import { AddToProjectButton } from '../FeatureList/AddToProjectButton';
import { SummaryMetadata } from './SummaryMetadata';

const FeatureViewDetailsHeader = styled.header`
  align-items: center;
  display: flex;
  margin-bottom: ${themeHelper('margins.large')}
`;

const FeatureViewWrapper = styled.div`
  padding: 16px;
`

const HeaderLeft = styled.div`
  flex: 1;
  margin-right: ${themeHelper('margins.large')}
`;

const HeaderRight = styled.div`
`;

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: 90vh;
  justify-content: center;
`;

const MainContainer = styled.div`
  align-items: start;
  display: flex;
`;

const Main = styled.section`
  flex: 1;
  margin-right: ${themeHelper('margins.large')}
`;

const RightSidebar = styled.aside`
  width: 275px;

  > *:not(:last-child) {
    margin-bottom: ${themeHelper('margins.small')};
  }
`;

interface RouteParams {
  featureViewId: string;
  ownerName?: string;
  projectName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FeatureViewDetailsProps {
  userIsAnonymous?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FeatureViewDetails = ({
  userIsAnonymous,
}: FeatureViewDetailsProps) => {
  const routeParams = useParams<RouteParams>();

  const { featureViewId } = routeParams;

  const {
    loading: featureViewLoading,
    data: featureView,
    hasLoaded: featureViewsHasLoaded,
  } = useRemoteData({
    canFetch: !userIsAnonymous,
    fetcher: () => getFeatureView({ featureViewId }),
    initialValue: initialFeatureView,
  });

  const returnUrl = React.useMemo(() => {
    if (routeParams.ownerName && routeParams.projectName) {
      return projectDataIndexPath({
        ownerName: routeParams.ownerName,
        projectName: routeParams.projectName,
      });
    }

    return dataIndexPath();
  }, [routeParams]);

  const ownerProject = React.useMemo(() => {
    return featureView.projectsInfo?.find((project) => project.isOriginProject);
  }, [featureView.projectsInfo]);

  const columns = React.useMemo(() => {
    return [
      {
        title: 'Feature',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Type',
        key: 'valueType',
        dataIndex: 'valueType',
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        sorter: false,
        render: (value: {}) => {
          return <KeyValueTags tags={value} />
        }
      },
    ];
  }, []);

  const handleFilterRecords = React.useCallback((record: FeatureView['features'], searchText: string) => {
    return searchObject(record, searchText);
  }, []);

  if (userIsAnonymous) {
    return (
      <LoginInterstitial />
    )
  }

  if (!featureViewsHasLoaded && featureViewLoading) {
    return (
      <LoadingContainer>
        Loading
      </LoadingContainer>
    );
  }
  
  return (
    <FeatureViewWrapper>
      <FeatureViewDetailsHeader>
        <HeaderLeft>
          <div>
            <RouteLink to={returnUrl}>{`‹ Feature Store`}</RouteLink>
          {` / ${featureView.name}`}</div>
          <div>{featureView.name}</div>
        </HeaderLeft>
        <HeaderRight>
          <AddToProjectButton 
            buttonStyle="button" 
            buttonText="Add to Project"
            originProjectId={ownerProject?.projectId}
            featureViewId={featureView.id}
          />
        </HeaderRight>
      </FeatureViewDetailsHeader>
      <MainContainer>
        <Main>
          <div>
            <div>Description</div>
            <div>{featureView.description}</div>
          </div>
          <Table
            hideRowSelection
            columns={columns}
            dataSource={featureView.features}
            onFilter={handleFilterRecords}
          />
        </Main>
        <RightSidebar>
          <Card title="Summary" width="100%">
            <SummaryMetadata
              createdAtMillis={featureView.createdAtMillis}
              entities={featureView.entities}
              features={featureView.features}
              lastUpdatedMillis={featureView.lastUpdatedMillis}
              projectsInfo={featureView.projectsInfo}
            />
          </Card>
          Tags: <KeyValueTags tags={featureView.tags}/>
        </RightSidebar>
      </MainContainer>
    </FeatureViewWrapper>
  );
}
