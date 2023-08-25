import { DatabaseOutlined } from '@ant-design/icons';
import {
  DominoFeaturestoreApiFeatureDto as FeatureDto,
  DominoFeaturestoreApiFeatureViewDto as FeatureViewDto,
  DominoProjectsApiWritableProjectMounts as WritableProjectMounts,
  DominoWorkspacesApiWorkspace as Workspace,
} from '@domino/api/dist/types';
// eslint-disable-next-line no-restricted-imports
import { Collapse } from 'antd';
import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import { themeHelper } from '../../../styled/themeUtils';
import * as colors from '../../../styled/colors';
import { FeatureStoreEmptyState } from './FeatureStoreEmptyState';
import { CopyCodeSnippetWithState } from './CopyCodeSnippet';
import { 
  WorkspaceFeatureStoreDetailsProps,
  WorkspaceFeatureStoreDetails 
} from './WorkspaceFeatureStoreDetails';

const { Panel } = Collapse;

const StyledFlexLayout = styled(FlexLayout)`
  margin: ${themeHelper('paddings.small')} 0;
  display: flex;
  align-items: center;
`;
const FlexItem = styled.div`
  flex: 1;
`;
const ShowFeatureIcon = styled(DatabaseOutlined)`
  opacity: 0.7;
  cursor: pointer;
  float: left;
`;
const PanelHeader = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  font-weight: ${themeHelper('fontWeights.small')};
`;
const FeatureTitle = styled.span`
  color: ${colors.black};
  font-size: ${themeHelper('fontSizes.small')};
  font-weight: ${themeHelper('fontWeights.medium')};
  padding-left: 4px;
}
`;
const StyledCollapse = styled(Collapse)`
  .ant-collapse-header {
    border: 1px solid ${colors.antgrey4};
    color: ${colors.mineShaftColor}
  }
  .ant-collapse-content > .ant-collapse-content-box {
    background: ${colors.white};
    padding-top: 10;
  }
`;

interface FeatureDetailsProp {
  feature: FeatureDto;
  projectMounts?: WritableProjectMounts;
  workspace?: Workspace;
}

const FeatureDetails = (props: FeatureDetailsProp) => {
  const { feature } = props;

  return (
    <StyledFlexLayout justifyContent="flex-start" alignItems="flex-start" data-test="feature-details">
      <ShowFeatureIcon></ShowFeatureIcon>
      <FlexItem>
        {feature.name}
      </FlexItem>
    </StyledFlexLayout>
  );
};

export interface WorkspaceFeatureStoreProps extends
  Pick<WorkspaceFeatureStoreDetailsProps, 'featureStore'> {
  featureViews: FeatureViewDto[];
  isFeatureStoreEnabledForProject: boolean;
  ownerName: string;
  projectName: string;
  projectMounts?: WritableProjectMounts;
  workspace?: Workspace;
}

export const WorkspaceFeatureStore = ({
  featureStore,
  featureViews, 
  isFeatureStoreEnabledForProject, 
  ownerName, 
  projectMounts,
  projectName,
  workspace,
}: WorkspaceFeatureStoreProps) => {
  const shouldShowEmptyState = !isFeatureStoreEnabledForProject || featureViews.length === 0;

  const repoDetails = React.useMemo(() => {
    return workspace?.dependentRepositories.find(repo => repo.isFeatureStore);
  }, [workspace]);

  const projectMount = React.useMemo(() => {
    if (!repoDetails || !projectMounts) {
      return;
    }

    return projectMounts.importedGitMounts[repoDetails.id];
  }, [projectMounts, repoDetails]);

  return (
    <>
      {shouldShowEmptyState ? (
          <FeatureStoreEmptyState
            featureViews={featureViews}
            isFeatureStoreEnabledForProject={isFeatureStoreEnabledForProject}
            ownerName={ownerName}
            projectName={projectName}
          />
        ) :
        <div>
          {R.map((featureView: FeatureViewDto) => (
            <StyledCollapse
              expandIconPosition="right"
              bordered={false}
              defaultActiveKey={1}
              key={featureView.id}
            >
              <Panel
                header={<PanelHeader>{featureView.name}</PanelHeader>}
                key="1"
                style={{background: 'transparent'}}
              >
                <div style={{paddingTop: 4}}>
                  <FeatureTitle>Features</FeatureTitle>
                  <CopyCodeSnippetWithState featureView={featureView}/>
                </div>
                <div style={{paddingLeft: 4}}>
                  {R.map((feature: FeatureDto) => (
                    <FeatureDetails
                      feature={feature}
                      key={feature.name}
                    />), featureView.features)
                  }
                </div>
              </Panel>
            </StyledCollapse>), featureViews)
          }
        </div>
      }
      {featureStore?.gitRepo && (
        <WorkspaceFeatureStoreDetails
          featureStoreRepositoryDetails={repoDetails}
          featureStore={featureStore}
          projectMount={projectMount}
        />
      )}
    </>
  );
};
